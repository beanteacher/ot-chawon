import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OrderDto } from '@/types/order.dto';

interface CartItem extends OrderDto.Item {
  cartItemId: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: OrderDto.Item) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const cartItemId = `${item.productId}-${item.size}-${Date.now()}`;
        set((state) => ({
          items: [...state.items, { ...item, cartItemId }],
        }));
      },
      removeItem: (cartItemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        })),
      updateQuantity: (cartItemId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      totalCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);
