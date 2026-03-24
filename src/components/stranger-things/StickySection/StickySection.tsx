"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SERVICES } from "@/data/teamServices";
import { Linkedin } from "lucide-react";
import styles from "./StickySection.module.css";

const formatName = (fullName: string) => {
    if (!fullName) return "";
    const first = fullName.trim().split(/\s+/)[0];
    return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
};

const SCROLL_PER = 800; // px of scroll per image transition

export default function StickySection() {
    const wrapperRef   = useRef<HTMLDivElement>(null);   // ← NEW outer scroll wrapper
    const sectionRef   = useRef<HTMLElement>(null);
    const layerRefs    = useRef<(HTMLDivElement | null)[]>([]);
    const bgRef        = useRef<HTMLDivElement>(null);
    const progressRef  = useRef<HTMLDivElement>(null);
    const labelRefs    = useRef<(HTMLDivElement | null)[]>([]);
    const triggerRef   = useRef<ScrollTrigger | null>(null);
    const headingRef   = useRef<HTMLHeadingElement>(null);
    const galleryRef   = useRef<HTMLDivElement>(null);
    const membersRef   = useRef<HTMLDivElement>(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const prevIndexRef = useRef(0);

    /* ── GSAP: 3D flip + parallax bg ─────────────────────── */
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

        const section = sectionRef.current;
        const bgEl    = bgRef.current;
        if (!section || !bgEl) return;

        const count       = SERVICES.length;
        const totalScroll = SCROLL_PER * (count - 1);

        // Set initial states for all layers
        layerRefs.current.forEach((layer, i) => {
            if (!layer) return;
            if (i === 0) {
                gsap.set(layer, { rotateX: 0, opacity: 1, zIndex: count });
            } else {
                gsap.set(layer, { rotateX: 90, opacity: 0, zIndex: count - i });
            }
        });

        const tl = gsap.timeline({ paused: true });

        for (let i = 0; i < count - 1; i++) {
            const current = layerRefs.current[i];
            const next    = layerRefs.current[i + 1];
            if (!current || !next) continue;

            tl.to(current, {
                rotateX: -90,
                opacity: 0,
                duration: 1,
                ease: "power2.inOut",
            }, i);

            tl.fromTo(next,
                { rotateX: 90, opacity: 0 },
                { rotateX: 0,  opacity: 1, duration: 1, ease: "power2.inOut" },
                i
            );
        }

        // Parallax background travels over full scroll distance
        tl.fromTo(bgEl,
            { y: 0 },
            { y: -2400, duration: count - 1, ease: "none" },
            0
        );

        const st = ScrollTrigger.create({
            trigger:       section,
            start:         "top top",
            end:           `+=${totalScroll}`,
            pin:           true,          // pins the section in place while scrolling
            pinSpacing:    true,          // pushes content below down so normal page flow is preserved
            anticipatePin: 1,
            scrub:         0.6,           // smooth scrub — increase for slower catch-up
            animation:     tl,
            onUpdate: (self) => {
                if (progressRef.current) {
                    gsap.set(progressRef.current, { scaleY: self.progress });
                }
                const idx = Math.min(
                    Math.round(self.progress * (count - 1)),
                    count - 1
                );
                setActiveIndex(idx);
            },
        });

        triggerRef.current = st;

        return () => {
            st.kill();
            tl.kill();
        };
    }, []);

    /* ── Entrance animation on mount ─────────────────────── */
    useEffect(() => {
        const heading = headingRef.current;
        const gallery = galleryRef.current;
        const members = membersRef.current;

        if (heading) {
            gsap.fromTo(heading,
                { opacity: 0, y: -20, filter: "blur(6px)", letterSpacing: "0.25em" },
                {
                    opacity: 1, y: 0, filter: "blur(0px)", letterSpacing: "0.1em",
                    duration: 0.9, delay: 0.2, ease: "back.out(1.4)",
                }
            );
        }

        if (gallery) {
            gsap.fromTo(gallery,
                { opacity: 0, scale: 0.88, rotateY: -12, filter: "blur(5px)" },
                {
                    opacity: 1, scale: 1, rotateY: 0, filter: "blur(0px)",
                    duration: 1.0, delay: 0.45, ease: "power3.out",
                }
            );
        }

        labelRefs.current.forEach((el, i) => {
            if (!el) return;
            gsap.fromTo(el,
                { opacity: 0, x: -24 },
                {
                    opacity: 1, x: 0,
                    duration: 0.6,
                    delay: 0.35 + i * 0.07,
                    ease: "power2.out",
                }
            );
        });

        if (members) {
            gsap.fromTo(members,
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.7, delay: 1.0, ease: "power2.out" }
            );
        }
    }, []);

    /* ── Sync label highlights ────────────────────────────── */
    useEffect(() => {
        labelRefs.current.forEach((el, i) => {
            const p = el?.querySelector("p");
            if (!p) return;
            gsap.to(p, {
                color:      i === activeIndex ? "#fff" : "#555",
                textShadow: i === activeIndex
                    ? "0 0 15px rgba(220,0,0,1), 0 0 40px rgba(220,0,0,0.8)"
                    : "none",
                x:          i === activeIndex ? 5 : 0,
                duration:   0.3,
                ease:       "power2.out",
                overwrite:  "auto",
            });
        });

        if (galleryRef.current && activeIndex !== prevIndexRef.current) {
            gsap.fromTo(galleryRef.current,
                { boxShadow: "0 0 0px 0px rgba(220,38,38,0)" },
                {
                    boxShadow: "0 0 30px 4px rgba(220,38,38,0.35)",
                    duration: 0.25,
                    ease: "power2.out",
                    yoyo: true,
                    repeat: 1,
                }
            );
        }

        prevIndexRef.current = activeIndex;
    }, [activeIndex]);

    /* ── Click label → scroll to that image ──────────────── */
    const handleLabelClick = useCallback((index: number) => {
        const st = triggerRef.current;
        if (!st) return;
        gsap.to(window, {
            scrollTo: { y: st.start + index * SCROLL_PER, autoKill: false },
            duration: 0.6,
            ease:     "power2.inOut",
        });
    }, []);

    /* ── Badge ripple helper ──────────────────────────────── */
    const handleBadgeMouseDown = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            const badge = e.currentTarget;
            const rect  = badge.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width)  * 100;
            const y = ((e.clientY - rect.top)  / rect.height) * 100;
            badge.style.setProperty("--ripple-x", `${x}%`);
            badge.style.setProperty("--ripple-y", `${y}%`);
        },
        []
    );

    /* ── Label hover GSAP nudges ──────────────────────────── */
    const handleLabelHoverIn  = useCallback((el: HTMLParagraphElement | null) => {
        if (!el) return;
        gsap.to(el, { letterSpacing: "3px", x: 6, duration: 0.25, ease: "power2.out" });
    }, []);

    const handleLabelHoverOut = useCallback((el: HTMLParagraphElement | null, isActive: boolean) => {
        if (!el) return;
        gsap.to(el, {
            letterSpacing: isActive ? "2px" : "1px",
            x:             isActive ? 5 : 0,
            duration:      0.25,
            ease:          "power2.out",
        });
    }, []);

    const count = SERVICES.length;

    return (
        /*
         * SCROLL WRAPPER
         * ──────────────
         * This div provides the total scrollable height for ScrollTrigger.
         * The inner <section> gets pinned inside it while the user scrolls
         * through (count - 1) × SCROLL_PER pixels, advancing one image per step.
         */
        <div
            ref={wrapperRef}
            style={{
                position: "relative",
                height: `calc(100vh + ${(count - 1) * SCROLL_PER}px)`,
            }}
        >
            <section ref={sectionRef} className={styles.sticky}>
                {/* ── Background ── */}
                <div className={styles.bgContainer}>
                    <div ref={bgRef} className={styles.bgParallax}>
                        <Image
                            src="/team_bg/bg (1).jpg"
                            alt=""
                            fill
                            className={styles.bgImage}
                            sizes="100vw"
                            priority
                            quality={80}
                        />
                    </div>
                    <div className={styles.bgDarkOverlay} />
                    <div className={styles.bgVignette} />
                </div>

                {/* ── Heading ── */}
                <h1 ref={headingRef} className={styles.sectionHeading}>
                    <span className="lg:inline hidden">Teams</span>
                    <span className="lg:hidden inline">{SERVICES[activeIndex]?.label}</span>
                </h1>

                {/* ── Left: Team Labels ── */}
                <div className={styles.col}>
                    <div className={styles.services}>
                        {SERVICES.map((s, i) => (
                            <div
                                key={s.label}
                                ref={el => { labelRefs.current[i] = el; }}
                                className={`${styles.service} ${i !== activeIndex ? "md:block hidden" : "block"}`}
                                onClick={() => handleLabelClick(i)}
                                style={{ cursor: "pointer" }}
                            >
                                <p
                                    className="lg:block hidden"
                                    onMouseEnter={e => handleLabelHoverIn(e.currentTarget)}
                                    onMouseLeave={e => handleLabelHoverOut(e.currentTarget, i === activeIndex)}
                                >
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Right: 3D Flip Gallery + Members ── */}
                <div className={styles.col}>
                    <div ref={galleryRef} className={styles.flipGallery}>
                        {SERVICES.map((service, i) => (
                            <div
                                key={`layer-${i}`}
                                ref={el => { layerRefs.current[i] = el; }}
                                className={`${styles.flipLayer} ${i === activeIndex ? styles.flipLayerActive : ""}`}
                            >
                                <Image
                                    src={service.img}
                                    alt={service.label}
                                    width={800}
                                    height={800}
                                    className={styles.flipImage}
                                    priority={i === 0}
                                    sizes="(max-width:768px) 90vw, 400px"
                                    quality={85}
                                />
                                <div className={styles.imageVignette} />
                            </div>
                        ))}
                    </div>

                    {/* ── Member cards (cross-fade) ── */}
                    <div ref={membersRef} className={styles.membersWrapper}>
                        {SERVICES.map((service, i) => (
                            <div
                                key={`m-${i}`}
                                className={styles.memberPanel}
                                style={{
                                    opacity:       i === activeIndex ? 1 : 0,
                                    pointerEvents: i === activeIndex ? "auto" : "none",
                                    position:      i === activeIndex ? "relative" : "absolute",
                                }}
                            >
                                <div className={styles.memberGrid}>
                                    {(() => {
                                        if (service.rowLayout) {
                                            let offset = 0;
                                            return service.rowLayout.map((rowCount, rowIdx) => {
                                                const rowMembers = service.members.slice(offset, offset + rowCount);
                                                offset += rowCount;
                                                return (
                                                    <div key={rowIdx} className={styles.memberRow}>
                                                        {rowMembers.map((m, mIdx) => (
                                                            <a
                                                                key={mIdx}
                                                                href={m.linkedin}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={styles.memberBadge}
                                                                onMouseDown={handleBadgeMouseDown}
                                                            >
                                                                <span className={styles.memberName}>
                                                                    {service.label === "DECORATION TEAM"
                                                                        ? m.name
                                                                        : formatName(m.name)}
                                                                </span>
                                                                <Linkedin size={16} className={styles.memberIcon} />
                                                            </a>
                                                        ))}
                                                    </div>
                                                );
                                            });
                                        }
                                        return (
                                            <div className={styles.memberRow} style={{ flexWrap: "wrap" }}>
                                                {service.members.map((m, mIdx) => (
                                                    <a
                                                        key={mIdx}
                                                        href={m.linkedin}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.memberBadge}
                                                        onMouseDown={handleBadgeMouseDown}
                                                    >
                                                        <span className={styles.memberName}>
                                                            {service.label === "DECORATION TEAM"
                                                                ? m.name
                                                                : formatName(m.name)}
                                                        </span>
                                                        <Linkedin size={16} className={styles.memberIcon} />
                                                    </a>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Progress Bar ── */}
                <div className={styles.progressBar}>
                    <div ref={progressRef} className={styles.progress} />
                </div>
            </section>
        </div>
    );
}