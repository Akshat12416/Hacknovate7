"use client";

import React from "react";
import Image from "next/image";
import localFont from "next/font/local";

const trackFont = localFont({
    src: [
        // Book (regular)
        { path: "../../../public/font/BenguiatStd-Book.woff2", weight: "400", style: "normal" },
        { path: "../../../public/font/BenguiatStd-Book.woff", weight: "400", style: "normal" },
        { path: "../../../public/font/BenguiatStd-Book.ttf", weight: "400", style: "normal" },
        // Book Italic
        { path: "../../../public/font/BenguiatStd-BookItalic.woff2", weight: "400", style: "italic" },
        { path: "../../../public/font/BenguiatStd-BookItalic.woff", weight: "400", style: "italic" },
        { path: "../../../public/font/BenguiatStd-BookItalic.ttf", weight: "400", style: "italic" },
        // Medium
        { path: "../../../public/font/BenguiatStd-Medium.woff2", weight: "500", style: "normal" },
        { path: "../../../public/font/BenguiatStd-Medium.woff", weight: "500", style: "normal" },
        { path: "../../../public/font/BenguiatStd-Medium.ttf", weight: "500", style: "normal" },
        // Medium Italic
        { path: "../../../public/font/BenguiatStd-MediumItalic.woff2", weight: "500", style: "italic" },
        { path: "../../../public/font/BenguiatStd-MediumItalic.woff", weight: "500", style: "italic" },
        { path: "../../../public/font/BenguiatStd-MediumItalic.ttf", weight: "500", style: "italic" },
        // Bold
        { path: "../../../public/font/BenguiatStd-Bold.woff2", weight: "700", style: "normal" },
        { path: "../../../public/font/BenguiatStd-Bold.woff", weight: "700", style: "normal" },
        { path: "../../../public/font/BenguiatStd-Bold.ttf", weight: "700", style: "normal" },
        // Bold Italic
        { path: "../../../public/font/BenguiatStd-BoldItalic.woff2", weight: "700", style: "italic" },
        { path: "../../../public/font/BenguiatStd-BoldItalic.woff", weight: "700", style: "italic" },
        { path: "../../../public/font/BenguiatStd-BoldItalic.ttf", weight: "700", style: "italic" },
    ],
    variable: "--font-track",
    display: "swap",
});

const SOCIAL_LINKS = [
    {
        name: "Instagram",
        label: "Jonathan’s Darkroom",
        url: "https://www.instagram.com/hacknovate.abesit",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
        ),
    },
    {
        name: "Facebook",
        label: "The AV Club",
        url: "https://www.facebook.com/hacknovate",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
        ),
    },
    {
        name: "Twitter",
        label: "Walkie-Talkie Channel",
        url: "https://x.com/hacknovate",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
        ),
    },
    {
        name: "LinkedIn",
        label: "Official Records",
        url: "https://www.linkedin.com/company/hacknovate/",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z"></path>
            </svg>
        ),
    },
];

export function Footer() {
    return (
        <footer
            className={`relative w-full bg-black text-white pt-24 md:pt-32 pb-6 md:pb-8 px-8 md:px-16 overflow-hidden ${trackFont.variable}`}
            style={{ fontFamily: "var(--font-track), serif" }}
        >
            {/* Stranger Things "Upside Down" Atmospheric Background */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-black">
                {/* Provided Texture Image Layer - The Primary Texture */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/footer/Whisk_ceb0427f925ba3aa2da4a808de0a47bceg.png"
                        alt="Background Texture"
                        fill
                        className="object-cover opacity-60 contrast-125 brightness-75"
                        priority
                    />
                </div>

                {/* Soft atmospheric subtle black/shadow vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.8)_0%,transparent_70%)] shadow-[inset_0_0_80px_rgba(0,0,0,0.9)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_45%,rgba(0,0,0,0.1)_0%,transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_25%,rgba(0,0,0,0.1)_0%,transparent_60%)]" />

                {/* Transition & Vignette Layers - Blends edges but preserves center detail */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black/10 z-10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_110%)] z-10" />

                {/* Retro CRT Scanlines Effect */}
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="flex flex-col items-center mb-16 border-b border-white/5 pb-10 w-full">
                    <div className="text-center mb-10 pt-10">
                        <h2 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-2 font-track text-white">
                            HACKNOVATE 7.0
                        </h2>
                        <p className="text-red-600 font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs italic tracking-widest">
                            "Coders dont lie"
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <Image
                            src="/abesit.png"
                            alt="ABESIT Logo"
                            width={160}
                            height={50}
                            className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        />
                        <div className="hidden md:block h-8 w-[1px] bg-white/20" />
                        <div className="text-center md:text-left">
                            <h3 className="text-base md:text-lg font-bold uppercase tracking-[0.2em] font-track text-white mb-0.5">
                                ABESIT Group of Institutions
                            </h3>
                            <p className="text-white/70 italic text-[10px] md:text-xs tracking-widest leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                "Where Innovation Meets Reality"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main 3-Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-4 lg:gap-8">
                    {/* Column 1: Contacts */}
                    <div className="flex flex-col items-center md:items-start space-y-8 text-center md:text-left">
                        <div className="w-full">
                            <h4 className="text-xl font-bold uppercase tracking-widest border-b border-red-900/50 pb-2 mb-6 text-red-500 w-full text-center md:text-left">
                                Hawkins Contacts
                            </h4>
                            <p className="text-white/90 text-sm mb-8 italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] max-w-sm mx-auto md:mx-0">
                                Connect with us through these inter-dimensional communication channels:
                            </p>
                            <div className="grid grid-cols-2 gap-6 w-full max-w-[280px] mx-auto md:mx-0">
                                {SOCIAL_LINKS.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex flex-col items-center space-y-2"
                                    >
                                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center group-hover:bg-red-900/20 group-hover:border-red-500/50 transition-all duration-300">
                                            <div className="text-gray-300 group-hover:text-red-500 transition-colors">
                                                {social.icon}
                                            </div>
                                        </div>
                                        <span className="text-[10px] uppercase tracking-tighter text-white/60 group-hover:text-red-400 drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
                                            {social.label}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Column 2: Location */}
                    <div className="flex flex-col items-center space-y-6">
                        <h4 className="text-xl font-bold uppercase tracking-widest border-b border-red-900/50 pb-2 mb-6 text-red-500 w-full text-center">
                            The Gateway Coordinates
                        </h4>
                        <div className="w-full aspect-video rounded-lg overflow-hidden border border-white/10 grayscale contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                            <iframe
                                src="https://maps.google.com/maps?q=28.6342725,77.4483716&t=k&z=16&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                        <div className="text-center w-full max-w-[280px] mx-auto bg-white/5 border border-white/10 p-4 rounded-lg backdrop-blur-sm shadow-xl">
                            <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2 font-track">The Gateway Location:</p>
                            <p className="text-[10px] md:text-xs text-white/90 leading-relaxed uppercase tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                ABESIT Campus Road, NE 3, near Crossing Republic, Ghaziabad, Uttar Pradesh 201009
                            </p>
                        </div>
                    </div>

                    {/* Column 3: Communication */}
                    <div className="flex flex-col items-center md:items-start space-y-8 text-center md:text-left">
                        <div className="w-full">
                            <h4 className="text-xl font-bold uppercase tracking-widest border-b border-red-900/50 pb-2 mb-6 text-red-500 w-full text-center md:text-left">
                                Comm Transmissions
                            </h4>
                            <div className="space-y-5">
                                {/* Email */}
                                <div>
                                    <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-1.5">Upside Down Mail:</p>
                                    <a href="mailto:hacknovate@abesit.edu.in" className="text-white/90 text-sm hover:text-red-400 transition-colors duration-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                        hacknovate@abesit.edu.in
                                    </a>
                                </div>

                                {/* Phone Numbers */}
                                <div>
                                    <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2">Walkie-Talkie Frequencies:</p>
                                    <div className="space-y-1.5">
                                        <a href="tel:+917061557021" className="block text-white/90 text-sm hover:text-red-400 transition-colors duration-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                            +91 70615 57021 - <span className="text-white/60">Gunabh</span>
                                        </a>
                                        <a href="tel:+919971337999" className="block text-white/90 text-sm hover:text-red-400 transition-colors duration-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                            +91 99713 37999 - <span className="text-white/60">Akshat Gour</span>
                                        </a>
                                        <a href="tel:+917217868173" className="block text-white/90 text-sm hover:text-red-400 transition-colors duration-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                            +91 72178 68173 - <span className="text-white/60">Aayush Shukla</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Special Notification Box */}
                        <div className="w-full bg-red-950/20 border border-red-900/30 p-6 rounded-lg relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-600 shadow-[0_0_10px_rgba(255,0,0,0.8)]" />
                            <h5 className="text-red-500 text-xs font-black tracking-[0.2em] uppercase mb-4">
                                HAWKINS GAZETTE NOTICE
                            </h5>
                            <p className="text-white/80 text-xs italic leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                "The grand event shall commence when the portal opens. Bring your systems and prepare for a journey into the unknown. Innovation awaits beyond the rift!"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-8 pt-6 border-t border-white/5 text-center space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        © 2026 THE HACKNOVATE POST | All Rights Reserved | "Stay Curious"
                    </p>
                    <p className="text-[9px] text-red-900 uppercase font-bold tracking-widest">
                        Transmitted by ABESIT Creative Labs
                    </p>
                </div>
            </div>
        </footer>
    );
}
