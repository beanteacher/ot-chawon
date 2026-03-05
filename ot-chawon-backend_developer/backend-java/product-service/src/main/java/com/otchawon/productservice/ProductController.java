package com.otchawon.productservice;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    @GetMapping
    public Map<String, Object> list() {
        List<Map<String, Object>> items = List.of(
            Map.of("id", 1, "name", "Basic Tee", "price", 29000),
            Map.of("id", 2, "name", "Denim Jacket", "price", 89000)
        );
        return Map.of("success", true, "data", Map.of("items", items, "page", 1, "size", 20, "total", 2), "message", "ok", "traceId", "mock-trace");
    }
}
