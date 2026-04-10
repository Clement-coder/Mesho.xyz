import React from "react"
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { AuthProvider } from '@/lib/auth-context';
import { Navbar } from "./components/navbar";
import { ConditionalFooter } from "./components/conditional-footer";
import './globals.css';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mesho Data Sciences - Academic Research Support',
  description: 'Access department-specific project materials, hire academic data analysts, and learn SPSS data analysis for your research.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <ConditionalFooter />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
