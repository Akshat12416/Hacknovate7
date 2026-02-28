"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import FieryButton from "@/components/stranger-things/FireBtn";
import FireModeButton from "@/components/stranger-things/ContactDestBtn";
import localFont from "next/font/local";
import { Navbar } from "@/components/stranger-things/Navbar";

gsap.registerPlugin(ScrollTrigger);

const trackFont = localFont({
  src: [
    { path: "../../../public/font/BenguiatStd-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../../public/font/BenguiatStd-Bold.woff", weight: "700", style: "normal" },
    { path: "../../../public/font/BenguiatStd-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-track",
  display: "swap",
});

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    const meteors: { x: number; y: number; len: number; speed: number; opacity: number; width: number }[] = [];
    function createMeteor(initial = false) {
      return {
        x: initial ? Math.random() * w : w + Math.random() * 100,
        y: Math.random() * h * 0.5,
        len: Math.random() * 60 + 20,
        speed: Math.random() * 2.5 + 1.2,
        opacity: Math.random() * 0.5 + 0.1,
        width: Math.random() * 1.2 + 0.4,
      };
    }
    const meteorCount = typeof window !== "undefined" && window.innerWidth < 1024 ? 5 : 8;
    for (let i = 0; i < meteorCount; i++) meteors.push(createMeteor(true));

    let animId: number;
    function draw() {
      ctx!.clearRect(0, 0, w, h);
      meteors.forEach((m) => {
        const grad = ctx!.createLinearGradient(m.x, m.y, m.x + m.len, m.y - m.len);
        grad.addColorStop(0, `rgba(255, 160, 60, ${m.opacity})`);
        grad.addColorStop(0.5, `rgba(255, 50, 5, ${m.opacity * 0.6})`);
        grad.addColorStop(1, "rgba(180, 10, 0, 0)");
        ctx!.shadowBlur = 6;
        ctx!.shadowColor = "#ff3300";
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = m.width;
        ctx!.beginPath();
        ctx!.moveTo(m.x, m.y);
        ctx!.lineTo(m.x + m.len, m.y - m.len);
        ctx!.stroke();
        m.x -= m.speed;
        m.y += m.speed * 0.75;
        if (m.x < -200 || m.y > h + 200) Object.assign(m, createMeteor());
      });
      animId = requestAnimationFrame(draw);
    }
    draw();

    // BG shake — desktop only
    const ctx_gsap = gsap.context(() => {
      if (bgImageRef.current && window.innerWidth >= 1024) {
        const shakeLoop = () => {
          gsap.to(bgImageRef.current, {
            x: gsap.utils.random(-12, 12),
            y: gsap.utils.random(-12, 12),
            rotation: gsap.utils.random(-0.4, 0.4),
            duration: gsap.utils.random(3, 5),
            ease: "sine.inOut",
            force3D: true,
            onComplete: shakeLoop,
          });
        };
        shakeLoop();
      }
    }, sectionRef);

    // Entrance
    const tl = gsap.timeline({ delay: 0.1 });
    if (headingRef.current) {
      gsap.set(Array.from(headingRef.current.children), { y: 24, opacity: 0 });
      tl.to(Array.from(headingRef.current.children), { y: 0, opacity: 1, duration: 0.65, stagger: 0.09, ease: "power3.out" });
    }
    if (formRef.current) {
      gsap.set(formRef.current, { y: 20, opacity: 0 });
      tl.to(formRef.current, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, "-=0.3");
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      ctx_gsap.revert();
      tl.kill();
    };
  }, []);

  return (
    <main
      className={`${trackFont.variable} relative w-full overflow-x-hidden`}
      style={{ backgroundColor: "#050000", fontFamily: "var(--font-track), serif", minHeight: "100svh" }}
    >
      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full z-[100]">
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} alwaysVisible />
      </div>

      <section
        ref={sectionRef}
        className="relative w-full flex items-center justify-center overflow-hidden"
        style={{ minHeight: "100svh" }}
      >
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{ opacity: 0.45, mixBlendMode: "screen" }}
        />

        {/* Background image */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div
            ref={bgImageRef}
            className="hidden lg:block absolute inset-[-5%] w-[110%] h-[110%] will-change-transform"
            style={{ opacity: 0.82, filter: "saturate(1.35) contrast(1.08)" }}
          >
            <Image src="/frame-background.png" alt="" fill className="object-cover object-center" priority />
          </div>
          <div
            className="block lg:hidden absolute inset-0 w-full h-full"
            style={{ opacity: 0.82, filter: "saturate(1.4) contrast(1.1)" }}
          >
            <Image src="/sm-frame-background.png" alt="" fill className="object-cover sm:scale-110  object-center" priority />
          </div>
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: "radial-gradient(ellipse 110% 80% at 50% 115%, rgba(150,0,12,0.65) 0%, rgba(70,0,5,0.3) 45%, transparent 68%)" }} />
        <div className="absolute top-0 inset-x-0 h-28 z-[1] pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(5,0,0,0.9) 0%, transparent 100%)" }} />
        <div className="absolute bottom-0 inset-x-0 h-20 z-[1] pointer-events-none"
          style={{ background: "linear-gradient(0deg, rgba(5,0,0,0.6) 0%, transparent 100%)" }} />
        <div className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            opacity: 0.055,
          }} />

        {/* ═══ CONTENT WRAPPER ═══
            < lg  : single column, scrollable, top-padded for navbar
            >= lg : two-column grid, vertically centered
        */}
        <div
          className="
            relative z-10 w-full max-w-5xl xl:max-w-6xl mx-auto
            px-4 sm:px-6 lg:px-10
            pt-37.5 pb-8 sm:pb-10 lg:py-0
            flex flex-col justify-baseline lg:grid lg:grid-cols-2
            gap-5 sm:gap-6 lg:gap-14
            min-h-[100svh] lg:min-h-0
            lg:items-center
          "
        >

          {/* ── LEFT — Info ── */}
          <div
            ref={headingRef}
            className="flex flex-col gap-3 sm:gap-4 text-center lg:text-left items-center lg:items-start w-full"
          >
            {/* Eyebrow */}
            <p
              className="text-[8px] sm:text-[9px] tracking-[0.42em] uppercase font-mono"
              style={{ color: "rgba(255,80,20,0.6)", textShadow: "0 0 8px rgba(255,60,0,0.35)" }}
            >
              Hacknovate 7.0 · Gateway
            </p>

            {/* Headings */}
            <div className="space-y-0.5">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-bold uppercase tracking-tight leading-none"
                style={{ color: "#fff", textShadow: "0 0 36px rgba(255,55,0,0.28), 0 2px 3px rgba(0,0,0,0.95)" }}
              >
                ABESIT GROUP
              </h2>
              <h2
                className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-bold uppercase tracking-widest leading-snug"
                style={{ color: "#ff3b00", textShadow: "0 0 18px rgba(255,59,0,0.9), 0 0 40px rgba(255,59,0,0.28)" }}
              >
                OF INSTITUTIONS
              </h2>
            </div>

            {/* Location */}
            <p
              className="text-[8px] sm:text-[9px] tracking-[0.25em] uppercase font-mono"
              style={{ color: "rgba(210,130,90,0.5)", fontStyle: "italic" }}
            >
              Ghaziabad • Uttar Pradesh • India
            </p>

            {/* Divider */}
            <div
              className="w-16 h-px self-center lg:self-start"
              style={{ background: "linear-gradient(90deg, #ff3b00, rgba(255,59,0,0.15), transparent)", boxShadow: "0 0 5px rgba(255,59,0,0.4)" }}
            />

            {/* Transport selector */}
            <div className="w-full flex justify-center lg:justify-start">
              <FireModeButton selectedMode={selectedMode} setSelectedMode={setSelectedMode} />
            </div>

            {/* Route info */}
            <div
              className=" w-[70%] sm:w-[60%] lg:w-full rounded-sm px-3 py-2.5 text-center lg:text-center"
              style={{
                borderLeft: "2px solid rgba(255,59,0,0.5)",
                backgroundColor: "rgba(255,25,0,0.055)",
                backdropFilter: "blur(6px)",
              }}
            >
              <span
                className="text-[7px] sm:text-[8px] uppercase tracking-widest font-mono font-bold block mb-1"
                style={{ color: "#ff3b00", textShadow: "0 0 5px rgba(255,59,0,0.55)" }}
              >
                ▸ Route Intel
              </span>
              <p
                className="text-[11px] sm:text-xs md:text-sm leading-snug"
                style={{ color: "rgba(255,215,195,0.88)", fontFamily: "Georgia, serif", fontStyle: "italic" }}
              >
                {transportInfo[selectedMode]}
              </p>
            </div>

            {/* Address */}
            <div
              className="w-[70%] sm:w-[60%] lg:w-full rounded-sm px-3 py-2.5"
              style={{
                border: "1px solid rgba(255,59,0,0.12)",
                backgroundColor: "rgba(140,10,0,0.07)",
                backdropFilter: "blur(8px)",
              }}
            >
              <p
                className="text-[7px] sm:text-[8px] uppercase tracking-[0.26em] font-mono mb-1"
                style={{ color: "rgba(255,100,50,0.42)" }}
              >
                The Gateway Location
              </p>
              <p
                className="text-[11px] sm:text-xs leading-relaxed text-center lg:text-left"
                style={{ color: "rgba(255,200,180,0.78)", fontFamily: "Georgia, serif" }}
              >
                ABESIT Campus Road, NE 3, Near Crossing Republic,<br />
                Ghaziabad, Uttar Pradesh 201009
              </p>
            </div>
          </div>

          {/* ── RIGHT — Form card ── */}
          {/* On mobile/tablet: full-width centered card below the info block
              On lg+: occupies right column, no forced max-width */}
          <div
            ref={formRef}
            className="relative w-[70%] sm:w-[60%] lg:w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-none mx-auto flex-shrink-0 mb-4 lg:mb-0"
          >
            {/* Outer glow */}
            <div
              className="absolute -inset-3 rounded-2xl pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(255,59,0,0.15) 0%, transparent 65%)",
                filter: "blur(18px)",
              }}
            />
            {/* Top glowing line */}
            <div
              className="absolute top-0 left-8 right-8 h-px pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, #ff3b00, rgba(255,100,50,0.45), transparent)",
                boxShadow: "0 0 8px rgba(255,59,0,0.65)",
              }}
            />

            <div
              className="relative rounded-xl overflow-hidden px-5 sm:px-7 md:px-8 py-5 sm:py-6 md:py-8 flex flex-col items-center gap-3 sm:gap-4"
              style={{
                backgroundColor: "rgba(10,1,0,0.8)",
                backdropFilter: "blur(22px)",
                border: "1px solid rgba(255,59,0,0.1)",
                boxShadow: "0 0 50px rgba(0,0,0,0.8), inset 0 0 28px rgba(150,12,0,0.04)",
              }}
            >
              {/* Top bloom */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-14 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at 50% 0%, rgba(255,59,0,0.25) 0%, transparent 70%)",
                  filter: "blur(5px)",
                }}
              />

              {/* Card heading */}
              <div className="text-center relative z-10">
                <p
                  className="text-[7px] sm:text-[8px] font-mono tracking-[0.38em] uppercase mb-1"
                  style={{ color: "rgba(255,95,45,0.42)" }}
                >
                  Hawkins Lab — Comm Channel
                </p>
                <h3
                  className="text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase tracking-[0.16em]"
                  style={{ color: "rgba(255,255,255,0.92)", textShadow: "0 0 14px rgba(255,59,0,0.22)" }}
                >
                  BECOME A{" "}
                  <span style={{
                    color: "#ff3b00",
                    textShadow: "0 0 14px rgba(255,59,0,1), 0 0 30px rgba(255,59,0,0.32)",
                  }}>
                    SPONSOR
                  </span>
                </h3>
              </div>

              {/* Divider */}
              <div
                className="w-full h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,59,0,0.35), transparent)", boxShadow: "0 0 4px rgba(255,59,0,0.2)" }}
              />

              {/* Stats */}
              <div className="w-full grid grid-cols-3 gap-2 text-center relative z-10">
                {[
                  { val: "500+", label: "Hackers" },
                  { val: "30Hrs", label: "Non-stop" },
                  { val: "₹5L+", label: "Prizes" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="py-2 rounded-sm"
                    style={{ backgroundColor: "rgba(255,30,0,0.07)", border: "1px solid rgba(255,59,0,0.1)" }}
                  >
                    <p
                      className="text-sm sm:text-base font-bold"
                      style={{ color: "#ff3b00", textShadow: "0 0 9px rgba(255,59,0,0.7)" }}
                    >
                      {s.val}
                    </p>
                    <p
                      className="text-[7px] sm:text-[8px] uppercase tracking-widest font-mono"
                      style={{ color: "rgba(255,170,140,0.48)" }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div
                className="w-full h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,59,0,0.22), transparent)" }}
              />

              {/* CTA */}
              <div className="relative z-10 w-full flex justify-center">
                <FieryButton href="https://drive.google.com/file/d/1D5jBObQtqiGGOjLcQW8cr6m2V_W07dcx/view?usp=drivesdk" label="Download Brochure" />
              </div>

              <div className="relative z-10 w-full flex justify-center">
                <FieryButton href="https://luma.com/lql70sek" label="Contact Form" />
              </div>

              {/* Corner brackets */}
              {(["bottom-0 left-0", "bottom-0 right-0"] as const).map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-4 h-4 pointer-events-none`}>
                  <div className="absolute w-full h-px bottom-0" style={{ backgroundColor: "rgba(255,59,0,0.35)" }} />
                  <div className="absolute h-full w-px" style={{ [i === 0 ? "left" : "right"]: 0, backgroundColor: "rgba(255,59,0,0.35)" }} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}