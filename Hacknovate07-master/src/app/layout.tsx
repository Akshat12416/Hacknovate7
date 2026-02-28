import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/shared/SmoothScrollProvider";
import { NavigationLogo } from "@/components/stranger-things/NavigationLogo";
import { Footer } from "@/components/stranger-things/Footer";
import { CustomCursor } from "@/components/stranger-things/CustomCursor";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cormorant"
});

export const metadata: Metadata = {
  title: "HACKNOVATE 7.0 - The Finale",
  description: "HACKNOVATE 7.0 — Experience the epic finale.",
  verification: {
    google: "GHtkFMWX2dbjiXRQv8RpqQTKA4cpQpv5J5HSL4FNFLs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${inter.variable} ${cormorant.variable} antialiased selection:bg-red-900 selection:text-white`}
      >
        <SmoothScrollProvider>
          <CustomCursor />
          <NavigationLogo />
          {children}
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
