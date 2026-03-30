package com.otchawon.product.controller;
import com.otchawon.product.dto.ProductDto;

import com.otchawon.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductDto.ProductResponse> create(@Valid @RequestBody ProductDto.CreateProductRequest request) {
        ProductDto.ProductResponse response = productService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ProductDto.ProductListResponse> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable) {

        ProductDto.ProductSearchRequest searchRequest = ProductDto.ProductSearchRequest.builder()
                .keyword(keyword)
                .categoryId(categoryId)
                .brandId(brandId)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .status(status)
                .build();

        ProductDto.ProductListResponse response = productService.search(searchRequest, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto.ProductResponse> getById(@PathVariable Long id) {
        ProductDto.ProductResponse response = productService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto.ProductResponse> update(
            @PathVariable Long id,
            @RequestBody ProductDto.UpdateProductRequest request) {
        ProductDto.ProductResponse response = productService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.softDelete(id);
        return ResponseEntity.noContent().build();
    }
}
