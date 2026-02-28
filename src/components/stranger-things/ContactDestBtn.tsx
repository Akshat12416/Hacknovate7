"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type TransportMode = "WALK" | "TRAIN" | "BUS" | "AIR";

const MODE_ICONS: Record<TransportMode, string> = {
  WALK: "⟶",
  TRAIN: "⟶",
  BUS:   "⟶",
  AIR:   "⟶",
};

// Tiny crack paths per button (viewBox 0 0 100 32)
const BTN_CRACKS = [
  "M 0 10 L 5 15 L 2 22",
  "M 100 8  L 95 13 L 98 20",
  "M 30 0  L 28 6  L 33 10",
  "M 70 32 L 72 26 L 67 22",
];

interface FireButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FireModeButton({ label, active, onClick }: FireButtonProps) {
  const btnRef    = useRef<HTMLButtonElement>(null);
  const glowRef   = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const coreRefs  = useRef<(SVGPathElement | null)[]>([]);
  const bloomRefs = useRef<(SVGPathElement | null)[]>([]);
  const ctxRef    = useRef<gsap.Context | null>(null);

  // Re-run animation when active state changes
  useEffect(() => {
    if (!btnRef.current) return;

    ctxRef.current?.revert();
    ctxRef.current = gsap.context(() => {

      if (active) {
        // Active: glow pulses, border brightens
        gsap.to(glowRef.current, {
          opacity: 0.7,
          scale: 1.08,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(borderRef.current, {
          opacity: 1,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Animate cracks only when active
        BTN_CRACKS.forEach((_, i) => {
          const core  = coreRefs.current[i];
          const bloom = bloomRefs.current[i];
          if (!core) return;

          const len = core.getTotalLength?.() ?? 15;
          gsap.set(core,  { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
          if (bloom) gsap.set(bloom, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });

          const run = () => {
            const drawDur  = gsap.utils.random(0.15, 0.35) as number;
            const coreMax  = gsap.utils.random(0.3, 0.5)   as number;

            const tl = gsap.timeline({
              onComplete: () => {
                gsap.delayedCall(gsap.utils.random(1.5, 5) as number, run);
              },
            });

            tl.to(core, { strokeDashoffset: 0, opacity: coreMax, duration: drawDur, ease: "power3.out" }, 0);
            if (bloom) tl.to(bloom, { strokeDashoffset: 0, opacity: coreMax * 0.4, duration: drawDur, ease: "power3.out" }, 0);

            const pulses = Math.floor(gsap.utils.random(2, 6) as number);
            for (let p = 0; p < pulses; p++) {
              const fo = gsap.utils.random(0.05, 0.45) as number;
              const fd = gsap.utils.random(0.05, 0.15) as number;
              tl.to(core,  { opacity: fo,        duration: fd, ease: "none" });
              if (bloom) tl.to(bloom, { opacity: fo * 0.4, duration: fd, ease: "none" }, "<");
            }

            const fadeDur = gsap.utils.random(0.2, 0.5) as number;
            tl.to(core,  { opacity: 0, strokeDashoffset: len, duration: fadeDur, ease: "power2.in" });
            if (bloom) tl.to(bloom, { opacity: 0, strokeDashoffset: len, duration: fadeDur, ease: "power2.in" }, "<");
          };

          gsap.delayedCall((gsap.utils.random(0, 1.5) as number) + i * 0.2, run);
        });

      } else {
        // Inactive: dim everything
        gsap.set(glowRef.current,  { opacity: 0 });
        gsap.set(borderRef.current, { opacity: 0.15 });
        coreRefs.current.forEach(c  => c  && gsap.set(c,  { opacity: 0 }));
        bloomRefs.current.forEach(b => b  && gsap.set(b,  { opacity: 0 }));
      }

    }, btnRef);

    return () => ctxRef.current?.revert();
  }, [active]);

  const onEnter = () => {
    if (active) return;
    gsap.to(borderRef.current, { opacity: 0.45, duration: 0.25, ease: "power2.out" });
    gsap.to(glowRef.current,   { opacity: 0.25, duration: 0.25, ease: "power2.out" });
  };
  const onLeave = () => {
    if (active) return;
    gsap.to(borderRef.current, { opacity: 0.15, duration: 0.3, ease: "power2.out" });
    gsap.to(glowRef.current,   { opacity: 0,    duration: 0.3, ease: "power2.out" });
  };
  const onDown = () => gsap.to(btnRef.current, { scale: 0.94, duration: 0.1, ease: "power2.in",         overwrite: true });
  const onUp   = () => gsap.to(btnRef.current, { scale: 1,    duration: 0.3, ease: "elastic.out(1,0.5)", overwrite: true });

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseDown={onDown}
      onMouseUp={onUp}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "5px",
        padding: "7px 14px",
        fontSize: "9px",
        fontWeight: 700,
        letterSpacing: "3px",
        textTransform: "uppercase",
        fontFamily: "'Cinzel', serif",
        color: active ? "#ffd5a8" : "#4a4035",
        background: active
          ? "linear-gradient(180deg, #180000 0%, #2c0000 50%, #180000 100%)"
          : "linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)",
        border: "none",
        borderRadius: "4px",
        outline: "none",
        cursor: "pointer",
        overflow: "visible",
        transition: "color 0.3s ease",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        boxShadow: active
          ? `0 0 0 1px rgba(255,65,15,0.7),
             0 0 0 2.5px rgba(140,10,0,0.4),
             0 0 14px rgba(255,35,0,0.5),
             0 0 35px rgba(180,8,0,0.2),
             inset 0 1px 0 rgba(255,80,20,0.12),
             inset 0 -1px 0 rgba(0,0,0,0.6)`
          : `0 0 0 1px rgba(255,255,255,0.04),
             inset 0 1px 0 rgba(255,255,255,0.03)`,
        textShadow: active
          ? `0 0 6px rgba(255,80,0,0.9), 0 0 14px rgba(255,25,0,0.5)`
          : "none",
      }}
    >
      {/* Outer glow blob */}
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          inset: "-6px",
          borderRadius: "8px",
          background:
            "radial-gradient(ellipse 90% 60% at 50% 60%, rgba(255,25,0,0.4) 0%, rgba(180,10,0,0.2) 45%, transparent 72%)",
          filter: "blur(10px)",
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      {/* Animated border ring */}
      <div
        ref={borderRef}
        style={{
          position: "absolute",
          inset: "-1px",
          borderRadius: "5px",
          border: active
            ? "1px solid rgba(255,68,15,0.8)"
            : "1px solid rgba(255,255,255,0.06)",
          boxShadow: active
            ? `0 0 5px rgba(255,55,0,0.8), 0 0 12px rgba(255,25,0,0.4), inset 0 0 4px rgba(255,40,0,0.2)`
            : "none",
          opacity: active ? 1 : 0.15,
          pointerEvents: "none",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
      />

      {/* SVG crack layer — only meaningful when active */}
      <svg
        viewBox="0 0 100 32"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
          pointerEvents: "none",
          zIndex: 3,
        }}
      >
        <defs>
          <filter id="fb-btn-bloom" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </filter>
          <filter id="fb-btn-sharp" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.25" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {BTN_CRACKS.map((d, i) => (
          <path
            key={"bloom-" + i}
            ref={(el) => { bloomRefs.current[i] = el; }}
            d={d} fill="none"
            stroke={i % 2 === 0 ? "#ff3300" : "#ff6600"}
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            filter="url(#fb-btn-bloom)"
          />
        ))}
        {BTN_CRACKS.map((d, i) => (
          <path
            key={"core-" + i}
            ref={(el) => { coreRefs.current[i] = el; }}
            d={d} fill="none"
            stroke={i % 3 === 0 ? "#ffffff" : i % 3 === 1 ? "#fff0d0" : "#ffd090"}
            strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"
            filter="url(#fb-btn-sharp)"
          />
        ))}
      </svg>

      {/* Inner lava sweep */}
      {active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            borderRadius: "4px",
            pointerEvents: "none",
          }}
        >
          <div
            className="fb-sweep"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "50%",
              height: "100%",
              background:
                "linear-gradient(105deg, transparent 20%, rgba(255,80,10,0.14) 50%, transparent 80%)",
              mixBlendMode: "screen",
            }}
          />
        </div>
      )}

      {/* Label */}
      <span style={{ position: "relative", zIndex: 4 }}>BY {label}</span>
    </button>
  );
}

interface TransportModeSelectorProps {
  selectedMode: TransportMode;
  setSelectedMode: (mode: TransportMode) => void;
}

export default function TransportModeSelector({
  selectedMode,
  setSelectedMode,
}: TransportModeSelectorProps) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&display=swap');
        @keyframes fb-sweep {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(220%);  }
        }
        .fb-sweep { animation: fb-sweep 3.5s linear infinite; }
      `}</style>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {(["WALK", "TRAIN", "BUS", "AIR"] as TransportMode[]).map((mode) => (
          <FireModeButton
            key={mode}
            label={mode}
            active={selectedMode === mode}
            onClick={() => setSelectedMode(mode)}
          />
        ))}
      </div>
    </>
  );
}