import { env } from '@/lib/env';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  traceId: string;
}

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  const res = await fetch(`${env.gatewayUrl}${path}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`GET ${path} failed with ${res.status}`);
  }

  return (await res.json()) as ApiResponse<T>;
}
