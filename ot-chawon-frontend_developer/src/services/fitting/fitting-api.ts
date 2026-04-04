import type { FittingDto } from '@/services/fitting/dto/fitting.dto';

const GATEWAY_URL = process.env.NEXT_PUBLIC_SPRING_GATEWAY_URL ?? 'http://localhost:8080';
const AI_SERVER_URL = process.env.NEXT_PUBLIC_AI_SERVER_URL ?? 'http://localhost:8001';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const authStorage = localStorage.getItem('auth-storage');
    return authStorage ? JSON.parse(authStorage)?.state?.accessToken ?? null : null;
  } catch {
    return null;
  }
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
  const { bodyMeasurement, ...rest } = req;
  const mappedBody = {
    height_cm: bodyMeasurement.height,
    weight_kg: bodyMeasurement.weight,
    chest_cm: bodyMeasurement.chest,
    waist_cm: bodyMeasurement.waist,
    hip_cm: bodyMeasurement.hip,
    shoulder_cm: bodyMeasurement.shoulder,
    arm_length_cm: bodyMeasurement.armLength,
    leg_length_cm: bodyMeasurement.legLength,
    gender: bodyMeasurement.gender,
  };
  return apiFetch<FittingDto.Response>(
    `${GATEWAY_URL}/api/v1/fittings`,
    { method: 'POST', body: JSON.stringify({ ...rest, bodyMeasurement: mappedBody }) }
  );
}

export async function getFitting(id: number): Promise<FittingDto.Response> {
  return apiFetch<FittingDto.Response>(
    `${GATEWAY_URL}/api/v1/fittings/${id}`
  );
}

export async function getFittingResult(id: number): Promise<FittingDto.FittingResult> {
  return apiFetch<FittingDto.FittingResult>(
    `${GATEWAY_URL}/api/v1/fittings/${id}/result`
  );
}

export async function getSizeRecommendation(
  bodyMeasurement: Record<string, number>,
  itemId: string
): Promise<FittingDto.SizeRecommendation> {
  return apiFetch<FittingDto.SizeRecommendation>(
    `${AI_SERVER_URL}/size/predict`,
    { method: 'POST', body: JSON.stringify({ bodyMeasurement, itemId }) }
  );
}

export async function getFittings(): Promise<FittingDto.Response[]> {
  return apiFetch<FittingDto.Response[]>(
    `${GATEWAY_URL}/api/v1/fittings`
  );
}
