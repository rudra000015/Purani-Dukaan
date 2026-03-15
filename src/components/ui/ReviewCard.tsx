'use client';

import { Review } from '@/data/shops';

export default function ReviewCard({ review: r }: { review: Review }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8d5524] to-[#b87333] flex items-center justify-center text-white text-xs font-black">
            {r.author.charAt(0)}
          </div>
          <span className="font-bold text-sm text-gray-800">{r.author}</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <i
              key={i}
              className={`fas fa-star text-[10px] ${i < r.rating ? 'text-yellow-400' : 'text-gray-200'}`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-600 italic">&quot;{r.text}&quot;</p>
      <p className="text-[10px] text-gray-400 mt-2 font-bold">{r.date}</p>
    </div>
  );
}
