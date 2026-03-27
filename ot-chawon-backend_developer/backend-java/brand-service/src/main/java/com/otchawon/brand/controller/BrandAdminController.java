package com.otchawon.brand.controller;

import com.otchawon.brand.dto.request.AddBrandAdminRequest;
import com.otchawon.brand.dto.response.BrandAdminResponse;
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
    public ResponseEntity<BrandAdminResponse> addAdmin(
            @PathVariable Long brandId,
            @Valid @RequestBody AddBrandAdminRequest request) {
        BrandAdminResponse response = brandAdminService.addAdmin(brandId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<BrandAdminResponse>> getAdmins(@PathVariable Long brandId) {
        List<BrandAdminResponse> response = brandAdminService.getAdmins(brandId);
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
