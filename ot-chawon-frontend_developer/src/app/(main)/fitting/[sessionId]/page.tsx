import { Suspense } from 'react';

interface FittingPageProps {
  params: { sessionId: string };
}

export default function FittingPage({ params }: FittingPageProps) {
  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8">
      <Suspense fallback={<div className="animate-pulse">피팅 결과 로딩 중...</div>}>
        <section>
          <p className="text-oc-gray-500">피팅 세션: {params.sessionId}</p>
        </section>
      </Suspense>
    </main>
  );
}
