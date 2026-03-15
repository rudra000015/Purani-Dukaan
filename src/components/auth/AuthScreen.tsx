'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';

export default function AuthScreen() {
  const [role, setRole] = useState<'explorer' | 'owner'>('explorer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser, showToast } = useStore();

  const handleLogin = () => {
    if (!email || !password) { setError('Enter email & password'); return; }
    showToast('Signing in...');
    setTimeout(() => {
      setUser({ name: email.split('@')[0], img: `https://api.dicebear.com/7.x/notionists/svg?seed=${email}` }, role);
    }, 800);
  };

  const handleSignup = () => {
    if (!email || !password) { setError('Enter email & password'); return; }
    showToast('Creating account...');
    setTimeout(() => {
      setUser({ name: email.split('@')[0], img: `https://api.dicebear.com/7.x/notionists/svg?seed=${email}` }, role);
      showToast('Account created!');
    }, 1200);
  };

  const handleGoogle = () => {
    showToast('Connecting to Google...');
    setTimeout(() => {
      setUser({ name: 'Heritage Explorer', img: 'https://api.dicebear.com/7.x/notionists/svg?seed=Google' }, role);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#fdfbf7] to-[#f5e6d3]">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#b87333]/10 rounded-full blur-3xl" />

        <div className="text-center mb-8 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#8d5524] to-[#b87333] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl shadow-lg">
            <i className="fas fa-store" />
          </div>
          <h1 className="text-3xl font-black text-gray-800">Purani Dukan</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Discover Meerut&apos;s Heritage</p>
        </div>

        {/* Role Tabs */}
        <div className="flex mb-8 bg-gray-50 p-1 rounded-xl relative z-10">
          {(['explorer', 'owner'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                role === r ? 'bg-white shadow text-[#8d5524]' : 'text-gray-500'
              }`}
            >
              <i className={`fas fa-${r === 'explorer' ? 'compass' : 'store'} mr-2`} />
              {r === 'explorer' ? 'Explorer' : 'Shop Owner'}
            </button>
          ))}
        </div>

        <div className="space-y-4 relative z-10">
          <button
            onClick={handleGoogle}
            className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
            Continue with Google
          </button>

          <div className="flex py-3 items-center">
            <div className="flex-grow border-t border-gray-200" />
            <span className="mx-4 text-gray-400 text-xs font-bold uppercase">Or email</span>
            <div className="flex-grow border-t border-gray-200" />
          </div>

          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:border-[#8d5524] bg-white" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:border-[#8d5524] bg-white" />

          <button
            onClick={handleLogin}
            className="w-full py-4 rounded-xl font-black text-lg shadow-lg bg-gradient-to-br from-[#8d5524] to-[#b87333] text-white hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {role === 'explorer' ? 'Start Exploring' : 'Access Dashboard'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            New?{' '}
            <button onClick={handleSignup} className="text-[#8d5524] font-bold hover:underline">
              Create Account
            </button>
          </p>

          {error && <p className="text-center text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
        </div>
      </div>
    </div>
  );
}
