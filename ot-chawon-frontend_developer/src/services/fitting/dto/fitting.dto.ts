/* eslint-disable @typescript-eslint/no-namespace */
export namespace FittingDto {
  export interface Request {
    productId: number;
    height: number;
    weight: number;
    chest: number;
    waist: number;
    hip: number;
  }

  export interface SessionResponse {
    sessionId: string;
    status: FittingStatus;
    estimatedSeconds: number;
  }

  export interface Result {
    sessionId: string;
    status: FittingStatus;
    avatarGlbUrl: string | null;
    clothingGlbUrl: string | null;
    smplParams: SmplParams | null;
  }

  export type FittingStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

  export interface SmplParams {
    betas: number[];
    pose: number[];
  }

  // Sprint 7 — AI 피팅 결과 + 사이즈 추천 UI
  export interface BodyMeasurementInput {
    height: number;
    weight: number;
    chest: number;
    waist: number;
    hip: number;
    shoulder: number;
    armLength: number;
    legLength: number;
    gender: 'male' | 'female';
  }

  export interface CreateRequest {
    userId: string;
    itemId: string;
    bodyMeasurement: BodyMeasurementInput;
    renderOptions?: {
      angles?: number[];
      resolution?: string;
    };
  }

  export interface Response {
    id: number;
    userId: string;
    itemId: string;
    status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    createdAt: string;
    completedAt?: string;
  }

  export interface FittingResult {
    fittedGlbUrl: string;
    renders: Record<string, string>;
    sizeRecommendation: SizeRecommendation;
    elapsedMs: number;
  }

  export interface SizeRecommendation {
    recommended_size: string;
    confidence: number;
    alternatives: string[];
    reason: string[];
  }
}
