"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import FieryButton from "@/components/stranger-things/FireBtn";
import localFont from "next/font/local";

gsap.registerPlugin(ScrollTrigger);

const trackFont = localFont({
  src: [
    { path: '../../../public/font/BenguiatStd-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../../public/font/BenguiatStd-Bold.woff', weight: '700', style: 'normal' },
    { path: '../../../public/font/BenguiatStd-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-track',
  display: 'swap',
});

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  type TransportMode = "WALK" | "TRAIN" | "BUS" | "AIR";
  const [selectedMode, setSelectedMode] = useState<TransportMode>("WALK");

  const transportInfo: Record<TransportMode, string> = {
    WALK: "From nearby residential areas, the campus is accessible via NH-24 service lane.",
    TRAIN: "From Ghaziabad Railway Station: Book a cab directly to ABESIT.",
    BUS: "Take the metro to Noida Electronic City (Blue Line) and then an auto.",
    AIR: "Book a cab directly from IGI Airport or take the Airport Express.",
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const meteors: any[] = [];
    const meteorCount = 20; 

    function createMeteor(initial = false) {
      return {
        x: initial ? Math.random() * w : w + Math.random() * 200,
        y: Math.random() * h,
        len: Math.random() * 80 + 20,
        speed: Math.random() * 3 + 1.5,
        opacity: Math.random() * 0.7 + 0.1,
        width: Math.random() * 1.5 + 0.5,
      };
    }

    for (let i = 0; i < meteorCount; i++) {
      meteors.push(createMeteor(true));
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      ctx!.shadowBlur = 5;
      ctx!.shadowColor = "#ff3b00";

      meteors.forEach((m) => {
        const gradient = ctx!.createLinearGradient(m.x, m.y, m.x + m.len, m.y - m.len);
        gradient.addColorStop(0, `rgba(255, 60, 0, ${m.opacity})`);
        gradient.addColorStop(1, "rgba(255, 60, 0, 0)");

        ctx!.strokeStyle = gradient;
        ctx!.lineWidth = m.width;
        ctx!.beginPath();
        ctx!.moveTo(m.x, m.y);
        ctx!.lineTo(m.x + m.len, m.y - m.len);
        ctx!.stroke();

        m.x -= m.speed;
        m.y += m.speed;

        if (m.x < -200 || m.y > h + 200) {
          Object.assign(m, createMeteor());
        }
      });
      requestAnimationFrame(draw);
    }
    draw();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fontClass = trackFont.variable + " font-track";

  return (
    <section
      ref={sectionRef}
      className={`${fontClass} relative w-full h-screen bg-black overflow-hidden flex items-center justify-center`}
      style={{ fontFamily: 'var(--font-track), serif' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-[2] pointer-events-none opacity-60" />

      <div className="absolute inset-0 z-0">
        <div className="hidden md:block relative w-full h-full">
          <Image
            src="/frame-background.png"
            alt="Desktop BG"
            fill
            className="object-cover object-center scale-105 saturate-[1.1] contrast-[1.1]"
            priority
          />
        </div>
        <div className="block md:hidden relative w-full h-full">
          <Image
            src="/sm-frame-background.png"
            alt="Mobile BG"
            fill
            className="object-cover object-center scale-100 saturate-[1.2] contrast-[1.2]"
            priority
          />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 items-center px-12 sm:px-16 md:px-6">
        
        <div ref={contentRef} className="flex flex-col space-y-4 md:space-y-6 text-center md:text-left items-center md:items-start pt-8 md:pt-0">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter text-white">
              ABESIT GROUP
            </h2>
            <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-widest text-[#ff3b00] drop-shadow-[0_0_10px_rgba(255,59,0,0.8)]">
              OF INSTITUTIONS
            </h2>
          </div>

          <p className="text-[8px] sm:text-[10px] md:text-sm text-gray-400 italic tracking-[0.2em] uppercase">
            Ghaziabad • Uttar Pradesh • India
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-1 md:gap-2 w-full max-w-[280px] md:max-w-none">
            {(["WALK", "TRAIN", "BUS", "AIR"] as TransportMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-2 py-1 md:px-3 md:py-2 text-[8px] md:text-xs font-bold tracking-widest uppercase border rounded-xs transition-all duration-500 ease-out transform active:scale-95
                    ${selectedMode === mode
                    ? "bg-[#ff3b00]/30 border-[#ff3b00] text-white shadow-[0_0_15px_rgba(255,59,0,0.4)] scale-105"
                    : "border-white/10 bg-black/40 text-gray-500 hover:text-gray-200 hover:border-white/30"
                  }`}
              >
                BY {mode}
              </button>
            ))}
          </div>

          <div className="text-[10px] md:text-sm text-gray-200 leading-tight min-h-[40px] max-w-[240px] md:max-w-sm italic opacity-80 transition-opacity duration-300">
            {selectedMode ? transportInfo[selectedMode] : ""}
          </div>
        </div>

        <div className="relative w-full max-w-[300px] sm:max-w-md mx-auto md:max-w-none bg-black/60 backdrop-blur-sm p-5 md:p-8 rounded-xl border border-white/5 shadow-2xl mb-10 md:mb-0">
          <h3 className="text-sm md:text-xl font-bold uppercase mb-4 md:mb-6 tracking-widest text-white text-center md:text-left">
            BECOME A <span className="text-[#ff3b00]">SPONSOR</span>
          </h3>

          <form className="space-y-3 md:space-y-6">
            <input
              type="email"
              placeholder="YOUR EMAIL"
              className="w-full bg-transparent border-b border-white/10 pb-1 text-[9px] md:text-xs tracking-widest text-white focus:outline-none focus:border-[#ff3b00] transition-all"
            />
            <textarea
              placeholder="MESSAGE"
              rows={1}
              className="w-full bg-transparent border-b border-white/10 pb-1 text-[9px] md:text-xs tracking-widest text-white focus:outline-none focus:border-[#ff3b00] transition-all resize-none"
            />
            <div className="pt-2 flex justify-center scale-75 md:scale-100">
              <FieryButton label="SEND MESSAGE" />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}