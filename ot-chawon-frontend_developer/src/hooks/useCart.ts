'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/services/cartApi';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/auth.store';
import type { CartDto } from '@/services/cart/dto/cart.dto';

export const CART_QUERY_KEY = ['cart'] as const;

export function useCart() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { setItems, selectedIds, toggleSelect, selectAll, clearSelection, getSelectedItems, getSubtotal, getSelectedCount } =
    useCartStore();

  const cartQuery = useQuery<CartDto.Response>({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const data = await cartApi.getCart();
      setItems(data.items);
      return data;
    },
    enabled: isAuthenticated,
  });

  const addItemMutation = useMutation({
    mutationFn: (req: CartDto.AddItemRequest) => cartApi.addCartItem(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) =>
      cartApi.updateCartItemQuantity(cartItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (cartItemId: number) => cartApi.removeCartItem(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  const removeItemsMutation = useMutation({
    mutationFn: (cartItemIds: number[]) => cartApi.removeCartItems(cartItemIds),
    onSuccess: () => {
      clearSelection();
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  const items = cartQuery.data?.items ?? [];
  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < items.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      selectAll(items.map((item) => item.cartItemId));
    } else {
      clearSelection();
    }
  };

  return {
    // 쿼리 상태
    items,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    error: cartQuery.error,
    refetch: cartQuery.refetch,

    // 선택 상태
    selectedIds,
    allSelected,
    someSelected,
    handleSelectAll,
    toggleSelect,
    getSelectedItems,

    // 계산값
    subtotal: getSubtotal(),
    selectedCount: getSelectedCount(),

    // 뮤테이션
    addItem: addItemMutation.mutate,
    updateQuantity: (cartItemId: number, quantity: number) =>
      updateQuantityMutation.mutate({ cartItemId, quantity }),
    removeItem: removeItemMutation.mutate,
    removeSelectedItems: () =>
      removeItemsMutation.mutate(Array.from(selectedIds)),
  };
}
