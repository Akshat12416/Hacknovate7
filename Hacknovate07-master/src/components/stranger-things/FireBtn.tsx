"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface FieryButtonProps {
  label?: string;
  onClick?: () => void;
  href?: string;                // renders as <a> if provided
  download?: boolean | string;  // NEW: Pass true or a filename string
  width?: string | number;      // e.g. "100%", 320, "auto"
  height?: string | number;     // e.g. 48, "3rem"
  fontSize?: string | number;   // e.g. 12, "0.75rem"
  className?: string;           // extra classes on the wrapper
}

const CRACKS = [
  "M 0 42 L 8 36 L 4 28 L 14 20",
  "M 8 36 L 18 38",
  "M 300 10 L 291 17 L 296 25 L 284 32",
  "M 291 17 L 281 14",
  "M 22 0 L 26 9 L 19 15",
  "M 278 52 L 273 43 L 281 37",
  "M 148 0 L 144 8 L 151 13 L 146 20",
  "M 160 52 L 164 43 L 157 38",
  "M 0 28 L 9 24 L 5 18",
  "M 300 32 L 291 27 L 295 21",
];

// Normalise number | string → CSS string
const toCss = (val: string | number | undefined, fallback: string): string => {
  if (val === undefined) return fallback;
  return typeof val === "number" ? `${val}px` : val;
};

export default function FieryButton({
  label    = "Send Message",
  onClick,
  href,
  download, // <--- Destructured here
  width,
  height,
  fontSize,
  className = "",
}: FieryButtonProps) {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const innerRef  = useRef<HTMLElement>(null);   // button OR anchor
  const glowRef   = useRef<HTMLDivElement>(null);
  const sparksRef = useRef<(HTMLSpanElement | null)[]>([]);
  const bloomRefs = useRef<(SVGPathElement | null)[]>([]);
  const coreRefs  = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    if (!innerRef.current) return;

    const ctx = gsap.context(() => {

      gsap.to(glowRef.current, {
        opacity: 0.85, scale: 1.04, duration: 2,
        repeat: -1, yoyo: true, ease: "sine.inOut",
      });

      gsap.to(innerRef.current, {
        scale: 1.01, duration: 2.8,
        repeat: -1, yoyo: true, ease: "sine.inOut",
      });

      // Crack animations
      CRACKS.forEach((_, i) => {
        const core  = coreRefs.current[i];
        const bloom = bloomRefs.current[i];
        if (!core) return;

        const len = core.getTotalLength?.() ?? 20;
        gsap.set(core,  { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
        if (bloom) gsap.set(bloom, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });

        const run = () => {
          const drawDur  = gsap.utils.random(0.25, 0.5) as number;
          const coreMax  = gsap.utils.random(0.35, 0.55) as number;
          const bloomMax = coreMax * 0.45;

          const tl = gsap.timeline({
            onComplete: () => { gsap.delayedCall(gsap.utils.random(2, 7) as number, run); },
          });

          tl.to(core,  { strokeDashoffset: 0, opacity: coreMax,  duration: drawDur, ease: "power3.out" }, 0);
          if (bloom) tl.to(bloom, { strokeDashoffset: 0, opacity: bloomMax, duration: drawDur, ease: "power3.out" }, 0);

          const pulses = Math.floor(gsap.utils.random(3, 8) as number);
          for (let p = 0; p < pulses; p++) {
            const fo = gsap.utils.random(0.05, 0.5) as number;
            const fd = gsap.utils.random(0.06, 0.2) as number;
            tl.to(core,  { opacity: fo,        duration: fd, ease: "none" });
            if (bloom) tl.to(bloom, { opacity: fo * 0.45, duration: fd, ease: "none" }, "<");
          }

          const fadeDur = gsap.utils.random(0.35, 0.7) as number;
          tl.to(core,  { opacity: 0, strokeDashoffset: len, duration: fadeDur, ease: "power2.in" });
          if (bloom) tl.to(bloom, { opacity: 0, strokeDashoffset: len, duration: fadeDur, ease: "power2.in" }, "<");
        };

        gsap.delayedCall((gsap.utils.random(0, 3) as number) + i * 0.35, run);
      });

      // Spark animations
      sparksRef.current.forEach((spark, i) => {
        if (!spark) return;
        const run = () => {
          const sx = gsap.utils.random(-130, 130) as number;
          const dx = gsap.utils.random(-28, 28)   as number;
          const h  = gsap.utils.random(18, 52)    as number;
          const d  = gsap.utils.random(0.9, 2.1)  as number;
          const sz = gsap.utils.random(1.5, 4)    as number;

          gsap.set(spark, { x: sx, y: 0, opacity: 0, width: sz, height: sz });
          gsap.to(spark, {
            x: sx + dx, y: -h,
            opacity: gsap.utils.random(0.45, 0.9) as number,
            duration: d * 0.35, ease: "power2.out",
            onComplete: () => {
              gsap.to(spark, {
                y: -(h + (gsap.utils.random(4, 15) as number)),
                opacity: 0, duration: d * 0.65, ease: "power1.in",
                onComplete: () => { gsap.delayedCall(gsap.utils.random(0.1, 2) as number, run); },
              });
            },
          });
        };
        gsap.delayedCall((i / sparksRef.current.length) * 3, run);
      });

    }, wrapRef);

    return () => ctx.revert();
  }, []);

  const onEnter = () => {
    gsap.to(innerRef.current, { scale: 1.035, duration: 0.28, ease: "power2.out",         overwrite: true });
    gsap.to(glowRef.current,  { opacity: 1, scale: 1.1, duration: 0.28, ease: "power2.out" });
  };
  const onLeave = () => {
    gsap.to(innerRef.current, { scale: 1, duration: 0.5, ease: "elastic.out(1,0.5)",        overwrite: true });
    gsap.to(glowRef.current,  { opacity: 0.5, scale: 1, duration: 0.4, ease: "power2.out"  });
  };
  const onDown = () => gsap.to(innerRef.current, { scale: 0.97,  duration: 0.1,  ease: "power2.in",         overwrite: true });
  const onUp   = () => gsap.to(innerRef.current, { scale: 1.035, duration: 0.22, ease: "elastic.out(1,0.5)", overwrite: true });

  // ── Shared style for <button> or <a> ──────────────────────
  const innerStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width:    toCss(width,    "auto"),
    height:   toCss(height,   "auto"),
    padding:  height ? "0 44px" : "11px 44px",   // no vertical padding if height is fixed
    minWidth: width  ? undefined : "220px",
    fontSize: toCss(fontSize, "12px"),
    fontWeight: 700,
    letterSpacing: "4px",
    textTransform: "uppercase",
    fontFamily: "'Cinzel', serif",
    color: "#ffd5a8",
    background: "linear-gradient(180deg, #120000 0%, #240000 50%, #120000 100%)",
    border: "none",
    borderRadius: "5px",
    outline: "none",
    cursor: "pointer",
    overflow: "visible",
    textDecoration: "none",
    boxSizing: "border-box",
    boxShadow: `
      0 0 0 1.5px rgba(255,70,15,0.9),
      0 0 0 4px   rgba(150,10,0,0.5),
      0 0 22px    rgba(255,40,0,0.7),
      0 0 55px    rgba(200,8,0,0.32),
      inset 0 1px 0 rgba(255,100,30,0.15),
      inset 0 -1px 0 rgba(0,0,0,0.7)
    `,
    textShadow: `
      0 0 5px  rgba(255,80,0,1),
      0 0 18px rgba(255,25,0,0.7),
      0 1px 0  rgba(0,0,0,0.95)
    `,
  };

  // ── Shared inner JSX ──────────────────────────────────────
  const innerChildren = (
    <>
      {/* Inner ember glow */}
      <div className="fb-ember" style={{
        position: "absolute", inset: 0, borderRadius: "5px",
        background: "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,60,0,0.35) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Lava sweep shimmer */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "5px", pointerEvents: "none" }}>
        <div className="fb-sweep" style={{
          position: "absolute", top: 0, left: 0, width: "45%", height: "100%",
          background: "linear-gradient(105deg, transparent 20%, rgba(255,90,20,0.18) 50%, transparent 80%)",
          mixBlendMode: "screen",
        }} />
      </div>

      {/* Animated neon border ring */}
      <div className="fb-border" style={{
        position: "absolute", inset: "-2px", borderRadius: "7px",
        border: "1.5px solid rgba(255,72,18,0.75)",
        boxShadow: `0 0 7px rgba(255,60,0,0.9), 0 0 18px rgba(255,30,0,0.5), inset 0 0 7px rgba(255,45,0,0.28)`,
        pointerEvents: "none",
      }} />

      {/* SVG Crack layers */}
      <svg viewBox="0 0 300 52" preserveAspectRatio="none" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        overflow: "visible", pointerEvents: "none", zIndex: 4,
      }}>
        <defs>
          <filter id="fb-bloom" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
          <filter id="fb-sharp" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {CRACKS.map((d, i) => (
          <path key={"bloom-" + i} ref={(el) => { bloomRefs.current[i] = el; }}
            d={d} fill="none" stroke={i % 2 === 0 ? "#ff3300" : "#ff6600"}
            strokeWidth={i < 4 ? "2.5" : "1.8"} strokeLinecap="round" strokeLinejoin="round"
            filter="url(#fb-bloom)" />
        ))}
        {CRACKS.map((d, i) => (
          <path key={"core-" + i} ref={(el) => { coreRefs.current[i] = el; }}
            d={d} fill="none"
            stroke={i % 4 === 0 ? "#ffffff" : i % 4 === 1 ? "#fff5e0" : i % 4 === 2 ? "#ffe8c0" : "#ffcc88"}
            strokeWidth={i < 4 ? "0.6" : "0.4"} strokeLinecap="round" strokeLinejoin="round"
            filter="url(#fb-sharp)" />
        ))}
      </svg>

      {/* Label */}
      <span style={{ position: "relative", zIndex: 5 }}>{label}</span>

      {/* Sparks */}
      {Array.from({ length: 14 }).map((_, i) => (
        <span key={i} ref={(el) => { sparksRef.current[i] = el; }}
          style={{
            position: "absolute", width: "3px", height: "3px", borderRadius: "50%",
            background: i % 3 === 0 ? "#ff8833" : i % 3 === 1 ? "#ff3300" : "#ffdd44",
            left: "50%", top: "0", transform: "translate(-50%, 0)",
            pointerEvents: "none", filter: "blur(0.5px)", opacity: 0, zIndex: 8,
          }}
        />
      ))}
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&display=swap');
        .fb-wrap { isolation: isolate; }
        .fb-wrap *, .fb-wrap *::before, .fb-wrap *::after { box-sizing: border-box; }
        @keyframes fb-border-pulse {
          0%,100% { opacity: 0.8;  filter: brightness(1);   }
          35%      { opacity: 1;    filter: brightness(1.6); }
          65%      { opacity: 0.55; filter: brightness(0.8); }
        }
        @keyframes fb-lava-sweep {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(120%);  }
        }
        @keyframes fb-inner-ember {
          0%,100% { opacity: 0.08; }
          50%      { opacity: 0.2;  }
        }
        .fb-border { animation: fb-border-pulse 3s ease-in-out infinite; }
        .fb-sweep  { animation: fb-lava-sweep 3.5s linear infinite; }
        .fb-ember  { animation: fb-inner-ember 3.2s ease-in-out infinite; }
      `}</style>

      <div
        ref={wrapRef}
        className={`fb-wrap ${className}`}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "18px 26px",
          width: width ? toCss(width, "auto") : undefined,
        }}
      >
        {/* Outer ambient glow */}
        <div ref={glowRef} style={{
          position: "absolute", inset: "-8px", borderRadius: "12px",
          background: "radial-gradient(ellipse 88% 58% at 50% 58%, rgba(255,30,0,0.52) 0%, rgba(180,12,0,0.28) 42%, transparent 72%)",
          filter: "blur(22px)", opacity: 0.5, pointerEvents: "none",
        }} />

        {/* Render as <a> if href provided, otherwise <button> */}
        {href ? (
          <a
            ref={innerRef as React.RefObject<HTMLAnchorElement>}
            href={href}
            download={typeof download === "string" ? download : (download ? "" : undefined)}
            target="_blank"
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            onMouseDown={onDown}
            onMouseUp={onUp}
            style={innerStyle}
          >
            {innerChildren}
          </a>
        ) : (
          <button
            ref={innerRef as React.RefObject<HTMLButtonElement>}
            onClick={onClick}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            onMouseDown={onDown}
            onMouseUp={onUp}
            style={innerStyle}
          >
            {innerChildren}
          </button>
        )}
      </div>
    </>
  );
}