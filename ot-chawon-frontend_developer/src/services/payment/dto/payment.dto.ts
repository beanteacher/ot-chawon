/* eslint-disable @typescript-eslint/no-namespace */
export namespace PaymentDto {
  export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

  export interface Request {
    orderId: string;
    amount: number;
    paymentMethod: string;
  }

  export interface Response {
    id: number;
    orderId: string;
    userId: number;
    pgTransactionId: string;
    amount: number;
    status: PaymentStatus;
    paymentMethod: string;
    paidAt: string;
    createdAt: string;
  }
}
