import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { shelters } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Phone, Mail } from 'lucide-react';

export default function ResQNestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">ResQNest</h1>
        <p className="mt-3 text-lg text-muted-foreground">Find a loving animal waiting for a forever home.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {shelters.map((shelter) => {
          const imageData = PlaceHolderImages.find(img => img.id === shelter.image.id);
          const [email, phone] = shelter.contact.split(' | ');

          return (
            <Card key={shelter.id} className="overflow-hidden">
              {imageData && (
                <div className="relative h-60 w-full">
                  <Image
                    src={imageData.imageUrl}
                    alt={imageData.description}
                    fill
                    className="object-cover"
                    data-ai-hint={imageData.imageHint}
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{shelter.name}</CardTitle>
                <CardDescription>{shelter.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${email}`} className="hover:text-primary">{email}</a>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${phone}`} className="hover:text-primary">{phone}</a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
