"use client";

import { useEffect, useRef } from "react";
import { SponsorCategory } from "@/data/sponsors";
import { SponsorCard } from "./SponsorCard";

interface SponsorSectionProps {
  category: SponsorCategory;
  index: number;
}

// All tiers use the site's red palette — different red intensities only
const TIER_STYLES: Record<string, { badge: string; heading: string; divider: string; glow: string }> = {
  venue: {
    badge: "from-red-700 to-red-900 text-white",
    heading: "text-red-600",
    divider: "from-transparent via-red-700/80 to-transparent",
    glow: "rgba(220,38,38,0.25)",
  },
  powered: {
    badge: "from-red-600 to-red-800 text-white",
    heading: "text-red-500",
    divider: "from-transparent via-red-600/75 to-transparent",
    glow: "rgba(200,30,30,0.2)",
  },
  gold: {
    badge: "from-yellow-400 to-amber-500 text-black",
    heading: "text-amber-400",
    divider: "from-transparent via-yellow-500/60 to-transparent",
    glow: "rgba(234,179,8,0.2)",
  },
  silver: {
    badge: "from-slate-300 to-slate-400 text-black",
    heading: "text-slate-300",
    divider: "from-transparent via-slate-400/60 to-transparent",
    glow: "rgba(200,200,200,0.15)",
  },
  bronze: {
    badge: "from-orange-500 to-red-600 text-white",
    heading: "text-orange-500",
    divider: "from-transparent via-orange-600/60 to-transparent",
    glow: "rgba(234,88,12,0.2)",
  },
  promo: {
    badge: "from-red-600 to-crimson-800 text-white",
    heading: "text-red-600",
    divider: "from-transparent via-red-600/60 to-transparent",
    glow: "rgba(225,29,72,0.2)",
  },
  food: {
    badge: "from-red-800 to-red-950 text-white",
    heading: "text-red-700",
    divider: "from-transparent via-red-800/60 to-transparent",
    glow: "rgba(185,28,28,0.22)",
  },
  platform: {
    badge: "from-red-600 to-red-800 text-white",
    heading: "text-red-600",
    divider: "from-transparent via-red-600/60 to-transparent",
    glow: "rgba(220,38,38,0.18)",
  },
  beverage: {
    badge: "from-red-500 to-red-700 text-white",
    heading: "text-red-500",
    divider: "from-transparent via-red-500/60 to-transparent",
    glow: "rgba(244,63,94,0.18)",
  },
  general: {
    badge: "from-red-700 to-red-900 text-white",
    heading: "text-red-600",
    divider: "from-transparent via-red-700/60 to-transparent",
    glow: "rgba(180,30,30,0.2)",
  },
  organized: {
    badge: "from-red-600 to-red-800 text-white",
    heading: "text-red-600",
    divider: "from-transparent via-red-600/70 to-transparent",
    glow: "rgba(220,38,38,0.3)",
  },
};

function getCardSize(tier: string): "sm" | "md" | "lg" {
  if (tier === "venue" || tier === "organized" || tier === "powered") return "lg";
  if (tier === "gold" || tier === "silver") return "md";
  return "sm";
}

export function SponsorSection({ category, index }: SponsorSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const styles = TIER_STYLES[category.tier] || TIER_STYLES.general;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("sponsor-section-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cardSize = getCardSize(category.tier);

  const count = category.sponsors.length;
  let gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
  if (count === 1) gridCols = "grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1";
  else if (count === 2) gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2";
  else if (count === 3) gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3";

  return (
    <div
      ref={sectionRef}
      className="sponsor-section py-12 px-4"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Subtle per-section glow behind content */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-96 h-32 pointer-events-none -z-10 blur-3xl opacity-30"
        style={{ background: `radial-gradient(ellipse, ${styles.glow}, transparent)` }}
        aria-hidden="true"
      />

      {/* Inline Heading + Animated Divider */}
      <div className="flex items-center gap-6 mb-12">
        <div className={`flex-1 h-px bg-gradient-to-r ${styles.divider}`} />
        <h2
          className={`text-2xl md:text-3xl font-bold whitespace-nowrap ${styles.heading} drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]`}
          style={{ fontFamily: "'ITC Benguiat Std', serif", letterSpacing: "0.15em" }}
        >
          {category.title.toUpperCase()}
        </h2>
        <div className={`flex-1 h-px bg-gradient-to-l ${styles.divider}`} />
      </div>

      {/* Sponsor grid */}
      <div className={`grid ${gridCols} gap-5 max-w-5xl mx-auto justify-items-center`}>
        {category.sponsors.map((sponsor) => (
          <div
            key={sponsor.name}
            className="w-full"
            style={{ maxWidth: count === 1 ? "320px" : "260px" }}
          >
            <SponsorCard sponsor={sponsor} size={cardSize} />
          </div>
        ))}
      </div>
    </div>
  );
}
