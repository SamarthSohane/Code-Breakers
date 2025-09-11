'use client';

import { cn } from "@/lib/utils";
import { PawPrint } from "lucide-react";

export const Logo = ({
  className,
  size = 'text-5xl',
  paw1Class,
  paw2Class,
  textClass,
}: {
  className?: string,
  size?: string,
  paw1Class?: string,
  paw2Class?: string,
  textClass?: string,
}) => {
  return (
    <div className={cn('font-headline font-bold text-primary', className)}>
      <div className={cn('inline-flex items-center gap-2', size)}>
        <PawPrint className={cn("text-accent", paw1Class)} />
        <PawPrint className={cn("text-accent", paw2Class)} />
        <span className={textClass}>ResQPet</span>
      </div>
    </div>
  );
};
