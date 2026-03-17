"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { SERVICES } from "@/data/services";

const SERVICE_HEIGHT = 98; // px — corresponds to CSS .service height + margin
const IMAGE_HEIGHT = 400;  // px — updated to match CSS portrait height

/**
 * useScrollAnimation — encapsulates all GSAP / ScrollTrigger scroll-driven
 * animation logic that was previously in script.js.
 *
 * Returns refs that must be attached to the corresponding DOM elements.
 */
export function useScrollAnimation() {
    const stickySectionRef = useRef(null);
    const indicatorRef = useRef(null);
    const servicesRef = useRef([]);
    const serviceImgRef = useRef(null);
    const serviceCopyRef = useRef(null);
    const currentCountRef = useRef(null);
    const progressRef = useRef(null);

    // Stable callback for text animation (avoids re-creating on every render)
    const splitTextRef = useRef(null);

    const animateTextChange = useCallback((index) => {
        return new Promise((resolve) => {
            if (!splitTextRef.current || !serviceCopyRef.current) {
                resolve();
                return;
            }

            gsap.to(splitTextRef.current.lines, {
                opacity: 0,
                y: -20,
                duration: 0.45,
                stagger: 0.025,
                ease: "power3.inOut",
                onComplete: () => {
                    splitTextRef.current?.revert();
                    serviceCopyRef.current.textContent = SERVICES[index].description;

                    splitTextRef.current = new SplitType(serviceCopyRef.current, {
                        types: "lines",
                    });

                    gsap.set(splitTextRef.current.lines, { opacity: 0, y: 22 });
                    gsap.to(splitTextRef.current.lines, {
                        opacity: 1,
                        y: 0,
                        duration: 0.45,
                        stagger: 0.025,
                        ease: "power3.out",
                        onComplete: resolve,
                    });
                },
            });
        });
    }, []);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const stickySection = stickySectionRef.current;
        const indicator = indicatorRef.current;
        const serviceImgEl = serviceImgRef.current;
        const serviceCopyEl = serviceCopyRef.current;
        const currentCountEl = currentCountRef.current;

        if (
            !stickySection ||
            !indicator ||
            !serviceImgEl ||
            !serviceCopyEl ||
            !currentCountEl
        )
            return;

        // Initialise description text and split it
        serviceCopyEl.textContent = SERVICES[0].description;
        splitTextRef.current = new SplitType(serviceCopyEl, { types: "lines" });

        // ── Measure indicator widths dynamically ──────────────────────────────
        const measureEl = document.createElement("div");
        measureEl.style.cssText = `
      position: absolute;
      visibility: hidden;
      height: auto;
      width: auto;
      white-space: nowrap;
      font-family: "PP NeueBit", sans-serif;
      font-size: 60px;
      font-weight: 600;
      text-transform: uppercase;
    `;
        document.body.appendChild(measureEl);

        const serviceWidths = servicesRef.current.map((el) => {
            if (!el) return 0;
            measureEl.textContent = el.querySelector("p")?.textContent ?? "";
            return measureEl.offsetWidth;
        });
        document.body.removeChild(measureEl);

        // Set initial indicator position
        gsap.set(indicator, {
            width: serviceWidths[0] ?? 120,
            xPercent: -50,
            left: "50%",
            y: 0,
        });

        // ── Glow helpers ──────────────────────────────────────────────────────
        const GLOW_ON = { color: "#fff", textShadow: "0 0 15px rgba(220,0,0,1), 0 0 40px rgba(220,0,0,0.8)", duration: 0.3, ease: "power2.out" };
        const GLOW_OFF = { color: "#555", textShadow: "none", duration: 0.3, ease: "power2.out" };

        const setLabelGlow = (index, on) => {
            const p = servicesRef.current[index]?.querySelector("p");
            if (p) gsap.to(p, on ? GLOW_ON : GLOW_OFF);
        };

        // Initialize: first label glows
        setLabelGlow(0, true);
        let hoveredIndex = -1;

        // ── Apply GSAP Hover Animation on Titles ──────────────────────────────
        servicesRef.current.forEach((serviceEl, index) => {
            if (!serviceEl) return;
            const titleP = serviceEl.querySelector("p");
            if (!titleP) return;

            serviceEl.addEventListener("mouseenter", () => {
                hoveredIndex = index;

                // Glow the hovered label
                setLabelGlow(index, true);

                // Trigger the existing text description update on hover
                animateTextChange(index);

                // Update the image using the same animation rules as normal scrolling
                gsap.to(serviceImgEl, {
                    y: -(index * IMAGE_HEIGHT),
                    duration: 0.5,
                    ease: "power3.inOut",
                    overwrite: "auto",
                });
            });

            serviceEl.addEventListener("mouseleave", () => {
                hoveredIndex = -1;
                // Only dim if this label is not the current scroll-active one
                if (index !== currentIndex) {
                    setLabelGlow(index, false);
                }
            });
        });

        // ── ScrollTrigger ─────────────────────────────────────────────────────
        const scrollPerService = 600;
        const stickyHeight = scrollPerService * SERVICES.length;
        let currentIndex = 0;

        const trigger = ScrollTrigger.create({
            trigger: stickySection,
            start: "top top",
            end: `${stickyHeight}px`,
            pin: true,
            onUpdate: async (self) => {
                // Progress bar
                gsap.set(progressRef.current, { scaleY: self.progress });

                const scrollPos = Math.max(0, self.scroll() - self.start);
                const activeIndex = Math.min(
                    Math.floor(scrollPos / scrollPerService),
                    SERVICES.length - 1
                );

                if (activeIndex >= 0 && currentIndex !== activeIndex) {
                    currentIndex = activeIndex;

                    // Update active class + glow
                    servicesRef.current.forEach((s, i) => {
                        s?.classList.remove("active");
                        // Only dim labels that aren't being hovered
                        if (i !== hoveredIndex) setLabelGlow(i, false);
                    });
                    servicesRef.current[activeIndex]?.classList.add("active");
                    setLabelGlow(activeIndex, true);

                    await Promise.all([
                        // Move indicator under active label
                        gsap.to(indicator, {
                            y: activeIndex * SERVICE_HEIGHT,
                            width: serviceWidths[activeIndex] ?? 120,
                            duration: 0.5,
                            ease: "power3.inOut",
                            overwrite: true,
                        }),
                        // Scroll image strip
                        gsap.to(serviceImgEl, {
                            y: -(activeIndex * IMAGE_HEIGHT),
                            duration: 0.5,
                            ease: "power3.inOut",
                            overwrite: true,
                        }),
                        // Animate counter
                        gsap.to(currentCountEl, {
                            innerText: activeIndex + 1,
                            snap: { innerText: 1 },
                            duration: 0.3,
                            ease: "power3.out",
                        }),
                        // Animate description copy
                        animateTextChange(activeIndex),
                    ]);
                }
            },
        });

        return () => {
            trigger.kill();
            splitTextRef.current?.revert();
        };
    }, [animateTextChange]);

    /**
     * The service item refs are set via a callback ref so we get a stable
     * array without needing useCallback on every item.
     */
    const setServiceRef = (index) => (el) => {
        servicesRef.current[index] = el;
    };

    return {
        stickySectionRef,
        indicatorRef,
        serviceImgRef,
        serviceCopyRef,
        currentCountRef,
        progressRef,
        setServiceRef,
    };
}
