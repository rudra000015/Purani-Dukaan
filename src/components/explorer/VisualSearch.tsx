'use client';

import { useState, useRef, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { Shop } from '@/types/shop';
import ShopCard from './ShopCard';

interface IdentifiedProduct {
  productName: string;
  productNameHindi?: string;
  category: string;
  searchKeywords: string[];
  confidence: 'high' | 'medium' | 'low';
  description: string;
}

interface VisualSearchResult {
  identified: IdentifiedProduct;
  shops: Shop[];
  searchTerm: string;
}

type Stage = 'idle' | 'preview' | 'searching' | 'results' | 'error';

export default function VisualSearch({ onClose }: { onClose: () => void }) {
  const [stage, setStage]           = useState<Stage>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult]         = useState<VisualSearchResult | null>(null);
  const [errorMsg, setErrorMsg]     = useState('');
  const [dragOver, setDragOver]     = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  const fileRef   = useRef<HTMLInputElement>(null);
  const videoRef  = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { showToast } = useStore();
  const runSearch = useCallback(async (file: File) => {
    setStage('searching');
    setResult(null);

    const form = new FormData();
    form.append('image', file);

    try {
      const res = await fetch('/api/visual-search', { method: 'POST', body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({} as any));
        throw new Error(body.error ?? 'Search failed');
      }
      const data: VisualSearchResult = await res.json();
      setResult(data);
      setStage('results');
    } catch (err: any) {
      setErrorMsg(err.message ?? 'Something went wrong');
      setStage('error');
    }
  }, []);

  // ── File / drag handlers ─────────────────────────────────
  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setStage('preview');
    await runSearch(file);
  }, [showToast, runSearch]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  // ── Camera ────────────────────────────────────────────────
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // rear camera
      });
      streamRef.current = stream;
      setCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch {
      showToast('Camera access denied. Use the upload option instead.');
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      if (!blob) return;
      closeCamera();
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
      handleFile(file);
    }, 'image/jpeg', 0.92);
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
  };


  const reset = () => {
    setStage('idle');
    setPreviewUrl(null);
    setResult(null);
    setErrorMsg('');
  };

  const CONFIDENCE_COLOR: Record<string, string> = {
    high:   'bg-green-50 text-green-700 border-green-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    low:    'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div className="bg-white w-full md:max-w-2xl md:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#8d5524] to-[#b87333] rounded-2xl flex items-center justify-center">
                <i className="fas fa-camera text-white" />
              </div>
              <div>
                <h2 className="font-black text-gray-800 text-lg">Visual Search</h2>
                <p className="text-xs text-gray-400">Photo kheencho ya upload karo</p>
              </div>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all">
              <i className="fas fa-times text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-5">

          {/* ── Camera view ─────────────────────────────────── */}
          {cameraOpen && (
            <div className="mb-5">
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
                <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
                {/* Viewfinder corners */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-48 h-48">
                    {[['top-0 left-0','border-t-2 border-l-2'],['top-0 right-0','border-t-2 border-r-2'],
                      ['bottom-0 left-0','border-b-2 border-l-2'],['bottom-0 right-0','border-b-2 border-r-2']
                    ].map(([pos, border], i) => (
                      <div key={i} className={`absolute ${pos} w-6 h-6 ${border} border-white opacity-80`} />
                    ))}
                  </div>
                </div>
                <p className="absolute bottom-3 left-0 right-0 text-center text-white/70 text-xs">
                  Product ko frame mein rakhein
                </p>
              </div>
              <div className="flex gap-3 mt-3">
                <button onClick={closeCamera}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm">
                  Cancel
                </button>
                <button onClick={capturePhoto}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-br from-[#8d5524] to-[#b87333] text-white font-bold text-sm flex items-center justify-center gap-2">
                  <i className="fas fa-circle text-xs" /> Capture
                </button>
              </div>
            </div>
          )}

          {/* ── Idle: upload zone ────────────────────────────── */}
          {stage === 'idle' && !cameraOpen && (
            <>
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all mb-5 ${
                  dragOver
                    ? 'border-[#8d5524] bg-[#8d5524]/5 scale-[1.01]'
                    : 'border-gray-200 hover:border-[#8d5524]/50 hover:bg-gray-50'
                }`}>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-cloud-upload-alt text-2xl text-gray-400" />
                </div>
                <p className="font-bold text-gray-700 mb-1">Photo drag karein ya tap karein</p>
                <p className="text-sm text-gray-400">JPG, PNG, WEBP supported</p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </div>

              {/* Camera button */}
              <button onClick={openCamera}
                className="w-full py-4 rounded-2xl bg-gradient-to-br from-[#3e2723] to-[#5d4037] text-white font-bold flex items-center justify-center gap-3 hover:-translate-y-0.5 transition-all shadow-lg mb-4">
                <i className="fas fa-camera text-lg" />
                Camera se photo lein
              </button>

              {/* Example hint chips */}
              <div className="flex flex-wrap gap-2 justify-center">
                {['Jalebi','Kaju Katli','Gajak','Til Laddu','Namkeen'].map(item => (
                  <span key={item}
                    className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-full font-medium">
                    {item}
                  </span>
                ))}
                <span className="text-xs text-gray-400 px-2 py-1">...aur bhi</span>
              </div>
            </>
          )}

          {/* ── Preview + searching ───────────────────────────── */}
          {(stage === 'preview' || stage === 'searching') && previewUrl && (
            <div className="mb-5">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 mb-4">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                {stage === 'searching' && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3">
                    {/* Animated scan line */}
                    <div className="w-48 h-48 border-2 border-white/60 rounded-2xl relative overflow-hidden">
                      <div className="absolute left-0 right-0 h-0.5 bg-[#b87333] animate-bounce"
                        style={{ animation: 'scan 1.5s ease-in-out infinite', top: '50%' }} />
                    </div>
                    <p className="text-white font-bold text-sm">Pehchaan raha hoon...</p>
                    <style>{`@keyframes scan{0%{top:10%}50%{top:85%}100%{top:10%}}`}</style>
                  </div>
                )}
              </div>

              {stage === 'searching' && (
                <div className="space-y-2">
                  {['Product identify kar raha hoon...', 'Meerut mein dhoondh raha hoon...'].map((msg, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-500">
                      <i className="fas fa-spinner fa-spin text-[#8d5524]" />
                      {msg}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Results ───────────────────────────────────────── */}
          {stage === 'results' && result && (
            <div>
              {/* What was identified */}
              <div className="flex gap-4 mb-5">
                {previewUrl && (
                  <img src={previewUrl} alt="searched"
                    className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 border border-gray-100" />
                )}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-black text-lg text-gray-800">
                      {result.identified.productName}
                    </h3>
                    {result.identified.productNameHindi && (
                      <span className="text-gray-400 text-sm">{result.identified.productNameHindi}</span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      CONFIDENCE_COLOR[result.identified.confidence]
                    }`}>
                      {result.identified.confidence} confidence
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{result.identified.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {result.identified.searchKeywords.map(kw => (
                      <span key={kw}
                        className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Shops found */}
              {result.shops.length > 0 ? (
                <>
                  <h4 className="font-black text-gray-700 mb-3 flex items-center gap-2">
                    <i className="fas fa-store text-[#8d5524]" />
                    {result.shops.length} shops mein mila
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {result.shops.slice(0, 4).map(s => (
                      <ShopCard key={s.id} shop={s} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-2xl">
                  <i className="fas fa-search text-3xl text-gray-300 block mb-3" />
                  <p className="font-bold text-gray-500">
                    &quot;{result.identified.productName}&quot; Meerut mein nahi mila
                  </p>
                  <p className="text-sm text-gray-400 mt-1">Try a different photo or search manually</p>
                </div>
              )}

              <button onClick={reset}
                className="w-full mt-4 py-3 rounded-2xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50">
                <i className="fas fa-redo mr-2" /> Dobara try karein
              </button>
            </div>
          )}

          {/* ── Error ─────────────────────────────────────────── */}
          {stage === 'error' && (
            <div className="text-center py-10">
              <i className="fas fa-exclamation-circle text-4xl text-red-400 block mb-3" />
              <p className="font-bold text-red-500 mb-1">Search fail ho gayi</p>
              <p className="text-sm text-gray-400 mb-5">{errorMsg}</p>
              <button onClick={reset}
                className="bg-gradient-to-br from-[#8d5524] to-[#b87333] text-white px-6 py-3 rounded-xl font-bold">
                Try Again
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
