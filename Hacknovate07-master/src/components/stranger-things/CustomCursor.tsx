"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const auraRef = useRef<HTMLDivElement>(null);

    const [isHovering, setIsHovering] = useState(false);
    const [isOverRed, setIsOverRed] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useGSAP(() => {
        const moveDotX = gsap.quickTo(dotRef.current, "x", { duration: 0.08, ease: "power3" });
        const moveDotY = gsap.quickTo(dotRef.current, "y", { duration: 0.08, ease: "power3" });

        const moveAuraX = gsap.quickTo(auraRef.current, "x", { duration: 0.35, ease: "power3" });
        const moveAuraY = gsap.quickTo(auraRef.current, "y", { duration: 0.35, ease: "power3" });

        const handleMove = (e: MouseEvent) => {
            if (!isVisible) setIsVisible(true);

            moveDotX(e.clientX);
            moveDotY(e.clientY);

            moveAuraX(e.clientX);
            moveAuraY(e.clientY);
        };

        const handleOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            const isInteractive = !!(
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button")
            );

            setIsHovering(isInteractive);

            const classStr = target.className?.toString() || "";
            const overRed =
                classStr.includes("text-red") ||
                classStr.includes("bg-red") ||
                target.getAttribute("data-cursor-flip") === "true";

            setIsOverRed(overRed);
        };

        const hide = () => setIsVisible(false);
        const show = () => setIsVisible(true);

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseover", handleOver);
        document.addEventListener("mouseleave", hide);
        document.addEventListener("mouseenter", show);

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseover", handleOver);
            document.removeEventListener("mouseleave", hide);
            document.removeEventListener("mouseenter", show);
        };
    }, []);

    useGSAP(() => {
        const color = isOverRed ? "#ffffff" : "#ff2a2a";

        gsap.to(dotRef.current, {
            scale: isHovering ? 0.6 : 1,
            backgroundColor: color,
            duration: 0.25,
            ease: "power2.out"
        });

        gsap.to(auraRef.current, {
            scale: isHovering ? 2.2 : 1,
            opacity: isHovering ? 0.18 : 0.10,
            duration: 0.35,
            ease: "power2.out"
        });
    }, [isHovering, isOverRed]);

    return (
        <div className={`hidden lg:block fixed inset-0 z-[9999] pointer-events-none transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>

            {/* Soft Aura */}
            <div
                ref={auraRef}
                className="absolute top-0 left-0 w-14 h-14 -ml-7 -mt-7 rounded-full"
                style={{
                    background: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(6px)"
                }}
            />

            {/* Core Dot */}
            <div
                ref={dotRef}
                className="absolute top-0 left-0 w-2.5 h-2.5 -ml-[5px] -mt-[5px] rounded-full"
                style={{
                    backgroundColor: "#ff2a2a"
                }}
            />
        </div>
    );
}
