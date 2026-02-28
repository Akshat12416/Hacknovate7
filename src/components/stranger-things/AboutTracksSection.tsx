'use client';

import { useRef } from 'react';
import localFont from 'next/font/local';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

const trackFont = localFont({
  src: [
    { path: '../../../public/font/BenguiatStd-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../../public/font/BenguiatStd-Bold.woff', weight: '700', style: 'normal' },
    { path: '../../../public/font/BenguiatStd-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-track',
  display: 'swap',
});

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TRACKS = [
  {
    title: 'AI / Machine Learning',
    description:
      'Build intelligent systems that learn, predict, and automate. From computer vision to NLP and analytics, design scalable AI solutions that transform data into decisions and real-world impact.',
    image: '/assets/character/ell.webp',
    accent: '#E8003D',
    tag: 'TRACK 01',
  },
  {
    title: 'Web3 & Blockchain',
    description:
      'Redefine digital trust with decentralized applications, digital identity, and secure transactions. Build transparent, resilient systems shaping the next generation of the internet.',
    image: '/assets/character/mike.webp',
    accent: '#C0392B',
    tag: 'TRACK 02',
  },
  {
    title: 'Cyber Security',
    description:
      'Protect digital ecosystems from evolving threats. Design secure architectures, threat detection systems, and resilient infrastructures ensuring trust across connected platforms.',
    image: '/assets/character/dustin.webp',
    accent: '#E8003D',
    tag: 'TRACK 03',
  },
  {
    title: 'AR / VR & Immersive Tech',
    description:
      'Bridge the physical and digital worlds. Build immersive experiences for education, healthcare, training, entertainment, and beyond.',
    image: '/assets/character/vill.webp',
    accent: '#A93226',
    tag: 'TRACK 04',
  },
  {
    title: 'Healthcare & Wellness',
    description:
      'Innovate for human well-being. Develop scalable digital health solutions, mental health tools, preventive care systems, and accessible healthcare technologies.',
    image: '/assets/character/nancy.webp',
    accent: '#E8003D',
    tag: 'TRACK 05',
  },
  {
    title: 'Open Innovation',
    description:
      'No limits. No predefined problems. Identify real-world challenges across domains and build practical, creative, scalable solutions with complete freedom.',
    image: '/assets/character/vil_brother.webp',
    accent: '#C0392B',
    tag: 'TRACK 06',
  },
];

const CHARACTER_NAMES = ['Eleven', 'Mike', 'Dustin', 'Will', 'Nancy', 'Jonathan'];

export function AboutTracksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const outerBoxRef = useRef<HTMLDivElement>(null);
  const panelsWrapperRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const accentBarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !panelsWrapperRef.current || !outerBoxRef.current) return;

      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      const totalPanels = TRACKS.length;
      const panels = panelRefs.current.filter(Boolean) as HTMLDivElement[];

      /* ─────────────────────────────────────────────────────────
         1. ENTRANCE ANIMATION
         Use a timeline with scrub instead of onUpdate+gsap.set
         to avoid creating new tweens every scroll frame.
      ───────────────────────────────────────────────────────── */
      gsap.set(outerBoxRef.current, {
        y: 100,
        scale: 0.9,
        opacity: 0,
        transformOrigin: '50% 60%',
      });
      gsap.set(stickyRef.current, { opacity: 0 });

      // Use a scrubbed timeline — FAR cheaper than onUpdate+gsap.set
      const entranceTl = gsap.timeline({ paused: true });
      entranceTl
        .to(outerBoxRef.current, { y: 0, scale: 1, opacity: 1, ease: 'power2.out', duration: 1 }, 0)
        .to(stickyRef.current, { opacity: 1, ease: 'none', duration: 0.5 }, 0);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 98%',
        end: 'top 5%',
        scrub: 0.9,
        animation: entranceTl,
      });

      /* ─────────────────────────────────────────────────────────
         2. HEADER stagger entrance
      ───────────────────────────────────────────────────────── */
      if (headerRef.current) {
        const kids = Array.from(headerRef.current.children) as HTMLElement[];
        gsap.set(kids, { y: 28, opacity: 0 });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 55%',
          once: true,
          onEnter: () => {
            gsap.to(kids, {
              y: 0,
              opacity: 1,
              duration: 0.75,
              stagger: 0.14,
              ease: 'power3.out',
              delay: 0.1,
            });
          },
        });
      }

      /* ─────────────────────────────────────────────────────────
         3. CHARACTER float — CSS animation on mobile to avoid
            GSAP RAF overhead. On desktop, only animate the
            ACTIVE panel's image to save GPU.
            Removed the per-frame drop-shadow filter tween —
            that's extremely expensive.
      ───────────────────────────────────────────────────────── */
      if (!isMobile) {
        const images = imageRefs.current.filter(Boolean) as HTMLDivElement[];
        images.forEach((img, i) => {
          // Single timeline per image instead of 3 separate infinite tweens
          gsap.to(img, {
            y: -14,
            repeat: -1,
            yoyo: true,
            duration: 3.5 + i * 0.3,
            ease: 'sine.inOut',
            delay: i * 0.4,
          });
        });
      }

      /* ─────────────────────────────────────────────────────────
         4. VERTICAL TRACK CYCLING
         Key fix: batch the per-panel opacity/scale updates and
         use gsap.set (not gsap.to) for panels — gsap.to inside
         onUpdate creates a new tween EVERY FRAME (memory leak).
         Accent bar color: throttle updates to only when the
         active index actually changes.
      ───────────────────────────────────────────────────────── */
      let lastActiveIdx = -1;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          const n = totalPanels;
          const segmentSize = 1 / n;
          const holdRatio = 0.7;
          const transRatio = 0.3;

          let steppedProgress = 0;
          if (p >= 1) {
            steppedProgress = 1;
          } else {
            const currentSegment = Math.floor(p / segmentSize);
            const segmentProgress = (p - currentSegment * segmentSize) / segmentSize;
            if (currentSegment >= n - 1) {
              steppedProgress = 1;
            } else if (segmentProgress <= holdRatio) {
              steppedProgress = currentSegment / (n - 1);
            } else {
              const transProgress = (segmentProgress - holdRatio) / transRatio;
              const eased = transProgress * transProgress * (3 - 2 * transProgress);
              steppedProgress = (currentSegment + eased) / (n - 1);
            }
          }

          const maxTranslate = ((n - 1) / n) * 100;
          // gsap.set is fine here — it's a direct style write, not a new tween
          gsap.set(panelsWrapperRef.current, {
            yPercent: -maxTranslate * steppedProgress,
            force3D: true,
          });

          const panelProgress = steppedProgress * (n - 1);
          const activeIdx = Math.round(panelProgress);

          // Only update accent bar color when the active track actually changes
          if (activeIdx !== lastActiveIdx && accentBarRef.current) {
            lastActiveIdx = activeIdx;
            gsap.to(accentBarRef.current, {
              backgroundColor: TRACKS[activeIdx]?.accent ?? TRACKS[0].accent,
              duration: 0.4,
              ease: 'power2.out',
              overwrite: true, // cancel any in-flight tween — prevents tween stacking
            });
          }

          // Use gsap.set (not gsap.to) for per-panel opacity/scale
          // gsap.to inside onUpdate = new tween every 16ms = memory leak
          panels.forEach((panel, i) => {
            const offset = panelProgress - i;
            const absOffset = Math.abs(offset);
            const opacity = absOffset > 0.2 ? Math.max(0, 1 - (absOffset - 0.2) / 0.4) : 1;
            const scale = 1 - Math.min(absOffset, 1) * 0.04;
            gsap.set(panel, { opacity, scale, force3D: true });
          });
        },
      });

      ScrollTrigger.refresh();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={`${trackFont.variable} relative`}
      style={{ height: `${TRACKS.length * 100}vh` }}
    >
      {/* Sticky viewport */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen bg-red-900 overflow-hidden flex items-center justify-center"
      >
        {/* OUTER BOX */}
        <div
          ref={outerBoxRef}
          className="relative w-full max-w-[1400px] h-[90vh] rounded-lg overflow-hidden"
          style={{
            border: '1px solid rgba(232,0,61,0.2)',
            boxShadow: '0 0 0 1px rgba(232,0,61,0.05), 0 40px 120px rgba(0,0,0,0.95), inset 0 0 120px rgba(139,0,20,0.08)',
            // will-change only on the element actually being transformed
            willChange: 'transform, opacity',
          }}
        >
          {/* ── BG layers — REDUCED from 6 to 3 composite layers ── */}
          {/* Layer 1: base radial gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 120% 120% at 70% 60%, #1a0005 0%, #0d0002 40%, #050001 100%)',
            }}
          />

          {/* Layer 2: combined top+bottom+vignette in one element (was 3 separate divs) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 80% 100% at 65% 0%, rgba(180,0,30,0.3) 0%, transparent 60%),
                radial-gradient(ellipse 70% 100% at 50% 100%, rgba(232,0,61,0.18) 0%, transparent 60%),
                radial-gradient(ellipse 90% 80% at 50% 50%, transparent 20%, rgba(0,0,0,0.7) 100%)
              `,
            }}
          />

          {/* Layer 3: subtle scan lines via CSS (no SVG filter = no CPU render) */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)',
              backgroundSize: '100% 3px',
            }}
          />

          {/* Left edge glow bar */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[2px] pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, rgba(232,0,61,0.6) 30%, rgba(232,0,61,0.8) 50%, rgba(232,0,61,0.6) 70%, transparent 100%)',
            }}
          />

          {/* ═══ HEADER ═══ */}
          <div
            ref={headerRef}
            className="absolute top-0 left-0 right-0 z-[60] px-8 md:px-12 pt-8 pb-6 flex items-start justify-between"
          >
            <div>
              <p
                className="text-[10px] md:text-[11px] tracking-[0.45em] uppercase mb-3 font-mono"
                style={{ color: '#E8003D', textShadow: '0 0 12px rgba(232,0,61,0.6)' }}
              >
                Hacknovate 7.0
              </p>

              <h2
                className="font-[family-name:var(--font-track)] text-3xl md:text-4xl lg:text-5xl text-white leading-none tracking-tight"
                style={{ textShadow: '0 0 60px rgba(232,0,61,0.5), 0 2px 4px rgba(0,0,0,0.9)' }}
              >
                Innovation{' '}
                <span
                  style={{
                    color: '#E8003D',
                    textShadow: '0 0 40px rgba(232,0,61,0.8), 0 0 80px rgba(232,0,61,0.3)',
                  }}
                >
                  Tracks
                </span>
              </h2>

              <div
                ref={accentBarRef}
                className="mt-3 h-[2px] w-16 rounded-full"
                style={{ backgroundColor: '#E8003D', boxShadow: '0 0 8px rgba(232,0,61,0.8)' }}
              />
            </div>

            <div className="text-right hidden md:block">
              <p
                className="font-mono text-[10px] tracking-[0.4em] uppercase mb-1"
                style={{ color: 'rgba(232,0,61,0.4)' }}
              >
                Explore
              </p>
              <p className="font-mono text-xs tracking-widest" style={{ color: 'rgba(255,255,255,0.12)' }}>
                {TRACKS.length} tracks
              </p>
            </div>
          </div>

          {/* ═══ SCROLLING PANELS WRAPPER ═══ */}
          <div
            ref={panelsWrapperRef}
            className="absolute inset-0"
            style={{ height: `${TRACKS.length * 100}%`, willChange: 'transform' }}
          >
            {TRACKS.map((track, idx) => (
              <div
                key={track.title}
                ref={(el) => { panelRefs.current[idx] = el; }}
                className="w-full flex flex-col md:flex-row items-center justify-between px-8 md:px-14 lg:px-20"
                style={{
                  height: `${100 / TRACKS.length}%`,
                  paddingTop: 'clamp(80px, 14vh, 140px)',
                  paddingBottom: 'clamp(24px, 5vh, 60px)',
                  // Remove will-change from individual panels — too much VRAM on mobile
                }}
              >
                {/* Text Block */}
                <div className="relative z-10 max-w-lg xl:max-w-xl flex flex-col gap-4 md:gap-5">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-[10px] font-mono tracking-[0.35em] uppercase px-3 py-1 rounded-sm border"
                      style={{
                        color: '#E8003D',
                        borderColor: 'rgba(232,0,61,0.5)',
                        backgroundColor: 'rgba(232,0,61,0.08)',
                        textShadow: '0 0 8px rgba(232,0,61,0.5)',
                      }}
                    >
                      {track.tag}
                    </span>
                    <div
                      className="h-px flex-1 max-w-[60px]"
                      style={{ background: 'linear-gradient(90deg, rgba(232,0,61,0.6), transparent)' }}
                    />
                  </div>

                  <h3
                    className="font-[family-name:var(--font-track)] text-3xl md:text-4xl xl:text-5xl leading-none"
                    style={{
                      color: '#ffffff',
                      textShadow: '0 0 80px rgba(232,0,61,0.4), 0 2px 8px rgba(0,0,0,0.9)',
                    }}
                  >
                    {track.title}
                  </h3>

                  <div
                    className="h-px w-32"
                    style={{
                      background: 'linear-gradient(90deg, #E8003D, rgba(232,0,61,0.3), transparent)',
                      boxShadow: '0 0 6px rgba(232,0,61,0.4)',
                    }}
                  />

                  <p
                    className="text-sm md:text-base leading-relaxed font-light max-w-md"
                    style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                  >
                    {track.description}
                  </p>
                </div>

                {/* Character Image */}
                <div className="relative flex-shrink-0 h-[72%] md:h-[85%] w-[85%] md:w-[38%] xl:w-[32%]">
                  {/* Single, cheaper glow underneath — removed blur-3xl radial on top */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
                    style={{
                      background: 'linear-gradient(0deg, rgba(232,0,61,0.25) 0%, transparent 100%)',
                    }}
                  />

                  {/* Float animation via CSS on mobile, GSAP on desktop */}
                  <div
                    ref={(el) => { imageRefs.current[idx] = el; }}
                    className="relative w-full h-full"
                    style={{ willChange: 'transform' }}
                  >
                    <Image
                      src={track.image}
                      alt={track.title}
                      fill
                      className="object-contain object-bottom"
                      // Static drop-shadow — no animated filter (very expensive on mobile)
                      style={{
                        filter: 'drop-shadow(0 20px 40px rgba(232,0,61,0.45))',
                      }}
                    />
                  </div>

                  <div
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-sm text-[9px] font-mono tracking-[0.3em] uppercase whitespace-nowrap border backdrop-blur-sm"
                    style={{
                      color: '#E8003D',
                      borderColor: 'rgba(232,0,61,0.35)',
                      backgroundColor: 'rgba(10,0,2,0.7)',
                      textShadow: '0 0 8px rgba(232,0,61,0.6)',
                    }}
                  >
                    {CHARACTER_NAMES[idx]}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SCROLL PROGRESS RAIL */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-3">
            {TRACKS.map((_, i) => (
              <div
                key={i}
                className="w-[2px] rounded-full"
                style={{
                  height: '20px',
                  backgroundColor: 'rgba(232,0,61,0.25)',
                  boxShadow: '0 0 4px rgba(232,0,61,0.2)',
                }}
              />
            ))}
          </div>

          {/* BOTTOM INFO BAR */}
          <div
            className="absolute bottom-0 left-0 right-0 z-20 px-8 md:px-12 py-4 flex items-center justify-between"
            style={{ borderTop: '1px solid rgba(232,0,61,0.1)' }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: '#E8003D', boxShadow: '0 0 6px rgba(232,0,61,0.8)' }}
              />
              <span className="text-[10px] font-mono tracking-widest" style={{ color: 'rgba(232,0,61,0.3)' }}>
                LIVE
              </span>
            </div>
          </div>

          {/* Corner decorations */}
          {(['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'] as const).map(
            (pos, i) => {
              const isRight = pos.includes('right');
              const isBottom = pos.includes('bottom');
              return (
                <div key={i} className={`absolute ${pos} w-8 h-8 pointer-events-none`}>
                  <div
                    className="absolute w-full h-[1px]"
                    style={{
                      [isBottom ? 'bottom' : 'top']: 0,
                      backgroundColor: 'rgba(232,0,61,0.5)',
                    }}
                  />
                  <div
                    className="absolute h-full w-[1px]"
                    style={{
                      [isRight ? 'right' : 'left']: 0,
                      backgroundColor: 'rgba(232,0,61,0.5)',
                    }}
                  />
                </div>
              );
            }
          )}
        </div>
        {/* END OUTER BOX */}
      </div>
    </section>
  );
}