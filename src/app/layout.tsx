import { ThemeProvider } from '@/components/ThemeProvider';
import { Playfair_Display, UnifrakturCook } from 'next/font/google';
import '@/styles/globals.css';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
});

const unifrakturCook = UnifrakturCook({
  weight: '700',
  subsets: ['latin'],
  variable: '--font-unifraktur-cook',
  display: 'swap',
});

export const metadata = {
  title: 'The Black Parade - Vintage Vinyl Emporium',
  description: 'A dark, theatrical e-commerce experience inspired by My Chemical Romance. Browse vintage vinyl records and complete your collection.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${unifrakturCook.variable}`}>
      <body className="bg-black text-gray-100 font-serif antialiased min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}