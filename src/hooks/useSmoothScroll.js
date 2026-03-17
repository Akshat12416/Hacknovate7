"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * useSmoothScroll — initialises Lenis smooth-scroll and wires it to GSAP's
 * ScrollTrigger so that GSAP animations are perfectly synced with inertia scroll.
 *
 * Returns the Lenis instance so callers can programmatically scroll if needed.
 */
export function useSmoothScroll() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
            lerp: 0.08,
            smoothWheel: true,
        });

        // Keep ScrollTrigger in sync with Lenis scroll position
        lenis.on("scroll", ScrollTrigger.update);

        // Drive Lenis with GSAP's ticker so timing is frame-perfect
        const tickerCallback = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(tickerCallback);
            lenis.destroy();
        };
    }, []);
}
