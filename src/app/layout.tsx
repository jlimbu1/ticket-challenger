import type { Metadata } from "next";
import { UnifrakturCook, Playfair_Display, Crimson_Text } from "next/font/google";
import "./globals.css";

const unifrakturCook = UnifrakturCook({
  weight: "700",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-gothic",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Ticket Challenger - MCR Emporium",
  description:
    "A dark, edgy e-commerce store themed around My Chemical Romance. Browse vintage records, merch, and more.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${unifrakturCook.variable} ${playfairDisplay.variable} ${crimsonText.variable}`}
    >
      <body className="bg-[var(--color-bg)] text-[var(--color-text)] font-[var(--font-body)] antialiased min-h-screen bg-distressed">
        {children}
      </body>
    </html>
  );
}