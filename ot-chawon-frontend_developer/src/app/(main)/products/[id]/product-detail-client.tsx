'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductInfo } from '@/components/product/product-info';
import { SizeGuide } from '@/components/product/size-guide';
import { ProductDto } from '@/services/product/dto/product.dto';
import { cartApi } from '@/services/cartApi';
import { useToast } from '@/hooks/useToast';

const ProductViewer3D = dynamic(
  () => import('@/components/three/product-viewer-3d').then((m) => m.ProductViewer3D),
  { ssr: false }
);

interface ProductDetailClientProps {
  product: ProductDto.Detail;
  relatedProducts: ProductDto.Item[];
}

const RELATED_DISCOUNTS: Record<number, number> = { 3: 30, 4: 10, 5: 25, 6: 5 };

function RelatedCard({ product }: { product: ProductDto.Item }) {
  const discount = RELATED_DISCOUNTS[product.id] ?? 0;
  const discountedPrice = Math.round(product.price * (1 - discount / 100));

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] bg-oc-gray-100 rounded-xl overflow-hidden mb-2">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-oc-gray-100 to-oc-gray-200 group-hover:scale-105 transition-transform duration-300">
          <svg className="w-10 h-10 text-oc-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-oc-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded">
            {discount}%
          </div>
        )}
        {product.hasThreeD && (
          <div className="absolute top-2 right-2 bg-white/80 text-oc-primary-600 text-2xs font-medium px-1.5 py-0.5 rounded border border-oc-primary-500/40">
            3D
          </div>
        )}
      </div>
      <p className="text-xs text-oc-gray-500 mb-0.5">{product.brandName}</p>
      <p className="text-sm text-oc-gray-900 font-medium line-clamp-1 mb-1">{product.name}</p>
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-bold text-oc-gray-900">{discountedPrice.toLocaleString()}원</span>
        {discount > 0 && <span className="text-xs text-oc-gray-600 line-through">{product.price.toLocaleString()}원</span>}
      </div>
    </Link>
  );
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [threeDOpen, setThreeDOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [galleryTab, setGalleryTab] = useState<'image' | '3d'>('image');

  const glbUrl =
    product.hasThreeD && product.glbAssetKey
      ? `${process.env.NEXT_PUBLIC_CDN_URL}/assets/clothing/${product.glbAssetKey}`
      : null;

  const handleAddToCart = async (_size: string, _color: string, quantity: number) => {
    try {
      await cartApi.addCartItem({
        productId: product.id,
        quantity,
      });
      toast.success('장바구니에 추가되었습니다');
    } catch {
      toast.error('장바구니 추가에 실패했습니다.');
    }
  };

  const handleBuyNow = async (_size: string, _color: string, quantity: number) => {
    try {
      await cartApi.addCartItem({
        productId: product.id,
        quantity,
      });
      router.push('/cart');
    } catch {
      toast.error('장바구니 추가에 실패했습니다.');
    }
  };

  return (
    <main className="min-h-screen bg-oc-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* 브레드크럼 */}
        <nav className="flex items-center gap-2 text-xs text-oc-gray-500 mb-6">
          <Link href="/" className="hover:text-oc-gray-900 transition-colors">홈</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-oc-gray-900 transition-colors">상품 목록</Link>
          <span>/</span>
          <span className="text-oc-gray-600 truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* 갤러리 */}
          <div>
            {/* 이미지 | 3D 탭 스위처 (hasThreeD일 때만 표시) */}
            {product.hasThreeD && glbUrl && (
              <div className="flex gap-1 mb-3 bg-oc-gray-100 rounded-xl p-1 w-fit">
                <button
                  onClick={() => setGalleryTab('image')}
                  className={cn(
                    'px-4 py-1.5 text-sm font-medium rounded-lg transition-colors',
                    galleryTab === 'image'
                      ? 'bg-white text-oc-gray-900'
                      : 'text-oc-secondary hover:text-oc-gray-900'
                  )}
                >
                  이미지
                </button>
                <button
                  onClick={() => setGalleryTab('3d')}
                  className={cn(
                    'px-4 py-1.5 text-sm font-medium rounded-lg transition-colors',
                    galleryTab === '3d'
                      ? 'bg-white text-oc-primary-400'
                      : 'text-oc-secondary hover:text-oc-gray-900'
                  )}
                >
                  3D
                </button>
              </div>
            )}

            {galleryTab === '3d' && glbUrl ? (
              <ProductViewer3D glbUrl={glbUrl} className="w-full" />
            ) : (
              <ProductGallery
                images={product.images}
                productName={product.name}
                hasThreeD={product.hasThreeD}
                onThreeDView={() => setThreeDOpen(true)}
              />
            )}
          </div>

          {/* 상품 정보 */}
          <div>
            <ProductInfo
              product={product}
              onSizeGuide={() => setSizeGuideOpen(true)}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>

        {/* 관련 상품 */}
        <section className="mt-16">
          <h2 className="text-lg font-bold text-oc-gray-900 mb-6">관련 상품</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <RelatedCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>

      {/* 사이즈 가이드 모달 */}
      <SizeGuide
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        category={product.category}
      />

      {/* 3D 뷰어 모달 */}
      {threeDOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80" onClick={() => setThreeDOpen(false)} />
          <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl overflow-hidden border border-oc-gray-200 animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-oc-gray-200">
              <h3 className="text-base font-bold text-oc-gray-900">3D 뷰어</h3>
              <button
                onClick={() => setThreeDOpen(false)}
                className="text-oc-gray-400 hover:text-oc-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="aspect-square bg-gradient-to-br from-oc-gray-100 to-oc-gray-200 flex flex-col items-center justify-center gap-4">
              <div className="w-24 h-24 rounded-2xl bg-oc-primary-500/20 flex items-center justify-center animate-spin-slow">
                <svg className="w-12 h-12 text-oc-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-oc-gray-600 font-medium">{product.name}</p>
                <p className="text-sm text-oc-gray-500 mt-1">3D 모델 준비 중...</p>
                <p className="text-xs text-oc-gray-400 mt-1">GLB: {product.glbAssetKey}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-oc-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                드래그하여 360° 회전
              </div>
            </div>
            <div className="p-4 flex justify-between items-center border-t border-oc-gray-200">
              <span className={cn(
                'text-xs px-2 py-1 rounded-full',
                product.hasThreeD ? 'bg-oc-primary-500/20 text-oc-primary-400' : 'bg-oc-gray-100 text-oc-gray-500'
              )}>
                {product.hasThreeD ? '3D 모델 지원' : '3D 모델 없음'}
              </span>
              <button
                onClick={() => setThreeDOpen(false)}
                className="text-sm text-oc-gray-400 hover:text-oc-gray-900 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
