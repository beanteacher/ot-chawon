export const env = {
  SPRING_GATEWAY_URL:
    process.env.NEXT_PUBLIC_SPRING_GATEWAY_URL ?? 'http://localhost:8080',
} as const;
