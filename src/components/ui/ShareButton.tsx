'use client';

import { useStore } from '@/store/useStore';

type Props = {
  title: string;
  text?: string;
  url?: string;
};

export default function ShareButton({ title, text, url }: Props) {
  const { showToast } = useStore();

  const handleShare = async () => {
    const shareUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '');
    const nav = typeof window !== 'undefined' ? window.navigator : undefined;

    try {
      if (nav && typeof (nav as any).share === 'function') {
        await (nav as any).share({ title, text, url: shareUrl });
        showToast('Shared!');
        return;
      }

      if (nav?.clipboard?.writeText) {
        await nav.clipboard.writeText(shareUrl);
        showToast('Link copied');
        return;
      }

      showToast('Sharing not supported');
    } catch {
      showToast('Could not share');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-bold hover:bg-gray-200 transition-all"
      type="button"
      aria-label="Share"
      title="Share"
    >
      <i className="fas fa-share-nodes" /> Share
    </button>
  );
}
