"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScheduleEvent } from "../../data/scheduleData";

const StoneSlabSchedule: React.FC<{ scheduleData: ScheduleEvent[], mode: 'offline' | 'online' }> = ({ scheduleData, mode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const listContainer = document.querySelector(".timeline-list") as HTMLElement;
      const items = gsap.utils.toArray<HTMLElement>(".timeline-item");
      if (!listContainer || !items.length) return;

      const totalElements = scheduleData.length;

      // Ensure first initialization renders correctly at progress 0
      gsap.set(items, { opacity: 0.15, filter: "blur(4px)", scale: 0.75 });

      const syncScroll = (e: Event) => {
        const evt = e as CustomEvent;
        const prog = Math.max(0, Math.min(1, evt.detail)); // 0 to 1 mapping

        const itemHeight = listContainer.scrollHeight / totalElements;

        // Force a discrete "Snapping" effect instead of continuous washing/whizzing
        const activeIndex = Math.round(prog * (totalElements - 1));

        // Let's calculate mathematically perfect vertical centering:
        // By knowing exact item bounds, we can pin its absolute literal center to 50vh!
        const screenCenterY = window.innerHeight / 2;
        const targetY = screenCenterY - (itemHeight / 2) - (activeIndex * itemHeight);

        // Slide the entire list cleanly to the exact locked step
        gsap.to(listContainer, {
          y: targetY,
          duration: 0.5, // Smooth, heavy glide into place
          ease: "power3.out",
        });

        items.forEach((item, i) => {
          const isActive = i === activeIndex;

          const isMobile = window.innerWidth < 768;
          // Massively reduced blur so nothing looks visually broken or noisy
          gsap.to(item, {
            scale: isActive ? (isMobile ? 1.02 : 1.15) : 0.85,
            opacity: isActive ? 1 : 0.25,
            filter: isActive ? "blur(0px)" : "blur(1.5px)", 
            duration: 0.4,
            ease: "power2.out",
          });

          // Animate the dots and glowing connections
          const dot = item.querySelector(".timeline-dot");
          gsap.to(dot, {
            scale: isActive ? 1.6 : 1,
            backgroundColor: isActive ? "#ff2a2a" : "#2a0a0a",
            boxShadow: isActive ? "0 0 25px 8px rgba(255,40,40,0.8)" : "0 0 0px 0px transparent",
            border: isActive ? "2px solid #fff" : "2px solid #7f1d1d",
            duration: 0.3,
          });

          // Text shifts outward slightly when focused for an organic 'popping' feel
          const textGroup = item.querySelector(".timeline-text");
          const shiftValue = isMobile ? 5 : 15;
          const shiftDir = scheduleData[i].side === "left" ? -shiftValue : shiftValue;
          gsap.to(textGroup, {
            x: isActive ? shiftDir : 0,
            duration: 0.4,
            ease: "back.out(1.2)",
          });
        });
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        // Check natively if the section is actually on the user's screen right now
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const isVisibleOnScreen = rect.top < window.innerHeight && rect.bottom > 0;

        if (!isVisibleOnScreen) return;

        if (e.key === "ArrowRight") {
          e.preventDefault();
          window.scrollBy({ top: 135, behavior: 'smooth' });
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          window.scrollBy({ top: -135, behavior: 'smooth' });
        }
      };

      window.addEventListener("update-stoneslab", syncScroll);
      window.addEventListener("keydown", handleKeyDown);

      // Force initial render frame
      syncScroll(new CustomEvent("update-stoneslab", { detail: 0 }));

      return () => {
        window.removeEventListener("update-stoneslab", syncScroll);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-hidden font-sans"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap');
      `}</style>
      
      {/* Central Glowing Vein Line */}
      <div className="absolute top-0 bottom-0 left-[50%] w-[3px] -translate-x-1/2 bg-gradient-to-b from-transparent via-red-800/40 to-transparent shadow-[0_0_20px_rgba(220,20,20,0.3)] z-0" />

      {/* Strong top mask to prevent scrolling items from sliding visibly under the heading */}
      <div className="absolute top-0 left-0 right-0 h-[200px] md:h-[260px] bg-gradient-to-b from-[#0a0000] via-black/90 to-transparent z-40 pointer-events-none" />

      {/* Fixed Title Header overlaying cinematic stream */}
      <div className="flex flex-col items-center gap-2 md:gap-3 absolute top-[95px] md:top-[110px] lg:top-[115px] left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <h2 
          className="text-4xl md:text-6xl lg:text-6xl text-red-600 font-benguiat font-black uppercase tracking-wide drop-shadow-[0_0_15px_rgba(220,20,20,0.8)] animate-[flicker_3s_infinite]"
          style={{ textShadow: "2px 3px 6px rgba(0,0,0,1)" }}
        >
          Timeline
        </h2>
        <div className="px-3 py-1.5 rounded-full border border-red-500/50 bg-red-950/80 text-red-200 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(255,0,0,0.5)] flex items-center gap-2 backdrop-blur-md">
          <span className={`w-2 h-2 rounded-full ${mode === 'online' ? 'bg-red-400 animate-pulse shadow-[0_0_8px_rgba(255,0,0,0.8)]' : 'bg-red-600'}`}></span>
          {mode} Mode
        </div>
      </div>

      {/* The timeline list container that moves up/down globally */}
      <div className="timeline-list absolute top-0 left-0 w-full flex flex-col items-center">
        {scheduleData.map((item, i) => (
          <div
            key={i}
            className="timeline-item group cursor-pointer hover:z-30 flex w-full max-w-5xl min-h-[140px] md:min-h-[160px] relative z-10"
          >
            {/* LEFT SIDE CONTENT */}
            <div className="w-[50%] flex justify-end items-center pr-6 sm:pr-12">
              {item.side === "left" && (
                <div className="timeline-text flex flex-col items-end text-right">
                  <h3 
                    className="text-xl sm:text-2xl md:text-4xl font-benguiat text-white/95 group-hover:text-white transition-all duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:drop-shadow-[0_0_25px_rgba(255,0,0,0.8)] mb-1"
                    style={{ textShadow: "0px 4px 20px rgba(0,0,0,1), 0px 2px 5px rgba(0,0,0,0.8)" }}
                  >
                    {item.title}
                  </h3>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-3">
                     <span 
                       className="text-red-500 font-bold text-sm sm:text-lg group-hover:text-red-400 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)] group-hover:drop-shadow-[0_0_15px_rgba(255,0,0,1)] transition-all duration-300" 
                       style={{ fontFamily: "'Inter', sans-serif", textShadow: "0px 2px 8px rgba(0,0,0,0.9)" }}
                     >
                       {item.time}
                     </span>
                     <span className="text-red-300 bg-red-950/60 border border-red-900/50 px-2 py-0.5 rounded text-[10px] md:text-xs font-black tracking-widest block group-hover:bg-red-900 group-hover:border-red-500 group-hover:text-white shadow-[0_0_5px_rgba(0,0,0,0.5)] transition-all duration-300">
                       {item.day}
                     </span>
                  </div>
                </div>
              )}
            </div>

            {/* CENTER DOT */}
            <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-20">
              <div className="timeline-dot w-4 h-4 md:w-5 md:h-5 bg-red-950 rounded-full border-2 border-red-900 transition-colors" />
            </div>

            {/* RIGHT SIDE CONTENT */}
            <div className="w-[50%] flex justify-start items-center pl-6 sm:pl-12">
              {item.side === "right" && (
                <div className="timeline-text flex flex-col items-start text-left">
                  <h3 
                    className="text-xl sm:text-2xl md:text-4xl font-benguiat text-white/95 group-hover:text-white transition-all duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:drop-shadow-[0_0_25px_rgba(255,0,0,0.8)] mb-1"
                    style={{ textShadow: "0px 4px 20px rgba(0,0,0,1), 0px 2px 5px rgba(0,0,0,0.8)" }}
                  >
                    {item.title}
                  </h3>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
                     <span className="text-red-300 bg-red-950/60 border border-red-900/50 px-2 py-0.5 rounded text-[10px] md:text-xs font-black tracking-widest block group-hover:bg-red-900 group-hover:border-red-500 group-hover:text-white shadow-[0_0_5px_rgba(0,0,0,0.5)] transition-all duration-300">
                       {item.day}
                     </span>
                     <span 
                       className="text-red-500 font-bold text-sm sm:text-lg group-hover:text-red-400 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)] group-hover:drop-shadow-[0_0_15px_rgba(255,0,0,1)] transition-all duration-300" 
                       style={{ fontFamily: "'Inter', sans-serif", textShadow: "0px 2px 8px rgba(0,0,0,0.9)" }}
                     >
                       {item.time}
                     </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows */}
      <div className="absolute top-[50%] max-md:top-auto max-md:bottom-8 left-0 right-0 w-full flex justify-between max-md:justify-center max-md:gap-12 items-center px-4 md:px-16 xl:px-32 -translate-y-1/2 max-md:-translate-y-0 pointer-events-none z-30">
        <button 
          onClick={() => window.scrollBy({ top: -135, behavior: 'smooth' })}
          className="pointer-events-auto p-2.5 md:p-3 rounded-full bg-red-950/40 border border-red-600/20 hover:bg-red-900/80 hover:scale-105 transition-all backdrop-blur-sm group shadow-[0_0_10px_rgba(255,0,0,0.1)] hover:shadow-[0_0_20px_rgba(255,0,0,0.5)] flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 group-hover:text-white transition-colors">
             <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button 
          onClick={() => window.scrollBy({ top: 135, behavior: 'smooth' })}
          className="pointer-events-auto p-2.5 md:p-3 rounded-full bg-red-950/40 border border-red-600/20 hover:bg-red-900/80 hover:scale-105 transition-all backdrop-blur-sm group shadow-[0_0_10px_rgba(255,0,0,0.1)] hover:shadow-[0_0_20px_rgba(255,0,0,0.5)] flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 group-hover:text-white transition-colors">
             <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Vignette overlays to fade out the top and bottom of the list */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black via-transparent to-black" />
    </div>
  );
};

export default StoneSlabSchedule;