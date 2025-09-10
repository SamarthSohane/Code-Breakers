'use client';

import { Logo } from '@/components/icons/logo';
import { cn } from '@/lib/utils';

export default function SplashScreen({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-1000",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="animate-scale-in animate-fade-in">
        <Logo size="text-7xl md:text-8xl" />
        <p className="mt-4 text-center text-lg text-muted-foreground font-headline">
          Rescue made simple, Care made sure.
        </p>
      </div>
    </div>
  );
}
