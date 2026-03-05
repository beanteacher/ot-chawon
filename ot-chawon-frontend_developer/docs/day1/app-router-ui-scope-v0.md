# Frontend Day1 - App Router/UI Scope v0

## Route Skeleton
- /(main)/page.tsx
- /(main)/products/page.tsx
- /(main)/products/[id]/page.tsx
- /(auth)/login/page.tsx
- /(auth)/signup/page.tsx
- /(main)/cart/page.tsx
- /(main)/mypage/page.tsx

## Common Layout Scope
- Root providers: QueryClient, Zustand hydration, global toast
- Main layout: header/footer/container

## UI Components v0
- ui/Button: variant(primary, secondary), size(sm, md, lg)
- ui/Input: label, error, helperText

## API Base URL Rule
- use NEXT_PUBLIC_SPRING_GATEWAY_URL for browser requests
