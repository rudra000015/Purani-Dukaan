'use client';

import { usePushNotifications } from '@/hooks/usePushNotifications';

interface Props {
  shopId: string;
  shopName: string;
}

export default function FollowShopButton({ shopId, shopName }: Props) {
  const {
    isSupported,
    isSubscribed,
    isLoading,
    followedShops,
    followShop,
    unfollowShop,
  } = usePushNotifications();

  if (!isSupported) return null;

  const isFollowing = followedShops.includes(shopId);

  const handleToggle = async () => {
    if (isFollowing) {
      await unfollowShop(shopId);
    } else {
      await followShop(shopId);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all disabled:opacity-60 pressable ${
        isFollowing
          ? 'bg-[#8d5524]/10 text-[#8d5524] border-2 border-[#8d5524]/30'
          : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#8d5524]/40'
      }`}
    >
      {isLoading ? (
        <i className="fas fa-spinner fa-spin" />
      ) : (
        <i className={`fas fa-${isFollowing ? 'bell' : 'bell-slash'} text-sm`} />
      )}
      {isFollowing ? `Following ${shopName.split(' ')[0]}` : 'Follow Shop'}
      {isFollowing && (
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      )}
    </button>
  );
}