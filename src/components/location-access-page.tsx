'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface LocationAccessPageProps {
  onLocationSuccess: (position: GeolocationPosition) => void;
  onLocationError: () => void;
}

export default function LocationAccessPage({ onLocationSuccess, onLocationError }: LocationAccessPageProps) {
  
  const handleLocationRequest = () => {
    if (!navigator.geolocation) {
      onLocationError(); // Geolocation not supported, but we proceed
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationSuccess(position);
      },
      () => {
        // Handle error or denial. The parent component decides what to do, which is to proceed.
        onLocationError();
      },
      { timeout: 10000 } // Add a timeout to avoid getting stuck
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 animate-fade-in">
        <Card className="w-[400px]">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <MapPin className="w-12 h-12 text-primary" />
                </div>
                <CardTitle>One Last Step: Location</CardTitle>
                <CardDescription>To find the best local vets and shelters, please allow access to your location. This is optional and you can proceed without it.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <Button onClick={handleLocationRequest} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    Allow Location Access
                </Button>
                <Button onClick={onLocationError} className="w-full" variant="ghost">
                    Maybe Later
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
