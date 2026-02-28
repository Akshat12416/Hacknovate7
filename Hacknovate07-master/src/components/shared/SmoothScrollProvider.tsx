"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const SmoothScrollContext = createContext<Lenis | null>(null);

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
    const [lenis, setLenis] = useState<Lenis | null>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

        const lenisInstance = new Lenis({
            duration: isMobile ? 0.8 : 1.5, // Slightly faster for mobile
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: isMobile ? 1.5 : 2.0, // More responsive touch
            syncTouch: false, // Let mobile handle touch natively
            infinite: false,
        });

        setLenis(lenisInstance);

        lenisInstance.on("scroll", ScrollTrigger.update);

        const tickerCb = (time: number) => {
            lenisInstance.raf(time * 1000);
        };

        gsap.ticker.add(tickerCb);
        gsap.ticker.lagSmoothing(0);

        ScrollTrigger.scrollerProxy(document.documentElement, {
            scrollTop(value) {
                if (arguments.length && value !== undefined) {
                    lenisInstance.scrollTo(value, { immediate: true });
                    return lenisInstance.scroll; // Lenis.scroll
                }
                return lenisInstance.scroll;
            },
            getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            },
        });

        const onResize = () => {
            ScrollTrigger.refresh();
        };
        window.addEventListener("resize", onResize);

        return () => {
            lenisInstance.destroy();
            gsap.ticker.remove(tickerCb);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <SmoothScrollContext.Provider value={lenis}>
            {children}
        </SmoothScrollContext.Provider>
    );
}
