'use client';

import { Logo } from '@/components/icons/logo-client';
import { cn } from '@/lib/utils';

export default function SplashScreen({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-1000",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="animate-logo-in">
        <Logo
          size="text-8xl md:text-9xl"
          paw1Class="animate-paw-in-left"
          paw2Class="animate-paw-in-right"
          textClass="animate-text-fade-in"
        />
        <p className="mt-4 text-center text-lg text-muted-foreground font-headline animate-text-fade-in">
          Rescue made simple, Care made sure.
        </p>
      </div>
    </div>
  );
}
