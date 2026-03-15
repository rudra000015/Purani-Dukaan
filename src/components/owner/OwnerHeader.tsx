'use client';

import { useRouter } from 'next/navigation';
import { useStore, type OwnerPage } from '@/store/useStore';

interface Props {
  shopName: string;
}

const OWNER_NAVS: { key: OwnerPage; label: string; icon: string }[] = [
  { key: 'showcase', label: 'Showcase', icon: 'th-large' },
  { key: 'collections', label: 'Collections', icon: 'layer-group' },
  { key: 'addproduct', label: 'Add Product', icon: 'plus-circle' },
  { key: 'profile', label: 'Shop Profile', icon: 'id-card' },
  { key: 'analytics', label: 'Analytics', icon: 'chart-line' },
];

export default function OwnerHeader({ shopName }: Props) {
  const { ownerPage, ownerNavTo, logout, theme, setTheme } = useStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header
      style={{ background: 'linear-gradient(135deg, #1a0f0a, #2c1810)' }}
      className="text-white px-6 py-4 flex items-center justify-between shadow-lg z-40 flex-shrink-0"
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-[#b87333]/30 rounded-xl flex items-center justify-center text-white text-xl">
          <i className="fas fa-store" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none">Shop Dashboard</h1>
          <p className="text-[10px] text-[#d2b48c] uppercase tracking-widest">{shopName}</p>
        </div>
      </div>

      <nav className="hidden md:flex gap-6 text-sm font-medium text-[#d2b48c]">
        {OWNER_NAVS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => ownerNavTo(key)}
            className={`hover:text-white border-b-2 pb-1 transition-all ${
              ownerPage === key ? 'text-white border-[#b87333]' : 'border-transparent'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="text-[#d2b48c] hover:text-white text-lg transition-colors"
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <i className={`fas fa-${theme === 'dark' ? 'sun' : 'moon'}`} />
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="text-[#d2b48c] hover:text-white text-xl transition-colors"
          aria-label="Logout"
          title="Logout"
        >
          <i className="fas fa-sign-out-alt" />
        </button>
      </div>
    </header>
  );
}
