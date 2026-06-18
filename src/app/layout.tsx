import type { Metadata } from "next";
import "./globals.css";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[var(--color-bg)] text-[var(--color-text)] font-[var(--font-body)] antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}