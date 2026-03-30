package com.otchawon.user.service;
import com.otchawon.user.dto.UserDto;


public interface AuthService {

    UserDto.UserResponse signup(UserDto.SignupRequest request);

    UserDto.TokenResponse login(UserDto.LoginRequest request);

    UserDto.TokenResponse refresh(UserDto.RefreshRequest request);

    void logout(UserDto.RefreshRequest request);

    UserDto.UserResponse getProfile(Long userId);
}
