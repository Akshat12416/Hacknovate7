"use client";

import { useRef, useLayoutEffect, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/stranger-things/Navbar";
// 1. FIXED IMPORT NAME: Make sure this matches the file name/export of your card component
import StrangerThingsCard from "@/components/stranger-things/timelinecard"; 
import StoneSlabSchedule from "@/components/stranger-things/StoneslabSchedule";
import ScheduleTable from "@/components/stranger-things/ScheduleTable";
import { OFFLINE_SCHEDULE, ONLINE_SCHEDULE } from "@/data/scheduleData";

gsap.registerPlugin(ScrollTrigger);

// ===== ORB CONFIG =====
const GLOW_ORBS = [
    { w: 480, h: 480, top: "10%", left: "5%", delay: 0 },
    { w: 320, h: 320, top: "60%", left: "70%", delay: 1.2 },
    { w: 240, h: 240, top: "75%", left: "20%", delay: 2.4 },
    { w: 200, h: 200, top: "15%", left: "80%", delay: 0.8 },
    { w: 160, h: 160, top: "45%", left: "50%", delay: 1.8 },
];

export default function SchedulePage() {
    const [isMounted, setIsMounted] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isTableView, setIsTableView] = useState(false);
    const [scheduleMode, setScheduleMode] = useState<'offline' | 'online'>('offline');
    const activeScheduleData = scheduleMode === 'offline' ? OFFLINE_SCHEDULE : ONLINE_SCHEDULE;

    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const orbRefs = useRef<(HTMLDivElement | null)[]>([]);

    const totalFrames = 90;

    const getFrameSrc = (i: number) =>
        `/frames/frame_${String(i + 1).padStart(3, "0")}.webp`;

    const imagesRef = useRef<HTMLImageElement[]>([]);

    // =========================
    // 🔥 PRELOAD (PARALLEL + SAFE)
    // =========================
    useEffect(() => {
        setIsMounted(true);

        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            // Bypass heavy frame buffer strictly for edge-mobile performance
            setIsLoaded(true);
            return;
        }

        let cancelled = false;

        const preloadImages = async () => {
            const promises = Array.from({ length: totalFrames }, (_, i) => {
                return new Promise<HTMLImageElement>((resolve) => {
                    const img = new Image();
                    img.src = getFrameSrc(i);

                    img.onload = async () => {
                        try {
                            await img.decode();
                        } catch (e) { }
                        resolve(img);
                    };

                    img.onerror = () => {
                        console.warn("Image failed:", img.src);
                        resolve(img);
                    };
                });
            });

            const images = await Promise.all(promises);

            if (!cancelled) {
                imagesRef.current = images;
                setIsLoaded(true);
            }
        };

        preloadImages();

        return () => {
            cancelled = true;
        };
    }, []);

    // =========================
    // 🎬 GSAP + CANVAS
    // =========================
    useLayoutEffect(() => {
        // Automatically destroy GSAP instance if the user switches to Native Table View or swaps Schedule data
        if (!isMounted || !isLoaded || isTableView) return;

        const ctx = gsap.context(() => {
            // ===== ORB ANIMATION =====
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
                    delay: GLOW_ORBS[i]?.delay || 0,
                });
            });

            // ===== CANVAS SETUP =====
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx2d = canvas.getContext("2d");
            if (!ctx2d) return;

            let width = 0;
            let height = 0;
            let dpr = Math.min(window.devicePixelRatio || 1, 2);

            const resize = () => {
                const rect = canvas.getBoundingClientRect();
                width = rect.width;
                height = rect.height;

                canvas.width = width * dpr;
                canvas.height = height * dpr;

                ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);

                // 🔥 APPLY HIGH SATURATION FILTER
                ctx2d.filter = "saturate(1.8) brightness(1.1)";
            };

            resize();
            window.addEventListener("resize", resize);

            const render = (index: number) => {
                const img = imagesRef.current[index];
                if (!img) return;

                ctx2d.clearRect(0, 0, width, height);
                ctx2d.drawImage(img, 0, 0, width, height);
            };

            // DRAW FIRST FRAME
            render(0);

            const playhead = { frame: 0 };
            let lastFrame = -1;
            
            // Dynamically scale the scroll distance based on how many timeline events exist so it never scrolls too fast or stops halfway
            const pinDistance = activeScheduleData.length * 250;

            gsap.to(playhead, {
                frame: totalFrames - 1,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: `+=${pinDistance}`,
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                },
                onUpdate: () => {
                    // Sync the 3D Stoneslab cards perfectly with this exact scroll progress!
                    const currentProgress = playhead.frame / (totalFrames - 1);
                    window.dispatchEvent(new CustomEvent("update-stoneslab", { detail: currentProgress }));

                    const frame = Math.round(playhead.frame);
                    if (frame === lastFrame) return;
                    lastFrame = frame;

                    requestAnimationFrame(() => render(frame));
                },
            });

            return () => {
                window.removeEventListener("resize", resize);
            };
        }, sectionRef);

        return () => ctx.revert();
    }, [isMounted, isLoaded, isTableView, scheduleMode]);

    return (
        <main className="relative bg-black min-h-screen overflow-x-hidden">
            <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} alwaysVisible />

            {/* Horizontal Segmented Toggle Bar */}
            {isLoaded && (
                <div className="absolute top-[85px] md:top-[95px] flex flex-row p-1.5 bg-black/60 backdrop-blur-xl border border-red-900/40 ring-1 ring-red-500/20 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_20px_rgba(220,38,38,0.15)] z-[100] left-1/2 -translate-x-1/2">
                    
                    {/* Animated Sliding Active Background */}
                    <div
                        className={`absolute transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] bg-gradient-to-br from-red-600/80 to-red-900/80 border border-red-500/50 rounded-full z-0 shadow-[0_0_20px_rgba(220,38,38,0.5),inset_0_0_12px_rgba(255,255,255,0.2)] top-1.5 bottom-1.5 w-[calc(50%-6px)]
                            ${scheduleMode === 'offline' ? 'left-1.5' : 'left-[50%]'}`}
                    />

                    <button
                        onClick={() => setScheduleMode('offline')}
                        className={`relative w-28 md:w-36 py-2.5 rounded-full transition-all duration-500 z-10 flex items-center justify-center group ${scheduleMode === 'offline' ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
                    >
                        <span className={`text-[10px] md:text-xs font-bold tracking-[0.2em] transition-all duration-300 ${scheduleMode === 'offline' ? 'text-shadow-glow drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]'}`}>
                            OFFLINE
                        </span>
                    </button>

                    <button
                        onClick={() => setScheduleMode('online')}
                        className={`relative w-28 md:w-36 py-2.5 rounded-full transition-all duration-500 z-10 flex items-center justify-center group ${scheduleMode === 'online' ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
                    >
                        <span className={`text-[10px] md:text-xs font-bold tracking-[0.2em] transition-all duration-300 ${scheduleMode === 'online' ? 'text-shadow-glow drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]'}`}>
                            ONLINE
                        </span>
                    </button>
                </div>
            )}

            {/* =========================
                 🔄 VIEW TOGGLE (Cinematic View mode)
            ========================= */}
            {isLoaded && !isTableView && (
                <div className="fixed z-50 top-24 right-4 md:right-8">
                    <button 
                        onClick={() => {
                            window.scrollTo(0, 0);
                            setIsTableView(true);
                        }}
                        className="px-4 py-2 bg-red-950/80 border border-red-600/50 hover:bg-red-900 group flex items-center gap-2 text-red-200 text-xs sm:text-sm font-bold tracking-widest uppercase rounded shadow-[0_0_15px_rgba(255,0,0,0.3)] backdrop-blur transition-all"
                    >
                        <span>📋 Table View</span>
                    </button>
                </div>
            )}

            {/* =========================
                 🔥 LOADING SCREEN
            ========================= */}
            <AnimatePresence mode="wait">
                {!isLoaded && (
                    <motion.div 
                        initial={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)", backgroundColor: "rgba(0,0,0,0)" }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black overflow-hidden origin-center"
                    >
                        {/* ── Background Layer ── */}
                        <div className="absolute inset-0 z-0 pointer-events-none">
                            <div
                                className="absolute inset-0 w-full h-full opacity-40 animate-[pulse_6s_ease-in-out_infinite]"
                                style={{
                                    backgroundImage: "url('/assets/sponsors/background.jpg')",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    filter: "blur(20px) brightness(0.3)",
                                    transform: "scale(1.1)",
                                }}
                            />
                            <div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30"
                                style={{
                                    background: "radial-gradient(circle, rgba(180,30,30,0.4) 0%, transparent 70%)",
                                }}
                            />
                            {/* Thematic Retro Scanlines */}
                            <div className="absolute inset-0 opacity-[0.08] pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)] z-10" />
                        </div>

                        {/* ── Foreground Content ── */}
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-32 h-32 mb-12 relative flex items-center justify-center">
                                {/* Stranger Things Portal Rings */}
                                <div className="absolute inset-0 border-4 border-red-900/40 rounded-full blur-[8px] animate-[pulse_3s_ease-in-out_infinite]" />
                                <div className="absolute inset-2 border-y-[3px] border-red-600/60 rounded-full animate-[spin_4s_linear_infinite]" />
                                <div className="absolute inset-4 border-x-[3px] border-red-500/80 rounded-full animate-[spin_3s_linear_infinite_reverse]" />
                                <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_25px_8px_rgba(255,0,0,0.9)] animate-pulse" />
                            </div>

                            <div className="text-center">
                                <h2
                                    className="text-5xl md:text-7xl font-benguiat font-bold uppercase tracking-widest mb-6 text-red-600 drop-shadow-[0_0_30px_rgba(255,20,20,0.9)] animate-pulse"
                                    style={{ lineHeight: 1.1 }}
                                >
                                    Navigating <br className="md:hidden" /> The Void
                                </h2>

                                <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-red-500/70 animate-pulse drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                                    Securing Link to Hawkins Lab...
                                </p>

                                <div className="flex items-center justify-center gap-6 mt-10 opacity-80">
                                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-red-800 to-red-600" />
                                    <div className="w-2.5 h-2.5 rotate-45 border border-red-500 bg-red-950 shadow-[0_0_15px_rgba(255,0,0,0.8)] animate-ping" />
                                    <div className="h-px w-24 bg-gradient-to-l from-transparent via-red-800 to-red-600" />
                                </div>
                            </div>

                            {/* Upside Down Floating Spores */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-10 left-[-150px] w-2 h-2 bg-gray-400/40 blur-[1px] rounded-full animate-[bounce_8s_infinite]" />
                                <div className="absolute top-40 right-[-120px] w-3 h-3 bg-red-400/20 blur-[2px] rounded-full animate-[bounce_10s_infinite]" />
                                <div className="absolute bottom-[-80px] left-32 w-1.5 h-1.5 bg-white/30 rounded-full animate-[bounce_6s_infinite]" />
                                <div className="absolute bottom-10 right-20 w-2 h-2 bg-gray-500/40 rounded-full animate-[bounce_7s_infinite]" />
                            </div>
                        </div>

                        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
                    </motion.div>
                )}
            </AnimatePresence>

           {/* =========================
                 🎬 MAIN SECTION
            ========================= */}
            <section
                ref={sectionRef}
                className={`relative w-full ${isTableView ? 'min-h-screen py-10 pt-[150px]' : 'h-screen overflow-hidden'}`}
            >
                {/* Static Fallback Background for Table View (Mobile AND Desktop) or just Mobile Cinematic */}
                <div
                    className={`z-0 opacity-20 ${isTableView ? 'fixed inset-0 block' : 'absolute inset-0 block md:hidden'}`}
                    style={{
                        backgroundImage: "url('/assets/sponsors/background.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

                {/* Visual Depth Background */}
                <div
                    className={`z-0 hidden md:block ${isTableView ? 'fixed inset-0 pointer-events-none' : 'absolute inset-0'}`}
                    style={{
                        background:
                            "radial-gradient(circle at center, rgba(140,0,0,0.15), black 80%)",
                    }}
                />

                {/* The Canvas - High Saturation Rendering (Only used in Cinematic) */}
                <canvas
                    ref={canvasRef}
                    className={`w-full h-full z-10 pointer-events-none ${isTableView ? 'hidden' : 'absolute inset-0 hidden md:block'}`}
                />

                {/* Floating Ambient Orbs */}
                {isLoaded &&
                    GLOW_ORBS.map((orb, i) => (
                        <div
                            key={i}
                            ref={(el) => { (orbRefs.current[i] = el) }}
                            className="absolute rounded-full z-[15] pointer-events-none"
                            style={{
                                width: orb.w,
                                height: orb.h,
                                top: orb.top,
                                left: orb.left,
                                background:
                                    "radial-gradient(circle, rgba(200,30,30,0.25), transparent 70%)",
                                filter: "blur(60px)",
                            }}
                        />
                    ))}

                {/* =========================
                     🧱 SCHEDULE VIEWS
                ========================= */}
                {isLoaded && !isTableView && <StoneSlabSchedule scheduleData={activeScheduleData} mode={scheduleMode} key={scheduleMode} />}
                
                {isLoaded && isTableView && (
                    <div className="w-full relative z-40 max-w-6xl mx-auto px-4 md:px-8 pt-28 flex justify-end">
                        <button 
                            onClick={() => {
                                window.scrollTo(0, 0);
                                setIsTableView(false);
                            }}
                            className="px-4 py-2 bg-red-950/80 border border-red-600/50 hover:bg-red-900 group flex items-center gap-2 text-red-200 text-xs sm:text-sm font-bold tracking-widest uppercase rounded shadow-[0_0_15px_rgba(255,0,0,0.3)] backdrop-blur transition-all"
                        >
                            <span>⚡ Cinematic View</span>
                        </button>
                    </div>
                )}
                {isLoaded && isTableView && <ScheduleTable scheduleData={activeScheduleData} mode={scheduleMode} />}
            </section>
        </main>
    );
}

// Add global glow utility class dynamically if it doesn't exist
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = `
        .text-shadow-glow {
            text-shadow: 0 0 10px rgba(255,0,0,0.6);
        }
    `;
    document.head.appendChild(style);
}