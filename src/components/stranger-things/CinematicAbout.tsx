"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const CAMPUS_IMAGE = "/upsidedown.webp";

export function CinematicAbout() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const topStripRef = useRef<HTMLDivElement>(null);
  const bottomStripRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    if (!heroRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "+=300%",
        scrub: 1, // Slightly tighter scrub for snappier feel
        pin: true,
        anticipatePin: 1,
        pinSpacing: true,
      },
    });

    if (!contentRef.current) return;

    const lines = contentRef.current.querySelectorAll(".about-line");

    gsap.set(contentRef.current, {
      opacity: 0,
      y: 60,
      scale: 0.96,
      filter: "blur(12px)",
    });

    gsap.set(lines, {
      opacity: 0,
      y: 40,
    });

    ScrollTrigger.create({
      trigger: contentRef.current,
      start: "top 70%",
      once: true,
      onEnter: () => {
        gsap.to(contentRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
        });

        gsap.to(lines, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.25,
          ease: "power3.out",
          delay: 0.3,
        });
      },
    });

    // ── PHASE 1 (0→1): Strips fly apart
    tl.to(topStripRef.current, {
      yPercent: -102, // Overshoot slightly to ensure no 1px lines
      ease: "expo.inOut",
      duration: 1,
    }, 0)
      .to(bottomStripRef.current, {
        yPercent: 102,
        ease: "expo.inOut",
        duration: 1,
      }, 0)
      .fromTo(bgImageRef.current,
        { scale: 1.2 },
        { scale: 1, ease: "expo.inOut", duration: 1 },
        0
      )

      // ── PHASE 2 (0.6→1.4): Content fades in/stays/fades out
      .fromTo(contentRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        0.6
      )
      // .to(contentRef.current, {
      //     opacity: 0,
      //     y: -25,
      //     duration: 0.4,
      //     ease: "power2.in",
      // }, 1.6)

      // ── PHASE 3 (2→3): Strips Close back
      .to(topStripRef.current, {
        yPercent: 0,
        ease: "expo.inOut",
        duration: 1,
      }, 2)
      .to(bottomStripRef.current, {
        yPercent: 0,
        ease: "expo.inOut",
        duration: 1,
      }, 2)
      .to(bgImageRef.current,
        { scale: 1.1, ease: "expo.inOut", duration: 1 },
        2
      )
      .to(contentRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.6,
        ease: "power2.in"
      }, 2);
    // After this the ScrollTrigger pin simply releases and
    // the next section scrolls in normally — no black gap.

  }, { scope: sectionRef });

  return (
    <div ref={sectionRef} className="w-full">
      <div ref={heroRef} style={{ height: "100vh" }}>
        <div
          className="relative w-full"
          style={{ height: "100vh", overflow: "hidden", background: "#080101" }}
        >
          {/* ── BACKGROUND IMAGE ── */}
          <div className="absolute inset-0 z-0">
            <img
              ref={bgImageRef}
              src={CAMPUS_IMAGE}
              alt="ABESIT Campus"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 50%" }}
            />
            <div className="absolute inset-0" style={{ background: "rgba(5,1,1,0.65)" }} />
          </div>

          {/* ── CONTENT (fades in over image) ── */}
          <div
            ref={contentRef}
            className="absolute inset-0 z-[60] flex items-center justify-center px-6 pointer-events-none"
            style={{ opacity: 0 }}
          >
            <div
              style={{
                maxWidth: "820px",
                textAlign: "justify",
                fontFamily: "ITC Benguiat Std",
              }}
            >
              <p
                style={{
                  fontSize: "clamp(1rem, 1.9vw, 1.25rem)",
                  lineHeight: 1.9,
                  color: "rgba(255,255,255,0.88)",
                  marginBottom: "1.6rem",
                  letterSpacing: "0.02em",
                }}
              >
                ABES Institute of Technology (ABESIT), affiliated with Dr. A.P.J. Abdul Kalam Technical University, Lucknow, stands as a distinguished center of technical education in Uttar Pradesh. Established in 2007, the institute has consistently upheld a strong academic foundation while nurturing innovation, research, and industry-aligned learning.
              </p>

              <p
                style={{
                  fontSize: "clamp(1rem, 1.9vw, 1.25rem)",
                  lineHeight: 1.9,
                  color: "rgba(255,255,255,0.88)",
                  letterSpacing: "0.02em",
                }}
              >
                With robust programs in engineering and technology, ABESIT actively cultivates a culture of problem-solving and forward-thinking innovation. Through national-level hackathons, research initiatives, and modern infrastructure, students are empowered to translate ideas into impactful technological solutions that resonate beyond the campus.
              </p>

            </div>
          </div>
          {/* ══ TOP BLACK STRIP — "ABOUT" at its bottom edge ══ */}
          <div
            ref={topStripRef}
            className="absolute inset-x-0 top-0 z-[70] flex flex-col justify-end"
            style={{
              height: "50%",
              background: "#080101",
              overflow: "hidden",
              willChange: "transform"
            }}
          >
            <span style={{
              position: "absolute", top: "1.75rem", left: "2rem",
              fontFamily: "'DM Mono', monospace", fontSize: "0.58rem",
              letterSpacing: "0.45em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
            }}>Welcome to</span>
            <span style={{
              position: "absolute", top: "1.75rem", right: "2rem",
              fontFamily: "'DM Mono', monospace", fontSize: "0.58rem",
              letterSpacing: "0.45em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
            }}>Est. 2007</span>

            <div style={{ width: "100%", textAlign: "center", marginBottom: "-0.06em" }}>
              <span style={{
                display: "block",
                fontFamily: "'Bebas Neue', 'Anton', Impact, sans-serif",
                fontSize: "clamp(4.5rem, 17vw, 15rem)",
                lineHeight: 0.82,
                letterSpacing: "0.02em",
                color: "transparent",
                backgroundImage: `url(${CAMPUS_IMAGE})`,
                backgroundSize: "cover",
                backgroundPosition: "center 50%",
                backgroundAttachment: "fixed",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextStroke: "1.5px rgba(255,255,255,0.2)",
              }}>ABOUT</span>
            </div>
          </div>

          {/* ══ BOTTOM BLACK STRIP — "ABESIT" at its top edge ══ */}
          <div
            ref={bottomStripRef}
            className="absolute inset-x-0 bottom-0 z-[70] flex flex-col justify-start"
            style={{
              height: "50%",
              background: "#080101", // Unified black for opening/closing
              overflow: "hidden",
              willChange: "transform"
            }}
          >
            <div style={{ width: "100%", textAlign: "center", marginTop: "-0.06em" }}>
              <span style={{
                display: "block",
                fontFamily: "'Bebas Neue', 'Anton', Impact, sans-serif",
                fontSize: "clamp(4.5rem, 17vw, 15rem)",
                lineHeight: 0.82,
                letterSpacing: "0.02em",
                color: "transparent",
                backgroundImage: `url(${CAMPUS_IMAGE})`,
                backgroundSize: "cover",
                backgroundPosition: "center 50%",
                backgroundAttachment: "fixed",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextStroke: "1.5px rgba(255,255,255,0.2)",
              }}>ABESIT</span>
            </div>


          </div>

        </div>
      </div>

      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;1,400&display=swap');
                .about-scroll-bar {
                    width: 1px; height: 34px;
                    background: linear-gradient(to bottom, rgba(255,255,255,0.35), transparent);
                    animation: asbPulse 2s ease-in-out infinite;
                }
                @keyframes asbPulse {
                    0%,100% { opacity:0.2; }
                    50%     { opacity:0.8; }
                }
            `}</style>
    </div>
  );
}