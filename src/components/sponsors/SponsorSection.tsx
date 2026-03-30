"use client";

import { useEffect, useRef } from "react";
import { SponsorCategory } from "@/data/sponsors";
import { SponsorCard } from "./SponsorCard";
import { grayscale } from "three/tsl";

// ─── Community Partners Data ──────────────────────────────────────────────────
interface Partner {
  name: string;
  logo: string;
}

const COMMUNITY_PARTNERS: Partner[] = [
  { name: "AI Verse",     logo: "/assets/com/aiVerse.png" },
  { name: "Code Verse",   logo: "/assets/com/codeVerse.jpg" },
  { name: "Elite Forums", logo: "/assets/com/eliteForums.png" },
  { name: "Event DevX",   logo: "/assets/com/eventDevX.png" },
  { name: "GDG ABESIT",   logo: "/assets/com/gdgAbesit.png" },
  { name: "Hack Shastra", logo: "/assets/com/hackShastra.png" },
  { name: "Idevion",      logo: "/assets/com/idevion.jpeg" },
  { name: "Node Zero",    logo: "/assets/com/nodeZero.jpg" },
  { name: "TDC",          logo: "/assets/com/tdc.png" },
  { name: "Tech Talk",    logo: "/assets/com/techTalk.svg" },
];
 
const MARQUEE_PARTNERS: Partner[] = [...COMMUNITY_PARTNERS, ...COMMUNITY_PARTNERS];
 

// ─── Tier Styles ──────────────────────────────────────────────────────────────
const TIER_STYLES: Record<
  string,
  { badge: string; heading: string; divider: string; glow: string }
> = {
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
  return "md";
}

// ─── Shared scroll-reveal hook ────────────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
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
  return ref;
}

// ─── SponsorSection ───────────────────────────────────────────────────────────
interface SponsorSectionProps {
  category: SponsorCategory;
  index: number;
}

export function SponsorSection({ category, index }: SponsorSectionProps) {
  const sectionRef = useScrollReveal();
  const styles = TIER_STYLES[category.tier] || TIER_STYLES.general;
  const cardSize = getCardSize(category.tier);

  const count = category.sponsors.length;
  let gridCols =
    "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
  if (count === 1)
    gridCols = "grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1";
  else if (count === 2)
    gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2";
  else if (count === 3)
    gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3";

  return (
    <div
      ref={sectionRef}
      className="sponsor-section py-12 px-4"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div
        className="absolute left-1/2 -translate-x-1/2 w-96 h-32 pointer-events-none -z-10 blur-3xl opacity-30"
        style={{ background: `radial-gradient(ellipse, ${styles.glow}, transparent)` }}
        aria-hidden="true"
      />

      <div className="flex items-center gap-6 mb-12">
        <div className={`flex-1 h-px bg-gradient-to-r ${styles.divider}`} />
        <h2
          className={`text-md text-center md:text-3xl font-bold whitespace-nowrap ${styles.heading} drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]`}
          style={{ fontFamily: "'ITC Benguiat Std', serif", letterSpacing: "0.15em" }}
        >
          {category.title.toUpperCase()}
        </h2>
        <div className={`flex-1 h-px bg-gradient-to-l ${styles.divider}`} />
      </div>

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

// ─── PartnerLogo ──────────────────────────────────────────────────────────────
function PartnerLogo({ partner }: { partner: Partner }) {
  return (
    <li style={{ flexShrink: 0, listStyle: "none" }}>
      <div
        style={{
          borderRadius: "10px",
          border: "1px solid rgba(153,27,27,0.5)",
          background: "rgba(255,255,255,0.05)",
          padding: "4px",
          boxSizing: "border-box",
          boxShadow: "0 2px 16px rgba(0,0,0,0.5)",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
          cursor: "pointer",
          overflow: "hidden",
        }}
         className="hover:scale-105 transition-all ease-linear"
        title={partner.name}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "rgba(220,38,38,0.8)";
          el.style.boxShadow = "0 0 18px rgba(220,38,38,0.4), 0 2px 16px rgba(0,0,0,0.5)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "rgba(153,27,27,0.5)";
          el.style.boxShadow = "0 2px 16px rgba(0,0,0,0.5)";
        }}
      >
        <div
          style={{
            width: "clamp(150px, 14vw, 180px)",
            height: "clamp(100px, 8vw, 120px)",
            borderRadius: "7px",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(4px, 1vw, 10px) clamp(6px, 1.5vw, 14px)",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={partner.logo}
            alt={partner.name}
            className="w-80 h-60 md:w-160 md:h-120 lg:w-240 lg:h-160"
            style={{
              objectFit: "contain",
              display: "block",
            }}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.style.display = "none";
              const fallback = img.nextElementSibling as HTMLElement | null;
              if (fallback) fallback.style.display = "flex";
            }}
          />
          <span
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              fontSize: "11px",
              fontWeight: 700,
              color: "#b91c1c",
              textAlign: "center",
              lineHeight: 1.3,
              fontFamily: "'ITC Benguiat Std', serif",
              letterSpacing: "0.08em",
            }}
          >
            {partner.name}
          </span>
        </div>
      </div>
    </li>
  );
}
// ─── CommunityPartners ────────────────────────────────────────────────────────
export function CommunityPartners() {
  const sectionRef = useScrollReveal();
  const trackRef = useRef<HTMLUListElement>(null);
 
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const totalItems = track.children.length; 
    const halfCount = totalItems / 2;          
 
    // Sum up the rendered width of the first `halfCount` items including gap
    let halfWidth = 0;
    const gap = 20; 
    for (let i = 0; i < halfCount; i++) {
      halfWidth += (track.children[i] as HTMLElement).offsetWidth + gap;
    }
 
    const styleId = "community-marquee-style";
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      @keyframes communityMarquee {
        0%   { transform: translateX(0px); }
        100% { transform: translateX(-${halfWidth}px); }
      }
    `;

    // ✅ FIX: Apply the animation directly to the DOM node AFTER the keyframes exist
    track.style.animation = "communityMarquee 25s linear infinite";

  }, []);
 
  return (
    <div
      ref={sectionRef}
      className="sponsor-section relative py-12 overflow-hidden"
    >
      {/* Section glow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-96 h-32 pointer-events-none -z-10 blur-3xl opacity-30"
        style={{ background: "radial-gradient(ellipse, rgba(220,38,38,0.25), transparent)" }}
        aria-hidden="true"
      />
      {/* Heading + Divider */}
      <div className="flex items-center gap-6 mb-12 px-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-700/80 to-transparent" />
        <h2
          className="text-md text-center md:text-3xl font-bold whitespace-nowrap text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]"
          style={{ fontFamily: "'ITC Benguiat Std', serif", letterSpacing: "0.15em" }}
        >
          COMMUNITY PARTNERS
        </h2>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-red-700/80 to-transparent" />
      </div>
 
      {/* Scrolling track */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        {/* Left fade mask */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0, bottom: 0, left: 0,
            width: "80px",
            zIndex: 10,
            pointerEvents: "none",
            background: "linear-gradient(to right, var(--color-background, #000) 0%, transparent 100%)",
          }}
        />
        {/* Right fade mask */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0, bottom: 0, right: 0,
            width: "80px",
            zIndex: 10,
            pointerEvents: "none",
            background: "linear-gradient(to left, var(--color-background, #000) 0%, transparent 100%)",
          }}
        />
 
        <ul
          ref={trackRef}
          aria-label="Community partners"
          style={{
            display: "flex",
            gap: "20px",
            padding: "6px 0",
            margin: 0,
            listStyle: "none",
            minWidth: "max-content",
            // ✅ FIX: Removed inline animation definition and hover events
            willChange: "transform",
            userSelect: "none",
          }}
        >
          {MARQUEE_PARTNERS.map((partner, i) => (
            <PartnerLogo key={`${partner.name}-${i}`} partner={partner} />
          ))}
        </ul>
      </div>
    </div>
  );
}