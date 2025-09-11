'use client';

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useMemo } from 'react';
import type { FindTopRatedVetsOutput } from '@/ai/flows/find-top-rated-vets';
import { Skeleton } from '@/components/ui/skeleton';

interface VetMapProps {
  vets: FindTopRatedVetsOutput;
  userLocation: { lat: number; lng: number };
}

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
};

export default function VetMap({ vets, userLocation }: VetMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const center = useMemo(() => userLocation, [userLocation]);

  if (!isLoaded) {
    return <Skeleton className="h-full w-full" />;
  }

  // A simple regex to parse lat/lng from the address string if needed
  const parseCoordinates = (address: string): { lat: number; lng: number } | null => {
    // This is a fallback and might not work for all address formats.
    // A proper geocoding step would be better.
    const match = address.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
    if (match) {
        return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }
    return null;
  };


  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
    >
      {/* User's location marker */}
      <Marker position={center} title="Your Location" icon={{
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#4285F4",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "white"
      }} />

      {/* Vets markers */}
      {vets.map((vet, index) => {
        // In a real app, you'd geocode the address. For now, we rely on picsum for psuedo-randomness.
        // This is a simplified approach for demonstration.
        const seed = vet.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + index;
        const lat = userLocation.lat + (Math.random() - 0.5) * 0.2;
        const lng = userLocation.lng + (Math.random() - 0.5) * 0.2;

        return <Marker key={index} position={{ lat, lng }} title={vet.name} />
      })}
    </GoogleMap>
  );
}
