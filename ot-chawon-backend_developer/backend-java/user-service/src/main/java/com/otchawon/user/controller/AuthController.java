package com.otchawon.user.controller;
import com.otchawon.user.dto.UserDto;

import com.otchawon.user.security.JwtTokenProvider;
import com.otchawon.user.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/signup")
    public ResponseEntity<UserDto.UserResponse> signup(@Valid @RequestBody UserDto.SignupRequest request) {
        UserDto.UserResponse response = authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto.TokenResponse> login(@Valid @RequestBody UserDto.LoginRequest request) {
        UserDto.TokenResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<UserDto.TokenResponse> refresh(@Valid @RequestBody UserDto.RefreshRequest request) {
        UserDto.TokenResponse response = authService.refresh(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody UserDto.RefreshRequest request) {
        authService.logout(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto.UserResponse> getProfile(@RequestHeader("Authorization") String authorizationHeader) {
        String token = resolveToken(authorizationHeader);
        Long userId = jwtTokenProvider.extractUserId(token);
        UserDto.UserResponse response = authService.getProfile(userId);
        return ResponseEntity.ok(response);
    }

    private String resolveToken(String bearerToken) {
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        throw new IllegalArgumentException("유효하지 않은 Authorization 헤더입니다.");
    }
}
