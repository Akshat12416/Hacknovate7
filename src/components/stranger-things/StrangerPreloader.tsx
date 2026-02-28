"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StrangerPreloaderProps {
    progress: number;
    onComplete: () => void;
    isLoaded: boolean;
    isMobile?: boolean;
}

/* ─── Flicker animation keyframes ─── */
const flicker = {
    opacity: [1, 0.85, 1, 0.55, 1, 0.9, 0.45, 1, 0.88, 1],
    transition: { duration: 2.6, repeat: Infinity, ease: "linear" as const },
};

/* ─── Floating particle ─── */
function Particle({ i }: { i: number }) {
    const left = `${8 + ((i * 73) % 84)}%`;
    const dur = 7 + (i % 5);
    const del = (i * 0.43) % 4;
    return (
        <motion.div
            style={{
                position: "absolute",
                bottom: "-4px",
                left,
                width: i % 3 === 0 ? "3px" : "2px",
                height: i % 3 === 0 ? "3px" : "2px",
                borderRadius: "50%",
                background: i % 4 === 0 ? "#ff3b3b" : "rgba(255,60,60,0.35)",
                filter: "blur(0.5px)",
            }}
            animate={{ y: [0, -(400 + (i % 200))], opacity: [0, 0.6, 0.3, 0] }}
            transition={{ duration: dur, repeat: Infinity, delay: del, ease: "linear" }}
        />
    );
}

export const StrangerPreloader: React.FC<StrangerPreloaderProps> = ({
    progress,
    onComplete,
    isLoaded,
    isMobile = false,
}) => {
    const [show, setShow] = useState(true);
    const [minTimeReached, setMinTime] = useState(false);
    const [glitch, setGlitch] = useState(false);
    const glitchRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [smoothedProgress, setSmoothedProgress] = useState(0);

    /* Minimum 3.5 s */
    useEffect(() => {
        const t = setTimeout(() => setMinTime(true), 3500);
        return () => clearTimeout(t);
    }, []);

    /* Progress smoothing */
    useEffect(() => {
        const interval = setInterval(() => {
            setSmoothedProgress(prev => {
                if (prev < progress) {
                    const diff = progress - prev;
                    // Move 2% of the way each frame, or at least 0.2%
                    const step = Math.max(0.2, diff * 0.02);
                    return Math.min(progress, prev + step);
                }
                return prev;
            });
        }, 20);
        return () => clearInterval(interval);
    }, [progress]);

    /* Random glitch bursts */
    useEffect(() => {
        const schedule = () => {
            const wait = 1400 + Math.random() * 2200;
            glitchRef.current = setTimeout(() => {
                setGlitch(true);
                setTimeout(() => { setGlitch(false); schedule(); }, 100 + Math.random() * 160);
            }, wait);
        };
        schedule();
        return () => { if (glitchRef.current) clearTimeout(glitchRef.current); };
    }, []);

    /* Exit */
    useEffect(() => {
        if (isLoaded && minTimeReached && smoothedProgress >= 99) {
            const t = setTimeout(() => { setShow(false); onComplete(); }, 800);
            return () => clearTimeout(t);
        }
    }, [isLoaded, minTimeReached, onComplete, smoothedProgress]);

    const pct = Math.min(100, Math.round(smoothedProgress));

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        filter: isMobile ? "none" : "blur(18px) brightness(2.5)",
                        transition: { duration: isMobile ? 0.6 : 1.1, ease: "easeInOut" },
                    }}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 9999,
                        background: "rgba(0, 0, 0, 0.9)", // Solid black fallback
                        backdropFilter: isMobile ? "none" : "blur(16px) saturate(120%)",
                        WebkitBackdropFilter: isMobile ? "none" : "blur(16px) saturate(120%)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        fontFamily: "'Courier New', monospace",
                        // Inner "glass edge" highlight
                        boxShadow: "inset 0 0 100px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.08)",
                    }}
                >
                    {/* Darker base for legibility since images underneath can be bright */}
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0, 0, 0, 0.75)",
                        zIndex: -1,
                    }} />

                    {/* Navbar-style Grain Texture */}
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.05,
                        pointerEvents: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        zIndex: 1,
                    }} />

                    {/* Dynamic Ambient Glow */}
                    <div style={{
                        position: "absolute",
                        width: "120vw",
                        height: "120vh",
                        top: "-10%",
                        left: "-10%",
                        background: "radial-gradient(circle at 50% 50%, rgba(180, 20, 20, 0.12) 0%, transparent 60%)",
                        pointerEvents: "none",
                        zIndex: 2,
                    }} />
                    {/* Scanlines */}
                    <div style={{
                        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.035,
                        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.9) 2px, rgba(255,255,255,0.9) 3px)",
                        backgroundSize: "100% 3px",
                    }} />

                    {/* Vignette */}
                    <div style={{
                        position: "absolute", inset: 0, pointerEvents: "none",
                        background: "radial-gradient(ellipse 72% 68% at 50% 50%, transparent 0%, rgba(0,0,0,0.92) 100%)",
                    }} />

                    {/* Bottom glow */}
                    <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        height: "180px", pointerEvents: "none",
                        background: "linear-gradient(to top, rgba(90,0,0,0.22), transparent)",
                    }} />

                    {/* Particles */}
                    {[...Array(isMobile ? 8 : 16)].map((_, i) => <Particle key={i} i={i} />)}



                    {/* Horizontal rules */}
                    {[{ top: "calc(50% - 108px)" }, { bottom: "calc(50% - 108px)" }].map((pos, i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.25, 0.5, 0.25], scaleX: [1, 0.97, 1] }}
                            transition={{ duration: 3 + i * 0.4, repeat: Infinity }}
                            style={{
                                position: "absolute", ...pos,
                                left: "7vw", right: "7vw", height: "1px",
                                background: "linear-gradient(to right, transparent, rgba(160,15,15,0.5) 20%, rgba(240,30,30,0.65) 50%, rgba(160,15,15,0.5) 80%, transparent)",
                            }}
                        />
                    ))}

                    {/* ══ CORE CONTENT ══ */}
                    <div style={{
                        position: "relative", zIndex: 10,
                        display: "flex", flexDirection: "column",
                        alignItems: "center", gap: "2.6rem",
                    }}>



                        {/* Title with glitch */}
                        <div style={{ position: "relative", textAlign: "center", userSelect: "none" }}>

                            {/* Glitch ghost */}
                            {glitch && (
                                <>
                                    <span aria-hidden style={{
                                        position: "absolute", top: 0, left: 0,
                                        fontFamily: "'Bebas Neue', Impact, sans-serif",
                                        fontSize: "clamp(3.2rem, 10vw, 7.5rem)",
                                        letterSpacing: "0.1em", lineHeight: 1,
                                        color: "rgba(255,0,0,0.3)",
                                        transform: "translate(5px, -3px)",
                                        pointerEvents: "none", whiteSpace: "nowrap",
                                    }}>HACKNOVATE</span>
                                    <span aria-hidden style={{
                                        position: "absolute", top: 0, left: 0,
                                        fontFamily: "'Bebas Neue', Impact, sans-serif",
                                        fontSize: "clamp(3.2rem, 10vw, 7.5rem)",
                                        letterSpacing: "0.1em", lineHeight: 1,
                                        color: "rgba(0,200,255,0.12)",
                                        transform: "translate(-3px, 2px)",
                                        pointerEvents: "none", whiteSpace: "nowrap",
                                    }}>HACKNOVATE</span>
                                </>
                            )}

                            <motion.h1
                                animate={flicker}
                                style={{
                                    margin: 0,
                                    fontFamily: "'Bebas Neue', Impact, sans-serif",
                                    fontSize: "clamp(3.2rem, 10vw, 7.5rem)",
                                    letterSpacing: "0.1em", lineHeight: 1,
                                    color: "#ffffff",
                                    textShadow: "0 0 35px rgba(255,25,25,0.4), 0 0 70px rgba(180,0,0,0.18)",
                                }}
                            >
                                HACKNOVATE
                            </motion.h1>

                            {/* Edition marker */}
                            <div style={{
                                display: "flex", alignItems: "center",
                                justifyContent: "center", gap: "0.9rem",
                                marginTop: "0.5rem",
                            }}>
                                <div style={{ flex: 1, maxWidth: "28px", height: "1px", background: "rgba(180,25,25,0.5)" }} />
                                <span style={{
                                    fontSize: "1rem", letterSpacing: "0.55em",
                                    textTransform: "uppercase", color: "rgba(200,50,50,0.85)",
                                    fontWeight: "bold"
                                }}>7.0</span>
                                <div style={{ flex: 1, maxWidth: "28px", height: "1px", background: "rgba(180,25,25,0.5)" }} />
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div style={{ width: "clamp(220px, 34vw, 440px)", display: "flex", flexDirection: "column", gap: "0.65rem" }}>

                            {/* Track */}
                            <div style={{ position: "relative", width: "100%", height: "2px", background: "rgba(80,8,8,0.5)" }}>
                                {/* Fill */}
                                <motion.div
                                    style={{
                                        position: "absolute", inset: "0 auto 0 0",
                                        width: `${pct}%`,
                                        background: "linear-gradient(to right, #6b0000, #ff2020)",
                                        boxShadow: "0 0 10px rgba(255,25,25,0.7), 0 0 25px rgba(180,0,0,0.3)",
                                    }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                />
                                {/* Dot */}
                                <motion.div
                                    style={{
                                        position: "absolute", top: "50%",
                                        left: `${pct}%`,
                                        transform: "translate(-50%, -50%)",
                                        width: "5px", height: "5px",
                                        borderRadius: "50%",
                                        background: "#ff2828",
                                        boxShadow: "0 0 8px #ff2828, 0 0 18px rgba(255,0,0,0.5)",
                                    }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                />
                            </div>

                            {/* Labels */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <span style={{ fontSize: "0.48rem", opacity: 0 }}>
                                    .
                                </span>
                                <motion.span
                                    key={pct}
                                    initial={{ opacity: 0.4, y: 3 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ fontSize: "0.68rem", letterSpacing: "0.1em", color: "rgba(240,55,55,0.85)" }}
                                >
                                    {pct.toString().padStart(3, "0")} %
                                </motion.span>
                            </div>
                        </div>


                    </div>

                    <style>{`
                        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
                    `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
};