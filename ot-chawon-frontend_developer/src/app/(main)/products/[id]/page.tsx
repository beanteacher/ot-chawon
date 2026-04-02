import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductDetailClient } from './product-detail-client';
import { ProductDto } from '@/services/product/dto/product.dto';

interface ProductDetailPageProps {
  params: { id: string };
}

// 더미 상품 데이터 (API 미연결 시 폴백)
const DUMMY_PRODUCTS: Record<string, ProductDto.Detail> = {
  '1': {
    id: 1,
    name: '오버사이즈 코튼 티셔츠',
    price: 39000,
    brandName: '무신사 스탠다드',
    thumbnailUrl: '',
    hasThreeD: true,
    glbAssetKey: 'item1.glb',
    description: `부드러운 코튼 소재로 제작된 오버사이즈 티셔츠입니다.\n\n넉넉한 핏으로 다양한 스타일링에 활용 가능하며, 심플한 디자인으로 어떤 하의와도 잘 어울립니다.\n\n소재: 면 100%\n세탁 방법: 손세탁 권장 (30도 이하)`,
    images: ['', '', ''],
    sizes: [
      { label: 'S', stock: 5 },
      { label: 'M', stock: 10 },
      { label: 'L', stock: 8 },
      { label: 'XL', stock: 0 },
      { label: 'XXL', stock: 3 },
    ],
    category: '상의',
  },
  '2': {
    id: 2,
    name: '슬림 테이퍼드 데님 팬츠',
    price: 79000,
    brandName: '무신사 스탠다드',
    thumbnailUrl: '',
    hasThreeD: false,
    glbAssetKey: null,
    description: `슬림 테이퍼드 실루엣의 데님 팬츠입니다.\n\n고탄성 데님 소재로 활동성이 뛰어나며, 다양한 상의와 매치하기 좋습니다.\n\n소재: 면 98%, 스판덱스 2%\n세탁 방법: 단독 세탁`,
    images: ['', ''],
    sizes: [
      { label: '28', stock: 3 },
      { label: '30', stock: 7 },
      { label: '32', stock: 5 },
      { label: '34', stock: 0 },
      { label: '36', stock: 2 },
    ],
    category: '하의',
  },
  '6': {
    id: 6,
    name: '캔버스 로우 스니커즈',
    price: 59000,
    brandName: 'Converse',
    thumbnailUrl: '',
    hasThreeD: false,
    glbAssetKey: null,
    description: `클래식한 디자인의 캔버스 로우컷 스니커즈입니다.\n\n가볍고 편안한 착화감으로 일상에서 활용하기 좋습니다.\n\n소재: 캔버스 어퍼, 고무 아웃솔\n현재 품절된 상품입니다.`,
    images: [],
    sizes: [
      { label: '240', stock: 0 },
      { label: '250', stock: 0 },
      { label: '260', stock: 0 },
      { label: '270', stock: 0 },
      { label: '280', stock: 0 },
    ],
    soldOut: true,
    category: '신발',
  },
};

const DUMMY_RELATED: ProductDto.Item[] = [
  { id: 3, name: '울 블렌드 오버핏 코트', price: 189000, brandName: 'ADIDAS', thumbnailUrl: '', hasThreeD: true, glbAssetKey: 'item3.glb' },
  { id: 4, name: '클래식 로고 후드티', price: 69000, brandName: 'NIKE', thumbnailUrl: '', hasThreeD: false, glbAssetKey: null },
  { id: 5, name: '리사이클 나일론 백팩', price: 129000, brandName: 'New Balance', thumbnailUrl: '', hasThreeD: true, glbAssetKey: 'item5.glb' },
  { id: 6, name: '캔버스 로우 스니커즈', price: 59000, brandName: 'Converse', thumbnailUrl: '', hasThreeD: false, glbAssetKey: null },
];

async function fetchProduct(id: string): Promise<ProductDto.Detail | null> {
  try {
    const { getProduct } = await import('@/services/product/get-products');
    return await getProduct(Number(id));
  } catch {
    return DUMMY_PRODUCTS[id] ?? {
      id: Number(id),
      name: `상품 #${id}`,
      price: 59000,
      brandName: '무신사 스탠다드',
      thumbnailUrl: '',
      hasThreeD: false,
      glbAssetKey: null,
      description: '상품 설명이 없습니다.',
      images: [],
      sizes: [
        { label: 'S', stock: 5 },
        { label: 'M', stock: 10 },
        { label: 'L', stock: 8 },
        { label: 'XL', stock: 3 },
      ],
      category: '상의',
    };
  }
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const product = await fetchProduct(params.id);
  if (!product) {
    return { title: '상품을 찾을 수 없습니다 | OT-CHAWON' };
  }
  const description = (product.description ?? '').slice(0, 150);
  return {
    title: `${product.name} | OT-CHAWON`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.thumbnailUrl ? [{ url: product.thumbnailUrl, alt: product.name }] : [],
    },
  };
}

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-oc-black p-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton variant="rectangular" className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton variant="text" className="h-6 w-1/3" />
            <Skeleton variant="text" className="h-8 w-2/3" />
            <Skeleton variant="text" className="h-6 w-1/4" />
            <Skeleton variant="rectangular" className="h-32 w-full rounded-lg" />
            <Skeleton variant="rectangular" className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await fetchProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailClient product={product} relatedProducts={DUMMY_RELATED} />
    </Suspense>
  );
}
