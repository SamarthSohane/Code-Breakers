import VetSearch from './vet-search';

export default function ResQVetPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">ResQVet</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Let our AI assistant find the best vets for your furry friend.
        </p>
      </div>
      <VetSearch />
    </div>
  );
}
