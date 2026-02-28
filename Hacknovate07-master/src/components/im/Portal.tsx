"use client";
import { useState, useEffect, useLayoutEffect } from "react";
import HeroScroll from "./HeroScroll";
import { Navbar } from "../stranger-things/Navbar";
import { useImagePreloader } from "./hooks/useImagePreloader";
import { StrangerPreloader } from "../stranger-things/StrangerPreloader";
import { ParallaxHero } from "../stranger-things/ParallaxHero";

/**
 * Portal — Dimensional Portal canvas-sequence section.
 * Activates strictly on user scroll. No auto-scroll, no mount triggers.
 */
export function Portal() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPreloaderDone, setIsPreloaderDone] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useLayoutEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setIsInitialized(true);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    // Refresh ScrollTrigger when isMobile changes
    useEffect(() => {
        if (isInitialized) {
            const timer = setTimeout(() => {
                import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
                    ScrollTrigger.refresh();
                });
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [isMobile, isInitialized]);

    // Refresh ScrollTrigger when preloader is done to recalibrate for newly visible layout
    useEffect(() => {
        if (isPreloaderDone) {
            const timer = setTimeout(() => {
                import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
                    ScrollTrigger.refresh();
                });
            }, 250);
            return () => clearTimeout(timer);
        }
    }, [isPreloaderDone]);

    const FRAME_COUNT = 240;
    const skipIncrement = isMobile ? 2 : 1;
    const { images, loaded, progress } = useImagePreloader("/im", FRAME_COUNT, isMobile ? 999999 : skipIncrement);

    const isHeroLoaded = isMobile ? true : loaded;
    const effectiveProgress = isMobile ? 100 : progress;

    return (
        <div className="relative bg-black min-h-screen">
            <StrangerPreloader
                progress={effectiveProgress}
                isLoaded={isHeroLoaded}
                onComplete={() => setIsPreloaderDone(true)}
                isMobile={isMobile}
            />

            <div
                style={{
                    opacity: isPreloaderDone ? 1 : 0,
                    visibility: isPreloaderDone ? "visible" : "hidden",
                    transition: "opacity 0.8s ease-in-out"
                }}
            >
                {isMobile ? (
                    <ParallaxHero />
                ) : (
                    <>
                        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
                        <HeroScroll isMenuOpen={isMenuOpen} externalLoaded={loaded} externalProgress={progress} isMobile={isMobile} images={images} />
                    </>
                )}
            </div>
        </div>
    );
}
