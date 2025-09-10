import { cn } from "@/lib/utils";
import { PawPrint } from "lucide-react";

export const Logo = ({ className, size = 'text-5xl' }: { className?: string, size?: string }) => {
  return (
    <div className={cn('font-headline font-bold text-primary', className)}>
      <div className={cn('inline-flex items-center gap-2', size)}>
        <PawPrint className="text-accent" />
        <span>ResQPet</span>
      </div>
    </div>
  );
};
