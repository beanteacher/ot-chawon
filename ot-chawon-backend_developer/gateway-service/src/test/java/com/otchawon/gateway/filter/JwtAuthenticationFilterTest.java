package com.otchawon.gateway.filter;

import com.otchawon.gateway.util.JwtUtil;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@TestPropertySource(properties = {
        "jwt.secret=test-secret-key-must-be-at-least-256-bits-long-for-hs256-algorithm"
})
class JwtAuthenticationFilterTest {

    @Autowired
    private JwtUtil jwtUtil;

    private SecretKey testSecretKey;

    @BeforeEach
    void setUp() {
        String secret = "test-secret-key-must-be-at-least-256-bits-long-for-hs256-algorithm";
        testSecretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    private String generateValidToken(String userId, String role) {
        return Jwts.builder()
                .subject(userId)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 15)) // 15분
                .signWith(testSecretKey)
                .compact();
    }

    private String generateExpiredToken(String userId) {
        return Jwts.builder()
                .subject(userId)
                .issuedAt(new Date(System.currentTimeMillis() - 1000 * 60 * 30)) // 30분 전
                .expiration(new Date(System.currentTimeMillis() - 1000 * 60 * 15)) // 15분 전 만료
                .signWith(testSecretKey)
                .compact();
    }

    @Test
    @DisplayName("유효한 JWT 토큰 검증 성공")
    void validToken_shouldReturnTrue() {
        String token = generateValidToken("user-123", "USER");

        assertThat(jwtUtil.isValid(token)).isTrue();
    }

    @Test
    @DisplayName("유효한 JWT 토큰에서 subject(userId) 추출 성공")
    void validToken_shouldExtractSubject() {
        String token = generateValidToken("user-123", "USER");

        assertThat(jwtUtil.extractSubject(token)).isEqualTo("user-123");
    }

    @Test
    @DisplayName("유효한 JWT 토큰에서 role 클레임 추출 성공")
    void validToken_shouldExtractRole() {
        String token = generateValidToken("user-123", "BRAND_ADMIN");

        String role = jwtUtil.parseToken(token).get("role", String.class);
        assertThat(role).isEqualTo("BRAND_ADMIN");
    }

    @Test
    @DisplayName("만료된 JWT 토큰 검증 실패")
    void expiredToken_shouldReturnFalse() {
        String token = generateExpiredToken("user-123");

        assertThat(jwtUtil.isValid(token)).isFalse();
    }

    @Test
    @DisplayName("잘못된 형식의 JWT 토큰 검증 실패")
    void malformedToken_shouldReturnFalse() {
        assertThat(jwtUtil.isValid("not.a.valid.token")).isFalse();
    }

    @Test
    @DisplayName("null 토큰 검증 실패")
    void nullToken_shouldReturnFalse() {
        assertThat(jwtUtil.isValid(null)).isFalse();
    }

    @Test
    @DisplayName("빈 문자열 토큰 검증 실패")
    void emptyToken_shouldReturnFalse() {
        assertThat(jwtUtil.isValid("")).isFalse();
    }

    @Test
    @DisplayName("다른 키로 서명된 토큰 검증 실패")
    void tokenWithWrongKey_shouldReturnFalse() {
        SecretKey wrongKey = Keys.hmacShaKeyFor(
                "wrong-secret-key-must-be-at-least-256-bits-long-for-hs256".getBytes(StandardCharsets.UTF_8)
        );
        String tokenWithWrongKey = Jwts.builder()
                .subject("user-123")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 15))
                .signWith(wrongKey)
                .compact();

        assertThat(jwtUtil.isValid(tokenWithWrongKey)).isFalse();
    }
}
