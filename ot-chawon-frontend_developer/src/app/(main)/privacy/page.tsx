import Link from 'next/link';
export default function PrivacyPage() {
  return (
    <main className="max-w-screen-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-oc-gray-900 mb-8">개인정보처리방침</h1>
      <div className="rounded-lg border border-oc-gray-200 bg-white p-6 text-oc-gray-600 space-y-6">
        <section>
          <h2 className="text-base font-semibold text-oc-gray-900 mb-2">제1조 (개인정보의 처리 목적)</h2>
          <p className="text-sm leading-relaxed">OT-CHAWON은 회원가입, 서비스 이용, 고객 상담 등의 목적으로 개인정보를 처리합니다.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-oc-gray-900 mb-2">제2조 (개인정보의 처리 및 보유기간)</h2>
          <p className="text-sm leading-relaxed">회원 탈퇴 시까지 개인정보를 보유하며, 관련 법령에 따라 일정 기간 보관할 수 있습니다.</p>
        </section>
      </div>
      <div className="mt-6">
        <Link href="/" className="inline-flex h-10 items-center justify-center rounded-md border border-oc-gray-200 bg-white px-5 text-sm font-medium text-oc-gray-600 transition-colors hover:bg-oc-gray-100">홈으로</Link>
      </div>
    </main>
  );
}
