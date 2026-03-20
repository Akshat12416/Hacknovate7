"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";

export function NavigationLogo() {
    const pathname  = usePathname();
    const logoRef   = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const logo = logoRef.current;
        if (!logo) return;

        const isMobile = window.innerWidth < 768;

        /* ── Desktop: always visible, no scroll logic ── */
        if (!isMobile) {
            gsap.set(logo, { y: 0, opacity: 1, pointerEvents: "auto" });
            return;
        }

        /* ── Mobile / Tablet: same pattern as navbar ──
           • Scroll DOWN  → hide
           • Scroll UP    → show immediately
           • Scroll stops → show after 600ms
           • At top       → always visible
        ─────────────────────────────────────────────── */
        gsap.set(logo, { y: 0, opacity: 1 });

        let lastY      = window.scrollY;
        let lastTime   = performance.now();
        let velocity   = 0;
        let visible    = true;
        let rafId      = 0;

        const show = () => {
            if (visible) return;
            visible = true;
            gsap.killTweensOf(logo);
            gsap.to(logo, {
                y: 0,
                opacity: 1,
                pointerEvents: "auto",
                duration: 0.36,
                ease: "power3.out",
                overwrite: true,
            });
        };

        const hide = () => {
            if (!visible) return;
            visible = false;
            gsap.killTweensOf(logo);
            gsap.to(logo, {
                y: -56,
                opacity: 0,
                pointerEvents: "none",
                duration: 0.28,
                ease: "power2.inOut",
                overwrite: true,
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
                    show();
                } else if (scrollingDown) {
                    hide();
                } else if (scrollingUp) {
                    show();
                }
                // Stopped — do nothing, keep current state

                lastY    = currentY;
                lastTime = now;
            });
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(rafId);
        };
    }, []);

    if (pathname === "/") return null;

    return (
        <Link
            ref={logoRef}
            href="/"
            className="fixed top-6 left-6 md:left-10 z-[110] transition-transform hover:scale-110 active:scale-95"
            style={{ willChange: "transform, opacity" }}
        >
            <img
                src="/navlogo.png"
                alt="Hacknovate 7.0 Home"
                className="w-16 md:w-24 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]"
            />
        </Link>
    );
}