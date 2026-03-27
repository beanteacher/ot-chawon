package com.otchawon.brand.dto.request;

import com.otchawon.brand.entity.BrandRole;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AddBrandAdminRequest {

    @NotNull(message = "userId는 필수입니다.")
    private Long userId;

    private BrandRole role = BrandRole.ADMIN;
}
