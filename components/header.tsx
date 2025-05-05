"use client"

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logos";

export function HeaderWithBackground() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <header className={`fixed top-0 w-full h-fit z-[100] flex justify-center items-center p-6 ${!isHomePage ? 'backdrop-blur-sm' : ''}`}>
      <Link href="/">
        <Logo className="w-24 sm:w-28 text-white" />
      </Link>
    </header>
  );
} 