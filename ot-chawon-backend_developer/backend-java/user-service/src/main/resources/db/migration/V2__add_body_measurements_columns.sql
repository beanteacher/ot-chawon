-- V3: body_measurements 테이블에 누락된 체형 컬럼 추가
-- shoulder(어깨너비), arm_length(팔길이), leg_length(다리길이)

ALTER TABLE body_measurements
    ADD COLUMN IF NOT EXISTS shoulder     DOUBLE  NULL COMMENT '어깨너비 (cm)',
    ADD COLUMN IF NOT EXISTS arm_length   DOUBLE  NULL COMMENT '팔 길이 (cm)',
    ADD COLUMN IF NOT EXISTS leg_length   DOUBLE  NULL COMMENT '다리 길이 (cm)';

-- V1의 암호화 컬럼 대신 평문 Double 컬럼으로 재구성
-- 기존 encrypted_* 컬럼을 유지하고 평문 컬럼을 추가 (마이그레이션 호환성)
ALTER TABLE body_measurements
    ADD COLUMN IF NOT EXISTS height  DOUBLE  NULL COMMENT '키 (cm)',
    ADD COLUMN IF NOT EXISTS weight  DOUBLE  NULL COMMENT '몸무게 (kg)',
    ADD COLUMN IF NOT EXISTS chest   DOUBLE  NULL COMMENT '가슴둘레 (cm)',
    ADD COLUMN IF NOT EXISTS waist   DOUBLE  NULL COMMENT '허리둘레 (cm)',
    ADD COLUMN IF NOT EXISTS hip     DOUBLE  NULL COMMENT '엉덩이둘레 (cm)';
