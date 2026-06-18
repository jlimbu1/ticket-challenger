import { Playfair_Display, Cormorant_Garamond } from "next/font/google";
import type { Metadata } from "next";
import React from "react";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["400", "700", "900"],
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["300", "400", "600"],
});

export const metadata: Metadata = {
  title: "The Black Parade Emporium",
  description:
    "Vintage records, merch, and curiosities from the world of My Chemical Romance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${cormorantGaramond.variable}`}
    >
      <body className="bg-[#0D0D0D] text-[#F5F0E8] font-body antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}