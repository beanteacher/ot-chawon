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
}
