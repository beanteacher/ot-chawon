import { Suspense } from 'react';

export default function ProductsPage() {
  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8">
      <Suspense fallback={<div className="animate-pulse">상품 목록 로딩 중...</div>}>
        <section>
          <p className="text-oc-gray-500">상품 목록 준비 중</p>
        </section>
      </Suspense>
    </main>
  );
}
