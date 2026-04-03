import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="max-w-screen-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-oc-gray-900 mb-8">서비스 이용약관</h1>

      <div className="rounded-lg border border-oc-gray-200 bg-white p-6 text-oc-gray-600 space-y-6">
        <section>
          <h2 className="text-base font-semibold text-oc-gray-900 mb-2">제1조 (목적)</h2>
          <p className="text-sm leading-relaxed">
            이 약관은 OT-CHAWON(이하 &quot;회사&quot;)이 제공하는 서비스의 이용과 관련하여 회사와 이용자 간의
            권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-oc-gray-900 mb-2">제2조 (정의)</h2>
          <p className="text-sm leading-relaxed">
            &quot;서비스&quot;란 회사가 제공하는 전자상거래 관련 제반 서비스를 의미합니다.
            &quot;이용자&quot;란 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-oc-gray-900 mb-2">제3조 (약관의 효력 및 변경)</h2>
          <p className="text-sm leading-relaxed">
            이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.
            회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 공지 후 효력이 발생합니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-oc-gray-900 mb-2">제4조 (서비스 이용)</h2>
          <p className="text-sm leading-relaxed">
            서비스 이용은 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간 운영을 원칙으로 합니다.
          </p>
        </section>
      </div>

      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md border border-oc-gray-200 bg-white px-5 text-sm font-medium text-oc-gray-600 transition-colors hover:bg-oc-gray-100"
        >
          홈으로
        </Link>
      </div>
    </main>
  );
}
