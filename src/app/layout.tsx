import { Playfair_Display, Inter } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import styles from '@/styles/themes.module.css';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
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
      <body className={`${styles.themeDark} ${styles.body}`}>
        <div className={styles.distressedOverlay} aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}