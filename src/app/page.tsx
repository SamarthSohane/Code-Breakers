'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/splash-screen';
import AuthPage from '@/components/auth-page';
import LocationAccessPage from '@/components/location-access-page';
import { useLocalStorage } from '@/hooks/use-local-storage';

type View = 'splash' | 'auth' | 'location';

export default function Home() {
  const [view, setView] = useState<View>('splash');
  const router = useRouter();
  const [name, setName] = useLocalStorage('userName', '');
  // Using a separate flag to know if onboarding is complete, location can be null
  const [onboardingComplete, setOnboardingComplete] = useLocalStorage('onboardingComplete', false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // If the user has completed onboarding before, go to dashboard
      if (onboardingComplete) {
        router.push('/dashboard');
      } else {
        // Otherwise, start the onboarding flow from the authentication step
        setView('auth');
      }
    }, 3000); // Duration of the splash screen
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAuthSuccess = (userName?: string) => {
    // If a name is provided from the signup form, save it.
    if (userName) {
      setName(userName);
    }
    // After auth, ask for location
    setView('location');
  };

  const handleLocationSuccess = (position?: GeolocationPosition) => {
     if (position) {
      // It's okay if window is not available during SSR.
      try {
        localStorage.setItem('userLocation', JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      } catch (error) {
        console.log(error);
      }
    }
    // Mark onboarding as complete and proceed to dashboard
    setOnboardingComplete(true);
    router.push('/dashboard');
  };

  const renderView = () => {
    switch (view) {
      case 'auth':
        return <AuthPage onAuthSuccess={handleAuthSuccess} />;
      case 'location':
        return <LocationAccessPage onLocationSuccess={handleLocationSuccess} onLocationError={handleLocationSuccess} />; // Always proceed after location step
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
