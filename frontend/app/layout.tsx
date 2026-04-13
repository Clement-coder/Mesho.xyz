import React from "react"
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { AuthProvider } from '@/lib/auth-context';
import { Navbar } from "./components/navbar";
import { ConditionalFooter } from "./components/conditional-footer";
import { WhatsAppButton } from "./components/whatsapp-button";
import { Toaster } from 'sonner';
import './globals.css';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3b82f6',
};

export const metadata: Metadata = {
  title: 'Mesho Data Sciences - Academic Research Support',
  description: 'Access department-specific project materials, hire academic data analysts, and learn SPSS data analysis for your research.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mesho Data Sciences',
  },
  icons: {
    icon: [
      { url: '/mesho_logo.png', sizes: '192x192', type: 'image/png' },
      { url: '/mesho_logo.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/mesho_logo.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/mesho_logo.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <ConditionalFooter />
          <WhatsAppButton />
        </AuthProvider>
        <Toaster
          position="top-right"
          expand={false}
          richColors
          closeButton
          toastOptions={{
            style: {
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              borderRadius: '0.875rem',
              boxShadow: 'var(--clay-shadow)',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
            },
          }}
        />
        <Analytics />
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js')` }} />
      </body>
    </html>
  );
}
