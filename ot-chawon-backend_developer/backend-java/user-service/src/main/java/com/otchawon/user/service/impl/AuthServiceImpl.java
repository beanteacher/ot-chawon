package com.otchawon.user.service.impl;

import com.otchawon.user.dto.request.LoginRequest;
import com.otchawon.user.dto.request.RefreshRequest;
import com.otchawon.user.dto.request.SignupRequest;
import com.otchawon.user.dto.response.TokenResponse;
import com.otchawon.user.dto.response.UserResponse;
import com.otchawon.user.entity.User;
import com.otchawon.user.exception.AuthException;
import com.otchawon.user.repository.UserRepository;
import com.otchawon.user.security.JwtTokenProvider;
import com.otchawon.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final String REFRESH_TOKEN_PREFIX = "refresh:";

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final StringRedisTemplate redisTemplate;

    @Override
    @Transactional
    public UserResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw AuthException.emailAlreadyExists();
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .role("USER")
                .status("ACTIVE")
                .build();

        User savedUser = userRepository.save(user);
        log.info("New user registered: {}", savedUser.getEmail());
        return UserResponse.from(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(AuthException::invalidCredentials);

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw AuthException.invalidCredentials();
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getRole());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        storeRefreshToken(user.getId(), refreshToken);

        log.info("User logged in: {}", user.getEmail());
        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtTokenProvider.getAccessTokenExpiryMs() / 1000)
                .build();
    }

    @Override
    public TokenResponse refresh(RefreshRequest request) {
        String refreshToken = request.getRefreshToken();

        if (!jwtTokenProvider.isValid(refreshToken)) {
            throw AuthException.invalidRefreshToken();
        }

        Long userId = jwtTokenProvider.extractUserId(refreshToken);
        String redisKey = REFRESH_TOKEN_PREFIX + userId;
        String storedToken = redisTemplate.opsForValue().get(redisKey);

        if (storedToken == null || !storedToken.equals(refreshToken)) {
            throw AuthException.invalidRefreshToken();
        }

        User user = userRepository.findById(userId)
                .orElseThrow(AuthException::userNotFound);

        String newAccessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getRole());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        storeRefreshToken(userId, newRefreshToken);

        return TokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .expiresIn(jwtTokenProvider.getAccessTokenExpiryMs() / 1000)
                .build();
    }

    @Override
    public void logout(RefreshRequest request) {
        String refreshToken = request.getRefreshToken();

        if (!jwtTokenProvider.isValid(refreshToken)) {
            throw AuthException.invalidRefreshToken();
        }

        Long userId = jwtTokenProvider.extractUserId(refreshToken);
        String redisKey = REFRESH_TOKEN_PREFIX + userId;
        redisTemplate.delete(redisKey);

        log.info("User logged out, userId: {}", userId);
    }

    private void storeRefreshToken(Long userId, String refreshToken) {
        String redisKey = REFRESH_TOKEN_PREFIX + userId;
        long ttlSeconds = jwtTokenProvider.getRefreshTokenExpiryMs() / 1000;
        redisTemplate.opsForValue().set(redisKey, refreshToken, Duration.ofSeconds(ttlSeconds));
    }
}
