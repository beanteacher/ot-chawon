package com.otchawon.product.service.impl;
import com.otchawon.product.dto.ProductDto;

import com.otchawon.product.entity.Product;
import com.otchawon.product.entity.ProductOption;
import com.otchawon.product.exception.ProductException;
import com.otchawon.product.repository.ProductAssetRepository;
import com.otchawon.product.repository.ProductOptionRepository;
import com.otchawon.product.repository.ProductRepository;
import com.otchawon.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductOptionRepository productOptionRepository;
    private final ProductAssetRepository productAssetRepository;

    @Override
    @Transactional
    public ProductDto.ProductResponse create(ProductDto.CreateProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .price(request.getPrice())
                .categoryId(request.getCategoryId())
                .brandId(request.getBrandId())
                .description(request.getDescription())
                .build();

        Product saved = productRepository.save(product);

        if (request.getOptions() != null && !request.getOptions().isEmpty()) {
            List<ProductOption> options = request.getOptions().stream()
                    .map(opt -> ProductOption.builder()
                            .productId(saved.getId())
                            .size(opt.getSize())
                            .color(opt.getColor())
                            .stock(opt.getStock())
                            .extraPrice(opt.getExtraPrice())
                            .build())
                    .collect(Collectors.toList());
            productOptionRepository.saveAll(options);

            List<ProductDto.ProductOptionResponse> optionResponses = options.stream()
                    .map(ProductDto.ProductOptionResponse::from)
                    .collect(Collectors.toList());
            log.info("상품 등록 완료: productId={}", saved.getId());
            return ProductDto.ProductResponse.from(saved, optionResponses);
        }

        log.info("상품 등록 완료: productId={}", saved.getId());
        return ProductDto.ProductResponse.from(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDto.ProductResponse getById(Long id) {
        Product product = productRepository.findById(id)
                .filter(p -> !p.isDeleted())
                .orElseThrow(ProductException::notFound);

        List<ProductDto.ProductOptionResponse> options = productOptionRepository.findByProductId(id)
                .stream()
                .map(ProductDto.ProductOptionResponse::from)
                .collect(Collectors.toList());

        List<ProductDto.ProductAssetResponse> assets = productAssetRepository.findAllByProductId(id)
                .stream()
                .map(ProductDto.ProductAssetResponse::from)
                .collect(Collectors.toList());

        return ProductDto.ProductResponse.from(product, options, assets);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDto.ProductListResponse search(ProductDto.ProductSearchRequest searchRequest, Pageable pageable) {
        Page<Product> page = productRepository.search(
                searchRequest.getKeyword(),
                searchRequest.getCategoryId(),
                searchRequest.getBrandId(),
                searchRequest.getMinPrice(),
                searchRequest.getMaxPrice(),
                searchRequest.getStatus(),
                pageable);

        List<ProductDto.ProductResponse> products = page.getContent().stream()
                .map(ProductDto.ProductResponse::from)
                .collect(Collectors.toList());

        return ProductDto.ProductListResponse.builder()
                .products(products)
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements())
                .currentPage(page.getNumber())
                .build();
    }

    @Override
    @Transactional
    public ProductDto.ProductResponse update(Long id, ProductDto.UpdateProductRequest request) {
        Product product = productRepository.findById(id)
                .filter(p -> !p.isDeleted())
                .orElseThrow(ProductException::notFound);

        product.update(
                request.getName(),
                request.getPrice(),
                request.getDescription(),
                request.getStatus(),
                request.getCategoryId());

        log.info("상품 수정 완료: productId={}", id);
        return ProductDto.ProductResponse.from(product);
    }

    @Override
    @Transactional
    public void softDelete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(ProductException::notFound);

        if (product.isDeleted()) {
            throw ProductException.alreadyDeleted();
        }

        product.softDelete();
        log.info("상품 삭제 완료: productId={}", id);
    }
}
