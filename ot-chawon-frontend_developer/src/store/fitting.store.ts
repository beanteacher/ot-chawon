import { create } from 'zustand';
import type { FittingDto } from '@/types/fitting.dto';

interface FittingState {
  sessionId: string | null;
  status: FittingDto.FittingStatus | null;
  result: FittingDto.Result | null;
  pendingRequest: FittingDto.Request | null;
  setSession: (sessionId: string, status: FittingDto.FittingStatus) => void;
  setResult: (result: FittingDto.Result) => void;
  setPendingRequest: (request: FittingDto.Request) => void;
  resetFitting: () => void;
}

export const useFittingStore = create<FittingState>()((set) => ({
  sessionId: null,
  status: null,
  result: null,
  pendingRequest: null,
  setSession: (sessionId, status) => set({ sessionId, status }),
  setResult: (result) => set({ result, status: result.status }),
  setPendingRequest: (request) => set({ pendingRequest: request }),
  resetFitting: () =>
    set({ sessionId: null, status: null, result: null, pendingRequest: null }),
}));
