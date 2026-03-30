package com.otchawon.brand.controller;
import com.otchawon.brand.dto.BrandDto;

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
    public ResponseEntity<BrandDto.Response> create(@Valid @RequestBody BrandDto.CreateRequest request) {
        BrandDto.Response response = brandService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<BrandDto.ListResponse> getAll() {
        BrandDto.ListResponse response = brandService.getAll();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BrandDto.Response> getById(@PathVariable Long id) {
        BrandDto.Response response = brandService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BrandDto.Response> update(
            @PathVariable Long id,
            @RequestBody BrandDto.UpdateRequest request) {
        BrandDto.Response response = brandService.update(id, request);
        return ResponseEntity.ok(response);
    }
}
