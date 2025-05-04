import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Logo } from "@/components/logos";
import Link from "next/link";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PSST Vodka",
  description: "Premium vodka crafted to perfection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen`}
      >
        <div className="relative h-screen w-screen overflow-hidden">
          <header className="fixed top-0 w-full h-fit z-[100] flex justify-center items-center p-6 bg-black/25 backdrop-blur-sm">
            <Link href="/">
              <Logo className="w-24 sm:w-28 text-white" />
            </Link>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
