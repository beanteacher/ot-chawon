export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(price);
}

export function formatPriceNumber(price: number): string {
  return new Intl.NumberFormat('ko-KR').format(price);
}
