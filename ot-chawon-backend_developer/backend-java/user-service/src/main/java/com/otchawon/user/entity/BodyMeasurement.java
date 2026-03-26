package com.otchawon.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 사용자 체형 정보 엔티티.
 * users 테이블과 1:1 관계이며, user_id에 UNIQUE 제약이 있어 중복 저장되지 않는다.
 */
@Entity
@Table(name = "body_measurements")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class BodyMeasurement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 사용자 ID (FK → users.id, UNIQUE) */
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    /** 키 (cm) */
    @Column(name = "height")
    private Double height;

    /** 몸무게 (kg) */
    @Column(name = "weight")
    private Double weight;

    /** 가슴둘레 (cm) */
    @Column(name = "chest")
    private Double chest;

    /** 허리둘레 (cm) */
    @Column(name = "waist")
    private Double waist;

    /** 엉덩이둘레 (cm) */
    @Column(name = "hip")
    private Double hip;

    /** 어깨너비 (cm) */
    @Column(name = "shoulder")
    private Double shoulder;

    /** 팔 길이 (cm) */
    @Column(name = "arm_length")
    private Double armLength;

    /** 다리 길이 (cm) */
    @Column(name = "leg_length")
    private Double legLength;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * 체형 정보를 업데이트한다. null 값은 기존 값을 유지하지 않고 덮어쓴다.
     */
    public void update(Double height, Double weight, Double chest, Double waist,
                       Double hip, Double shoulder, Double armLength, Double legLength) {
        this.height = height;
        this.weight = weight;
        this.chest = chest;
        this.waist = waist;
        this.hip = hip;
        this.shoulder = shoulder;
        this.armLength = armLength;
        this.legLength = legLength;
    }
}
