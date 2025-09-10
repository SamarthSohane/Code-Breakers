'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useEffect, useState } from 'react';

export default function Header() {
  const [name] = useLocalStorage('userName', '');
  const [initial, setInitial] = useState('');

  useEffect(() => {
    if (name && typeof name === 'string' && name.length > 0) {
      setInitial(name.charAt(0).toUpperCase());
    } else {
      setInitial('U'); // Default initial
    }
  }, [name]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Logo size="text-3xl" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
           <Avatar>
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
