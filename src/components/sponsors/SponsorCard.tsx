"use client";

import Image from "next/image";
import { Sponsor } from "@/data/sponsors";

interface SponsorCardProps {
  sponsor: Sponsor;
  size?: "sm" | "md" | "lg";
}

export function SponsorCard({ sponsor, size = "md" }: SponsorCardProps) {
  const sizeClasses = {
    sm: "h-20 p-3",
    md: "h-28 p-4",
    lg: "h-36 p-5",
  };

  return (
    <div
      className="sponsor-card group relative flex items-center justify-center transition-all duration-300"
      title={sponsor.name}
    >
      {/* Soft red glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
        style={{
          filter: "blur(20px)",
          background: "radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%)",
        }}
      />



      {/* Logo */}
      <div
        className={`relative w-full ${sizeClasses[size]} flex items-center justify-center`}
      >
        <Image
          src={sponsor.logo}
          alt={sponsor.alt}
          fill
          className="object-contain sponsor-logo transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
          loading="lazy"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
          style={{
            filter: "brightness(0.9) contrast(1.1) drop-shadow(0 0 0 red)",
          }}
        />
      </div>
    </div>
  );
}
