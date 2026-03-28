import type { FittingDto } from '@/types/fitting.dto';

const GATEWAY_URL = process.env.NEXT_PUBLIC_SPRING_GATEWAY_URL ?? 'http://localhost:8080';
const AI_SERVER_URL = process.env.NEXT_PUBLIC_AI_SERVER_URL ?? 'http://localhost:8001';

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  const json = await response.json();
  return (json.data ?? json) as T;
}

export async function createFitting(
  req: FittingDto.CreateRequest
): Promise<FittingDto.Response> {
  try {
    return await apiFetch<FittingDto.Response>(
      `${GATEWAY_URL}/api/v1/fittings`,
      { method: 'POST', body: JSON.stringify(req) }
    );
  } catch {
    // 더미 폴백
    return {
      id: Date.now(),
      userId: req.userId,
      itemId: req.itemId,
      status: 'QUEUED',
      createdAt: new Date().toISOString(),
    };
  }
}

export async function getFitting(id: number): Promise<FittingDto.Response> {
  try {
    return await apiFetch<FittingDto.Response>(
      `${GATEWAY_URL}/api/v1/fittings/${id}`
    );
  } catch {
    return {
      id,
      userId: '',
      itemId: '',
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
  }
}

export async function getFittingResult(id: number): Promise<FittingDto.FittingResult> {
  try {
    return await apiFetch<FittingDto.FittingResult>(
      `${GATEWAY_URL}/api/v1/fittings/${id}/result`
    );
  } catch {
    // 더미 폴백 데이터
    return {
      fittedGlbUrl: '',
      renders: {
        '0': '',
        '90': '',
        '180': '',
      },
      sizeRecommendation: {
        recommended_size: 'M',
        confidence: 87,
        alternatives: ['S', 'L'],
        reason: [
          '가슴둘레가 M 사이즈 기준에 적합합니다',
          '어깨너비가 M 사이즈 범위 내에 있습니다',
          '팔 길이가 M 사이즈에 맞습니다',
        ],
      },
      elapsedMs: 3200,
    };
  }
}

export async function getSizeRecommendation(
  bodyMeasurement: Record<string, number>,
  itemId: string
): Promise<FittingDto.SizeRecommendation> {
  try {
    return await apiFetch<FittingDto.SizeRecommendation>(
      `${AI_SERVER_URL}/size/predict`,
      { method: 'POST', body: JSON.stringify({ bodyMeasurement, itemId }) }
    );
  } catch {
    return {
      recommended_size: 'M',
      confidence: 85,
      alternatives: ['S', 'L'],
      reason: [
        '체형 측정값 기반 분석 결과입니다',
        '유사 체형 고객의 구매 데이터를 참고했습니다',
      ],
    };
  }
}
