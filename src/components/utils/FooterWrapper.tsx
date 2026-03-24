"use client";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/stranger-things/Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  if (pathname === "/teams") return null;
  return <Footer />;
}