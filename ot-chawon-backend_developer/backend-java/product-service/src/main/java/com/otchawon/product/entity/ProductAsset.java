package com.otchawon.product.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_assets",
        uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "lod_level"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ProductAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "glb_url", nullable = false, length = 500)
    private String glbUrl;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(name = "rig_type", length = 50)
    private String rigType;

    @Column(name = "draco_compressed", nullable = false)
    @Builder.Default
    private boolean dracoCompressed = true;

    @Column(name = "lod_level", length = 10)
    @Builder.Default
    private String lodLevel = "LOD0";

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "polygon_count")
    private Integer polygonCount;

    @Column(name = "texture_info", length = 1000)
    private String textureInfo;

    @Column(name = "cdn_url", length = 500)
    private String cdnUrl;

    @Column(name = "category", length = 20)
    private String category;

    @Column(name = "material_type", length = 50)
    private String materialType;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public void update(String glbUrl, String thumbnailUrl, String rigType, boolean dracoCompressed,
                       String lodLevel, Long fileSize, Integer polygonCount, String textureInfo,
                       String cdnUrl, String category, String materialType) {
        if (glbUrl != null) this.glbUrl = glbUrl;
        if (thumbnailUrl != null) this.thumbnailUrl = thumbnailUrl;
        if (rigType != null) this.rigType = rigType;
        this.dracoCompressed = dracoCompressed;
        if (lodLevel != null) this.lodLevel = lodLevel;
        if (fileSize != null) this.fileSize = fileSize;
        if (polygonCount != null) this.polygonCount = polygonCount;
        if (textureInfo != null) this.textureInfo = textureInfo;
        if (cdnUrl != null) this.cdnUrl = cdnUrl;
        if (category != null) this.category = category;
        if (materialType != null) this.materialType = materialType;
    }
}
