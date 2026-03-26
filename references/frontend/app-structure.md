# 옷차원 Frontend 앱 구조 및 코드 패턴

## 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js App Router | 14.x |
| 언어 | TypeScript strict | 5.x |
| 스타일 | Tailwind CSS | 3.x |
| 전역 상태 | Zustand | 4.x |
| 서버 상태 | TanStack Query | 5.x |
| 3D 렌더링 | Three.js + React Three Fiber + Drei | latest stable |
| HTTP 클라이언트 | Axios (클라이언트 사이드), fetch (서버 사이드 RSC) |
| Mock | MSW 2.x |
| 테스트 | Jest + React Testing Library |
| API 게이트웨이 | Spring Cloud Gateway (`NEXT_PUBLIC_SPRING_GATEWAY_URL`) |
| BFF | Prisma (Read 전용) |

---

## 디렉터리 구조

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # 루트 레이아웃
│   ├── (main)/                 # 일반 사용자 라우트 그룹
│   │   ├── page.tsx            # 홈 (상품 피드)
│   │   ├── products/
│   │   │   ├── page.tsx        # 상품 목록
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx    # 상품 상세 (3D 뷰어 포함)
│   │   ├── fitting/
│   │   │   └── [sessionId]/
│   │   │       └── page.tsx    # AI 피팅 결과 페이지
│   │   ├── cart/
│   │   ├── order/
│   │   └── mypage/
│   └── (auth)/
│       ├── login/
│       └── signup/
├── components/
│   ├── ui/                     # 디자인 시스템 원자 컴포넌트
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Badge/
│   │   └── Skeleton/
│   ├── product/                # 상품 도메인 컴포넌트
│   ├── fitting/                # AI 피팅 도메인 컴포넌트
│   └── three/                  # Three.js / R3F 컴포넌트
│       ├── AvatarViewer.tsx    # 아바타 3D 뷰어
│       ├── ClothingLayer.tsx   # 의류 GLB 레이어
│       ├── FittingScene.tsx    # 피팅 결과 씬
│       └── SceneLights.tsx     # 조명 표준 설정
├── hooks/                      # 클라이언트 커스텀 훅
│   ├── useProducts.ts
│   ├── useFitting.ts
│   └── useAuth.ts
├── lib/
│   ├── api/
│   │   ├── client.ts           # fetch 기반 서버 사이드 헬퍼
│   │   └── axios.ts            # Axios 인스턴스 (클라이언트 사이드)
│   ├── env.ts                  # 환경변수 타입 안전 접근
│   └── utils/
│       └── price.ts
├── services/                   # 서버 사이드 data fetching 함수
│   ├── product/
│   ├── fitting/
│   └── order/
├── store/                      # Zustand 전역 상태
│   ├── auth.store.ts
│   ├── cart.store.ts
│   └── fitting.store.ts
└── types/                      # DTO namespace 타입 정의
    ├── product.dto.ts
    ├── fitting.dto.ts
    ├── order.dto.ts
    └── auth.dto.ts
```

---

## 코드 컨벤션

### 명명 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| React 컴포넌트 | PascalCase | `FittingScene`, `ProductCard` |
| 커스텀 훅 | camelCase, `use` 접두사 | `useFitting`, `useProducts` |
| 서비스 함수 | kebab-case 파일, camelCase 함수 | `get-products.ts` → `getProducts()` |
| Zustand 스토어 | camelCase 파일, `use~Store` | `auth.store.ts` → `useAuthStore` |
| DTO namespace | PascalCase, `Dto` 접미사 | `ProductDto`, `FittingDto` |
| 상수 | UPPER_SNAKE_CASE | `MAX_FITTING_POLL_ATTEMPTS` |
| 환경변수 | `NEXT_PUBLIC_` 접두사 (클라이언트 노출 시) | `NEXT_PUBLIC_SPRING_GATEWAY_URL` |
| GLB 에셋 | kebab-case | `avatar-base-male.glb`, `top-shirt-001.glb` |

### TypeScript 엄격 규칙

```json
// tsconfig.json 필수 설정
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": true
  }
}
```

- `any` 사용 금지. 불가피한 경우 `// eslint-disable-next-line @typescript-eslint/no-explicit-any` + 사유 주석 필수.
- `as` 타입 단언은 외부 API 응답 경계(service 레이어)에서만 허용.
- 함수 반환 타입은 명시적으로 선언한다. 단, 추론이 명확한 단순 유틸은 예외.
- `null`과 `undefined`는 혼용 금지. 도메인 내부는 `undefined`, API 응답 경계는 `null` 허용.

### React 컴포넌트 규칙

```tsx
// 컴포넌트 파일 구조 순서
// 1. import
// 2. interface Props (export 금지, 해당 파일 전용)
// 3. export function ComponentName
// 4. 내부 서브컴포넌트 (필요 시)

interface ProductCardProps {
  product: ProductDto.Item;
  onFittingRequest?: (productId: number) => void;
}

export function ProductCard({ product, onFittingRequest }: ProductCardProps) {
  // ...
}
```

- `default export` 금지. 모든 컴포넌트는 named export.
- Props 인터페이스는 컴포넌트 파일 내부에 선언. 재사용이 필요하면 `types/` 디렉터리로 이동.
- 서버 컴포넌트(RSC)와 클라이언트 컴포넌트(`'use client'`)를 명확히 분리한다.
- `'use client'`는 반드시 필요한 최소 컴포넌트에만 선언한다.
- 3D 뷰어 컴포넌트는 반드시 `'use client'`를 선언하고 `<Suspense>`로 감싼다.

### Tailwind CSS 규칙

- 인라인 스타일 금지. 모든 스타일은 Tailwind 유틸리티 클래스로 작성.
- 커스텀 색상은 `tailwind.config.ts`의 `extend.colors`에 옷차원 브랜드 토큰으로 등록.
  ```ts
  // tailwind.config.ts
  colors: {
    'oc-black': '#111111',     // 옷차원 메인 배경
    'oc-accent': '#FF6B35',    // 옷차원 강조색 (피팅 CTA 버튼 등)
    'oc-gray': {
      50: '#F9F9F9',
      200: '#E5E5E5',
      500: '#9E9E9E',
      800: '#333333',
    },
  }
  ```
- 반응형 접두사 순서: `sm:` → `md:` → `lg:` → `xl:`.
- 복잡한 반복 클래스는 `cn()` 유틸 (`clsx` + `tailwind-merge`)로 조합.
  ```ts
  import { cn } from '@/lib/utils/cn';
  ```

---

## DTO 타입 규칙

BE의 Java DTO record와 1:1 대응하는 **namespace 패턴**을 사용한다.

```ts
// src/types/product.dto.ts
// BE: ProductDto.java record와 1:1 대응

export namespace ProductDto {
  /** ProductDto.Item (Java record) */
  export interface Item {
    id: number;
    name: string;
    price: number;
    brandName: string;
    thumbnailUrl: string;
    hasThreeD: boolean;       // 3D 에셋 보유 여부
    glbAssetKey: string | null; // S3 GLB 키 (hasThreeD === true 시 non-null)
  }

  /** ProductDto.Detail (Java record) */
  export interface Detail extends Item {
    description: string;
    images: string[];
    sizes: SizeOption[];
    category: string;
  }

  export interface SizeOption {
    label: string;   // 'S' | 'M' | 'L' | 'XL'
    stock: number;
  }

  /** ProductDto.ListResponse (Java record) */
  export interface ListResponse {
    items: Item[];
    page: number;
    size: number;
    total: number;
  }
}
```

```ts
// src/types/fitting.dto.ts
export namespace FittingDto {
  /** FittingDto.Request */
  export interface Request {
    productId: number;
    height: number;   // cm
    weight: number;   // kg
    chest: number;    // cm
    waist: number;    // cm
    hip: number;      // cm
  }

  /** FittingDto.SessionResponse */
  export interface SessionResponse {
    sessionId: string;
    status: FittingStatus;
    estimatedSeconds: number;
  }

  /** FittingDto.Result */
  export interface Result {
    sessionId: string;
    status: FittingStatus;
    avatarGlbUrl: string | null;   // 피팅 완료 시 서명된 S3 URL
    clothingGlbUrl: string | null;
    smplParams: SmplParams | null;
  }

  export type FittingStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

  export interface SmplParams {
    betas: number[];   // SMPL shape 파라미터 (10차원)
    pose: number[];    // SMPL pose 파라미터
  }
}
```

- namespace 이름 = Java DTO 클래스 이름과 동일하게 유지한다.
- BE API 응답 구조가 변경되면 해당 namespace만 수정하고 전파를 TypeScript 오류로 확인한다.
- `ApiResponse<T>` 래퍼는 `src/lib/api/client.ts`에서 한 번만 처리하고 서비스 레이어는 `T`만 반환한다.

---

## 클라이언트 상태관리 패턴

Next.js App Router 데이터 흐름:

```
Server Component (RSC)
  └─ services/product/get-products.ts   (fetch, cache: 'no-store')
       └─ ProductListContent.tsx        ('use client', TanStack Query)
            └─ useProducts()            (커스텀 훅)
                 └─ ProductCard.tsx     (렌더링)

Page: app/(main)/products/page.tsx
  └─ <Suspense fallback={<ProductListSkeleton />}>
       <ProductListContent />
     </Suspense>
```

### Page 레이어 (RSC)

```tsx
// app/(main)/products/page.tsx
import { Suspense } from 'react';
import { ProductListContent } from '@/components/product/ProductListContent';
import { ProductListSkeleton } from '@/components/product/ProductListSkeleton';

export default function ProductsPage() {
  return (
    <main className="max-w-screen-xl mx-auto px-4">
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductListContent />
      </Suspense>
    </main>
  );
}
```

### Content Client 레이어

```tsx
// components/product/ProductListContent.tsx
'use client';

import { useProducts } from '@/hooks/useProducts';

export function ProductListContent() {
  const { data: products, isError } = useProducts();

  if (isError) return <ProductListError />;

  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {products?.map((p) => <ProductCard key={p.id} product={p} />)}
    </ul>
  );
}
```

### 커스텀 훅 레이어

```ts
// hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/product/get-products';
import type { ProductDto } from '@/types/product.dto';

export function useProducts() {
  return useQuery<ProductDto.Item[]>({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5, // 5분
  });
}
```

---

## API 호출 규칙

### 서버 사이드 (RSC / Server Actions) — fetch 사용

```ts
// src/lib/api/client.ts
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
```

### 클라이언트 사이드 — Axios 인스턴스

```ts
// src/lib/api/axios.ts
import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { env } from '@/lib/env';

export const gatewayClient = axios.create({
  baseURL: env.gatewayUrl,
  headers: { 'Content-Type': 'application/json' },
});

// JWT 요청 인터셉터
gatewayClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 갱신 인터셉터
let isRefreshing = false;
let pendingQueue: Array<(token: string) => void> = [];

gatewayClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingQueue.push((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(gatewayClient(original));
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('no refresh token');

      const { data } = await axios.post<ApiResponse<{ accessToken: string }>>(
        `${env.gatewayUrl}/api/v1/auth/refresh`,
        { refreshToken },
      );

      const newToken = data.data.accessToken;
      useAuthStore.getState().setAccessToken(newToken);
      pendingQueue.forEach((cb) => cb(newToken));
      pendingQueue = [];

      original.headers.Authorization = `Bearer ${newToken}`;
      return gatewayClient(original);
    } catch (refreshError) {
      useAuthStore.getState().clearAuth();
      pendingQueue = [];
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
```

- Spring Cloud Gateway baseURL은 `NEXT_PUBLIC_SPRING_GATEWAY_URL` 환경변수 단일 값.
- API 경로 접두사: `/api/v1/` (Gateway 라우팅 기준).
- 서버 사이드 RSC에서는 Axios 사용 금지 — fetch만 사용.
- Axios는 클라이언트 컴포넌트 훅 내부 또는 커스텀 훅 레이어에서만 사용.

---

## Zustand 전역 상태 규칙

### 인증 스토어 — accessToken 메모리, refreshToken localStorage

```ts
// src/store/auth.store.ts
import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,  // 메모리에만 보관 (XSS 방어)

  setAccessToken: (token) => set({ accessToken: token }),

  clearAuth: () => {
    localStorage.removeItem('refreshToken');  // refreshToken은 localStorage
    set({ accessToken: null });
  },
}));
```

- `accessToken`: 메모리(Zustand)에만 보관. localStorage/쿠키 저장 금지.
- `refreshToken`: `localStorage`에 보관. 키 이름: `'refreshToken'`.
- 페이지 새로고침 시 accessToken 소멸 → `/api/v1/auth/refresh` 자동 호출로 재발급.
- 스토어 파일 하나당 단일 도메인. 스토어 간 직접 참조 금지. 필요 시 이벤트 또는 커스텀 훅으로 조합.

### 3D 피팅 스토어

```ts
// src/store/fitting.store.ts
import { create } from 'zustand';
import type { FittingDto } from '@/types/fitting.dto';

interface FittingState {
  activeSessionId: string | null;
  result: FittingDto.Result | null;
  setSession: (sessionId: string) => void;
  setResult: (result: FittingDto.Result) => void;
  reset: () => void;
}

export const useFittingStore = create<FittingState>((set) => ({
  activeSessionId: null,
  result: null,
  setSession: (sessionId) => set({ activeSessionId: sessionId }),
  setResult: (result) => set({ result }),
  reset: () => set({ activeSessionId: null, result: null }),
}));
```

---

## Three.js / 3D 뷰어 규칙 (옷차원 핵심)

### GLB 모델 로딩 컴포넌트 패턴

```tsx
// components/three/AvatarViewer.tsx
'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { SceneLights } from './SceneLights';

interface AvatarViewerProps {
  avatarGlbUrl: string;
  clothingGlbUrl?: string;
  className?: string;
}

export function AvatarViewer({ avatarGlbUrl, clothingGlbUrl, className }: AvatarViewerProps) {
  return (
    <div className={cn('w-full aspect-[3/4] rounded-lg overflow-hidden bg-oc-gray-50', className)}>
      <Canvas
        camera={{ position: [0, 1.6, 2.5], fov: 45 }}
        gl={{ antialias: true, preserveDrawingBuffer: false }}
        dpr={[1, 2]}  // 디바이스 픽셀 비율 상한 2로 제한 (성능)
      >
        <SceneLights />
        <Suspense fallback={<AvatarLoadingMesh />}>
          <AvatarMesh url={avatarGlbUrl} />
          {clothingGlbUrl && <ClothingLayer url={clothingGlbUrl} />}
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={1.0}
          maxDistance={4.0}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.5}
        />
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}

function AvatarMesh({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

// 로딩 중 와이어프레임 폴백
function AvatarLoadingMesh() {
  return (
    <mesh>
      <capsuleGeometry args={[0.3, 1.2, 4, 8]} />
      <meshBasicMaterial color="#E5E5E5" wireframe />
    </mesh>
  );
}

// 뷰어 언마운트 시 GLB 캐시 해제
AvatarMesh.preload = (url: string) => useGLTF.preload(url);
```

### React Three Fiber 컴포넌트 구조

```
<Canvas>                    ← R3F 루트, 웹GL 컨텍스트
  <SceneLights />           ← 조명 (분리된 컴포넌트)
  <Suspense>
    <AvatarMesh />          ← SMPL 기반 아바타 GLB
    <ClothingLayer />       ← 의류 GLB (아바타 위에 레이어)
  </Suspense>
  <OrbitControls />         ← 카메라 인터랙션
  <Environment />           ← IBL 환경광
</Canvas>
```

- `Canvas`는 반드시 고정 `aspect-ratio` 컨테이너 내부에 배치한다.
- `useGLTF`는 `@react-three/drei` 제공 훅을 사용한다. `THREE.GLTFLoader` 직접 호출 금지.
- Draco 압축 GLB 사용 시 `<Canvas>` 외부에서 `useGLTF.setDecoderPath('/draco/')` 초기화.

### 3D 뷰어 성능 최적화

| 최적화 항목 | 적용 방법 |
|-------------|-----------|
| LOD (Level of Detail) | 상품 목록: 저해상도 GLB (< 5MB), 상세 페이지: 고해상도 GLB |
| Draco 압축 | 3D Designer가 납품하는 모든 GLB에 Draco 압축 적용 필수 |
| lazy loading | `next/dynamic` + `ssr: false`로 Canvas 지연 로드 |
| Suspense | GLB 로딩 중 와이어프레임 폴백 표시 |
| dpr 상한 | `Canvas dpr={[1, 2]}` — 레티나 대응, 3 이상 금지 |
| 캐시 해제 | 뷰어 언마운트 시 `useGLTF.clear(url)` 호출 |
| 씬 정리 | `useEffect` cleanup에서 geometry, material dispose |

```tsx
// 3D 뷰어 lazy loading 패턴
// components/product/ProductThreeDSection.tsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const AvatarViewer = dynamic(
  () => import('@/components/three/AvatarViewer').then((m) => m.AvatarViewer),
  { ssr: false },
);

export function ProductThreeDSection({ glbUrl }: { glbUrl: string }) {
  return (
    <Suspense fallback={<ThreeDSkeleton />}>
      <AvatarViewer avatarGlbUrl={glbUrl} />
    </Suspense>
  );
}
```

### 카메라 컨트롤 표준

```ts
// 상품 상세 — 전신 아바타 뷰
camera={{ position: [0, 1.6, 2.5], fov: 45 }}
OrbitControls:
  enablePan={false}
  minDistance={1.0}
  maxDistance={4.0}
  minPolarAngle={Math.PI / 6}    // 위에서 30도
  maxPolarAngle={Math.PI / 1.5}  // 아래에서 120도

// 상품 목록 썸네일 — 고정 각도
camera={{ position: [0, 1.5, 2.0], fov: 40 }}
OrbitControls: 비활성화 (autoRotate={true} autoRotateSpeed={0.5})
```

### 조명 설정 표준

```tsx
// components/three/SceneLights.tsx
export function SceneLights() {
  return (
    <>
      {/* 앰비언트 — 전체 균일 밝기 */}
      <ambientLight intensity={0.6} />
      {/* 키 라이트 — 왼쪽 상단 주광 */}
      <directionalLight position={[2, 4, 3]} intensity={1.2} castShadow />
      {/* 필 라이트 — 오른쪽 보조광 */}
      <directionalLight position={[-2, 2, -1]} intensity={0.4} />
      {/* 림 라이트 — 뒤에서 윤곽 강조 */}
      <pointLight position={[0, 3, -3]} intensity={0.3} color="#ffffff" />
    </>
  );
}
```

### 3D 피팅 결과 렌더링 컴포넌트

```tsx
// components/three/FittingScene.tsx
'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, PresentationControls } from '@react-three/drei';
import { SceneLights } from './SceneLights';
import type { FittingDto } from '@/types/fitting.dto';

interface FittingSceneProps {
  result: FittingDto.Result;
}

export function FittingScene({ result }: FittingSceneProps) {
  if (!result.avatarGlbUrl || !result.clothingGlbUrl) return null;

  return (
    <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-oc-gray-50">
      <Canvas camera={{ position: [0, 1.6, 2.8], fov: 42 }} dpr={[1, 2]}>
        <SceneLights />
        <Suspense fallback={<FittingLoadingMesh />}>
          <FittingAvatar
            avatarUrl={result.avatarGlbUrl}
            clothingUrl={result.clothingGlbUrl}
          />
        </Suspense>
        <PresentationControls
          global
          rotation={[0, -Math.PI / 6, 0]}
          polar={[-Math.PI / 8, Math.PI / 8]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
          snap
        />
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}

function FittingAvatar({ avatarUrl, clothingUrl }: { avatarUrl: string; clothingUrl: string }) {
  const avatar = useGLTF(avatarUrl);
  const clothing = useGLTF(clothingUrl);

  return (
    <group>
      <primitive object={avatar.scene} />
      <primitive object={clothing.scene} />
    </group>
  );
}

function FittingLoadingMesh() {
  return (
    <mesh position={[0, 1, 0]}>
      <capsuleGeometry args={[0.3, 1.2, 4, 8]} />
      <meshBasicMaterial color="#E5E5E5" wireframe />
    </mesh>
  );
}
```

---

## AI 피팅 결과 연동 규칙

### 피팅 플로우 전체 다이어그램

```
사용자: 체형 입력 + 상품 선택
  │
  ▼
POST /api/v1/fitting/sessions        ← 피팅 세션 생성
  │ FittingDto.SessionResponse { sessionId, status: 'PENDING' }
  │
  ▼
useFittingPoll(sessionId)            ← 폴링 시작 (2초 간격, 최대 60회)
  │
  ├─ status: 'PROCESSING' → 로딩 UX 유지 (ProgressBar, 예상시간 표시)
  ├─ status: 'COMPLETED'  → FittingDto.Result 수신 → FittingScene 렌더링
  └─ status: 'FAILED'     → 에러 UX 표시 + 재시도 버튼
```

### 피팅 세션 생성 서비스

```ts
// services/fitting/create-fitting-session.ts
import { gatewayClient } from '@/lib/api/axios';
import type { FittingDto } from '@/types/fitting.dto';
import type { ApiResponse } from '@/lib/api/client';

export async function createFittingSession(
  req: FittingDto.Request,
): Promise<FittingDto.SessionResponse> {
  const { data } = await gatewayClient.post<ApiResponse<FittingDto.SessionResponse>>(
    '/api/v1/fitting/sessions',
    req,
  );
  return data.data;
}
```

### 폴링 커스텀 훅

```ts
// hooks/useFittingPoll.ts
'use client';

import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFittingResult } from '@/services/fitting/get-fitting-result';
import { useFittingStore } from '@/store/fitting.store';
import type { FittingDto } from '@/types/fitting.dto';

const MAX_POLL_ATTEMPTS = 60;
const POLL_INTERVAL_MS = 2000;

export function useFittingPoll(sessionId: string | null) {
  const setResult = useFittingStore((s) => s.setResult);
  const attemptRef = useRef(0);

  const query = useQuery<FittingDto.Result>({
    queryKey: ['fitting', sessionId],
    queryFn: () => getFittingResult(sessionId!),
    enabled: sessionId !== null,
    refetchInterval: (data) => {
      if (!data) return POLL_INTERVAL_MS;
      if (data.status === 'COMPLETED' || data.status === 'FAILED') return false;
      attemptRef.current += 1;
      if (attemptRef.current >= MAX_POLL_ATTEMPTS) return false;
      return POLL_INTERVAL_MS;
    },
    staleTime: 0,
  });

  useEffect(() => {
    if (query.data?.status === 'COMPLETED') {
      setResult(query.data);
    }
  }, [query.data, setResult]);

  return query;
}
```

### 피팅 로딩 UX

```tsx
// components/fitting/FittingProgress.tsx
'use client';

import { useFittingPoll } from '@/hooks/useFittingPoll';
import { FittingScene } from '@/components/three/FittingScene';

export function FittingProgress({ sessionId }: { sessionId: string }) {
  const { data: result, isError } = useFittingPoll(sessionId);

  if (isError || result?.status === 'FAILED') {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-oc-gray-800 font-medium">피팅 처리에 실패했습니다.</p>
        <button className="px-6 py-3 bg-oc-accent text-white rounded-lg font-semibold">
          다시 시도
        </button>
      </div>
    );
  }

  if (!result || result.status !== 'COMPLETED') {
    return (
      <div className="flex flex-col items-center gap-6 py-16">
        <div className="w-12 h-12 border-4 border-oc-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-oc-gray-500 text-sm">
          AI가 3D 피팅 결과를 생성하고 있습니다
          {result?.status === 'PROCESSING' && ' — 잠시만 기다려 주세요'}
        </p>
      </div>
    );
  }

  return <FittingScene result={result} />;
}
```

- 폴링 방식 사용 (SSE/WebSocket은 AI/ML 서비스 지원 확정 후 전환 가능).
- 폴링 최대 시도: `MAX_POLL_ATTEMPTS = 60` (2초 × 60 = 최대 2분).
- 초과 시 FAILED 상태와 동일하게 에러 UX 표시.
- 피팅 완료 후 결과 GLB URL은 서명된 S3 Presigned URL. 유효시간 내 렌더링 완료 필수.

---

## 테스트 코드 규칙

### FIRST 원칙 적용

| 원칙 | 옷차원 적용 |
|------|-------------|
| **Fast** | MSW로 Spring Gateway 모킹. Three.js Canvas는 `jest-three-fiber` 또는 canvas mock으로 격리. |
| **Isolated** | 각 테스트 전 `zustand` 스토어 초기화. TanStack Query `QueryClient` 신규 생성. |
| **Repeatable** | 날짜/랜덤 값 고정. S3 URL은 MSW 핸들러에서 고정 fixture 반환. |
| **Self-validating** | `expect` 단정문으로 명확한 pass/fail. 콘솔 출력 확인 금지. |
| **Timely** | 기능 구현과 동시 작성. 3D 뷰어 PR은 렌더링 smoke 테스트 필수. |

### 컴포넌트 테스트 패턴 (RTL + MSW)

```ts
// components/product/__tests__/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ProductCard } from '../ProductCard';
import type { ProductDto } from '@/types/product.dto';

const mockProduct: ProductDto.Item = {
  id: 1,
  name: '오버사이즈 린넨 셔츠',
  price: 89000,
  brandName: 'COVERNAT',
  thumbnailUrl: '/fixtures/shirt-thumbnail.webp',
  hasThreeD: true,
  glbAssetKey: 'products/1/shirt.glb',
};

describe('ProductCard', () => {
  it('상품명과 가격을 표시한다', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('오버사이즈 린넨 셔츠')).toBeInTheDocument();
    expect(screen.getByText('89,000원')).toBeInTheDocument();
  });

  it('3D 에셋 보유 시 3D 뷰어 뱃지를 표시한다', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('3D 피팅')).toBeInTheDocument();
  });
});
```

### 훅 테스트 패턴 (MSW + TanStack Query)

```ts
// hooks/__tests__/useFittingPoll.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import { createWrapper } from '@/test-utils/query-wrapper';
import { useFittingPoll } from '../useFittingPoll';
import type { FittingDto } from '@/types/fitting.dto';

describe('useFittingPoll', () => {
  it('COMPLETED 상태 수신 시 result를 반환한다', async () => {
    const mockResult: FittingDto.Result = {
      sessionId: 'sess-001',
      status: 'COMPLETED',
      avatarGlbUrl: 'https://cdn.ot-chawon.com/avatars/sess-001.glb',
      clothingGlbUrl: 'https://cdn.ot-chawon.com/clothing/prod-1.glb',
      smplParams: { betas: Array(10).fill(0), pose: Array(72).fill(0) },
    };

    server.use(
      http.get('/api/v1/fitting/sessions/sess-001', () =>
        HttpResponse.json({ success: true, data: mockResult, message: '', traceId: 'x' }),
      ),
    );

    const { result } = renderHook(() => useFittingPoll('sess-001'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data?.status).toBe('COMPLETED'));
    expect(result.current.data?.avatarGlbUrl).toContain('sess-001.glb');
  });
});
```

### MSW 핸들러 위치

```
src/mocks/
├── handlers/
│   ├── product.handlers.ts
│   ├── fitting.handlers.ts
│   └── auth.handlers.ts
├── server.ts     # Node.js 테스트 환경
└── browser.ts    # 브라우저 개발 환경
```

---

## SOLID 원칙 적용 요약

| 원칙 | 옷차원 FE 적용 |
|------|----------------|
| **S** 단일 책임 | `AvatarViewer`는 렌더링만. 피팅 API 호출은 `useFittingPoll` 훅이 담당. |
| **O** 개방/폐쇄 | `ClothingLayer`는 의류 GLB URL만 받아 교체 가능. 아바타 컴포넌트 수정 불필요. |
| **L** 리스코프 치환 | `ProductDto.Detail`은 `ProductDto.Item`을 extends. `Item`을 받는 모든 컴포넌트에 Detail 전달 가능. |
| **I** 인터페이스 분리 | 3D 뷰어 Props는 `AvatarViewerProps`와 `FittingSceneProps`로 분리. 공통 Props 강제 금지. |
| **D** 의존성 역전 | 컴포넌트는 `gatewayClient`를 직접 호출하지 않고 커스텀 훅에 의존. |

---

## 디자인 패턴 적용 규칙

| 패턴 | 적용 위치 | 설명 |
|------|-----------|------|
| **Container/Presenter** | 모든 도메인 컴포넌트 | `ProductListContent`(데이터) + `ProductCard`(렌더링) 분리 |
| **Custom Hook** | 서버 상태, 3D 씬 로직 | `useProducts`, `useFittingPoll`, `useAvatarScene` |
| **Compound Component** | 복합 UI (피팅 결과 패널) | `FittingResult.Root`, `FittingResult.Scene`, `FittingResult.Info` |
| **Factory** | MSW 핸들러, 테스트 픽스처 | `createProductFixture()`, `createFittingResultFixture()` |
| **Observer** | Zustand 스토어 구독 | 피팅 완료 이벤트 → 알림 컴포넌트 반응 |

---

## Sub Agent 협업 규칙

### 3D Graphics Designer → FE (GLB 에셋 수령)

3D Designer가 GLB 에셋 납품 시 FE는 다음을 검증한다.

```
검증 체크리스트:
□ Draco 압축 적용 여부 (파일 크기 5MB 이하 권장)
□ glTF 2.0 포맷 (GLB 바이너리)
□ PBR 텍스처 포함 여부 (baseColor, metallic, roughness)
□ 원점(origin) 기준: 발바닥 중심 (0, 0, 0)
□ Y-up 좌표계 확인
□ 아바타: T-pose 리깅 완료
□ 의류: 아바타 스케일과 일치
```

에셋 수령 후 `AvatarViewer`에서 smoke 렌더링 테스트 실행 후 Jira 티켓에 결과 코멘트.

### AI/ML → FE (피팅 결과 연동)

AI/ML이 피팅 추론 API 스펙 변경 시 사전 통보 필수 항목:

```
- 변경된 엔드포인트 경로
- FittingDto.Result 응답 필드 추가/변경/삭제
- SMPL 파라미터 포맷 변경 (betas 차원 수 등)
- 예상 응답 시간 변화 (폴링 간격 조정 필요 여부)
```

FE는 `types/fitting.dto.ts` namespace 업데이트 후 TypeScript 오류 전파로 영향 범위 확인.

### BE Developer → FE (API 연동)

```
BE가 제공해야 할 것:
- OpenAPI(Swagger) 명세 URL: http://localhost:8080/swagger-ui.html
- 응답 구조 변경 시 FE에 사전 Slack #dev 알림
- 401/403 오류 시나리오 및 응답 포맷

FE가 확인해야 할 것:
- ApiResponse<T> 래퍼 구조 일치 여부
- 페이지네이션 필드명 (page/size/total) 일치
- 날짜 필드 포맷 (ISO 8601 표준 준수)
```

### QA → FE (버그 리포트 수신)

- **Critical/High**: Slack #bugs 알림 즉시 확인, 당일 수정 시작.
- **3D 뷰어 렌더링 오류**: GLB URL, 브라우저/디바이스 정보, 콘솔 오류 스택 제공 요청.
- **피팅 폴링 무한루프**: `useFittingPoll` 훅의 `attemptRef` 값과 API 응답 상태 로그 확인.

---

## 빌드 검증

작업 완료 전 반드시 아래 두 명령어를 실행하고 오류 없음을 확인한다.

```bash
# 1. 타입 검사
npx tsc --noEmit

# 2. 프로덕션 빌드
npm run build
```

- `tsc --noEmit` 오류가 있는 상태로 커밋 금지.
- `npm run build` 실패 상태로 PR 생성 금지.
- 3D 뷰어 관련 변경 시 `npx tsc --noEmit` 후 `AvatarViewer`, `FittingScene` 관련 타입 오류 우선 확인.

---

## Jira/Slack 운영 규칙

### Jira 티켓 관리

- 모든 기능 개발은 Jira 티켓 존재 시 시작. 티켓 번호를 커밋 메시지에 포함.
  ```
  feat: 상품 상세 3D 뷰어 컴포넌트 추가 (OTC-101)
  ```
- 티켓 상태 전환: `To Do` → `In Progress` (작업 시작) → `In Review` (PR 생성) → `Done` (머지 완료).
- 3D 에셋 대기(블로커) 발생 시 티켓 상태를 `Blocked`로 전환하고 코멘트에 블로커 내용 기재.

### Slack 알림

| 이벤트 | 채널 | 내용 |
|--------|------|------|
| 3D 에셋 수령 완료 | #dev | "GLB 에셋 수령 완료 — OTC-101 적용 완료. 렌더링 테스트 통과." |
| 피팅 API 연동 완료 | #dev | "피팅 결과 3D 렌더링 완료 — FittingScene 구현 (OTC-115)" |
| 블로커 발생 | #dev | "OTC-101 Blocked — 3D Designer GLB 납품 대기 중" |
| Critical 버그 수신 | #bugs | 즉시 확인 후 조사 시작 코멘트 |

---

## 주의사항

1. **Design-First 준수** — UI/UX 시안 미완료 섹션의 FE 선행 구현 금지.
2. **Three.js 메모리 누수** — `useEffect` cleanup에서 반드시 geometry, material, texture `dispose()` 호출. 누락 시 장시간 사용 후 WebGL 컨텍스트 소멸.
3. **Canvas SSR 오류** — `next/dynamic ssr: false` 없이 Canvas를 RSC에서 import 시 빌드 오류. 반드시 lazy loading 패턴 사용.
4. **accessToken localStorage 저장 금지** — XSS 공격 시 토큰 탈취 방지. 메모리(Zustand)에만 보관.
5. **GLB Presigned URL 만료** — AI 피팅 결과 GLB URL은 S3 Presigned URL로 만료 시간 존재. 결과 수신 즉시 렌더링 시작. URL을 오래 보관하지 말 것.
6. **3D 뷰어 모바일 성능** — `dpr` 상한을 2로 제한하고 저사양 디바이스 대응을 위해 `gl.capabilities.isWebGL2` 체크 후 폴백 UI 제공 고려.
7. **any 타입 사용 금지** — 특히 GLB scene 조작 시 `THREE.Object3D` 타입을 명시적으로 사용.
8. **피팅 체형 정보 보안** — 사용자 체형 정보(신체 치수)는 API 전송 시 HTTPS 필수. 로컬 스토리지 저장 금지.
9. **git push 자동 실행 금지** — 반드시 사용자 허가 후 실행. 허가 요청 형식은 루트 `AGENTS.md` 참고.
10. **MEMORY.md 업데이트** — 작업 종료 시 `ot-chawon/MEMORY.md`를 업데이트한 뒤 커밋/종료. 위치는 프로젝트 루트 고정.
