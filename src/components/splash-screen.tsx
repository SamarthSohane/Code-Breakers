'use client';

import { Logo } from '@/components/icons/logo';
import { cn } from '@/lib/utils';

export default function SplashScreen({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-beige-100 to-yellow-100 transition-opacity duration-1000",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      style={{
        '--tw-gradient-from': 'hsl(80, 40%, 80%)',
        '--tw-gradient-to': 'hsl(40, 30%, 80%)',
        '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)',
        'backgroundColor': 'hsl(var(--background))'
      }}
    >
      <div className="animate-scale-in animate-fade-in">
        <Logo size="text-7xl md:text-8xl" />
        <p className="mt-4 text-center text-lg text-primary-foreground font-headline">
          Rescue made simple, Care made sure.
        </p>
      </div>
    </div>
  );
}
