-- V2: body_measurements 테이블에 누락된 체형 컬럼 추가
-- shoulder(어깨너비), arm_length(팔길이), leg_length(다리길이), 평문 Double 컬럼

ALTER TABLE body_measurements
    ADD COLUMN shoulder     DOUBLE  NULL COMMENT '어깨너비 (cm)',
    ADD COLUMN arm_length   DOUBLE  NULL COMMENT '팔 길이 (cm)',
    ADD COLUMN leg_length   DOUBLE  NULL COMMENT '다리 길이 (cm)',
    ADD COLUMN height       DOUBLE  NULL COMMENT '키 (cm)',
    ADD COLUMN weight       DOUBLE  NULL COMMENT '몸무게 (kg)',
    ADD COLUMN chest        DOUBLE  NULL COMMENT '가슴둘레 (cm)',
    ADD COLUMN waist        DOUBLE  NULL COMMENT '허리둘레 (cm)',
    ADD COLUMN hip          DOUBLE  NULL COMMENT '엉덩이둘레 (cm)';
