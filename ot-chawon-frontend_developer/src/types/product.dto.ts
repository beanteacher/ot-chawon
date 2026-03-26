/* eslint-disable @typescript-eslint/no-namespace */
export namespace ProductDto {
  export interface Item {
    id: number;
    name: string;
    price: number;
    brandName: string;
    thumbnailUrl: string;
    hasThreeD: boolean;
    glbAssetKey: string | null;
  }

  export interface Detail extends Item {
    description: string;
    images: string[];
    sizes: SizeOption[];
    category: string;
  }

  export interface SizeOption {
    label: string;
    stock: number;
  }

  export interface ListResponse {
    items: Item[];
    page: number;
    size: number;
    total: number;
  }
}
