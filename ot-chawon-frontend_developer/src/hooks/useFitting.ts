'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/axios';
import { useFittingStore } from '@/store/fitting.store';
import type { FittingDto } from '@/services/fitting/dto/fitting.dto';

export function useFittingRequest() {
  const { setSession, setPendingRequest } = useFittingStore();

  return useMutation<FittingDto.SessionResponse, Error, FittingDto.Request>({
    mutationFn: async (request) => {
      const response = await apiClient.post<FittingDto.SessionResponse>(
        '/api/fitting/sessions',
        request
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      setSession(data.sessionId, data.status);
      setPendingRequest(variables);
    },
  });
}

export function useFittingResult(sessionId: string | null) {
  const { setResult } = useFittingStore();

  return useQuery<FittingDto.Result>({
    queryKey: ['fitting', sessionId],
    queryFn: async () => {
      const response = await apiClient.get<FittingDto.Result>(
        `/api/fitting/sessions/${sessionId}`
      );
      return response.data;
    },
    enabled: sessionId !== null,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'PENDING' || status === 'PROCESSING') return 3000;
      return false;
    },
    select: (data) => {
      if (data.status === 'COMPLETED') {
        setResult(data);
      }
      return data;
    },
  });
}
