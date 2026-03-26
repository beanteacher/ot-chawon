import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-oc-gray-900 border-t border-oc-gray-800 mt-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-semibold text-white">
            OT-CHAWON - AI 3D 옷핏 플랫폼
          </p>
          <nav className="flex items-center gap-4">
            <Link href="/terms" className="text-xs text-oc-gray-500 hover:text-oc-gray-300 transition-colors">
              이용약관
            </Link>
            <Link href="/privacy" className="text-xs text-oc-gray-500 hover:text-oc-gray-300 transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/support" className="text-xs text-oc-gray-500 hover:text-oc-gray-300 transition-colors">
              고객센터
            </Link>
          </nav>
        </div>
        <p className="mt-4 text-xs text-oc-gray-600 text-center md:text-left">
          Copyright 2026 Ot-Chawon. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
