import { serverFetch } from '@/lib/api/client';
import type { FittingDto } from '@/services/fitting/dto/fitting.dto';

export async function getFittingResult(
  sessionId: string
): Promise<FittingDto.Result> {
  return serverFetch<FittingDto.Result>(
    `/api/fitting/sessions/${sessionId}`
  );
}
