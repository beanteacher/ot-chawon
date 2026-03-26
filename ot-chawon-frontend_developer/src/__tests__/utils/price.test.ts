import { formatPrice, formatPriceNumber } from '@/lib/utils/price';

describe('formatPrice', () => {
  it('원화 형식으로 포맷팅한다', () => {
    expect(formatPrice(10000)).toContain('10,000');
  });

  it('0원을 포맷팅한다', () => {
    expect(formatPrice(0)).toContain('0');
  });
});

describe('formatPriceNumber', () => {
  it('숫자를 천단위 콤마로 포맷팅한다', () => {
    expect(formatPriceNumber(1000000)).toBe('1,000,000');
  });
});
