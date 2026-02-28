"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function TrailerReveal() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const brandingRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const textConfig = {
            line1: "THE FINALE",
            line2: "NEW YEAR'S EVE",
            fontFamily: "'Cormorant Garamond', serif",
            sizePercent: 0.3,
        };

        const isMobile = window.innerWidth < 768;
        const resize = () => {
            const dpr = isMobile ? Math.min(window.devicePixelRatio, 1.5) : window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
        };
        resize();
        window.addEventListener("resize", resize);

        const drawMask = (scale: number, opacity: number) => {
            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);
            if (opacity <= 0) return;

            ctx.globalAlpha = opacity;
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, width, height);

            ctx.globalCompositeOperation = "destination-out";
            ctx.fillStyle = "#fff";

            const fontSize = width * textConfig.sizePercent * 0.5;
            ctx.font = `700 ${fontSize}px ${textConfig.fontFamily}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.save();
            // Zoom into the "I" in THE FINALE
            const zoomX = width / 2 + (fontSize * 0.3);
            const zoomY = height / 2 - (fontSize * 0.25);

            ctx.translate(zoomX, zoomY);
            ctx.scale(scale, scale);
            ctx.translate(-zoomX, -zoomY);

            ctx.fillText(textConfig.line1, width / 2, height / 2 - fontSize * 0.5);
            ctx.fillText(textConfig.line2, width / 2, height / 2 + fontSize * 0.7);

            ctx.restore();
            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = 1;
        };

        gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=500%",
                pin: true,
                scrub: true,
                onUpdate: (self) => {
                    const p = self.progress;

                    // Phase 1: Branding (HACKNOVATE 7.0) fades out (0% - 15%)
                    if (p < 0.15) {
                        gsap.set(brandingRef.current, { opacity: 1 - (p / 0.15) });
                    } else {
                        gsap.set(brandingRef.current, { opacity: 0 });
                    }

                    // Phase 2: Text mask appears (no red tint)
                    let maskOpacity = 0;
                    if (p > 0.1 && p < 0.2) {
                        maskOpacity = (p - 0.1) * 10;
                    } else if (p >= 0.2) {
                        maskOpacity = 1;
                    }

                    // Phase 3: Text Zoom through "I" (30% - 90%)
                    let scale = 1;
                    let finalMaskOpacity = maskOpacity;
                    if (p > 0.3) {
                        const zoomP = Math.min(1, (p - 0.3) / 0.6);
                        scale = 1 + Math.pow(zoomP, 3) * 500;

                        // Fade out mask to reveal full video
                        if (p > 0.8) {
                            finalMaskOpacity = Math.max(0, 1 - (p - 0.8) * 5);
                        }
                    }

                    drawMask(scale, finalMaskOpacity);

                    // Video fades in as mask appears
                    if (p > 0.15) {
                        gsap.set(videoRef.current, { opacity: 1 });
                    } else {
                        gsap.set(videoRef.current, { opacity: 0 });
                    }
                }
            }
        });

        return () => {
            window.removeEventListener("resize", resize);
        };
    }, { scope: sectionRef });

    return (
        <div ref={sectionRef} className="relative h-screen w-full bg-black overflow-hidden">
            {/* Video at the bottom of the stack */}
            <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-0 z-0"
                src="/assets/video/stange-trailer.mp4"
            />

            {/* HACKNOVATE 7.0 Branding that fades out - Matched with ParallaxHero */}
            <div
                ref={brandingRef}
                className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none gap-2 -translate-y-24"
            >
                <h2 className="text-white text-4xl md:text-6xl font-bold tracking-[0.15em] drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    HACKNOVATE
                </h2>
                <span className="text-white text-2xl md:text-4xl font-light tracking-[0.3em] opacity-90" style={{ fontFamily: "'Inter', sans-serif" }}>
                    7.0
                </span>
            </div>

            {/* Canvas Mask on the very top */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-30 pointer-events-none"
            />
        </div>
    );
}
