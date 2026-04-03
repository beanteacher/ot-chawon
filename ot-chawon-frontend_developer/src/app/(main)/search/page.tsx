import { Suspense } from 'react';
import { Metadata } from 'next';
import { Spinner } from '@/components/ui/spinner';
import { SearchClient } from './search-client';

interface SearchPageProps {
  searchParams: { q?: string; category?: string; priceRange?: string; brands?: string; sizes?: string };
}

export const metadata: Metadata = {
  title: '검색 | OT-CHAWON',
  description: '원하는 상품을 검색해보세요.',
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q ?? '';
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-oc-gray-50 flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    }>
      <SearchClient initialQuery={query} initialResults={[]} />
    </Suspense>
  );
}
