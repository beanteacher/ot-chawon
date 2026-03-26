-- ========================
-- 옷차원 서비스별 독립 DB 초기화
-- ========================

CREATE DATABASE IF NOT EXISTS `otc_user_db`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS `otc_product_db`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS `otc_order_db`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS `otc_payment_db`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS `otc_fitting_db`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS `otc_brand_db`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- 각 DB에 대한 권한 부여
GRANT ALL PRIVILEGES ON `otc_user_db`.* TO 'otc_user'@'%';
GRANT ALL PRIVILEGES ON `otc_product_db`.* TO 'otc_user'@'%';
GRANT ALL PRIVILEGES ON `otc_order_db`.* TO 'otc_user'@'%';
GRANT ALL PRIVILEGES ON `otc_payment_db`.* TO 'otc_user'@'%';
GRANT ALL PRIVILEGES ON `otc_fitting_db`.* TO 'otc_user'@'%';
GRANT ALL PRIVILEGES ON `otc_brand_db`.* TO 'otc_user'@'%';

FLUSH PRIVILEGES;
