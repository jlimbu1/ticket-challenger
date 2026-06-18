import type { Metadata } from "next";
import { Cinzel, UnifrakturMaguntia, Inter } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const unifrakturMaguntia = UnifrakturMaguntia({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-unifraktur",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Black Parade - Vintage Records & Curiosities",
  description:
    "A collection of rare vinyl records and dark curiosities. Welcome to the black parade.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${unifrakturMaguntia.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-gothic-900 font-sans text-gothic-100 antialiased">
        {children}
      </body>
    </html>
  );
}