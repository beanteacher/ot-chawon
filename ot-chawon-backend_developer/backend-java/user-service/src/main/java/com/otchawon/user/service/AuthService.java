package com.otchawon.user.service;

import com.otchawon.user.dto.request.LoginRequest;
import com.otchawon.user.dto.request.RefreshRequest;
import com.otchawon.user.dto.request.SignupRequest;
import com.otchawon.user.dto.response.TokenResponse;
import com.otchawon.user.dto.response.UserResponse;

public interface AuthService {

    UserResponse signup(SignupRequest request);

    TokenResponse login(LoginRequest request);

    TokenResponse refresh(RefreshRequest request);

    void logout(RefreshRequest request);
}
