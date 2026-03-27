import { create } from 'zustand';
import type { CartDto } from '@/types/cart.dto';

interface CartStoreState {
  items: CartDto.Item[];
  selectedIds: Set<number>;
  isLoading: boolean;
  setItems: (items: CartDto.Item[]) => void;
  toggleSelect: (cartItemId: number) => void;
  selectAll: (cartItemIds: number[]) => void;
  clearSelection: () => void;
  getSelectedItems: () => CartDto.Item[];
  getSubtotal: () => number;
  getSelectedCount: () => number;
}

export const useCartStore = create<CartStoreState>()((set, get) => ({
  items: [],
  selectedIds: new Set<number>(),
  isLoading: false,

  setItems: (items) =>
    set((state) => ({
      items,
      // 기존 선택 상태 중 유효한 항목만 유지
      selectedIds: new Set(
        Array.from(state.selectedIds).filter((id) =>
          items.some((item) => item.cartItemId === id)
        )
      ),
    })),

  toggleSelect: (cartItemId) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(cartItemId)) {
        next.delete(cartItemId);
      } else {
        next.add(cartItemId);
      }
      return { selectedIds: next };
    }),

  selectAll: (cartItemIds) =>
    set({ selectedIds: new Set(cartItemIds) }),

  clearSelection: () => set({ selectedIds: new Set<number>() }),

  getSelectedItems: () => {
    const { items, selectedIds } = get();
    return items.filter((item) => selectedIds.has(item.cartItemId));
  },

  getSubtotal: () => {
    const { items, selectedIds } = get();
    return items
      .filter((item) => selectedIds.has(item.cartItemId))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getSelectedCount: () => {
    const { items, selectedIds } = get();
    return items
      .filter((item) => selectedIds.has(item.cartItemId))
      .reduce((sum, item) => sum + item.quantity, 0);
  },
}));
