package com.otchawon.orderservice;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    @PostMapping
    public Map<String, Object> create(@RequestBody Map<String, Object> payload) {
        return Map.of("success", true, "data", Map.of("id", 1001, "status", "CREATED"), "message", "ok", "traceId", "mock-trace");
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@PathVariable Long id) {
        return Map.of("success", true, "data", Map.of("id", id, "status", "CREATED"), "message", "ok", "traceId", "mock-trace");
    }
}
