package com.otchawon.brand.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class ProductServiceClientFallbackFactory implements FallbackFactory<ProductServiceClient> {

    @Override
    public ProductServiceClient create(Throwable cause) {
        return new ProductServiceClient() {
            @Override
            public Object getProductById(Long id) {
                log.warn("ProductServiceClient fallback triggered for productId={}, cause={}", id, cause.getMessage());
                return null;
            }
        };
    }
}
