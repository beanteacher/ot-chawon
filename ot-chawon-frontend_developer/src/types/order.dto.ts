export namespace OrderDto {
  export interface Item {
    productId: number;
    productName: string;
    size: string;
    quantity: number;
    price: number;
  }

  export interface Request {
    items: Item[];
    shippingAddress: string;
    paymentMethod: string;
  }

  export interface Response {
    orderId: string;
    status: OrderStatus;
    totalPrice: number;
    createdAt: string;
  }

  export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}
