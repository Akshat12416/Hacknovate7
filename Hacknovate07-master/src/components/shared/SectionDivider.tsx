"use client";
import React from "react";

/**
 * Cinematic Section Divider
 * A minimal, elegant 1px black line with a soft vertical smoke/shadow glow.
 * Designed to create a seamless transition between dark-themed sections.
 */
export function SectionDivider() {
    return (
        <div
            className="relative w-full pointer-events-none flex items-center justify-center overflow-visible"
            style={{
                height: "1px",
                zIndex: 25, // Above backgrounds, below most UI
            }}
        >
            {/* Subtle Gradient Fade Above */}
            <div
                className="absolute bottom-0 left-0 w-full"
                style={{
                    height: "80px",
                    background: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)",
                }}
            />

            {/* Subtle Gradient Fade Below */}
            <div
                className="absolute top-0 left-0 w-full"
                style={{
                    height: "80px",
                    background: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)",
                }}
            />

            {/* The 1px sharp black line */}
            <div className="absolute inset-0 w-full h-[1px] bg-black" />
        </div>
    );
}
