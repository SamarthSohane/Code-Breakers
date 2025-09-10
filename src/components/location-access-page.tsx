'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface LocationAccessPageProps {
  onLocationSuccess: () => void;
}

export default function LocationAccessPage({ onLocationSuccess }: LocationAccessPageProps) {
  
  const handleLocationRequest = () => {
    navigator.geolocation.getCurrentPosition(
      () => {
        onLocationSuccess();
      },
      () => {
        // Handle error or denial. For now, just proceed.
        onLocationSuccess();
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 animate-fade-in">
        <Card className="w-[400px]">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <MapPin className="w-12 h-12 text-primary" />
                </div>
                <CardTitle>Location Access</CardTitle>
                <CardDescription>To provide you with the best local results, please allow access to your location.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleLocationRequest} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    Allow Location Access
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
