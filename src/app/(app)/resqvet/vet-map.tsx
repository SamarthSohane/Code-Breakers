'use client';

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useMemo, useState, useEffect } from 'react';
import type { FindTopRatedVetsOutput } from '@/ai/flows/find-top-rated-vets';
import { Skeleton } from '@/components/ui/skeleton';

interface VetMapProps {
  vets: FindTopRatedVetsOutput;
  userLocation: { lat: number; lng: number };
  selectedVet: number | null;
  onMarkerClick: (index: number) => void;
}

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
};

export default function VetMap({ vets, userLocation, selectedVet, onMarkerClick }: VetMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const center = useMemo(() => userLocation, [userLocation]);
  
  useEffect(() => {
    if (map && selectedVet !== null) {
        const vet = vets[selectedVet];
        if (vet) {
            const seed = vet.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + selectedVet;
            const lat = userLocation.lat + ((seed % 1000) / 1000 - 0.5) * 0.2;
            const lng = userLocation.lng + ((seed % 2000) / 2000 - 0.5) * 0.2;
            map.panTo({ lat, lng });
            map.setZoom(14);
        }
    } else if (map) {
        map.panTo(center);
        map.setZoom(10);
    }
  }, [selectedVet, map, vets, userLocation, center]);


  if (!isLoaded) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={setMap}
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
        const seed = vet.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + index;
        const lat = userLocation.lat + ((seed % 1000) / 1000 - 0.5) * 0.2;
        const lng = userLocation.lng + ((seed % 2000) / 2000 - 0.5) * 0.2;
        const isSelected = selectedVet === index;

        return (
            <Marker 
                key={index} 
                position={{ lat, lng }} 
                title={vet.name}
                onClick={() => onMarkerClick(index)}
                animation={isSelected ? google.maps.Animation.BOUNCE : undefined}
            />
        )
      })}
    </GoogleMap>
  );
}
