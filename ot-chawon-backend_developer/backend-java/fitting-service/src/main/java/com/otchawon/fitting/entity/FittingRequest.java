package com.otchawon.fitting.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "fitting_requests")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class FittingRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "item_id", nullable = false)
    private String itemId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private FittingStatus status = FittingStatus.QUEUED;

    @Column(name = "body_measurement", columnDefinition = "TEXT")
    private String bodyMeasurement;

    @Column(name = "avatar_glb_url", length = 500)
    private String avatarGlbUrl;

    @Column(name = "fitted_glb_url", length = 500)
    private String fittedGlbUrl;

    @Column(name = "render_urls", columnDefinition = "TEXT")
    private String renderUrls;

    @Column(name = "size_recommendation", columnDefinition = "TEXT")
    private String sizeRecommendation;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public void updateStatus(FittingStatus status) {
        this.status = status;
    }

    public void completeWithResult(String fittedGlbUrl, String renderUrls, String sizeRecommendation) {
        this.fittedGlbUrl = fittedGlbUrl;
        this.renderUrls = renderUrls;
        this.sizeRecommendation = sizeRecommendation;
        this.status = FittingStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
    }

    public void fail() {
        this.status = FittingStatus.FAILED;
        this.completedAt = LocalDateTime.now();
    }
}
