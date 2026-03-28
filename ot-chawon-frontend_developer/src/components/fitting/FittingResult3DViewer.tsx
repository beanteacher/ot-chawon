'use client';

import dynamic from 'next/dynamic';

const ProductViewer3D = dynamic(
  () =>
    import('@/components/three/ProductViewer3D').then((m) => m.ProductViewer3D),
  { ssr: false, loading: () => <ViewerSkeleton /> }
);

function ViewerSkeleton() {
  return (
    <div className="aspect-square rounded-2xl bg-oc-surface flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-oc-gray-700 border-t-[#FF6B35] animate-spin" />
    </div>
  );
}

interface FittingResult3DViewerProps {
  glbUrl: string;
}

export function FittingResult3DViewer({ glbUrl }: FittingResult3DViewerProps) {
  return (
    <div className="aspect-square rounded-2xl overflow-hidden">
      <ProductViewer3D glbUrl={glbUrl} autoRotate className="rounded-2xl" />
    </div>
  );
}
