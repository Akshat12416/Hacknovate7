"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/stranger-things/Navbar";
import StickySection from "@/components/stranger-things/StickySection/StickySection";
import FacultySection from "@/components/stranger-things/FacultySection/FacultySection";

export default function TeamsPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'students' | 'faculty'>('students');

    // Smooth scroll to top when changing tabs
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeTab]);

    return (
        <main className="relative bg-black min-h-screen">
            <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} alwaysVisible />

            {/* Premium Tab Bar (Enhanced Stranger Things Glassmorphism Aesthetic with Sliding Active State) */}
            <div className="absolute top-[65px] left-1/2 -translate-x-1/2 md:fixed md:left-auto md:translate-x-0 md:right-5 xl:right-8 md:top-1/2 md:-translate-y-1/2 z-[100] flex flex-row md:flex-col p-1.5 md:p-2 bg-black/40 backdrop-blur-2xl border border-white/10 ring-1 ring-white/5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_20px_rgba(220,38,38,0.15)]">

                {/* Animated Sliding Active Background */}
                <div
                    className={`absolute transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] bg-gradient-to-br from-red-600/80 to-red-900/80 border border-red-500/50 rounded-full z-0 shadow-[0_0_20px_rgba(220,38,38,0.5),inset_0_0_12px_rgba(255,255,255,0.2)] 
                        ${activeTab === 'students'
                            ? 'left-1.5 right-[calc(50%+2px)] top-1.5 bottom-1.5 md:left-2 md:right-2 md:top-2 md:bottom-[calc(50%+2px)]'
                            : 'left-[calc(50%+2px)] right-1.5 top-1.5 bottom-1.5 md:left-2 md:right-2 md:top-[calc(50%+2px)] md:bottom-2'
                        }`}
                />

                <button
                    onClick={() => setActiveTab('students')}
                    className={`flex-1 relative px-4 py-2 md:px-2 md:py-8 rounded-full transition-all duration-500 z-10 flex items-center justify-center group ${activeTab === 'students'
                        ? 'text-white'
                        : 'text-neutral-400 hover:text-white'
                        }`}
                >
                    <span className={`md:[writing-mode:vertical-rl] md:rotate-180 text-[10px] md:text-[11px] font-bold tracking-[0.1em] md:tracking-[0.2em] transition-all duration-300 ${activeTab === 'students' ? 'text-shadow-glow drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]'}`}>
                        STUDENTS
                    </span>
                </button>

                <div className="my-auto mx-1 w-px h-4 md:mx-0 md:my-2 md:w-full md:h-px bg-gradient-to-b md:bg-gradient-to-r from-transparent via-white/20 to-transparent shrink-0 z-10" />

                <button
                    onClick={() => setActiveTab('faculty')}
                    className={`flex-1 relative px-4 py-2 md:px-2 md:py-8 rounded-full transition-all duration-500 z-10 flex items-center justify-center group ${activeTab === 'faculty'
                        ? 'text-white'
                        : 'text-neutral-400 hover:text-white'
                        }`}
                >
                    <span className={`md:[writing-mode:vertical-rl] md:rotate-180 text-[10px] md:text-[11px] font-bold tracking-[0.1em] md:tracking-[0.2em] transition-all duration-300 ${activeTab === 'faculty' ? 'text-shadow-glow drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]'}`}>
                        FACULTY
                    </span>
                </button>
            </div>

            <div className="transition-opacity duration-700">
                {activeTab === 'students' ? <StickySection /> : <FacultySection />}
            </div>
        </main>
    );
}

// Add global glow utility class dynamically if it doesn't exist
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = `
        .text-shadow-glow {
            text-shadow: 0 0 10px rgba(255,0,0,0.6);
        }
    `;
    document.head.appendChild(style);
}
