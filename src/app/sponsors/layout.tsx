import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Sponsors — HACKNOVATE 7.0",
  description: "Meet the amazing sponsors powering Hacknovate 7.0 — the ultimate tech hackathon.",
};

export default function SponsorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
