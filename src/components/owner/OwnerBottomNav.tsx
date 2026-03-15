'use client';

import { useStore, type OwnerPage } from '@/store/useStore';

const TABS: { key: OwnerPage; icon: string; label: string }[] = [
  { key: 'showcase', icon: 'th', label: 'Showcase' },
  { key: 'profile', icon: 'id-card', label: 'Profile' },
  { key: 'collections', icon: 'layer-group', label: 'Collections' },
  { key: 'addproduct', icon: 'plus-circle', label: 'Add' },
  { key: 'analytics', icon: 'chart-line', label: 'Stats' },
];

export default function OwnerBottomNav() {
  const { ownerPage, ownerNavTo } = useStore();

  return (
    <nav className="bg-white border-t flex justify-around py-3 md:hidden flex-shrink-0">
      {TABS.map(({ key, icon, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => ownerNavTo(key)}
          className={`flex flex-col items-center transition-colors ${
            ownerPage === key ? 'text-[#8d5524]' : 'text-gray-400'
          }`}
        >
          <i className={`fas fa-${icon} text-xl mb-1`} />
          <span className="text-[10px] font-bold">{label}</span>
        </button>
      ))}
    </nav>
  );
}

