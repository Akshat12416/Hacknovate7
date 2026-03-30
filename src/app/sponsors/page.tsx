"use client";

import { useState } from "react";
import { Navbar } from "@/components/stranger-things/Navbar";
import { SPONSOR_CATEGORIES } from "@/data/sponsors";
import { CommunityPartners, SponsorSection } from "@/components/sponsors/SponsorSection";

export default function SponsorsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} alwaysVisible />

      {/* ── Background image from sponsors folder with blur ── */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/assets/sponsors/background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(15px) brightness(0.4)",
            transform: "scale(1.1)", // prevent blur edge bleed
          }}
        />
        {/* Layered dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(10,0,0,0.6) 0%, rgba(0,0,0,0.9) 100%)",
          }}
        />
        {/* Crimson ambient glow orbs */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(180,30,30,0.15) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Hero Header ── */}
      <section className="relative z-10 pt-48 pb-16 px-4 text-center">
        <div className="relative inline-block mb-4">
          <span
            className="text-xs font-bold tracking-[0.35em] uppercase px-4 py-2 rounded-full border border-red-700/50 text-red-500"
            style={{
              background: "rgba(180,30,30,0.1)",
              backdropFilter: "blur(8px)",
            }}
          >
            Hacknovate 7.0
          </span>
        </div>

        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mt-4 mb-6 text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]"
          style={{ 
            fontFamily: "'ITC Benguiat Std', serif", 
            lineHeight: 1.1,
            // Removed gradient and animation
          }}
        >
          Our Sponsors
        </h1>

        <p
          className="text-base md:text-lg text-white/70 max-w-xl mx-auto"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          The incredible organisations who make Hacknovate 7.0 possible.
        </p>

        {/* Decorative separator */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-red-600" />
          <div
            className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_15px_#ff0000]"
          />
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-red-600" />
        </div>
      </section>

      {/* ── Sponsor Sections ── */}
      <section className="relative z-10 max-w-7xl mx-auto pb-36 px-4 md:px-8">
        {SPONSOR_CATEGORIES.map((category, idx) => (
          <SponsorSection key={category.title} category={category} index={idx} />
        ))}
        <CommunityPartners/>
      </section>

      {/* ── Bottom fade ── */}
      <div
        className="pointer-events-none fixed bottom-0 inset-x-0 h-32 z-10"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 100%)" }}
        aria-hidden="true"
      />
    </main>
  );
}
