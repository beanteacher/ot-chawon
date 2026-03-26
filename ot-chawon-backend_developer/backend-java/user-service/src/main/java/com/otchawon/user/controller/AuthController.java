package com.otchawon.user.controller;

import com.otchawon.user.dto.request.LoginRequest;
import com.otchawon.user.dto.request.RefreshRequest;
import com.otchawon.user.dto.request.SignupRequest;
import com.otchawon.user.dto.response.TokenResponse;
import com.otchawon.user.dto.response.UserResponse;
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
    public ResponseEntity<UserResponse> signup(@Valid @RequestBody SignupRequest request) {
        UserResponse response = authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        TokenResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        TokenResponse response = authService.refresh(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshRequest request) {
        authService.logout(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getProfile(@RequestHeader("Authorization") String authorizationHeader) {
        String token = resolveToken(authorizationHeader);
        Long userId = jwtTokenProvider.extractUserId(token);
        UserResponse response = authService.getProfile(userId);
        return ResponseEntity.ok(response);
    }

    private String resolveToken(String bearerToken) {
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        throw new IllegalArgumentException("유효하지 않은 Authorization 헤더입니다.");
    }
}
