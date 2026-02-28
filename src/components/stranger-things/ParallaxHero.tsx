"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Navbar } from "./Navbar";
import { CountdownTimer } from "./CountdownTimer";
import { CustomCursor } from "./CustomCursor";
import CustomButton from "./HeroButton";

gsap.registerPlugin(ScrollTrigger);

export function ParallaxHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLImageElement>(null);
    const leftTreesRef = useRef<HTMLDivElement>(null);
    const rightTreesRef = useRef<HTMLDivElement>(null);
    const fgRef = useRef<HTMLImageElement>(null);
    const brandingRef = useRef<HTMLDivElement>(null);
    const countdownRef = useRef<HTMLDivElement>(null);
    const navLogoRef = useRef<HTMLDivElement>(null);
    const abesitLogoRef = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useGSAP(() => {
        const isMobile = window.innerWidth < 768;
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });

        tl.to(bgRef.current, { y: -100, filter: isMobile ? "blur(2px)" : "blur(5px)", duration: 1, force3D: true }, 0);
        tl.to(leftTreesRef.current, { x: -500, filter: isMobile ? "blur(4px)" : "blur(8px)", duration: 1, force3D: true }, 0);
        tl.to(rightTreesRef.current, { x: 500, filter: isMobile ? "blur(4px)" : "blur(8px)", duration: 1, force3D: true }, 0);
        tl.to(fgRef.current, { y: -120, scale: 2.5, duration: 1, force3D: true }, 0);
        tl.to(countdownRef.current, { y: -120, scale: 0.9, duration: 1, force3D: true }, 0);

        tl.to(brandingRef.current, {
            y: isMobile ? -600 : -400,
            scale: 0.85,
            opacity: 0,
            duration: 1,
            ease: "none",
            force3D: true,
        }, 0);

        gsap.to(brandingRef.current, {
            x: isMobile ? "0%" : "-35%",
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });

    }, { scope: containerRef });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const x = (clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const y = (clientY - window.innerHeight / 2) / (window.innerHeight / 2);

        // Use xPercent/yPercent for mouse parallax to avoid conflict with ScrollTrigger x/y transforms
        gsap.to(bgRef.current, { xPercent: x * 2, yPercent: y * 2, duration: 2, ease: "power2.out", force3D: true });
        gsap.to(leftTreesRef.current, { xPercent: -12 + (x * 2), yPercent: y * 1.5, duration: 2, ease: "power2.out", force3D: true });
        gsap.to(rightTreesRef.current, { xPercent: 12 + (x * 2), yPercent: y * 1.5, duration: 2, ease: "power2.out", force3D: true });
        gsap.to(fgRef.current, { xPercent: -50 + (x * 2), yPercent: y * 1.5, duration: 2, ease: "power2.out", force3D: true });
        gsap.to(countdownRef.current, { xPercent: x * 2, yPercent: y * 2, duration: 2, ease: "power2.out", force3D: true });
        gsap.to(brandingRef.current, { xPercent: x * 1.5, yPercent: y * 1.5, duration: 2, ease: "power2.out", force3D: true });
    };

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        gsap.set([brandingRef.current, countdownRef.current, navLogoRef.current, abesitLogoRef.current], { opacity: 0 });
        // Removed initial opacity set for fgRef (kids) to keep them visible immediately

        tl.fromTo(brandingRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 1.5, delay: 0.3, immediateRender: false }
        )
            .fromTo([navLogoRef.current, abesitLogoRef.current],
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.2 },
                "-=1"
            )
            // Removed kids appearance animation as requested
            .fromTo(countdownRef.current,
                { opacity: 0, x: 50 },
                { opacity: 1, x: 0, duration: 1 },
                "-=0.8"
            );
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative h-screen w-full overflow-hidden bg-black"
        >

            <div ref={navLogoRef} className="absolute top-0 left-0 pl-4 md:pl-6 pt-2 md:pt-4 z-50">
                <img src="/navlogo.png" alt="Navigation Logo" className="h-16 md:h-20 w-auto" />
            </div>

            <div ref={abesitLogoRef} className="hidden md:block absolute top-0 right-0 p-4 md:p-6 z-50">
                <img src="/abesit.png" alt="Abesit Logo" className="h-6 md:h-12 lg:h-16 w-auto" />
            </div>

            <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full max-w-[1586px]">
                    <img ref={bgRef} src="/assets/images/strange-bg-sans-trees.png" className="absolute inset-0 w-full h-full object-cover will-change-transform" style={{ transform: "translateZ(0)" }} />
                </div>
            </div>

            <div ref={leftTreesRef} className="hidden md:block absolute inset-y-0 left-0 h-full pointer-events-none will-change-transform" style={{ transform: 'translateX(-12%) translateZ(0)' }}>
                <img src="/assets/images/trees-left.png" className="h-full w-auto" />
            </div>

            <div ref={rightTreesRef} className="hidden md:block absolute inset-y-0 right-0 h-full pointer-events-none will-change-transform" style={{ transform: 'translateX(12%) translateZ(0)' }}>
                <img src="/assets/images/trees-right.png" className="h-full w-auto" />
            </div>

            <div className="absolute inset-x-0 bottom-[-20px] md:bottom-0 w-full pointer-events-none">
                <img ref={fgRef} src="/assets/images/strange-kids.png" className="absolute bottom-0 left-1/2 w-full min-w-[150%] translate-y-10 will-change-transform" style={{ transform: "translateX(-50%) translateZ(0)" }} />
            </div>

            {/* LEFT CONTENT */}
            <div ref={brandingRef} className="absolute inset-0 z-30 flex items-center justify-center md:justify-start pointer-events-none">
                <div className="pointer-events-auto text-center md:text-left px-2 md:pl-10 max-w-xl">

                    <h1
                        className="text-white font-bold text-[1.8rem] sm:text-4xl lg:text-5xl leading-[0.75] lg:leading-[0.95] whitespace-nowrap"
                        style={{ fontFamily: "ITC Benguiat Std" }}
                    >
                        ENTER THE UPSIDE
                        <br />
                        DOWN OF INNOVATION
                    </h1>

                    <p className="text-gray-300 mt-4 text-lg lg:text-xl" style={{ fontFamily: "ITC Benguiat Std" }}>
                        30-Hours International Hybrid Hackathon
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 lg:mt-10 items-center md:justify-start">
                        <CustomButton
                            link="https://hacknovate07.devfolio.co/"
                            buttonText="Apply with Devfolio"
                            imageSrc="/devfolio.png"
                            width="180px"
                            height="56px"
                            iconSize="34px"
                            gap="-2px"
                            applyInvert={true}
                        />
                        <CustomButton
                            link="https://discord.gg/qxFmdeYCT"
                            buttonText="Join Discord"
                            imageSrc="/discord-logo.svg"
                            width="180px"
                            height="56px"
                            iconSize="24px"
                            applyInvert={false}
                        />
                    </div>

                    {/* MOBILE TIMER */}
                    <div className="md:hidden mt-10 flex justify-center">
                        <CountdownTimer isMenuOpen={isMenuOpen} />
                    </div>
                </div>
            </div>

            {/* DESKTOP TIMER */}
            <div ref={countdownRef} className="hidden md:flex absolute inset-0 z-40 items-center justify-end pointer-events-none">
                <div className="pointer-events-auto pr-12">
                    <CountdownTimer isMenuOpen={isMenuOpen} />
                </div>
            </div>

        </div>
    );
}