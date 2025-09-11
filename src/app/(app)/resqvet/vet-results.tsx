
'use client';

import { useEffect, useState, useMemo } from 'react';
import { findTopRatedVetsAction } from './actions';
import type { FindTopRatedVetsOutput } from '@/ai/flows/find-top-rated-vets';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin, Phone, Clock, DollarSign, AlertCircle, Star } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import VetMap from './vet-map';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface VetResultsProps {
  animal: string;
}

export default function VetResults({ animal }: VetResultsProps) {
  const [vets, setVets] = useState<FindTopRatedVetsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [userStoredLocation, setUserStoredLocation] = useLocalStorage<{latitude: number; longitude: number} | null>('userLocation', null);

  const userLocation = useMemo(() => {
    if (userStoredLocation) {
        return { lat: userStoredLocation.latitude, lng: userStoredLocation.longitude };
    }
    return null;
  }, [userStoredLocation]);

  useEffect(() => {
    
    const getLocationAndFetchVets = async () => {
      setIsLoading(true);
      setError(null);

      const fetchVets = async (lat: number, lng: number) => {
        const locationString = `${lat}, ${lng}`;
        try {
          const result = await findTopRatedVetsAction({ location: locationString });
          if (result.success) {
            setVets(Array.isArray(result.data) ? result.data : []);
          } else {
            setError(result.error);
            toast({ variant: "destructive", title: "Error finding vets", description: result.error });
          }
        } catch (e: any) {
          const errorMessage = e.message || 'An unexpected error occurred while fetching vet data.';
          setError(errorMessage);
          toast({ variant: "destructive", title: "Error", description: errorMessage });
        } finally {
          setIsLoading(false);
        }
      };

      if (userStoredLocation) {
        fetchVets(userStoredLocation.latitude, userStoredLocation.longitude);
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserStoredLocation({ latitude, longitude });
            fetchVets(latitude, longitude);
          },
          () => {
            setError("We couldn't access your location. Please enable location permissions in your browser settings to find nearby vets.");
            setIsLoading(false);
          },
          { timeout: 10000 }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
        setIsLoading(false);
      }
    };

    getLocationAndFetchVets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animal, toast]);

  if (isLoading) {
    return <VetSkeletonLoader animal={animal} />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (!userLocation) {
     return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Location not found</AlertTitle>
        <AlertDescription>We need your location to find nearby vets. Please restart the app and allow location access.</AlertDescription>
      </Alert>
    );
  }

  if (!vets || vets.length === 0) {
    return (
        <Alert className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Vets Found</AlertTitle>
            <AlertDescription>
                We couldn't find any veterinarians in a 200km radius of your location. You could try searching again later.
            </AlertDescription>
        </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold font-headline text-center">Top Vets for {animal}s Near You</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[70vh]">
         <div className="relative">
            <VetMap vets={vets} userLocation={userLocation} />
         </div>
         <ScrollArea className="h-full">
            <div className="space-y-4 pr-4">
                {vets.map((vet, index) => (
                <Card key={index} className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="relative h-40 w-full">
                    <Image
                        src={vet.image || `https://picsum.photos/seed/vet${index}/600/400`}
                        alt={`Photo of ${vet.name}`}
                        fill
                        className="object-cover"
                        data-ai-hint="veterinarian clinic"
                    />
                    </div>
                    <CardHeader>
                    <CardTitle className="text-xl font-headline">{vet.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3 text-sm">
                        <div className="flex items-start gap-3 text-muted-foreground">
                            <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                            <span>{vet.address} ({vet.distance})</span>
                        </div>
                        <div className="flex items-start gap-3 text-muted-foreground">
                            <Clock className="h-4 w-4 mt-1 flex-shrink-0" />
                            <span>{vet.opening_hours}</span>
                        </div>
                        <div className="flex items-start gap-3 text-muted-foreground">
                            <DollarSign className="h-4 w-4 mt-1 flex-shrink-0" />
                            <span>{vet.fees}</span>
                        </div>
                        <div className="flex items-center gap-2 text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-5 w-5 ${i < (vet.rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                            <span className="font-bold text-base text-muted-foreground ml-1">{vet.rating ? `${vet.rating.toFixed(1)} / 5.0` : 'No rating'}</span>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/50 p-3 grid grid-cols-2 gap-2">
                        <Button asChild variant="outline" size="sm">
                            <a href={`tel:${vet.phone_number}`}>
                                <Phone />
                                Call
                            </a>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                            <a 
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(vet.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <MapPin />
                                Directions
                            </a>
                        </Button>
                    </CardFooter>
                </Card>
                ))}
            </div>
         </ScrollArea>
      </div>
    </div>
  );
}

const VetSkeletonLoader = ({ animal }: { animal: string }) => (
    <div className="space-y-6 animate-pulse">
        <div className='text-center'>
            <Skeleton className="h-8 w-80 mx-auto mb-4" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[70vh]">
            <Skeleton className="h-full w-full rounded-lg" />
            <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                    <Card key={i} className="flex flex-col overflow-hidden rounded-lg">
                        <Skeleton className="h-40 w-full" />
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </div>
);
