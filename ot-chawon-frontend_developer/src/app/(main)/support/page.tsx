import Link from 'next/link';
export default function SupportPage() {
  return (
    <main className="max-w-screen-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-white mb-8">고객지원</h1>
      <div className="rounded-lg border border-oc-gray-700 bg-oc-gray-900 p-6 text-oc-gray-300 space-y-6">
        <section>
          <h2 className="text-base font-semibold text-white mb-2">문의하기</h2>
          <p className="text-sm leading-relaxed">이메일: support@ot-chawon.com</p>
          <p className="text-sm leading-relaxed mt-1">운영시간: 평일 09:00 - 18:00</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-white mb-2">자주 묻는 질문</h2>
          <p className="text-sm leading-relaxed">배송, 반품, 교환 관련 문의는 이메일로 연락 주시기 바랍니다.</p>
        </section>
      </div>
      <div className="mt-6">
        <Link href="/" className="inline-flex h-10 items-center justify-center rounded-md border border-oc-gray-700 bg-oc-gray-900 px-5 text-sm font-medium text-oc-gray-300 transition-colors hover:bg-oc-gray-800">홈으로</Link>
      </div>
    </main>
  );
}
