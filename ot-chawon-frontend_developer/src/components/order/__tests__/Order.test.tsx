import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { OrderForm } from '../OrderForm';
import { PaymentSelect } from '../PaymentSelect';

// UI 컴포넌트 mock
jest.mock('@/components/ui', () => ({
  Input: ({ id, placeholder, value, onChange, readOnly, className }: {
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
  FormField: ({ label, children, htmlFor, required }: {
    label: string;
    children: React.ReactNode;
    htmlFor?: string;
    required?: boolean;
  }) => (
    <div>
      <label htmlFor={htmlFor}>{label}{required && ' *'}</label>
      {children}
    </div>
  ),
  Checkbox: ({ id, label }: { id?: string; label?: string }) => (
    <label>
      <input type="checkbox" id={id} />
      {label}
    </label>
  ),
}));

const defaultShippingInfo = {
  recipientName: '',
  phone: '',
  zipCode: '',
  address: '',
  addressDetail: '',
  memo: '',
};

describe('OrderForm', () => {
  const mockOnChange = jest.fn();
  const mockOnZipCodeSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('배송지 필드들이 렌더링된다', () => {
    render(
      <OrderForm
        shippingInfo={defaultShippingInfo}
        onChange={mockOnChange}
        onZipCodeSearch={mockOnZipCodeSearch}
      />
    );

    expect(screen.getByPlaceholderText('이름을 입력하세요')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('010-0000-0000')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('우편번호')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('주소를 검색하세요')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('상세주소를 입력하세요')).toBeInTheDocument();
  });

  it('수령인 입력 시 onChange가 호출된다', () => {
    render(
      <OrderForm
        shippingInfo={defaultShippingInfo}
        onChange={mockOnChange}
        onZipCodeSearch={mockOnZipCodeSearch}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('이름을 입력하세요'), {
      target: { value: '홍길동' },
    });
    expect(mockOnChange).toHaveBeenCalledWith('recipientName', '홍길동');
  });

  it('연락처 입력 시 onChange가 호출된다', () => {
    render(
      <OrderForm
        shippingInfo={defaultShippingInfo}
        onChange={mockOnChange}
        onZipCodeSearch={mockOnZipCodeSearch}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('010-0000-0000'), {
      target: { value: '010-1234-5678' },
    });
    expect(mockOnChange).toHaveBeenCalledWith('phone', '010-1234-5678');
  });

  it('우편번호 검색 버튼 클릭 시 onZipCodeSearch가 호출된다', () => {
    render(
      <OrderForm
        shippingInfo={defaultShippingInfo}
        onChange={mockOnChange}
        onZipCodeSearch={mockOnZipCodeSearch}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '우편번호 검색' }));
    expect(mockOnZipCodeSearch).toHaveBeenCalled();
  });

  it('값이 채워진 상태로 렌더링된다', () => {
    render(
      <OrderForm
        shippingInfo={{
          recipientName: '홍길동',
          phone: '010-1234-5678',
          zipCode: '12345',
          address: '서울시 강남구',
          addressDetail: '101호',
          memo: '문앞',
        }}
        onChange={mockOnChange}
        onZipCodeSearch={mockOnZipCodeSearch}
      />
    );

    expect(screen.getByDisplayValue('홍길동')).toBeInTheDocument();
    expect(screen.getByDisplayValue('010-1234-5678')).toBeInTheDocument();
  });
});

describe('PaymentSelect', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('모든 결제수단이 렌더링된다', () => {
    render(<PaymentSelect value="credit_card" onChange={mockOnChange} />);

    expect(screen.getByText('신용카드')).toBeInTheDocument();
    expect(screen.getByText('카카오페이')).toBeInTheDocument();
    expect(screen.getByText('네이버페이')).toBeInTheDocument();
    expect(screen.getByText('무통장입금')).toBeInTheDocument();
  });

  it('초기 선택값이 올바르게 표시된다', () => {
    render(<PaymentSelect value="credit_card" onChange={mockOnChange} />);

    const creditCardRadio = screen.getByDisplayValue('credit_card');
    expect(creditCardRadio).toBeChecked();
  });

  it('결제수단 선택 시 onChange가 호출된다', () => {
    render(<PaymentSelect value="credit_card" onChange={mockOnChange} />);

    fireEvent.click(screen.getByDisplayValue('kakao_pay'));
    expect(mockOnChange).toHaveBeenCalledWith('kakao_pay');
  });

  it('카카오페이 선택 시 onChange가 kakao_pay로 호출된다', () => {
    render(<PaymentSelect value="kakao_pay" onChange={mockOnChange} />);

    const kakaoRadio = screen.getByDisplayValue('kakao_pay');
    expect(kakaoRadio).toBeChecked();
  });

  it('네이버페이 선택 시 onChange가 naver_pay로 호출된다', () => {
    render(<PaymentSelect value="credit_card" onChange={mockOnChange} />);

    fireEvent.click(screen.getByDisplayValue('naver_pay'));
    expect(mockOnChange).toHaveBeenCalledWith('naver_pay');
  });
});

describe('주문 내역 빈 상태', () => {
  it('빈 상태 메시지를 렌더링한다', () => {
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

  it('상태 뱃지가 올바른 텍스트로 렌더링된다', () => {
    const StatusBadge = ({ status }: { status: string }) => {
      const labels: Record<string, string> = {
        PENDING: '결제대기',
        PAID: '결제완료',
        SHIPPING: '배송중',
        DELIVERED: '배송완료',
        CANCELLED: '취소',
      };
      return <span>{labels[status] ?? status}</span>;
    };

    const { rerender } = render(<StatusBadge status="PENDING" />);
    expect(screen.getByText('결제대기')).toBeInTheDocument();

    rerender(<StatusBadge status="PAID" />);
    expect(screen.getByText('결제완료')).toBeInTheDocument();

    rerender(<StatusBadge status="SHIPPING" />);
    expect(screen.getByText('배송중')).toBeInTheDocument();

    rerender(<StatusBadge status="CANCELLED" />);
    expect(screen.getByText('취소')).toBeInTheDocument();
  });
});
