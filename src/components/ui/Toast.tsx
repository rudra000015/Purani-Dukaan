'use client';

import { useStore } from '@/store/useStore';

const ICONS: Record<string, string> = {
  '❤️': 'fas fa-heart text-red-400',
  'success': 'fas fa-check-circle text-green-400',
  'error': 'fas fa-exclamation-circle text-red-400',
};

export default function Toast() {
  const { toast } = useStore();

  // Pick icon based on message content
  const iconClass = toast.message.includes('❤️')
    ? 'fas fa-heart text-red-400'
    : toast.message.includes('Removed')
    ? 'fas fa-trash text-gray-400'
    : toast.message.includes('added') || toast.message.includes('Created') || toast.message.includes('saved')
    ? 'fas fa-check-circle text-green-400'
    : 'fas fa-info-circle text-[#b87333]';

  return (
    <div className={`toast ${toast.visible ? 'show' : ''}`}>
      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
        <i className={`${iconClass} text-sm`} />
      </div>
      <span>{toast.message}</span>
    </div>
  );
}