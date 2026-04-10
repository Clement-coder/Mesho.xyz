'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './footer';
import { WhatsAppButton } from './whatsapp-button';

export function ConditionalFooter() {
  const pathname = usePathname();
  const hide = pathname?.startsWith('/dashboard') || pathname?.startsWith('/profile');
  if (hide) return null;
  return (
    <>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
