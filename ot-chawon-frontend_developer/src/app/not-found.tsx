import Link from 'next/link';

/**
 * Next.js 14 전역 404 Not Found 페이지
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-oc-gray-50 px-4 text-center">
      <div className="space-y-2">
        <p className="text-8xl font-bold text-oc-accent">404</p>
        <h1 className="text-2xl font-semibold text-oc-gray-900">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-sm text-oc-gray-500">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-oc-accent px-5 text-sm font-medium text-white transition-colors hover:bg-oc-primary-600 active:bg-oc-primary-700"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
