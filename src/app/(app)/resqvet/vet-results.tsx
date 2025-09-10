'use client';

import { useEffect, useState } from 'react';
import { findTopRatedVetsAction } from './actions';
import type { FindTopRatedVetsOutput } from '@/ai/flows/find-top-rated-vets';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin, Phone, Clock, DollarSign, AlertCircle, Star } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface VetResultsProps {
  animal: string;
}

export default function VetResults({ animal }: VetResultsProps) {
  const [vets, setVets] = useState<FindTopRatedVetsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function getVets() {
      try {
        setIsLoading(true);
        setError(null);
        
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const location = `${position.coords.latitude}, ${position.coords.longitude}`;
        
        const result = await findTopRatedVetsAction({ location });

        if (result.success) {
          setVets(result.data);
        } else {
          setError(result.error);
          toast({
            variant: "destructive",
            title: "Error finding vets",
            description: result.error,
          });
        }
      } catch (e: any) {
        let errorMessage = 'An unexpected error occurred.';
        if (e.code === 1) { // Geolocation permission denied
            errorMessage = 'Location access is required to find nearby vets. Please enable it in your browser settings.';
        } else if (typeof e.message === 'string') {
            errorMessage = e.message;
        }
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    }

    getVets();
  }, [animal, toast]);

  if (isLoading) {
    return <VetSkeletonLoader />;
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

  if (!vets || vets.length === 0) {
    return (
        <div className="text-center text-muted-foreground">
            <p>No veterinarians found for your location.</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-headline text-center">Top Vets for {animal}s Near You</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vets.map((vet, index) => (
          <Card key={index} className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48 w-full">
              <Image
                src={vet.image || 'https://picsum.photos/seed/vet-placeholder/600/400'}
                alt={`Photo of ${vet.name}`}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-headline">{vet.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow space-y-3 text-sm">
                <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="mt-1" />
                    <span>{vet.address} ({vet.distance})</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock />
                    <span>{vet.opening_hours}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                    <DollarSign />
                    <span>{vet.fees}</span>
                </div>
                <div className="flex items-center gap-3 text-yellow-500">
                    <Star className="fill-current" />
                    <span className="font-bold">{vet.rating ? `${vet.rating.toFixed(1)} / 5.0` : 'No rating'}</span>
                </div>
            </CardContent>
            <CardFooter className="bg-muted/50 p-3 grid grid-cols-2 gap-2">
                <Button asChild variant="outline" size="sm">
                    <a href={`tel:${vet.phone_number}`}>
                        <Phone className="mr-2"/>
                        Call
                    </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                    <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(vet.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <MapPin className="mr-2"/>
                        Directions
                    </a>
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

const VetSkeletonLoader = () => (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold font-headline text-center">
            <Skeleton className="h-8 w-80 mx-auto" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
                <Card key={i} className="flex flex-col overflow-hidden rounded-lg">
                    <Skeleton className="h-48 w-full" />
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                    <CardFooter className="p-3 grid grid-cols-2 gap-2">
                        <Skeleton className="h-9 w-full" />
                        <Skeleton className="h-9 w-full" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    </div>
)
