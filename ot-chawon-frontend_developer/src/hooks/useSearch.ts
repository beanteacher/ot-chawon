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

const API_BASE = process.env.NEXT_PUBLIC_SPRING_GATEWAY_URL ?? 'http://localhost:8080';

async function searchProducts(query: string): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/api/products?page=0&size=20`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const items = json.data?.items ?? json.items ?? [];
    return items
      .filter((item: { name: string; brandName: string }) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.brandName.toLowerCase().includes(q);
      })
      .map((item: { id: number; brandName: string; name: string; price: number; thumbnailUrl: string; hasThreeD: boolean }) => ({
        id: String(item.id),
        brand: item.brandName,
        name: item.name,
        price: item.price,
        ...(item.thumbnailUrl ? { imageUrl: item.thumbnailUrl } : {}),
        hasThreeD: item.hasThreeD,
      }));
  } catch {
    return [];
  }
}

function applyFilters(products: Product[], filters: SearchFilters, sort: SortOption): Product[] {
  let result = [...products];

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

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  useEffect(() => {
    setSuggestions([]);
  }, [searchQuery]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    let cancelled = false;
    searchProducts(debouncedQuery).then((products) => {
      if (cancelled) return;
      const filtered = applyFilters(products, filters, sortOption);
      setResults(filtered);
      setIsLoading(false);
    });
    return () => { cancelled = true; };
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
