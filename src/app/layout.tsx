import { Playfair_Display, Inter } from 'next/font/google';
import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import '../styles/animations.css';
import '../styles/textures.css';
import ThemeProvider from '../components/ThemeProvider';
import DramaticErrorBoundary from '../components/DramaticErrorBoundary';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['400', '700', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'The Black Parade Emporium',
  description: 'Vintage records, merch, and curiosities from the world of My Chemical Romance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${inter.variable}`}>
      <body className="bg-black text-white font-body antialiased min-h-screen">
        <ThemeProvider>
          <DramaticErrorBoundary>
            <div className="fixed inset-0 pointer-events-none z-50" style={{
              backgroundImage: `
                radial-gradient(ellipse at 20% 50%, rgba(74, 0, 130, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 20%, rgba(139, 0, 0, 0.1) 0%, transparent 50%),
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(255, 255, 255, 0.02) 2px,
                  rgba(255, 255, 255, 0.02) 4px
                )
              `,
            }} />
            <main className="relative z-10">
              {children}
            </main>
          </DramaticErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}