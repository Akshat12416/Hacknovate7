"use client";

import { useRef, useLayoutEffect, useState, useEffect } from "react";
import gsap from "gsap";
import { Navbar } from "@/components/stranger-things/Navbar";

const GLOW_ORBS = [
    { w: 480, h: 480, top: "10%", left: "5%", delay: 0 },
    { w: 320, h: 320, top: "60%", left: "70%", delay: 1.2 },
    { w: 240, h: 240, top: "75%", left: "20%", delay: 2.4 },
    { w: 200, h: 200, top: "15%", left: "80%", delay: 0.8 },
    { w: 160, h: 160, top: "45%", left: "50%", delay: 1.8 },
];

type Dot = {
    id: number;
    size: number;
    top: string;
    left: string;
    delay: number;
    dur: number;
};

export default function EventsPage() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const orbRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [dots, setDots] = useState<Dot[]>([]);

    useEffect(() => {
        setDots(
            Array.from({ length: 18 }, (_, i) => ({
                id: i,
                size: Math.random() * 4 + 2,
                top: `${Math.random() * 90 + 5}%`,
                left: `${Math.random() * 90 + 5}%`,
                delay: Math.random() * 4,
                dur: Math.random() * 3 + 4,
            }))
        );
    }, []);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            orbRefs.current.forEach((el, i) => {
                if (!el) return;
                gsap.to(el, {
                    x: gsap.utils.random(-60, 60),
                    y: gsap.utils.random(-40, 40),
                    scale: 1.08,
                    duration: gsap.utils.random(6, 10),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: GLOW_ORBS[i].delay,
                    force3D: true,
                });
            });

            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.fromTo(sectionRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 })
                .fromTo(headingRef.current, { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 1 }, "-=0.2")
                .fromTo(lineRef.current, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.7, ease: "power2.out" }, "-=0.4")
                .fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.3")
                .fromTo(badgeRef.current, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5 }, "-=0.2");
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <main className="relative bg-black min-h-screen">
            <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} alwaysVisible />
            <section
                ref={sectionRef}
                className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center"
                style={{ opacity: 0 }}
            >
                {/* Cinematic radial background */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        background:
                            "radial-gradient(circle at 50% 50%, rgba(120,0,0,0.18) 0%, rgba(60,0,0,0.08) 40%, black 72%)",
                    }}
                />

                {/* Noise texture */}
                <div
                    className="absolute inset-0 z-[1] pointer-events-none opacity-[0.035]"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
                        backgroundRepeat: "repeat",
                        backgroundSize: "128px 128px",
                    }}
                />

                {/* Vignette */}
                <div
                    className="absolute inset-0 z-[2] pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)",
                    }}
                />

                {/* Ambient glow orbs */}
                {GLOW_ORBS.map((orb, i) => (
                    <div
                        key={i}
                        ref={(el) => { orbRefs.current[i] = el; }}
                        className="absolute rounded-full pointer-events-none z-[1] will-change-transform"
                        style={{
                            width: orb.w,
                            height: orb.h,
                            top: orb.top,
                            left: orb.left,
                            background:
                                "radial-gradient(circle, rgba(180,20,20,0.22) 0%, rgba(120,0,0,0.08) 50%, transparent 70%)",
                            filter: "blur(48px)",
                            opacity: 0.8,
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                ))}

                {/* Floating dots — client-only */}
                {dots.map((dot) => (
                    <div
                        key={dot.id}
                        className="absolute rounded-full pointer-events-none z-[3]"
                        style={{
                            width: dot.size,
                            height: dot.size,
                            top: dot.top,
                            left: dot.left,
                            background: "rgba(220,38,38,0.55)",
                            filter: "blur(1.5px)",
                            animation: `floatDot ${dot.dur}s ${dot.delay}s ease-in-out infinite alternate`,
                        }}
                    />
                ))}

                {/* CRT scanlines */}
                <div
                    className="absolute inset-0 z-[3] opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.3) 50%)",
                        backgroundSize: "100% 4px",
                    }}
                />

                {/* Main content */}
                <div className="relative z-20 text-center px-6 flex flex-col items-center select-none">
                    <p
                        className="uppercase tracking-[0.5em] text-[10px] md:text-xs text-red-600 font-semibold mb-6"
                        style={{ fontFamily: "'ITC Benguiat Std', serif" }}
                    >
                        Hacknovate 7.0
                    </p>

                    <h1
                        ref={headingRef}
                        className="uppercase text-red-600"
                        style={{
                            fontFamily: "'ITC Benguiat Std', serif",
                            fontSize: "clamp(3.5rem, 12vw, 9rem)",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            lineHeight: 1,
                            textShadow:
                                "0 0 60px rgba(220,38,38,0.55), 0 0 120px rgba(180,0,0,0.25), 0 4px 0 rgba(0,0,0,0.9)",
                            willChange: "transform, opacity",
                        }}
                    >
                        EVENTS
                    </h1>

                    {/* Animated underline */}
                    <div
                        ref={lineRef}
                        className="mt-5 mx-auto h-[2px] origin-left"
                        style={{
                            width: 120,
                            background: "linear-gradient(to right, rgba(220,38,38,0.9), rgba(180,0,0,0.4), transparent)",
                            boxShadow: "0 0 12px rgba(220,38,38,0.6)",
                            transform: "scaleX(0)",
                        }}
                    />

                    <p
                        ref={subRef}
                        className="mt-8 text-gray-300 tracking-[0.35em] uppercase"
                        style={{
                            fontFamily: "'ITC Benguiat Std', serif",
                            fontSize: "clamp(0.85rem, 2.5vw, 1.4rem)",
                            fontWeight: 400,
                            opacity: 0,
                            textShadow: "0 2px 8px rgba(0,0,0,0.9)",
                        }}
                    >
                        Coming Soon
                    </p>

                    <div
                        ref={badgeRef}
                        className="mt-12 border border-red-900/40 rounded-lg px-6 py-3 backdrop-blur-sm bg-red-950/10"
                        style={{ opacity: 0 }}
                    >
                        <p
                            className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-red-500/80 italic"
                            style={{ fontFamily: "'ITC Benguiat Std', serif" }}
                        >
                            "The events are yet to be announced"
                        </p>
                    </div>
                </div>

                <style>{`
                    @keyframes floatDot {
                        0%   { transform: translateY(0px) scale(1);     opacity: 0.25; }
                        100% { transform: translateY(-18px) scale(1.3); opacity: 0.55; }
                    }
                `}</style>
            </section>
        </main>
    );
}
