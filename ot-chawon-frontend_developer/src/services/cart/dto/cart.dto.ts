/* eslint-disable @typescript-eslint/no-namespace */
export namespace CartDto {
  export interface Item {
    cartItemId: number;
    productId: number;
    productOptionId?: number;
    productName: string;
    brandName?: string;
    size?: string;
    color?: string;
    quantity: number;
    price: number;
    imageUrl?: string;
  }

  export interface Response {
    cartId: number;
    items: Item[];
    totalPrice: number;
  }

  export interface AddItemRequest {
    productId: number;
    productOptionId?: number;
    quantity: number;
  }

  export interface UpdateQuantityRequest {
    quantity: number;
  }
}
