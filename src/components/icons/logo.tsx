import { cn } from "@/lib/utils";

export const Logo = ({ className, size = 'text-5xl' }: { className?: string, size?: string }) => {
  return (
    <div className={cn('font-headline font-bold text-primary', className)}>
      <div className={cn('inline-flex items-center', size)}>
        <span>Res</span>
        <div className="relative mx-[-0.1em]">
          <span>Q</span>
          <svg
            viewBox="0 0 256 256"
            className="absolute w-[0.45em] h-[0.45em] top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 fill-accent"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M224,96a24,24,0,0,1-48,0,48.1,48.1,0,0,0-48-48,24,24,0,0,1,0-48,96.11,96.11,0,0,1,96,96Z" />
            <path d="M96,32a24,24,0,0,1,0,48,48.1,48.1,0,0,0-48,48,24,24,0,0,1-48,0,96.11,96.11,0,0,1,96-96Z" />
            <path d="M128,112a24,24,0,1,1,24,24,24,24,0,0,1-24-24Z" />
            <path d="M176,144a32,32,0,0,1-64,0c0-24,16-48,32-72,16,24,32,48,32,72Z" />
          </svg>
        </div>
        <span>Pet</span>
      </div>
    </div>
  );
};
