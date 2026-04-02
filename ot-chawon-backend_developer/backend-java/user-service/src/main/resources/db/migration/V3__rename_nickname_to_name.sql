-- users 테이블 nickname 컬럼 → name 으로 변경
ALTER TABLE users CHANGE COLUMN nickname name VARCHAR(100);
