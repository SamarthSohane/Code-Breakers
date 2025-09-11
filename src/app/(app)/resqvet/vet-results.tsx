'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
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
import { cn } from '@/lib/utils';

interface VetResultsProps {
  animal: string;
}

export default function VetResults({ animal }: VetResultsProps) {
  const [vets, setVets] = useState<FindTopRatedVetsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedVet, setSelectedVet] = useState<number | null>(null);
  const vetCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const getLocationAndFetchVets = () => {
      setIsLoading(true);
      setError(null);

      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser. We can't find vets without your location.");
        setIsLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          const locationString = `${latitude}, ${longitude}`;

          try {
            const result = await findTopRatedVetsAction({ location: locationString, animal });
            if (result.success) {
              const vetData = Array.isArray(result.data) ? result.data : [];
               if (vetData.length === 0) {
                setVets([]);
                setError(`We couldn't find any veterinarians specializing in ${animal}s near you. You could try searching again later.`);
              } else {
                setVets(vetData);
                vetCardRefs.current = new Array(vetData.length).fill(null);
              }
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
        },
        (geoError) => {
          switch(geoError.code) {
            case geoError.PERMISSION_DENIED:
              setError("Location access was denied. Please allow location access in your browser settings to find nearby vets.");
              break;
            case geoError.POSITION_UNAVAILABLE:
              setError("Your location information is unavailable. Please check your device's location services.");
              break;
            case geoError.TIMEOUT:
              setError("The request to get your location timed out. Please try again.");
              break;
            default:
              setError("An unknown error occurred while trying to get your location.");
              break;
          }
          setIsLoading(false);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    };

    getLocationAndFetchVets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animal, toast]);

  const handleVetSelection = (index: number) => {
    setSelectedVet(index);
    vetCardRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
    });
  }

  if (isLoading) {
    return <VetSkeletonLoader animal={animal} />;
  }

  if (error && (!vets || vets.length === 0)) {
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
        <AlertDescription>We need your location to find nearby vets. Please allow location access and try again.</AlertDescription>
      </Alert>
    );
  }

  if (!vets || vets.length === 0) {
    return (
        <Alert className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Vets Found</AlertTitle>
            <AlertDescription>
                We couldn't find any veterinarians specializing in {animal}s within a 200km radius. You could try searching again later.
            </AlertDescription>
        </Alert>
    );
  }


  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold font-headline text-center">Top Vets for {animal}s Near You</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[70vh]">
         <div className="relative">
            <VetMap 
              vets={vets} 
              userLocation={userLocation} 
              selectedVet={selectedVet}
              onMarkerClick={handleVetSelection}
            />
         </div>
         <ScrollArea className="h-full">
            <div className="space-y-4 pr-4">
                {vets.map((vet, index) => (
                <Card 
                    key={index} 
                    ref={el => vetCardRefs.current[index] = el}
                    className={cn(
                        "flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer",
                        selectedVet === index ? 'border-primary ring-2 ring-primary' : 'border-border'
                    )}
                    onClick={() => handleVetSelection(index)}
                >
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
                        <Button asChild variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                            <a href={`tel:${vet.phone_number}`}>
                                <Phone />
                                Call
                            </a>
                        </Button>
                        <Button asChild variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
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
