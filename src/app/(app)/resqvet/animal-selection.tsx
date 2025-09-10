'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { animals } from '@/lib/animals';
import { cn } from '@/lib/utils';

interface AnimalSelectionProps {
  onAnimalSelect: (animal: string) => void;
}

export default function AnimalSelection({ onAnimalSelect }: AnimalSelectionProps) {

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold font-headline text-center mb-6">Choose the desired Animal</h2>
      <Card>
        <CardContent className="p-2">
          <ScrollArea className="h-96 w-full">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4">
              {animals.map((animal, index) => (
                <div
                  key={`${animal.name}-${index}`}
                  className={cn(
                    'flex flex-col items-center justify-center p-3 rounded-lg border-2 border-transparent cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:border-primary'
                  )}
                  onClick={() => onAnimalSelect(animal.name)}
                >
                  <div className="w-16 h-16 flex items-center justify-center text-foreground">
                    {animal.icon}
                  </div>
                  <span className="mt-2 text-sm font-semibold font-headline text-center tracking-tight">{animal.name}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
