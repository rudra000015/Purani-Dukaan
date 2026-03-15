'use client';

import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useStore } from '@/store/useStore';

export default function NotificationBell() {
  const { showToast } = useStore();
  const { isSupported, permission, isSubscribed, isLoading, subscribe, unsubscribe } =
    usePushNotifications();

  if (!isSupported) return null;

  const handleClick = async () => {
    if (permission === 'denied') {
      showToast('Notifications browser settings mein blocked hain');
      return;
    }

    const ok = isSubscribed ? await unsubscribe() : await subscribe();
    if (!ok && !isSubscribed) {
      showToast('Notification permission allow karo');
      return;
    }

    showToast(isSubscribed ? 'Notifications off' : 'Notifications on');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className="relative w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-gray-200 hover:border-[#8d5524]/40 transition-all shadow-sm pressable disabled:opacity-60"
      aria-label={isSubscribed ? 'Disable notifications' : 'Enable notifications'}
      title={isSubscribed ? 'Notifications enabled' : 'Enable notifications'}
    >
      <i
        className={`fas fa-bell text-sm ${
          isSubscribed ? 'text-[#8d5524]' : 'text-gray-500'
        }`}
      />
      {isSubscribed && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      )}
    </button>
  );
}

