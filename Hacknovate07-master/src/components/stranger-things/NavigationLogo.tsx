"use client";

import { usePathname } from "next/navigation";

export function NavigationLogo() {
    const pathname = usePathname();

    if (pathname === "/") return null;

    return (
        <a href="/" className="fixed top-6 left-6 md:left-10 z-[110] transition-transform hover:scale-110 active:scale-95">
            <img
                src="/navlogo.png"
                alt="Hacknovate 7.0 Home"
                className="w-16 md:w-24 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]"
            />
        </a>
    );
}
