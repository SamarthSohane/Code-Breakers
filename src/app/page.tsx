'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/splash-screen';
import AuthPage from '@/components/auth-page';
import LocationAccessPage from '@/components/location-access-page';
import NameInputPage from '@/components/name-input-page';
import { useLocalStorage } from '@/hooks/use-local-storage';

type View = 'splash' | 'auth' | 'location' | 'nameInput';

export default function Home() {
  const [view, setView] = useState<View>('splash');
  const router = useRouter();
  const [name, setName] = useLocalStorage('userName', '');
  const [location, setLocation] = useLocalStorage('userLocation', null);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Start with authentication
      if (name && location) {
        router.push('/dashboard');
      } else {
        setView('auth');
      }
    }, 3000); 
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAuthSuccess = () => {
    // After auth, ask for location if we don't have it
    if (location) {
      handleLocationSuccess();
    } else {
      setView('location');
    }
  };

  const handleLocationSuccess = (position?: GeolocationPosition) => {
    if (position) {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    }
    // After location, ask for name if we don't have it
    if (name) {
      router.push('/dashboard');
    } else {
      setView('nameInput');
    }
  };

  const handleLocationError = () => {
    // If location fails, proceed to name input
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
      case 'auth':
        return <AuthPage onAuthSuccess={handleAuthSuccess} />;
      case 'location':
        return <LocationAccessPage onLocationSuccess={handleLocationSuccess} onLocationError={handleLocationError} />;
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
