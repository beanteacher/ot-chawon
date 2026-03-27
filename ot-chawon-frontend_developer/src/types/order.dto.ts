/* eslint-disable @typescript-eslint/no-namespace */
export namespace OrderDto {
  export interface ShippingAddress {
    recipientName: string;
    phone: string;
    zipCode: string;
    address: string;
    addressDetail: string;
    memo: string;
  }

  export type PaymentMethod = 'credit_card' | 'kakao_pay' | 'naver_pay' | 'bank_transfer';

  export type OrderStatus =
    | 'PENDING'
    | 'PAYMENT_REQUESTED'
    | 'PAID'
    | 'SHIPPING'
    | 'DELIVERED'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'REFUNDED';

  export interface Item {
    productId: number;
    productName: string;
    size: string;
    color?: string;
    quantity: number;
    price: number;
  }

  export interface Request {
    cartItemIds: number[];
    shippingAddress: string;
    paymentMethod: string;
  }

  export interface Response {
    orderId: string;
    status: OrderStatus;
    totalPrice: number;
    createdAt: string;
  }

  export interface OrderDetail {
    orderId: string;
    userId: number;
    status: OrderStatus;
    totalPrice: number;
    shippingAddress: ShippingAddress;
    trackingNumber?: string;
    items: Item[];
    createdAt: string;
    updatedAt: string;
  }

  export interface ListResponse {
    orders: OrderDetail[];
    total: number;
    page: number;
    pageSize: number;
  }
}
