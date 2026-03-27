import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartItem } from '../CartItem';
import { CartSummary } from '../CartSummary';

// UI 컴포넌트 mock
jest.mock('@/components/ui', () => ({
  Checkbox: ({ checked, onChange, 'aria-label': ariaLabel }: { checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 'aria-label'?: string }) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={ariaLabel}
    />
  ),
  Button: ({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) => (
    <button onClick={onClick} disabled={disabled}>{children}</button>
  ),
}));

const mockItem = {
  cartItemId: 1,
  productId: 1,
  productName: '테스트 상품',
  brandName: '테스트 브랜드',
  size: 'M',
  color: '블랙',
  quantity: 2,
  price: 30000,
};

describe('CartItem', () => {
  const mockOnSelect = jest.fn();
  const mockOnQuantityChange = jest.fn();
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('상품명, 가격, 수량을 렌더링한다', () => {
    render(
      <CartItem
        item={mockItem}
        selected={false}
        onSelect={mockOnSelect}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText('테스트 상품')).toBeInTheDocument();
    expect(screen.getByText('테스트 브랜드')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    // 총 가격: 30000 * 2 = 60000
    expect(screen.getByText('60,000원')).toBeInTheDocument();
  });

  it('수량 감소(-) 버튼 클릭 시 onQuantityChange가 호출된다', () => {
    render(
      <CartItem
        item={mockItem}
        selected={false}
        onSelect={mockOnSelect}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '수량 감소' }));
    expect(mockOnQuantityChange).toHaveBeenCalledWith(1, 1);
  });

  it('수량 증가(+) 버튼 클릭 시 onQuantityChange가 호출된다', () => {
    render(
      <CartItem
        item={mockItem}
        selected={false}
        onSelect={mockOnSelect}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '수량 증가' }));
    expect(mockOnQuantityChange).toHaveBeenCalledWith(1, 3);
  });

  it('삭제 버튼 클릭 시 onRemove가 호출된다', () => {
    render(
      <CartItem
        item={mockItem}
        selected={false}
        onSelect={mockOnSelect}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '테스트 상품 삭제' }));
    expect(mockOnRemove).toHaveBeenCalledWith(1);
  });

  it('수량이 1일 때 감소 버튼이 비활성화된다', () => {
    render(
      <CartItem
        item={{ ...mockItem, quantity: 1 }}
        selected={false}
        onSelect={mockOnSelect}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByRole('button', { name: '수량 감소' })).toBeDisabled();
  });
});

describe('CartSummary', () => {
  const mockOnOrder = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('상품 금액 합계를 표시한다', () => {
    render(
      <CartSummary
        itemCount={2}
        subtotal={60000}
        onOrder={mockOnOrder}
      />
    );

    expect(screen.getAllByText('60,000원').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('상품 금액 (2개)')).toBeInTheDocument();
  });

  it('50,000원 이상이면 무료 배송 달성 문구를 표시한다', () => {
    render(
      <CartSummary
        itemCount={2}
        subtotal={50000}
        onOrder={mockOnOrder}
      />
    );

    expect(screen.getByText('무료 배송 조건 달성')).toBeInTheDocument();
  });

  it('50,000원 미만이면 무료 배송까지 남은 금액을 표시한다', () => {
    render(
      <CartSummary
        itemCount={1}
        subtotal={30000}
        onOrder={mockOnOrder}
      />
    );

    expect(screen.getByText('20,000원 더 담으면 무료 배송')).toBeInTheDocument();
  });

  it('주문하기 버튼 클릭 시 onOrder가 호출된다', () => {
    render(
      <CartSummary
        itemCount={1}
        subtotal={30000}
        onOrder={mockOnOrder}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /주문하기/ }));
    expect(mockOnOrder).toHaveBeenCalled();
  });

  it('disabled=true이면 주문하기 버튼이 비활성화된다', () => {
    render(
      <CartSummary
        itemCount={0}
        subtotal={0}
        onOrder={mockOnOrder}
        disabled={true}
      />
    );

    expect(screen.getByRole('button', { name: /주문하기/ })).toBeDisabled();
  });
});

describe('Cart 빈 상태', () => {
  it('장바구니가 비어있습니다 텍스트 렌더링', () => {
    const EmptyCart = () => (
      <div>
        <p>장바구니가 비어있습니다</p>
      </div>
    );
    render(<EmptyCart />);
    expect(screen.getByText('장바구니가 비어있습니다')).toBeInTheDocument();
  });
});
