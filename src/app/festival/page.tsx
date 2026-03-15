// ============================================================
'use client';
 
import { useRouter } from 'next/navigation';
import FestivalHub from '@/components/festival/FestivalHub';
import ExplorerHeader from '@/components/explorer/ExplorerHeader';
import ExplorerNav from '@/components/explorer/ExplorerNav';
import { useState } from 'react';
import { DEFAULT_FILTERS } from '@/data/categories';
 
export default function FestivalsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
 
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <ExplorerHeader
        query=""
        onQueryChange={() => {}}
        filters={filters}
        onFiltersChange={setFilters}
        totalResults={0}
        onRefetch={() => {}}
        showSearch={false}
      />
      <main className="max-w-2xl mx-auto px-4 pt-6 pb-28">
        <FestivalHub onNavigate={(slug) => router.push(`/festival/${slug}`)} />
      </main>
      <ExplorerNav />
    </div>
  );
}
 