import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Rubik_Mono_One } from "next/font/google"; // or another Rubik variant
import "./globals.css";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const rubikMono = Rubik_Mono_One({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CardsV3",
  description: "Flashcards App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${rubikMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
