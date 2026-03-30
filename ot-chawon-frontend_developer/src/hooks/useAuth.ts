'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/axios';
import { useAuthStore } from '@/store/auth.store';
import type { AuthDto } from '@/services/auth/dto/auth.dto';

export function useLogin() {
  const { setAuth } = useAuthStore();

  return useMutation<AuthDto.TokenResponse, Error, AuthDto.LoginRequest>({
    mutationFn: async (credentials) => {
      const response = await apiClient.post<AuthDto.TokenResponse>(
        '/api/auth/login',
        credentials
      );
      return response.data;
    },
    onSuccess: async (tokens) => {
      const profileResponse = await apiClient.get<AuthDto.UserProfile>(
        '/api/auth/me',
        {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        }
      );
      setAuth(profileResponse.data, tokens.accessToken);
    },
  });
}

export function useLogout() {
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/api/auth/logout');
    },
    onSettled: () => {
      clearAuth();
    },
  });
}
