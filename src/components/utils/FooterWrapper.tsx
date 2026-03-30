"use client";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/stranger-things/Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  if (pathname === "/teams" || pathname === "/sponsors" || pathname === "/schedule") return null;
  return <Footer />;
}