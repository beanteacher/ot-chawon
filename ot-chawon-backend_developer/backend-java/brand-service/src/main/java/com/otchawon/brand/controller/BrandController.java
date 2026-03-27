package com.otchawon.brand.controller;

import com.otchawon.brand.dto.request.CreateBrandRequest;
import com.otchawon.brand.dto.request.UpdateBrandRequest;
import com.otchawon.brand.dto.response.BrandListResponse;
import com.otchawon.brand.dto.response.BrandResponse;
import com.otchawon.brand.service.BrandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    @PostMapping
    public ResponseEntity<BrandResponse> create(@Valid @RequestBody CreateBrandRequest request) {
        BrandResponse response = brandService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<BrandListResponse> getAll() {
        BrandListResponse response = brandService.getAll();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BrandResponse> getById(@PathVariable Long id) {
        BrandResponse response = brandService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BrandResponse> update(
            @PathVariable Long id,
            @RequestBody UpdateBrandRequest request) {
        BrandResponse response = brandService.update(id, request);
        return ResponseEntity.ok(response);
    }
}
