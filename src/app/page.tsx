'use client';

import { useEffect, useState } from 'react';
import IntroScreen from '@/components/intro/IntroScreen';
import AuthScreen from '@/components/auth/AuthScreen';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const user = useStore(s => s.user);
  const role = useStore(s => s.role);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      setShowAuth(true);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      router.push(role === 'owner' ? '/owner' : '/explorer');
    }
  }, [user, role, router]);

  return (
    <>
      {showIntro && <IntroScreen />}
      {showAuth && !user && <AuthScreen />}
    </>
  );
}