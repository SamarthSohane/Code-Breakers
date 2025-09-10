'use client';

import { useState } from 'react';
import AnimalSelection from './animal-selection';
import InjuryGuide from './injury-guide';

export default function ResQGuidePage() {
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);

  const handleAnimalSelect = (animal: string) => {
    setSelectedAnimal(animal);
  };

  const handleBack = () => {
    setSelectedAnimal(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">ResQGuide</h1>
        <p className="mt-3 text-lg text-muted-foreground">Your essential resource for pet first aid.</p>
      </div>

      {!selectedAnimal ? (
        <AnimalSelection onAnimalSelect={handleAnimalSelect} />
      ) : (
        <InjuryGuide animal={selectedAnimal} onBack={handleBack} />
      )}
    </div>
  );
}
