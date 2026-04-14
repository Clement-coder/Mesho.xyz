'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './footer';

export function ConditionalFooter() {
  const pathname = usePathname();
  const hide = pathname?.startsWith('/dashboard') || pathname?.startsWith('/profile') || pathname?.startsWith('/admin');
  if (hide) return null;
  return <Footer />;
}
