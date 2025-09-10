'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/splash-screen';
import AuthPage from '@/components/auth-page';

export default function Home() {
  const [view, setView] = useState('splash');
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setView('auth');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleAuthSuccess = () => {
    // In a real app, you'd set a session cookie or token here.
    // For this demo, we'll just navigate to the dashboard.
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen">
      <SplashScreen isVisible={view === 'splash'} />
      {view === 'auth' && <AuthPage onAuthSuccess={handleAuthSuccess} />}
    </div>
  );
}
