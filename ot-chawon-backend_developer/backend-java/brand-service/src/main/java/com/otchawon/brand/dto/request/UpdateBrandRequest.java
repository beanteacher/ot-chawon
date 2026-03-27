package com.otchawon.brand.dto.request;

import com.otchawon.brand.entity.BrandStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBrandRequest {

    private String name;

    private String description;

    private String logoUrl;

    private BrandStatus status;
}
