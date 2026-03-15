'use client';

import { isOpenNow, todayHours } from '@/data/shops';
import type { Hours } from '@/data/shops';

interface Props {
  hours: Record<string, Hours>;
}

export default function OpenStatus({ hours }: Props) {
  const open = isOpenNow(hours);
  const timeStr = todayHours(hours);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
        open
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-red-50 text-red-600 border border-red-200'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${open ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`}
      />
      {open ? 'Open Now' : 'Closed'}
      <span className="opacity-70">· {timeStr}</span>
    </span>
  );
}