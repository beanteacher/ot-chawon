import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductDetailClient } from './product-detail-client';
import { ProductDto } from '@/services/product/dto/product.dto';

interface ProductDetailPageProps {
  params: { id: string };
}

async function fetchProduct(id: string): Promise<ProductDto.Detail | null> {
  try {
    const { getProduct } = await import('@/services/product/get-products');
    return await getProduct(Number(id));
  } catch {
    return null;
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
    <div className="min-h-screen bg-oc-gray-50 p-8">
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
      <ProductDetailClient product={product} relatedProducts={[]} />
    </Suspense>
  );
}
