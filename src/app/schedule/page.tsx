"use client";

import { useState } from "react";
import { Navbar } from "@/components/stranger-things/Navbar";
import ScheduleTable from "@/components/stranger-things/ScheduleTable";
import { OFFLINE_SCHEDULE, ONLINE_SCHEDULE } from "@/data/scheduleData";

export default function SchedulePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scheduleMode, setScheduleMode] = useState<'offline' | 'online'>('offline');

    const activeScheduleData = scheduleMode === 'offline' ? OFFLINE_SCHEDULE : ONLINE_SCHEDULE;

    return (
        <main className="relative bg-black min-h-screen overflow-x-hidden">
            <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} alwaysVisible />

            {/* Horizontal Segmented Toggle Bar */}
            <div className="absolute top-[85px] md:top-[95px] flex flex-row p-1.5 bg-black/60 backdrop-blur-xl border border-red-900/40 ring-1 ring-red-500/20 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_20px_rgba(220,38,38,0.15)] z-[100] left-1/2 -translate-x-1/2">
                
                {/* Animated Sliding Active Background */}
                <div
                    className={`absolute transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] bg-gradient-to-br from-red-600/80 to-red-900/80 border border-red-500/50 rounded-full z-0 shadow-[0_0_20px_rgba(220,38,38,0.5),inset_0_0_12px_rgba(255,255,255,0.2)] top-1.5 bottom-1.5 w-[calc(50%-6px)]
                        ${scheduleMode === 'offline' ? 'left-1.5' : 'left-[50%]'}`}
                />

                <button
                    onClick={() => setScheduleMode('offline')}
                    className={`relative w-28 md:w-36 py-2.5 rounded-full transition-all duration-500 z-10 flex items-center justify-center group ${scheduleMode === 'offline' ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
                >
                    <span className={`text-[10px] md:text-xs font-bold tracking-[0.2em] transition-all duration-300 ${scheduleMode === 'offline' ? 'text-shadow-glow drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]'}`}>
                        OFFLINE
                    </span>
                </button>

                <button
                    onClick={() => setScheduleMode('online')}
                    className={`relative w-28 md:w-36 py-2.5 rounded-full transition-all duration-500 z-10 flex items-center justify-center group ${scheduleMode === 'online' ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
                >
                    <span className={`text-[10px] md:text-xs font-bold tracking-[0.2em] transition-all duration-300 ${scheduleMode === 'online' ? 'text-shadow-glow drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]'}`}>
                        ONLINE
                    </span>
                </button>
            </div>

            {/* =========================
                 🎬 MAIN SECTION
            ========================= */}
            <section className="relative w-full min-h-screen py-10 pt-[150px] transition-opacity duration-700">
                {/* Static Background */}
                <div
                    className="fixed inset-0 z-0 opacity-20 block"
                    style={{
                        backgroundImage: "url('/assets/sponsors/background.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

                {/* Visual Depth Background */}
                <div
                    className="fixed inset-0 z-0 hidden md:block pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(circle at center, rgba(140,0,0,0.15), black 80%)",
                    }}
                />

                {/* =========================
                     🧱 SCHEDULE VIEW
                ========================= */}
                <ScheduleTable scheduleData={activeScheduleData} mode={scheduleMode} />
            </section>
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