import { Suspense } from 'react';

export default function HomePage() {
  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white">옷차원</h1>
      <Suspense fallback={<div className="animate-pulse">로딩 중...</div>}>
        <section className="mt-8">
          <p className="text-oc-gray-500">상품 피드 준비 중</p>
        </section>
      </Suspense>
    </main>
  );
}
