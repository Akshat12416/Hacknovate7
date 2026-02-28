"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useCanvasSequence } from "./hooks/useCanvasSequence";
import { CountdownTimer } from "@/components/stranger-things/CountdownTimer";
import CustomButton from "@/components/stranger-things/HeroButton";
import { StrangerPreloader } from "@/components/stranger-things/StrangerPreloader";
import PortalGlitch, { PortalGlitchRef } from "./PortalGlitch";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;
const LAST_FRAME_INDEX = 240;

interface HeroScrollProps {
    isMenuOpen: boolean;
    externalLoaded: boolean;
    externalProgress: number;
    isMobile: boolean;
    images: HTMLImageElement[];
}

export default function HeroScroll({ isMenuOpen, externalLoaded, externalProgress, isMobile, images }: HeroScrollProps) {
    // 1. Core Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const topBarRef = useRef<HTMLDivElement>(null);
    const bottomBarRef = useRef<HTMLDivElement>(null);

    // 2. Scene Element Refs
    const treesLeftRef = useRef<HTMLDivElement>(null);
    const treesRightRef = useRef<HTMLDivElement>(null);
    const kidsRef = useRef<HTMLDivElement>(null);

    // 3. Inner Scene Refs (Mouse Parallax)
    const treesLeftInnerRef = useRef<HTMLImageElement>(null);
    const treesRightInnerRef = useRef<HTMLImageElement>(null);
    const kidsInnerRef = useRef<HTMLImageElement>(null);

    // 4. UI Ref
    const heroUIContainerRef = useRef<HTMLDivElement>(null);
    const heroUILeftRef = useRef<HTMLDivElement>(null);
    const heroUIRightRef = useRef<HTMLDivElement>(null);
    const navLogoRef = useRef<HTMLDivElement>(null);
    const abesitLogoRef = useRef<HTMLDivElement>(null);
    const scrollIndicatorRef = useRef<HTMLDivElement>(null);

    const lastRenderedIndex = useRef<number>(-1);
    const glitchRef = useRef<PortalGlitchRef>(null);
    const lastGlitchActive = useRef(false);

    const loaded = externalLoaded;

    // We use the images passed from the parent to avoid double loading
    const { drawFrame } = useCanvasSequence();

    // --- Canvas Resize ---
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                // Optimize mobile: Use lower DPR if it lags, or cap it.
                const dpr = isMobile ? Math.min(window.devicePixelRatio, 1.5) : window.devicePixelRatio || 1;
                canvasRef.current.width = window.innerWidth * dpr;
                canvasRef.current.height = window.innerHeight * dpr;
                lastRenderedIndex.current = -1;
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isMobile]);

    // --- Initial Draw ---
    useEffect(() => {
        // Only trigger initial draw if we haven't rendered anything yet
        if (loaded && images.length > 0 && canvasRef.current && lastRenderedIndex.current === -1) {
            const ctx = canvasRef.current.getContext("2d", { alpha: false });
            if (ctx) {
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "medium";
                drawFrame(ctx, images[0], canvasRef.current);
                lastRenderedIndex.current = 0;
            }
        }
    }, [loaded, images, drawFrame]);


    // --------------------------------------------------------
    // MOUSE MOVEMENT LOGIC (Fixed)
    // --------------------------------------------------------
    useGSAP(() => {
        if (!loaded) return;
        if (isMobile) return;

        // 1. Set Initial Positions via GSAP (Fixes Conflict)
        // We removed -translate-x-1/2 and translate-y-10 from CSS
        // and actived them here as xPercent and y. 
        // This lets 'x' (mouse) work independently without breaking centering.
        gsap.set(kidsInnerRef.current, { 
            xPercent: -50, 
            y: 40, // equivalent to translate-y-10
            transformOrigin: "center bottom"
        });

        const config = { duration: 1.5, ease: "power2.out" };

        const leftX = gsap.quickTo(treesLeftInnerRef.current, "x", config);
        const leftY = gsap.quickTo(treesLeftInnerRef.current, "y", config);
        const rightX = gsap.quickTo(treesRightInnerRef.current, "x", config);
        const rightY = gsap.quickTo(treesRightInnerRef.current, "y", config);
        
        // Kids move slightly slower for depth effect
        const kidsX = gsap.quickTo(kidsInnerRef.current, "x", { duration: 1.8, ease: "power2.out" });

        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            // Normalize mouse position (-1 to 1)
            const xNorm = (e.clientX / innerWidth - 0.5) * 2;
            const yNorm = (e.clientY / innerHeight - 0.5) * 2;

            leftX(xNorm * 15);
            leftY(yNorm * 15);
            rightX(xNorm * 15);
            rightY(yNorm * 15);
            
            // Move kids 15px left/right based on mouse
            kidsX(xNorm * 15);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, { dependencies: [loaded, isMobile], scope: containerRef });


    // --- GSAP Scroll Animations ---
    useGSAP(() => {
        if (!loaded) return;

        // -------------------------
        // INITIAL STATES
        // -------------------------
        gsap.set(treesLeftRef.current, { xPercent: -120, opacity: 0 });
        gsap.set(treesRightRef.current, { xPercent: 120, opacity: 0 });
        gsap.set(kidsRef.current, { y: "120vh", opacity: 0, scale: 0.9 });

        gsap.set(topBarRef.current, { yPercent: -100 });
        gsap.set(bottomBarRef.current, { yPercent: 100 });

        gsap.set(heroUIContainerRef.current, { opacity: 0 });

        // -------------------------
        // MAIN SCRUB TIMELINE
        // -------------------------
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: isMobile ? 0.8 : 1.2,
                invalidateOnRefresh: true,
            },
            defaults: { ease: "none" }
        });

        // 1️⃣ CANVAS SEQUENCE
        const frameObj = { frame: 0 };

        tl.to(frameObj, {
            frame: LAST_FRAME_INDEX,
            duration: LAST_FRAME_INDEX,
            onUpdate: () => {
                const index = Math.round(frameObj.frame);
                const safeIndex = Math.min(Math.max(index, 0), LAST_FRAME_INDEX);

                if (safeIndex !== lastRenderedIndex.current && canvasRef.current) {
                    const localIndex = isMobile
                        ? Math.min(Math.floor(safeIndex / 2), images.length - 1)
                        : Math.min(safeIndex, images.length - 1);
                    const img = images[localIndex];

                    if (img) {
                        const ctx = canvasRef.current.getContext("2d", { alpha: false });
                        if (ctx) {
                            drawFrame(ctx, img, canvasRef.current);
                            lastRenderedIndex.current = safeIndex;
                        }
                    }

                    // Glitch Activation: Frame 1 to 240
                    const isGlitchActive = safeIndex >= 1 && safeIndex <= LAST_FRAME_INDEX;
                    if (isGlitchActive !== lastGlitchActive.current) {
                        glitchRef.current?.setActive(isGlitchActive);
                        lastGlitchActive.current = isGlitchActive;
                    }
                }
            }
        }, 0);

        tl.to(scrollIndicatorRef.current, {
            opacity: 0,
            y: -20,
            duration: 25,
            ease: "power2.in",
        }, 0);

        // 2️⃣ OVERLAY ENTRANCE
        const overlayStart = LAST_FRAME_INDEX - 40; 
        tl.to(heroUIContainerRef.current, {
            opacity: 1,
            duration: 20,
        }, 245); 

        // 3️⃣ HOLD PHASE
        tl.addLabel("hold", overlayStart + 60);

        // 4️⃣ EXIT TIMELINE
        tl.addLabel("exit", overlayStart + 90);

        tl.to(treesLeftRef.current, {
            xPercent: -120,
            yPercent: -30,
            opacity: 0,
            duration: 40,
        }, "exit");

        tl.to(treesRightRef.current, {
            xPercent: 120,
            yPercent: -30,
            opacity: 0,
            duration: 40,
        }, "exit");

        tl.to(kidsRef.current, {
            yPercent: -40,
            y: "-5vh",
            scale: 2,
            duration: 30,
        }, "exit");

        tl.to(heroUIContainerRef.current, {
            opacity: 0,
            yPercent: "-40",
            duration: 30,
        }, "exit");

        tl.to(canvasRef.current, {
            y: "-5vh",
            yPercent: -20,
            duration: 30,
            scale: 1.1,
        }, "exit")

    }, { dependencies: [loaded], scope: containerRef });


    // 🎯 DEDICATED ENTRANCE ScrollTrigger
    useGSAP(() => {
        if (!loaded) return;

        const entranceTl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "45% top",
                end: "53% top",
                scrub: isMobile ? 0.8 : 1.2,
                invalidateOnRefresh: true,
            },
        });

        entranceTl.to(treesLeftRef.current, { xPercent: -3, opacity: 1, duration: 1, ease: "none" }, 0);
        entranceTl.to(treesRightRef.current, { xPercent: 3, opacity: 1, duration: 1, ease: "none" }, 0);
        entranceTl.to(kidsRef.current, { y: "-5vh", scale: 1, opacity: 1, duration: 1, ease: "none" }, 0);

    }, { dependencies: [loaded], scope: containerRef });

    const gpuStyle = {
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden" as const
    };

    return (
        <section
            ref={containerRef}
            className="relative w-full bg-black"
            style={{ height: `${FRAME_COUNT * 15}px` }}
        >
            <div
                ref={stickyRef}
                className="sticky top-0 h-[100vh] w-full overflow-hidden bg-black"
                style={gpuStyle}
            >
                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 0, display: "block" }}
                />

                <PortalGlitch ref={glitchRef} />

                <div ref={topBarRef} className="absolute top-0 left-0 w-full bg-black pointer-events-none" style={{ ...gpuStyle, height: "12vh", zIndex: 5, top: 0 }} />
                <div ref={bottomBarRef} className="absolute bottom-0 left-0 w-full bg-black pointer-events-none" style={{ ...gpuStyle, height: "12vh", zIndex: 5, bottom: 0 }} />

                {/* Trees Left */}
                <div ref={treesLeftRef} style={{ ...gpuStyle, zIndex: 10 }} className="hidden md:block absolute inset-y-0 left-0 h-full pointer-events-none">
                    <div className="h-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img ref={treesLeftInnerRef} src="/assets/images/trees-left.png" alt="" className="h-full w-auto" draggable={false} />
                    </div>
                </div>

                {/* Trees Right */}
                <div ref={treesRightRef} style={{ ...gpuStyle, zIndex: 10, right: "1%" }} className="hidden md:block absolute inset-y-0 h-full pointer-events-none">
                    <div className="h-full" style={{ position: "relative", top: "-5%" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img ref={treesRightInnerRef} src="/assets/images/trees-right.png" alt="" className="h-[110%] w-auto max-w-none" draggable={false} />
                    </div>
                </div>

                {/* Kids - Fixed Logic */}
                <div ref={kidsRef} style={{ ...gpuStyle, zIndex: 15 }} className="absolute inset-x-0 bottom-[-20px] md:bottom-0 w-full pointer-events-none">
                    {/* FIX: 
                        1. Removed wrapper div.
                        2. Removed '-translate-x-1/2' and 'translate-y-10' from className.
                        3. We apply those offsets in the useGSAP hook (xPercent: -50, y: 40).
                        This ensures 'x' (mouse animation) works ON TOP of the centering.
                    */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        ref={kidsInnerRef} 
                        src="/assets/images/strange-kids.png" 
                        alt="" 
                        className="absolute bottom-0 left-1/2 w-full min-w-[150%] opacity-60 md:opacity-100 block" 
                        draggable={false} 
                    />
                </div>

                {/* UI Overlay */}
                <div ref={heroUIContainerRef} style={{ ...gpuStyle, zIndex: 30 }} className="absolute inset-0 pointer-events-none">
                    <div ref={navLogoRef} className="absolute top-0 left-0 pl-4 md:pl-6 pt-2 md:pt-4 z-50 pointer-events-auto">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/navlogo.png" alt="Navigation Logo" className="h-16 md:h-20 w-auto" />
                    </div>

                    <div ref={abesitLogoRef} className="hidden md:block absolute top-0 right-0 p-4 md:p-6 z-50 pointer-events-auto">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/abesit.png" alt="Abesit Logo" className="h-6 md:h-12 lg:h-16 w-auto" />
                    </div>

                    <div ref={heroUILeftRef} className="absolute inset-0 z-30 flex items-center justify-center md:justify-start pointer-events-none">
                        <div className="pointer-events-auto text-center md:text-left px-2 md:pl-10 max-w-xl">
                            <h1 className="text-white font-bold text-[1.8rem] sm:text-4xl lg:text-5xl leading-[0.75] lg:leading-[0.95] whitespace-nowrap" style={{ fontFamily: "ITC Benguiat Std" }}>
                                ENTER THE UPSIDE<br />DOWN OF INNOVATION
                            </h1>
                            <p className="text-gray-300 mt-4 text-lg lg:text-xl" style={{ fontFamily: "ITC Benguiat Std" }}>
                                Hacknovate 7.0 <br/> 30-Hrs International Hybrid Hackathon
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mt-8 lg:mt-10 items-center md:justify-start">
                                <CustomButton link="https://hacknovate07.devfolio.co/" buttonText="Apply with Devfolio" imageSrc="/devfolio.png" width="180px" height="56px" iconSize="34px" gap="-2px" applyInvert={true} />
                                <CustomButton link="https://discord.gg/qxFmdeYCT" buttonText="Join Discord" imageSrc="/discord-logo.svg" width="180px" height="56px" iconSize="24px" applyInvert={false} />
                            </div>
                            <div className="md:hidden mt-8 flex justify-center relative z-[25] pb-10">
                                <CountdownTimer isMenuOpen={isMenuOpen} />
                            </div>
                        </div>
                    </div>

                    <div ref={heroUIRightRef} className="hidden md:flex absolute inset-0 z-40 items-center justify-end pointer-events-none">
                        <div className="pointer-events-auto pr-12">
                            <CountdownTimer isMenuOpen={isMenuOpen} />
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div
                    ref={scrollIndicatorRef}
                    className="absolute bottom-10 md:bottom-16 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1 md:gap-2 pointer-events-none w-full max-w-[90vw]"
                >
                    <span className="text-[11px] md:text-[14px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-white font-extrabold drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] text-center leading-relaxed" style={{ fontFamily: "ITC Benguiat Std" }}>
                        Scroll to Enter<br className="md:hidden" /> the Portal
                    </span>
                    <div className="flex flex-col items-center gap-0 animate-bounce transition-all duration-300">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] opacity-100">
                            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="-mt-4 text-white/60 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] opacity-80">
                            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}