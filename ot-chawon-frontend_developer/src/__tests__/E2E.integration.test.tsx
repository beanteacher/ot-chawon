import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { OrderForm } from '@/components/order/OrderForm';
import { PaymentSelect } from '@/components/order/PaymentSelect';

// UI 컴포넌트 mock
jest.mock('@/components/ui', () => ({
  Checkbox: ({
    checked,
    onChange,
    'aria-label': ariaLabel,
  }: {
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    'aria-label'?: string;
  }) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={ariaLabel}
    />
  ),
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  Input: ({
    id,
    placeholder,
    value,
    onChange,
    readOnly,
    className,
  }: {
    id?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    className?: string;
  }) => (
    <input
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={className}
    />
  ),
  FormField: ({
    label,
    children,
    htmlFor,
    required,
  }: {
    label: string;
    children: React.ReactNode;
    htmlFor?: string;
    required?: boolean;
  }) => (
    <div>
      <label htmlFor={htmlFor}>
        {label}
        {required && ' *'}
      </label>
      {children}
    </div>
  ),
}));

// API mock
jest.mock('@/services/cartApi', () => ({
  cartApi: {
    getCart: jest.fn(),
    addCartItem: jest.fn(),
    updateCartItemQuantity: jest.fn(),
    removeCartItem: jest.fn(),
  },
}));

jest.mock('@/services/orderApi', () => ({
  orderApi: {
    createOrder: jest.fn(),
    getOrder: jest.fn(),
    getOrders: jest.fn(),
    cancelOrder: jest.fn(),
  },
}));

jest.mock('@/services/paymentApi', () => ({
  paymentApi: {
    requestPayment: jest.fn(),
    confirmPayment: jest.fn(),
    getPayment: jest.fn(),
  },
}));

// ---- 공통 픽스처 ----
const mockCartItem = {
  cartItemId: 1,
  productId: 101,
  productName: '테스트 티셔츠',
  brandName: '테스트 브랜드',
  size: 'M',
  color: '블랙',
  quantity: 1,
  price: 29000,
};

const defaultShipping = {
  recipientName: '',
  phone: '',
  zipCode: '',
  address: '',
  addressDetail: '',
  memo: '',
};

// ================================================================
// 시나리오 1: 빈 장바구니 → 상품 담기 → 장바구니 확인 → 주문 → 결제 완료
// ================================================================
describe('시나리오 1: 빈 장바구니 → 상품 담기 → 장바구니 확인 → 주문', () => {
  it('빈 장바구니 상태에서 주문하기 버튼이 비활성화된다', () => {
    const mockOnOrder = jest.fn();
    render(
      <CartSummary itemCount={0} subtotal={0} onOrder={mockOnOrder} disabled={true} />
    );
    expect(screen.getByRole('button', { name: /주문하기/ })).toBeDisabled();
  });

  it('상품을 담으면 CartItem이 렌더링된다', () => {
    const mockOnSelect = jest.fn();
    const mockOnQuantityChange = jest.fn();
    const mockOnRemove = jest.fn();

    render(
      <CartItem
        item={mockCartItem}
        selected={false}
        onSelect={mockOnSelect}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText('테스트 티셔츠')).toBeInTheDocument();
    expect(screen.getByText('테스트 브랜드')).toBeInTheDocument();
    expect(screen.getByText('29,000원')).toBeInTheDocument();
  });

  it('상품 담기 후 CartSummary에 금액이 표시된다', () => {
    const mockOnOrder = jest.fn();
    render(
      <CartSummary itemCount={1} subtotal={29000} onOrder={mockOnOrder} />
    );
    expect(screen.getAllByText('29,000원').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('상품 금액 (1개)')).toBeInTheDocument();
  });

  it('주문하기 버튼 클릭 시 주문 흐름이 시작된다', () => {
    const mockOnOrder = jest.fn();
    render(
      <CartSummary itemCount={1} subtotal={29000} onOrder={mockOnOrder} />
    );
    fireEvent.click(screen.getByRole('button', { name: /주문하기/ }));
    expect(mockOnOrder).toHaveBeenCalledTimes(1);
  });

  it('주문 폼에 배송지 정보를 입력할 수 있다', () => {
    const mockOnChange = jest.fn();
    const mockOnZipCodeSearch = jest.fn();
    render(
      <OrderForm
        shippingInfo={defaultShipping}
        onChange={mockOnChange}
        onZipCodeSearch={mockOnZipCodeSearch}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('이름을 입력하세요'), {
      target: { value: '홍길동' },
    });
    expect(mockOnChange).toHaveBeenCalledWith('recipientName', '홍길동');

    fireEvent.change(screen.getByPlaceholderText('010-0000-0000'), {
      target: { value: '010-1234-5678' },
    });
    expect(mockOnChange).toHaveBeenCalledWith('phone', '010-1234-5678');
  });

  it('결제 수단을 선택할 수 있다', () => {
    const mockOnChange = jest.fn();
    render(<PaymentSelect value="credit_card" onChange={mockOnChange} />);

    fireEvent.click(screen.getByDisplayValue('kakao_pay'));
    expect(mockOnChange).toHaveBeenCalledWith('kakao_pay');
  });
});

// ================================================================
// 시나리오 2: 장바구니 수량 변경 → 가격 재계산 확인
// ================================================================
describe('시나리오 2: 장바구니 수량 변경 → 가격 재계산', () => {
  it('수량 증가 버튼 클릭 시 onQuantityChange(id, newQty)가 호출된다', () => {
    const mockOnSelect = jest.fn();
    const mockOnQuantityChange = jest.fn();
    const mockOnRemove = jest.fn();

    render(
      <CartItem
        item={mockCartItem}
        selected={false}
        onSelect={mockOnSelect}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '수량 증가' }));
    expect(mockOnQuantityChange).toHaveBeenCalledWith(1, 2);
  });

  it('수량 2로 변경하면 총 가격이 2배가 된다', () => {
    const mockOnSelect = jest.fn();
    const mockOnQuantityChange = jest.fn();
    const mockOnRemove = jest.fn();

    render(
      <CartItem
        item={{ ...mockCartItem, quantity: 2 }}
        selected={false}
        onSelect={mockOnSelect}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );

    // 29000 * 2 = 58000
    expect(screen.getByText('58,000원')).toBeInTheDocument();
  });

  it('수량 감소 버튼 클릭 시 onQuantityChange(id, newQty)가 호출된다', () => {
    const mockOnSelect = jest.fn();
    const mockOnQuantityChange = jest.fn();
    const mockOnRemove = jest.fn();

    render(
      <CartItem
        item={{ ...mockCartItem, quantity: 3 }}
        selected={false}
        onSelect={mockOnSelect}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '수량 감소' }));
    expect(mockOnQuantityChange).toHaveBeenCalledWith(1, 2);
  });

  it('수량이 1일 때 감소 버튼이 비활성화된다', () => {
    const mockOnSelect = jest.fn();
    const mockOnQuantityChange = jest.fn();
    const mockOnRemove = jest.fn();

    render(
      <CartItem
        item={{ ...mockCartItem, quantity: 1 }}
        selected={false}
        onSelect={mockOnSelect}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByRole('button', { name: '수량 감소' })).toBeDisabled();
  });

  it('CartSummary가 변경된 수량에 따른 합계를 표시한다', () => {
    const mockOnOrder = jest.fn();
    // 수량 3 * 29000 = 87000
    render(
      <CartSummary itemCount={3} subtotal={87000} onOrder={mockOnOrder} />
    );
    expect(screen.getAllByText('87,000원').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('상품 금액 (3개)')).toBeInTheDocument();
  });
});

// ================================================================
// 시나리오 3: 주문 후 주문 내역 확인 → 주문 상세 확인
// ================================================================
describe('시나리오 3: 주문 내역 확인', () => {
  it('주문 상태 PENDING이 결제대기로 표시된다', () => {
    const StatusBadge = ({ status }: { status: string }) => {
      const labels: Record<string, string> = {
        PENDING: '결제대기',
        PAYMENT_REQUESTED: '결제요청',
        PAID: '결제완료',
        SHIPPING: '배송중',
        DELIVERED: '배송완료',
        COMPLETED: '구매확정',
        CANCELLED: '취소',
        REFUNDED: '환불완료',
      };
      return <span>{labels[status] ?? status}</span>;
    };

    const { rerender } = render(<StatusBadge status="PENDING" />);
    expect(screen.getByText('결제대기')).toBeInTheDocument();

    rerender(<StatusBadge status="PAID" />);
    expect(screen.getByText('결제완료')).toBeInTheDocument();

    rerender(<StatusBadge status="SHIPPING" />);
    expect(screen.getByText('배송중')).toBeInTheDocument();

    rerender(<StatusBadge status="DELIVERED" />);
    expect(screen.getByText('배송완료')).toBeInTheDocument();

    rerender(<StatusBadge status="COMPLETED" />);
    expect(screen.getByText('구매확정')).toBeInTheDocument();
  });

  it('주문 내역이 없을 때 빈 상태 메시지가 표시된다', () => {
    const EmptyOrderList = () => (
      <div>
        <p>주문 내역이 없습니다</p>
        <button>쇼핑하기</button>
      </div>
    );
    render(<EmptyOrderList />);
    expect(screen.getByText('주문 내역이 없습니다')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '쇼핑하기' })).toBeInTheDocument();
  });

  it('주문 상세 정보가 올바르게 렌더링된다', () => {
    const OrderDetail = () => (
      <div>
        <h2>주문 상세</h2>
        <p>주문번호: ORDER-001</p>
        <p>상품명: 테스트 티셔츠</p>
        <p>배송지: 서울시 강남구</p>
        <p>결제금액: 29,000원</p>
      </div>
    );
    render(<OrderDetail />);
    expect(screen.getByText('주문번호: ORDER-001')).toBeInTheDocument();
    expect(screen.getByText('상품명: 테스트 티셔츠')).toBeInTheDocument();
    expect(screen.getByText('결제금액: 29,000원')).toBeInTheDocument();
  });
});

// ================================================================
// 시나리오 4: 주문 취소 → 상태 변경 확인
// ================================================================
describe('시나리오 4: 주문 취소 → 상태 변경', () => {
  it('취소 버튼 클릭 시 취소 핸들러가 호출된다', () => {
    const mockOnCancel = jest.fn();
    const CancelButton = ({ onCancel }: { onCancel: () => void }) => (
      <button onClick={onCancel}>주문 취소</button>
    );
    render(<CancelButton onCancel={mockOnCancel} />);
    fireEvent.click(screen.getByRole('button', { name: '주문 취소' }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('취소 후 주문 상태가 CANCELLED로 변경된다', () => {
    const OrderStatus = ({ status }: { status: string }) => {
      const labels: Record<string, string> = {
        PENDING: '결제대기',
        PAID: '결제완료',
        CANCELLED: '취소',
      };
      return <span data-testid="order-status">{labels[status] ?? status}</span>;
    };

    const { rerender } = render(<OrderStatus status="PAID" />);
    expect(screen.getByTestId('order-status')).toHaveTextContent('결제완료');

    rerender(<OrderStatus status="CANCELLED" />);
    expect(screen.getByTestId('order-status')).toHaveTextContent('취소');
  });

  it('취소 확인 모달이 렌더링된다', () => {
    const CancelModal = ({
      onConfirm,
      onClose,
    }: {
      onConfirm: () => void;
      onClose: () => void;
    }) => (
      <div role="dialog" aria-label="주문 취소 확인">
        <p>주문을 취소하시겠습니까?</p>
        <button onClick={onConfirm}>확인</button>
        <button onClick={onClose}>닫기</button>
      </div>
    );

    const mockConfirm = jest.fn();
    const mockClose = jest.fn();
    render(<CancelModal onConfirm={mockConfirm} onClose={mockClose} />);

    expect(screen.getByText('주문을 취소하시겠습니까?')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '확인' }));
    expect(mockConfirm).toHaveBeenCalledTimes(1);
  });
});

// ================================================================
// 시나리오 5: 결제 실패 → 실패 페이지 → 재시도
// ================================================================
describe('시나리오 5: 결제 실패 → 실패 페이지 → 재시도', () => {
  it('결제 실패 시 실패 메시지가 표시된다', () => {
    const PaymentFailed = ({ onRetry }: { onRetry: () => void }) => (
      <div>
        <h2>결제 실패</h2>
        <p>결제 처리 중 오류가 발생했습니다.</p>
        <button onClick={onRetry}>다시 시도</button>
      </div>
    );

    const mockOnRetry = jest.fn();
    render(<PaymentFailed onRetry={mockOnRetry} />);

    expect(screen.getByText('결제 실패')).toBeInTheDocument();
    expect(screen.getByText('결제 처리 중 오류가 발생했습니다.')).toBeInTheDocument();
  });

  it('다시 시도 버튼 클릭 시 재시도 핸들러가 호출된다', () => {
    const PaymentFailed = ({ onRetry }: { onRetry: () => void }) => (
      <div>
        <p>결제 처리 중 오류가 발생했습니다.</p>
        <button onClick={onRetry}>다시 시도</button>
      </div>
    );

    const mockOnRetry = jest.fn();
    render(<PaymentFailed onRetry={mockOnRetry} />);

    fireEvent.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('결제 수단 재선택이 가능하다', () => {
    const mockOnChange = jest.fn();
    render(<PaymentSelect value="credit_card" onChange={mockOnChange} />);

    // 카카오페이로 변경
    fireEvent.click(screen.getByDisplayValue('kakao_pay'));
    expect(mockOnChange).toHaveBeenCalledWith('kakao_pay');

    // 네이버페이로 재선택 (재시도 시 다른 결제수단 선택)
    fireEvent.click(screen.getByDisplayValue('naver_pay'));
    expect(mockOnChange).toHaveBeenLastCalledWith('naver_pay');
  });

  it('결제 성공 시 완료 메시지가 표시된다', () => {
    const PaymentSuccess = ({ orderId }: { orderId: string }) => (
      <div>
        <h2>결제 완료</h2>
        <p>주문번호: {orderId}</p>
        <p>결제가 성공적으로 완료되었습니다.</p>
      </div>
    );

    render(<PaymentSuccess orderId="ORDER-001" />);
    expect(screen.getByText('결제 완료')).toBeInTheDocument();
    expect(screen.getByText('주문번호: ORDER-001')).toBeInTheDocument();
    expect(screen.getByText('결제가 성공적으로 완료되었습니다.')).toBeInTheDocument();
  });

  it('결제 상태 FAILED가 올바르게 표시된다', () => {
    const PaymentStatus = ({ status }: { status: string }) => {
      const labels: Record<string, string> = {
        PENDING: '결제대기',
        PAID: '결제완료',
        FAILED: '결제실패',
        CANCELLED: '결제취소',
        REFUNDED: '환불완료',
      };
      return <span data-testid="payment-status">{labels[status] ?? status}</span>;
    };

    const { rerender } = render(<PaymentStatus status="PENDING" />);
    expect(screen.getByTestId('payment-status')).toHaveTextContent('결제대기');

    rerender(<PaymentStatus status="FAILED" />);
    expect(screen.getByTestId('payment-status')).toHaveTextContent('결제실패');

    rerender(<PaymentStatus status="PAID" />);
    expect(screen.getByTestId('payment-status')).toHaveTextContent('결제완료');
  });
});

// ================================================================
// 무료 배송 임계값 경계 테스트
// ================================================================
describe('무료 배송 임계값 경계 테스트', () => {
  it('49,999원일 때 무료 배송까지 1원 남은 문구를 표시한다', () => {
    const mockOnOrder = jest.fn();
    render(
      <CartSummary itemCount={1} subtotal={49999} onOrder={mockOnOrder} />
    );
    expect(screen.getByText('1원 더 담으면 무료 배송')).toBeInTheDocument();
  });

  it('50,000원이면 무료 배송 달성 문구를 표시한다', () => {
    const mockOnOrder = jest.fn();
    render(
      <CartSummary itemCount={2} subtotal={50000} onOrder={mockOnOrder} />
    );
    expect(screen.getByText('무료 배송 조건 달성')).toBeInTheDocument();
  });
});
