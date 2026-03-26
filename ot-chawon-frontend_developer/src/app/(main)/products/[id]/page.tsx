import { Suspense } from 'react';

interface ProductDetailPageProps {
  params: { id: string };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8">
      <Suspense fallback={<div className="animate-pulse">상품 상세 로딩 중...</div>}>
        <section>
          <p className="text-oc-gray-500">상품 ID: {params.id}</p>
        </section>
      </Suspense>
    </main>
  );
}
