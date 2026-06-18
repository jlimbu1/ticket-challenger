import type { Metadata } from 'next';
import { UnifrakturMaguntia, Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../hooks/useCart';
import Header from '../components/Header';
import CartDrawer from '../components/CartDrawer';
import { CartDrawerProvider } from '../hooks/useCartDrawer';

const unifrakturMaguntia = UnifrakturMaguntia({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-gothic',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Black Parade - Vintage Vinyl Emporium',
  description: 'Curated vinyl records for the hopeless romantic. A My Chemical Romance inspired vintage record store.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${unifrakturMaguntia.variable} ${playfairDisplay.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-black text-gray-100 font-sans antialiased">
        <CartProvider>
          <CartDrawerProvider>
            <Header />
            <main className="relative z-0">
              {children}
            </main>
            <CartDrawer />
          </CartDrawerProvider>
        </CartProvider>
      </body>
    </html>
  );
}