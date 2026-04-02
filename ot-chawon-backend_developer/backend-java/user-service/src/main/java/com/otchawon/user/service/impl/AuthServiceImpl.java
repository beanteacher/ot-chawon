package com.otchawon.user.service.impl;
import com.otchawon.user.dto.UserDto;

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
    public UserDto.UserResponse signup(UserDto.SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw AuthException.emailAlreadyExists();
        }

        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .name(request.name())
                .role("USER")
                .status("ACTIVE")
                .build();

        User savedUser = userRepository.save(user);
        log.info("New user registered: {}", savedUser.getEmail());
        return UserDto.UserResponse.from(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto.TokenResponse login(UserDto.LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(AuthException::invalidCredentials);

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw AuthException.invalidCredentials();
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getRole());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        storeRefreshToken(user.getId(), refreshToken);

        log.info("User logged in: {}", user.getEmail());
        return new UserDto.TokenResponse(accessToken, refreshToken,
                jwtTokenProvider.getAccessTokenExpiryMs() / 1000);
    }

    @Override
    public UserDto.TokenResponse refresh(UserDto.RefreshRequest request) {
        String refreshToken = request.refreshToken();

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

        return new UserDto.TokenResponse(newAccessToken, newRefreshToken,
                jwtTokenProvider.getAccessTokenExpiryMs() / 1000);
    }

    @Override
    public void logout(UserDto.RefreshRequest request) {
        String refreshToken = request.refreshToken();

        if (!jwtTokenProvider.isValid(refreshToken)) {
            throw AuthException.invalidRefreshToken();
        }

        Long userId = jwtTokenProvider.extractUserId(refreshToken);
        String redisKey = REFRESH_TOKEN_PREFIX + userId;
        redisTemplate.delete(redisKey);

        log.info("User logged out, userId: {}", userId);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto.UserResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(AuthException::userNotFound);
        return UserDto.UserResponse.from(user);
    }

    private void storeRefreshToken(Long userId, String refreshToken) {
        String redisKey = REFRESH_TOKEN_PREFIX + userId;
        long ttlSeconds = jwtTokenProvider.getRefreshTokenExpiryMs() / 1000;
        redisTemplate.opsForValue().set(redisKey, refreshToken, Duration.ofSeconds(ttlSeconds));
    }
}
