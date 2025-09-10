import Link from 'next/link';
import { Stethoscope, Home, BookOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const categories = [
  {
    title: 'ResQVet',
    description: 'Find top-rated veterinarians in your neighborhood.',
    href: '/resqvet',
    icon: <Stethoscope className="h-12 w-12 mb-4 text-accent" />,
  },
  {
    title: 'ResQNest',
    description: 'Discover local animal shelters and foster homes.',
    href: '/resqnest',
    icon: <Home className="h-12 w-12 mb-4 text-accent" />,
  },
  {
    title: 'ResQGuide',
    description: 'Access essential resources on pet care.',
    href: '/resqguide',
    icon: <BookOpen className="h-12 w-12 mb-4 text-accent" />,
  },
];

const CategoryCard = ({ title, description, href, icon }: (typeof categories)[0]) => (
  <Link href={href} className="block group">
    <Card className="w-full max-w-sm text-center transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
      <CardHeader className="flex flex-col items-center">
        {icon}
        <CardTitle className="font-headline text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  </Link>
);

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">How can we help?</h1>
        <p className="mt-3 text-lg text-muted-foreground">Select a category to get started.</p>
      </div>
      <div className="flex flex-col items-center gap-8">
        {/* Top of the pyramid */}
        <div className="flex justify-center">
           <CategoryCard {...categories[0]} />
        </div>
        {/* Bottom of the pyramid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
           <CategoryCard {...categories[1]} />
           <CategoryCard {...categories[2]} />
        </div>
      </div>
    </div>
  );
}
