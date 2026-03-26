interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_SPRING_GATEWAY_URL ?? 'http://localhost:8080';

export async function serverFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const json = (await response.json()) as ApiResponse<T>;
  return json.data;
}
