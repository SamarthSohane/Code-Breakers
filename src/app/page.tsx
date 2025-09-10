'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/splash-screen';
import AuthPage from '@/components/auth-page';
import LocationAccessPage from '@/components/location-access-page';
import NameInputPage from '@/components/name-input-page';
import { useLocalStorage } from '@/hooks/use-local-storage';

type View = 'splash' | 'location' | 'auth' | 'nameInput' | 'denied';

export default function Home() {
  const [view, setView] = useState<View>('splash');
  const router = useRouter();
  const [name, setName] = useLocalStorage('userName', '');
  const [location, setLocation] = useLocalStorage('userLocation', null);

  useEffect(() => {
    const timer = setTimeout(() => {
      // If we already have location, skip to auth.
      if (location) {
        setView('auth');
      } else if (navigator.geolocation) {
        // Otherwise, ask for it.
        setView('location');
      } else {
        // If geolocation is not supported, go to auth but some features might be limited.
        setView('auth');
      }
    }, 3000); // Reduced splash time
    return () => clearTimeout(timer);
  }, [location]);

  const handleLocationSuccess = (position: GeolocationPosition) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    setView('auth');
  };

  const handleLocationError = () => {
    // Silently proceed to auth, features requiring location will be handled in-app.
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

  const renderView = () => {
    switch (view) {
      case 'location':
        return <LocationAccessPage onLocationSuccess={handleLocationSuccess} onLocationError={handleLocationError} />;
      case 'auth':
        return <AuthPage onAuthSuccess={handleAuthSuccess} />;
      case 'nameInput':
        return <NameInputPage onNameSubmit={handleNameSubmit} />;
      default:
        return null;
    }
  }

  return (
    <div className="relative min-h-screen">
      <SplashScreen isVisible={view === 'splash'} />
      <div className={`transition-opacity duration-500 ${view === 'splash' ? 'opacity-0' : 'opacity-100'}`}>
        {renderView()}
      </div>
    </div>
  );
}
