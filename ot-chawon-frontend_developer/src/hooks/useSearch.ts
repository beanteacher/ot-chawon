'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Product } from '@/components/product/product-card';

export interface SearchFilters {
  category: string;
  priceRange: string;
  brands: string[];
  sizes: string[];
  priceMin: number;
  priceMax: number;
}

export const DEFAULT_FILTERS: SearchFilters = {
  category: '전체',
  priceRange: '전체',
  brands: [],
  sizes: [],
  priceMin: 0,
  priceMax: 200000,
};

export type SortOption = '인기순' | '최신순' | '가격순';

const MOCK_PRODUCTS: Product[] = [
  { id: '1', brand: '나이키', name: '오버사이즈 코트 윈터 에디션', price: 189000, originalPrice: 250000, discountRate: 24 },
  { id: '2', brand: '아디다스', name: '데님 팬츠 와이드핏 블루', price: 79000, originalPrice: 99000, discountRate: 20 },
  { id: '3', brand: '자라', name: '나이키 스니커즈 에어맥스 270', price: 139000 },
  { id: '4', brand: 'H&M', name: '울 니트 스웨터 크루넥', price: 49000, originalPrice: 69000, discountRate: 29 },
  { id: '5', brand: '유니클로', name: '가죽 재킷 라이더 블랙', price: 219000 },
  { id: '6', brand: '무신사', name: '린넨 셔츠 오버핏 화이트', price: 39000 },
  { id: '7', brand: '나이키', name: '크롭 티셔츠 베이직 라운드', price: 29000, discountRate: 10, originalPrice: 32000 },
  { id: '8', brand: '아디다스', name: '후드 집업 그레이 멜란지', price: 89000 },
  { id: '9', brand: '자라', name: '와이드 팬츠 블랙 기본핏', price: 59000, originalPrice: 79000, discountRate: 25 },
  { id: '10', brand: 'H&M', name: '봄 자켓 라이트 베이지', price: 119000 },
  { id: '11', brand: '유니클로', name: '스트라이프 셔츠 컬러블록', price: 45000 },
  { id: '12', brand: '무신사', name: '데님 미니스커트 라이트 블루', price: 55000, originalPrice: 69000, discountRate: 20 },
];

const MOCK_SUGGESTIONS = ['오버사이즈 코트', '데님 팬츠', '나이키 스니커즈', '울 니트 스웨터', '가죽 재킷'];

function filterProducts(products: Product[], query: string, filters: SearchFilters, sort: SortOption): Product[] {
  let result = [...products];

  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }

  if (filters.category !== '전체') {
    // 카테고리별 필터는 mock에서는 브랜드로 근사
    result = result.filter((p) => p.brand === filters.category || filters.category === '전체');
  }

  if (filters.brands.length > 0) {
    result = result.filter((p) => filters.brands.includes(p.brand));
  }

  if (filters.priceRange !== '전체') {
    result = result.filter((p) => {
      if (filters.priceRange === '~5만원') return p.price <= 50000;
      if (filters.priceRange === '5~10만원') return p.price > 50000 && p.price <= 100000;
      if (filters.priceRange === '10~20만원') return p.price > 100000 && p.price <= 200000;
      if (filters.priceRange === '20만원~') return p.price > 200000;
      return true;
    });
  }

  if (sort === '가격순') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === '최신순') {
    result.sort((a, b) => Number(b.id) - Number(a.id));
  }
  // 인기순은 기본 순서 유지

  return result;
}

export function useSearch(initialQuery = '') {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [sortOption, setSortOption] = useState<SortOption>('인기순');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // debounce query
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  // update suggestions
  useEffect(() => {
    if (searchQuery.trim()) {
      const matched = MOCK_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(matched);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  // search results
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const filtered = filterProducts(MOCK_PRODUCTS, debouncedQuery, filters, sortOption);
      setResults(filtered);
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [debouncedQuery, filters, sortOption]);

  const setQuery = useCallback((q: string) => {
    setSearchQuery(q);
  }, []);

  const setFilter = useCallback(<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilter = useCallback((key: keyof SearchFilters) => {
    setFilters((prev) => ({ ...prev, [key]: DEFAULT_FILTERS[key] }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const executeSearch = useCallback((q: string) => {
    setSearchQuery(q);
    setDebouncedQuery(q);
    setShowSuggestions(false);
  }, []);

  return {
    searchQuery,
    debouncedQuery,
    filters,
    sortOption,
    setSortOption,
    results,
    isLoading,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    setQuery,
    setFilter,
    clearFilter,
    clearAllFilters,
    executeSearch,
  };
}
