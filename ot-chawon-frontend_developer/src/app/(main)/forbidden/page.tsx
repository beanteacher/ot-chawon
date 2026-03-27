import Link from 'next/link';

/**
 * 403 Forbidden 페이지 - 권한 없음
 */
export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 bg-oc-gray-50 px-4 text-center">
      <div className="space-y-2">
        <p className="text-8xl font-bold text-oc-warning">403</p>
        <h1 className="text-2xl font-semibold text-oc-gray-900">
          접근 권한이 없습니다
        </h1>
        <p className="text-sm text-oc-gray-500">
          이 페이지에 접근할 권한이 없습니다. 로그인 후 다시 시도해 주세요.
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/login"
          className="inline-flex h-10 items-center justify-center rounded-md bg-oc-accent px-5 text-sm font-medium text-white transition-colors hover:bg-oc-primary-600 active:bg-oc-primary-700"
        >
          로그인
        </Link>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md border border-oc-gray-300 bg-white px-5 text-sm font-medium text-oc-gray-800 transition-colors hover:bg-oc-gray-50 active:bg-oc-gray-100"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
