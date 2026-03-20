"use client";
import { useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

interface NavbarProps {
    isMenuOpen: boolean;
    setIsMenuOpen: (isOpen: boolean) => void;
    alwaysVisible?: boolean;
    portalThreshold?: number;
}

const NAV_LINKS = [
    { label: "Team", href: "/teams" },
    { label: "Events", href: "/events" },
    { label: "Schedule", href: "/schedule" },
    { label: "Contact Us", href: "/contactus" },
];

// How long (ms) to wait after scroll stops before hiding the nav
const IDLE_HIDE_DELAY = 1500;

export function Navbar({
    isMenuOpen,
    setIsMenuOpen,
    alwaysVisible = false,
    portalThreshold = 3000,
}: NavbarProps) {
    const navContainerRef = useRef<HTMLDivElement>(null);
    const mobileNavRef    = useRef<HTMLDivElement>(null);
    const mobileMenuRef   = useRef<HTMLDivElement>(null);
    const menuIconRef     = useRef<SVGSVGElement>(null);
    const xIconRef        = useRef<SVGSVGElement>(null);

    // All scroll state in refs — zero re-renders
    const state = useRef({
        lastY:      0,
        velocity:   0,
        lastTime:   0,
        visible:    false,
        ticking:    false,
        idleTimer:  null as ReturnType<typeof setTimeout> | null,
    });

    /* ─────────────────────────────────────────
       ALWAYS VISIBLE MODE
    ───────────────────────────────────────── */
    useEffect(() => {
        if (!alwaysVisible) return;
        const nav      = navContainerRef.current;
        const mobileNav = mobileNavRef.current;
        if (nav)      gsap.set(nav,      { y: 0, opacity: 1, pointerEvents: "auto" });
        if (mobileNav) gsap.set(mobileNav, { y: 0, opacity: 1 });
    }, [alwaysVisible]);

    /* ─────────────────────────────────────────
       DESKTOP — show while scrolling,
                 auto-hide after idle
    ───────────────────────────────────────── */
    useEffect(() => {
        const nav = navContainerRef.current;
        if (!nav || alwaysVisible || window.innerWidth < 768) return;

        const s = state.current;

        // Start hidden
        gsap.set(nav, { y: -72, opacity: 0, pointerEvents: "none" });

        const showNav = () => {
            // Cancel any pending hide timer — user is still scrolling
            if (s.idleTimer) { clearTimeout(s.idleTimer); s.idleTimer = null; }
            if (s.visible) return;
            s.visible = true;
            gsap.killTweensOf(nav);
            gsap.to(nav, {
                y: 0,
                opacity: 1,
                pointerEvents: "auto",
                duration: 0.45,
                ease: "power3.out",
                overwrite: true,
            });
        };

        const hideNav = (instant = false) => {
            if (!s.visible) return;
            s.visible = false;
            gsap.killTweensOf(nav);
            gsap.to(nav, {
                y: -72,
                opacity: 0,
                pointerEvents: "none",
                duration: instant ? 0.25 : 0.42,
                ease: instant ? "power2.in" : "power2.inOut",
                overwrite: true,
            });
        };

        const scheduleHide = () => {
            // If menu is open, never auto-hide
            if (isMenuOpen) return;
            if (s.idleTimer) clearTimeout(s.idleTimer);
            s.idleTimer = setTimeout(() => {
                hideNav();
            }, IDLE_HIDE_DELAY);
        };

        const onScroll = () => {
            if (s.ticking) return;
            s.ticking = true;

            requestAnimationFrame(() => {
                const now      = performance.now();
                const currentY = window.scrollY;
                const dt       = Math.max(now - s.lastTime, 1);

                // Smoothed velocity (px/ms) — lerp dampens jitter
                const raw     = (currentY - s.lastY) / dt;
                s.velocity    = s.velocity * 0.55 + raw * 0.45;

                const pastThreshold = currentY > portalThreshold;

                // Near footer — hide immediately, no idle timer
                const footer    = document.querySelector("footer");
                const nearFooter = footer
                    ? footer.getBoundingClientRect().top < 400
                    : false;

                if (nearFooter || !pastThreshold) {
                    // Hard zones — clear timer and hide
                    if (s.idleTimer) { clearTimeout(s.idleTimer); s.idleTimer = null; }
                    hideNav(true);
                } else {
                    // Past threshold: show while user is scrolling (any direction)
                    // and schedule the idle hide on every scroll event
                    showNav();
                    scheduleHide();
                }

                s.lastY    = currentY;
                s.lastTime = now;
                s.ticking  = false;
            });
        };

        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
            if (s.idleTimer) clearTimeout(s.idleTimer);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alwaysVisible, portalThreshold]);

    // Keep nav shown while menu is open — cancel any pending hide
    useEffect(() => {
        const nav = navContainerRef.current;
        if (!nav || window.innerWidth < 768) return;
        const s = state.current;

        if (isMenuOpen) {
            if (s.idleTimer) { clearTimeout(s.idleTimer); s.idleTimer = null; }
            if (!s.visible) {
                s.visible = true;
                gsap.killTweensOf(nav);
                gsap.to(nav, {
                    y: 0, opacity: 1, pointerEvents: "auto",
                    duration: 0.4, ease: "power3.out", overwrite: true,
                });
            }
        }
    }, [isMenuOpen]);

    /* ─────────────────────────────────────────
       MOBILE / TABLET — standard pattern:
       • Scroll DOWN  → hide navbar
       • Scroll UP    → show navbar immediately
       • Scroll stops → show navbar after 600ms
       • At top       → always visible
    ───────────────────────────────────────── */
    useEffect(() => {
        const mobileNav = mobileNavRef.current;
        if (!mobileNav || window.innerWidth >= 768) return;

        gsap.set(mobileNav, { y: 0, opacity: 1 });

        let lastY      = window.scrollY;
        let lastTime   = performance.now();
        let velocity   = 0;
        let mVisible   = true;
        let rafId      = 0;

        const showMobile = () => {
            if (mVisible) return;
            mVisible = true;
            gsap.killTweensOf(mobileNav);
            gsap.to(mobileNav, {
                y: 0, opacity: 1,
                duration: 0.36, ease: "power3.out", overwrite: true,
            });
        };

        const hideMobile = () => {
            if (!mVisible || isMenuOpen) return;
            mVisible = false;
            gsap.killTweensOf(mobileNav);
            gsap.to(mobileNav, {
                y: -72, opacity: 0,
                duration: 0.28, ease: "power2.inOut", overwrite: true,
            });
        };

        const onScroll = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const now      = performance.now();
                const currentY = window.scrollY;
                const dt       = Math.max(now - lastTime, 1);

                // Smoothed velocity (px/ms)
                const raw = (currentY - lastY) / dt;
                velocity  = velocity * 0.6 + raw * 0.4;

                const atTop         = currentY < 60;
                const scrollingDown = velocity > 0.08;
                const scrollingUp   = velocity < -0.06;

                if (atTop) {
                    // Always visible at very top
                    showMobile();
                } else if (scrollingDown) {
                    // Going down — hide
                    hideMobile();
                } else if (scrollingUp) {
                    // Any upward scroll — show immediately
                    showMobile();
                }
                // Stopped / barely moving — do nothing, keep current state

                lastY    = currentY;
                lastTime = now;
            });
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(rafId);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ─────────────────────────────────────────
       ICON INIT
    ───────────────────────────────────────── */
    useGSAP(() => {
        gsap.set(xIconRef.current,    { opacity: 0, scale: 0, rotation: -90 });
        gsap.set(menuIconRef.current, { opacity: 1, scale: 1, rotation: 0 });
    }, []);

    /* ─────────────────────────────────────────
       MOBILE MENU TOGGLE
    ───────────────────────────────────────── */
    const handleMenuToggle = () => {
        if (isMenuOpen) {
            const tl = gsap.timeline({ onComplete: () => setIsMenuOpen(false) });
            tl.to(".menu-item", { opacity: 0, y: -8, duration: 0.16, stagger: 0.04 })
              .to(mobileMenuRef.current, { height: 0, opacity: 0, duration: 0.36, ease: "power2.inOut" })
              .to(menuIconRef.current,   { rotation: 0,  opacity: 1, scale: 1, duration: 0.26 }, "-=0.26")
              .to(xIconRef.current,      { rotation: -90, opacity: 0, scale: 0, duration: 0.26 }, "-=0.26");
        } else {
            setIsMenuOpen(true);
            requestAnimationFrame(() => {
                const tl = gsap.timeline();
                gsap.set(mobileMenuRef.current, { height: 0, opacity: 0 });
                tl.to(mobileMenuRef.current, { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" })
                  .fromTo(".menu-item",
                    { opacity: 0, y: -14 },
                    { opacity: 1, y: 0, stagger: 0.08, duration: 0.3, ease: "power2.out" },
                    "-=0.2"
                  )
                  .to(menuIconRef.current, { rotation: 90, opacity: 0, scale: 0, duration: 0.26 }, 0)
                  .to(xIconRef.current,    { rotation: 0,  opacity: 1, scale: 1, duration: 0.26 }, 0);
            });
        }
    };

    return (
        <div className="contents">
            {/* ── Desktop Nav ── */}
            <div className="hidden md:flex fixed inset-x-0 top-6 z-[100] justify-center">
                <div
                    ref={navContainerRef}
                    className="whitespace-nowrap bg-white/5 backdrop-blur-lg border border-white/10 rounded-full h-16 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] px-8 lg:px-12"
                    style={{ willChange: "transform, opacity" }}
                >
                    <nav className="flex gap-8 lg:gap-12" style={{ fontFamily: "'ITC Benguiat Std', serif" }}>
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-white hover:text-red-500 text-lg lg:text-xl"
                                style={{
                                    display: "inline-block",
                                    transition: "color 0.2s ease, transform 0.2s ease",
                                }}
                                onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.1, duration: 0.2, ease: "power2.out" })}
                                onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1.0, duration: 0.2, ease: "power2.out" })}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* ── Mobile Nav ── */}
            <div
                ref={mobileNavRef}
                className="fixed top-0 inset-x-0 w-full md:hidden z-[100]"
                style={{ willChange: "transform, opacity" }}
            >
                <div className="flex justify-between items-center px-5 py-4">
                    <div />
                    <button
                        onClick={handleMenuToggle}
                        className="w-12 h-12 bg-black/80 border border-white/20 rounded-full text-white flex items-center justify-center shadow-lg active:scale-95"
                        style={{ transition: "transform 0.15s ease" }}
                        aria-label="Toggle menu"
                    >
                        <Menu ref={menuIconRef} size={22} className="absolute" />
                        <X    ref={xIconRef}    size={22} className="absolute opacity-0" />
                    </button>
                </div>

                {isMenuOpen && (
                    <div
                        ref={mobileMenuRef}
                        className="absolute top-0 left-0 w-full bg-black/95 border-b border-white/10 overflow-hidden backdrop-blur-xl"
                    >
                        <button
                            onClick={handleMenuToggle}
                            className="absolute top-5 right-5 w-10 h-10 bg-white/10 border border-white/20 rounded-full text-white flex items-center justify-center z-10 active:scale-95"
                            style={{ transition: "transform 0.15s ease" }}
                        >
                            <X size={20} />
                        </button>
                        <nav
                            className="flex flex-col items-start px-8 pt-24 pb-10 gap-6"
                            style={{ fontFamily: "'ITC Benguiat Std', serif" }}
                        >
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={handleMenuToggle}
                                    className="menu-item text-white hover:text-red-500 text-2xl opacity-0"
                                    style={{ transition: "color 0.2s ease" }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}