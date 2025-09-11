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
      // If the user has completed onboarding before, go to dashboard
      if (name && location) {
        router.push('/dashboard');
      } else {
        // Otherwise, start the onboarding flow from the authentication step
        setView('auth');
      }
    }, 3000); // Duration of the splash screen
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAuthSuccess = () => {
    // After auth, ask for location
    setView('location');
  };

  const handleLocationSuccess = (position?: GeolocationPosition) => {
    if (position) {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    }
    // After location, ask for name
    setView('nameInput');
  };

  const handleLocationError = () => {
    // If location fails or is skipped, still proceed to name input
    setView('nameInput');
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
        // Render nothing during the splash screen phase, as it's an overlay
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
