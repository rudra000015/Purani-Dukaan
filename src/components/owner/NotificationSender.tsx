'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';

type NotifType = 'new_product' | 'offer' | 'open_now' | 'general';

interface Template {
  type: NotifType;
  icon: string;
  label: string;
  defaultTitle: string;
  defaultBody: string;
  color: string;
  bgColor: string;
}

const TEMPLATES: Template[] = [
  {
    type: 'new_product',
    icon: 'box',
    label: 'New Product',
    defaultTitle: '🆕 Naya Product Aaya!',
    defaultBody: 'Aaj ka fresh batch ready hai — jaldi aao!',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  {
    type: 'offer',
    icon: 'tag',
    label: 'Special Offer',
    defaultTitle: '🏷️ Special Offer — Limited Time!',
    defaultBody: 'Aaj sirf — 20% off on all sweets!',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 border-orange-200',
  },
  {
    type: 'open_now',
    icon: 'door-open',
    label: 'Shop Open',
    defaultTitle: '🏪 Dukan Khul Gayi!',
    defaultBody: 'Aaj fresh maal aaya hai. Aao jaldi!',
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
  },
  {
    type: 'general',
    icon: 'bullhorn',
    label: 'Announcement',
    defaultTitle: '📢 Important Update',
    defaultBody: 'Kuch khaas baat hai aaj...',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-200',
  },
];

export default function NotificationSender() {
  const { ownerShopId, showToast } = useStore();

  const [selectedType, setSelectedType] = useState<NotifType>('new_product');
  const [title, setTitle]   = useState('');
  const [body, setBody]     = useState('');
  const [url, setUrl]       = useState('');
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState<{ sent: number; failed: number } | null>(null);

  const template = TEMPLATES.find(t => t.type === selectedType)!;

  const handleTypeSelect = (type: NotifType) => {
    setSelectedType(type);
    const t = TEMPLATES.find(x => x.type === type)!;
    if (!title) setTitle(t.defaultTitle);
    if (!body)  setBody(t.defaultBody);
  };

  const handleSend = async () => {
    const finalTitle = title.trim() || template.defaultTitle;
    const finalBody  = body.trim()  || template.defaultBody;

    if (!finalTitle || !finalBody) {
      showToast('Title aur message dono bharo');
      return;
    }

    setSending(true);
    setLastResult(null);

    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: process.env.NEXT_PUBLIC_NOTIFY_SECRET || 'purani-dukan-secret',
          shopId: ownerShopId,
          payload: {
            title: finalTitle,
            body: finalBody,
            type: selectedType,
            url: url || `/explorer?shop=${ownerShopId}`,
            shopId: ownerShopId,
          },
        }),
      });

      const data = await res.json();

      if (data.success) {
        setLastResult({ sent: data.sent, failed: data.failed || 0 });
        showToast(`Notification bheja! ${data.sent} logon tak pahuncha`);
        setTitle('');
        setBody('');
        setUrl('');
      } else {
        showToast('Bhejne mein dikkat ayi');
      }
    } catch {
      showToast('Network error — try again');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#8d5524]/10 rounded-2xl flex items-center justify-center">
          <i className="fas fa-bell text-[#8d5524]" />
        </div>
        <div>
          <h3 className="font-black text-lg text-gray-800">Send Notification</h3>
          <p className="text-xs text-gray-400">Apne followers ko directly notify karo</p>
        </div>
      </div>

      {/* Type selector */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        {TEMPLATES.map(t => (
          <button
            key={t.type}
            onClick={() => handleTypeSelect(t.type)}
            className={`flex items-center gap-2.5 p-3 rounded-2xl border-2 text-left transition-all ${
              selectedType === t.type
                ? `${t.bgColor} border-current ${t.color}`
                : 'bg-gray-50 border-transparent text-gray-600 hover:border-gray-200'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              selectedType === t.type ? 'bg-white/60' : 'bg-white border border-gray-100'
            }`}>
              <i className={`fas fa-${t.icon} text-sm`} />
            </div>
            <span className="font-bold text-sm">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="text-sm font-bold text-gray-600 block mb-1.5">
          Title <span className="text-gray-400 font-normal">(Max 50 chars)</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value.slice(0, 50))}
          placeholder={template.defaultTitle}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-[#8d5524] text-sm transition-colors"
        />
        <div className="text-right text-[10px] text-gray-400 mt-1">{title.length}/50</div>
      </div>

      {/* Body */}
      <div className="mb-4">
        <label className="text-sm font-bold text-gray-600 block mb-1.5">
          Message <span className="text-gray-400 font-normal">(Max 120 chars)</span>
        </label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value.slice(0, 120))}
          placeholder={template.defaultBody}
          rows={3}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-[#8d5524] text-sm resize-none transition-colors"
        />
        <div className="text-right text-[10px] text-gray-400">{body.length}/120</div>
      </div>

      {/* URL (optional) */}
      <div className="mb-6">
        <label className="text-sm font-bold text-gray-600 block mb-1.5">
          Link <span className="text-gray-400 font-normal">(optional — notification tap karne par kahan jaye)</span>
        </label>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder={`/explorer?shop=${ownerShopId}`}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-[#8d5524] text-sm transition-colors"
        />
      </div>

      {/* Preview */}
      <div className="bg-gray-900 rounded-2xl p-4 mb-5">
        <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-wide">Preview</p>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8d5524] flex items-center justify-center flex-shrink-0">
            <i className="fas fa-store text-white text-sm" />
          </div>
          <div>
            <p className="font-bold text-sm text-white leading-tight">
              {title || template.defaultTitle}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
              {body || template.defaultBody}
            </p>
            <p className="text-[10px] text-gray-600 mt-1">Purani Dukan • now</p>
          </div>
        </div>
      </div>

      {/* Last result */}
      {lastResult && (
        <div className="flex items-center gap-2 mb-4 bg-green-50 border border-green-200 rounded-2xl p-3">
          <i className="fas fa-check-circle text-green-500" />
          <p className="text-sm text-green-700 font-bold">
            {lastResult.sent} followers tak pahuncha
            {lastResult.failed > 0 && `, ${lastResult.failed} fail`}
          </p>
        </div>
      )}

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={sending}
        className="w-full py-4 rounded-2xl font-black text-lg text-white disabled:opacity-50 flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5 active:scale-98"
        style={{ background: 'linear-gradient(135deg, #8d5524, #b87333)' }}
      >
        {sending ? (
          <><i className="fas fa-spinner fa-spin" /> Bhej raha hoon...</>
        ) : (
          <><i className="fas fa-paper-plane" /> Notification Bhejo</>
        )}
      </button>

      <p className="text-center text-xs text-gray-400 mt-3">
        Sirf un logon ko milega jinhone aapki shop follow ki hai
      </p>
    </div>
  );
}