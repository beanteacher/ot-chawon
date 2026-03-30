package com.otchawon.brand.controller;
import com.otchawon.brand.dto.BrandDto;

import com.otchawon.brand.service.BrandAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands/{brandId}/admins")
@RequiredArgsConstructor
public class BrandAdminController {

    private final BrandAdminService brandAdminService;

    @PostMapping
    public ResponseEntity<BrandDto.AdminResponse> addAdmin(
            @PathVariable Long brandId,
            @Valid @RequestBody BrandDto.AddAdminRequest request) {
        BrandDto.AdminResponse response = brandAdminService.addAdmin(brandId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<BrandDto.AdminResponse>> getAdmins(@PathVariable Long brandId) {
        List<BrandDto.AdminResponse> response = brandAdminService.getAdmins(brandId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{adminId}")
    public ResponseEntity<Void> removeAdmin(
            @PathVariable Long brandId,
            @PathVariable Long adminId) {
        brandAdminService.removeAdmin(brandId, adminId);
        return ResponseEntity.noContent().build();
    }
}
