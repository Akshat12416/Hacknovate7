"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const content =
    "Hacknovate 7.0 is a 30-hour International Hybrid Hackathon where ideas feel like discoveries beyond the ordinary. Developers and innovators unite to solve real problems and turn imagination into reality.";

export function AboutHacknovate() {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const isMobile = window.innerWidth < 768;
        const ctx = gsap.context(() => {
            // Ambient glow
            gsap.to(glowRef.current, {
                x: 100,
                y: -50,
                scale: 1.1,
                duration: 15,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                force3D: true,
            });

            // 0. Section Entrance
            gsap.fromTo(
                sectionRef.current,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 90%",
                        end: "top 60%",
                        scrub: isMobile ? 0.8 : 1.5,
                    },
                }
            );

            // Timeline for the pinned sequence
            const tl = gsap.timeline();

            // 1. Logo fades in
            tl.fromTo(
                logoRef.current,
                { opacity: 0, scale: 0.6, filter: isMobile ? "blur(8px)" : "blur(20px)" },
                {
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 1,
                    ease: "expo.out",
                    force3D: true,
                }
            )
                .to({}, { duration: 0.8 })
                .to(logoRef.current, {
                    opacity: 0,
                    scale: 1.2,
                    filter: isMobile ? "blur(8px)" : "blur(15px)",
                    duration: 0.8,
                    ease: "expo.in",
                    force3D: true,
                });

            // 2. Text Reveal - Word by Word with Blur
            const words = gsap.utils.toArray<HTMLElement>(".reveal-word");

            tl.fromTo(
                words,
                {
                    opacity: 0,
                    y: isMobile ? 15 : 30,
                    filter: isMobile ? "blur(6px)" : "blur(15px)",
                    scale: isMobile ? 0.9 : 0.8
                },
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    scale: 1,
                    stagger: isMobile ? 0.1 : 0.15,
                    ease: "power3.out",
                    duration: 1,
                    force3D: true,
                }
            )
                .to({}, { duration: 2.5 }) // Hold the text significantly longer
                // Text fades out
                .to(textRef.current, {
                    opacity: 0,
                    y: isMobile ? -20 : -40,
                    filter: isMobile ? "blur(8px)" : "blur(20px)",
                    duration: 1,
                    ease: "expo.in",
                    force3D: true,
                });

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: "+=350%", // Slowed down significantly for better readability
                pin: true,
                scrub: isMobile ? 1.2 : 1.8,
                animation: tl,
                anticipatePin: 1,
            });

            ScrollTrigger.refresh();
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-[100dvh] bg-black overflow-hidden z-20"
        >
            <div className="absolute inset-0 z-0 will-change-transform">
                <img
                    src="/assets/about hacknovate/Frame126115411.jpeg"
                    alt="About Background"
                    className="w-full h-full object-cover opacity-60 grayscale-[0.1]"
                />
                <div className="absolute inset-0 bg-black/30" />
            </div>

            <div
                ref={glowRef}
                className="absolute w-[500px] h-[500px] rounded-full opacity-[0.06] pointer-events-none z-[1] will-change-transform"
                style={{
                    top: "30%",
                    left: "20%",
                    background: "radial-gradient(circle, rgba(180,30,30,0.8) 0%, rgba(120,0,0,0.4) 50%, transparent 70%)"
                }}
            />

            <div
                className="absolute inset-0 pointer-events-none z-[2]"
                style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(20,0,0,0.6) 100%)" }}
            />

            <div className="absolute inset-0 flex items-center justify-center px-8 md:px-16 lg:px-24 max-w-[1200px] mx-auto z-[60]">
                <p
                    ref={textRef}
                    className="absolute text-white/90 text-[1.4rem] md:text-[2rem] lg:text-[2.75rem] leading-[1.3] font-medium tracking-tight text-center max-w-[1200px] w-full px-4 will-change-[transform,opacity]"
                    style={{
                        fontFamily: "'ITC Benguiat Std', serif",
                        textWrap: "balance" as any
                    }}
                >
                    {content.split(" ").map((word, wIdx) => (
                        <span
                            key={wIdx}
                            className="reveal-word inline-block opacity-0 will-change-[transform,opacity,filter] mr-[0.3em]"
                            style={{ backfaceVisibility: "hidden", transform: "translateZ(0)" }}
                        >
                            {word}
                        </span>
                    ))}
                </p>

                <div
                    ref={logoRef}
                    className="absolute flex flex-col items-center justify-center pointer-events-none opacity-0 will-change-[transform,opacity]"
                >
                    <img
                        src="/navlogo.png"
                        alt="Hacknovate 7.0 Logo"
                        className="h-48 md:h-72 lg:h-96 w-auto drop-shadow-[0_0_40px_rgba(255,0,0,0.4)]"
                    />
                </div>
            </div>
        </section>
    );
}