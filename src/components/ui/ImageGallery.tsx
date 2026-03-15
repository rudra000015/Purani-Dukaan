'use client';

import { useState } from 'react';

interface Props {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);

  if (!images.length) return null;

  return (
    <div className="space-y-2">
      {/* Main image */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 relative">
        <img
          src={images[active]}
          alt={alt}
          className="w-full h-full object-cover transition-all duration-500"
          onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80'; }}
        />
        {/* Image counter */}
        <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-full">
          {active + 1}/{images.length}
        </span>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                active === i ? 'border-[#8d5524] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
