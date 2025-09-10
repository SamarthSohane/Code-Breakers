'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/splash-screen';
import AuthPage from '@/components/auth-page';
import LocationAccessPage from '@/components/location-access-page';
import NameInputPage from '@/components/name-input-page';
import { useLocalStorage } from '@/hooks/use-local-storage';

export default function Home() {
  const [view, setView] = useState('splash');
  const router = useRouter();
  const [name, setName] = useLocalStorage('userName', '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (navigator.geolocation) {
        setView('location');
      } else {
        setView('auth');
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleLocationSuccess = () => {
    setView('auth');
  };
  
  const handleAuthSuccess = () => {
    if (name) {
      router.push('/dashboard');
    } else {
      setView('nameInput');
    }
  };

  const handleNameSubmit = (newName: string) => {
    setName(newName);
    router.push('/dashboard');
  }

  return (
    <div className="relative min-h-screen">
      <SplashScreen isVisible={view === 'splash'} />
      {view === 'location' && <LocationAccessPage onLocationSuccess={handleLocationSuccess} />}
      {view === 'auth' && <AuthPage onAuthSuccess={handleAuthSuccess} />}
      {view === 'nameInput' && <NameInputPage onNameSubmit={handleNameSubmit} />}
    </div>
  );
}
