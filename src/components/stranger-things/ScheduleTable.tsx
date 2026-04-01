"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ScheduleEvent } from "../../data/scheduleData";

export default function ScheduleTable({ scheduleData, mode }: { scheduleData: ScheduleEvent[], mode: 'offline' | 'online' }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  // Staggering animation for the table rows
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.1 }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring" as const, stiffness: 80, damping: 15 }
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 pb-32 z-20 relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap');
      `}</style>
      
      {/* Premium Header Animation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-10 pt-4"
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <h2 className="text-4xl md:text-6xl text-white font-benguiat drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] tracking-wide">
            Timeline
          </h2>
          <div className="px-3 py-1.5 rounded-full border border-red-500/50 bg-red-950/80 text-red-200 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(255,0,0,0.5)] flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${mode === 'online' ? 'bg-red-400 animate-pulse shadow-[0_0_8px_rgba(255,0,0,0.8)]' : 'bg-red-600'}`}></span>
            {mode} Mode
          </div>
        </div>
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
          className="h-1 w-32 bg-gradient-to-r from-red-800 via-red-500 to-red-800 mx-auto mt-6 shadow-[0_0_20px_rgba(255,0,0,0.8)] rounded-full origin-center"
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] rounded-xl border border-red-900/30 bg-black/60 backdrop-blur-xl shadow-[0_0_40px_rgba(150,0,0,0.15)] relative group/container pb-2"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-red-950/90 to-black border-b border-red-800/60 shadow-lg relative z-10 flex-col md:table-row">
              <th className="p-5 md:p-6 text-red-500 font-black uppercase tracking-[0.2em] text-xs md:text-sm border-r border-red-900/30 w-1/4">Date & Time</th>
              <th className="p-5 md:p-6 text-red-500 font-black uppercase tracking-[0.2em] text-xs md:text-sm border-r border-red-900/30 w-1/2">Description</th>
              <th className="p-5 md:p-6 text-red-500 font-black uppercase tracking-[0.2em] text-xs md:text-sm w-1/4">Venue</th>
            </tr>
          </thead>
          <motion.tbody 
            key={mode}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="divide-y divide-red-900/20"
          >
            {scheduleData.map((item, idx) => (
              <motion.tr 
                key={idx} 
                variants={rowVariants}
                // Combining Framer hover with Tailwind for maximum performance
                whileHover={{ scale: 1.015, x: 5, backgroundColor: "rgba(100, 10, 10, 0.4)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative cursor-pointer border-l-4 border-transparent hover:border-red-500 hover:shadow-[0_0_30px_rgba(255,0,0,0.1)] z-0 hover:z-20 origin-left"
              >
                <td className="p-5 md:p-6 border-r border-red-900/20 align-top relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="flex flex-col gap-2 relative z-10">
                    <span className="text-red-300 bg-black/50 border border-red-700/50 px-2 py-1 rounded text-[10px] md:text-xs font-black tracking-widest w-max shadow-[0_0_10px_rgba(0,0,0,0.8)] group-hover:bg-red-950 group-hover:border-red-500 group-hover:text-white transition-all duration-300">
                      {item.day}
                    </span>
                    <span className="text-white/80 md:text-lg font-bold group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] transition-all duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {item.time}
                    </span>
                  </div>
                </td>
                <td className="p-5 md:p-6 align-middle relative border-r border-red-900/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg md:text-xl xl:text-2xl text-white/90 font-benguiat group-hover:text-white transition-colors duration-300 drop-shadow-sm group-hover:drop-shadow-[0_0_15px_rgba(200,0,0,0.6)]">
                      {item.title}
                    </h3>
                  </div>
                </td>
                <td className="p-5 md:p-6 align-middle relative">
                  <div className="flex items-center justify-between h-full">
                    <span className="text-red-200 uppercase tracking-widest text-xs md:text-sm font-semibold">
                      {item.venue}
                    </span>
                    {/* Animated trailing indicator arrow that slides in on hover */}
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 0, x: -10 }}
                      className="hidden md:flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </motion.div>
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </motion.div>
    </div>
  );
}
