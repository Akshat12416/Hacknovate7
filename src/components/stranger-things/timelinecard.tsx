import React from 'react';

interface TimeLineCardProps {
  side: 'left' | 'right';
  depthScale?: number;
  title: string;
  subtitle?: string;
  content: string;
  className?: string;
}

const CARD_W = 280;
const CARD_H = 380;
const DEPTH  = 85; // Massive thickness to look like a heavy pillar

const TimeLineCard: React.FC<TimeLineCardProps> = ({
  side,
  depthScale = 1,
  title,
  subtitle,
  content,
  className = '',
}) => {
  const isLeft  = side === 'left';
  // left cards: tilt so right edge faces road; right cards: left edge faces road
  const rotateY = isLeft ? 18 : -18;
  const rotateZ = isLeft ? -1.5 : 1.5;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Crimson+Pro:wght@400;600;700&display=swap');

        /* ── outer perspective shell ── */
        .tlc-scene {
          display: inline-block;
          perspective: 1200px;
          perspective-origin: 50% 40%;
          position: relative;
          pointer-events: auto;
        }

        .tlc-group {
          position: relative;
          width:  ${CARD_W}px;
          height: ${CARD_H}px;
          transform-style: preserve-3d;
        }

        .tlc-face {
          position: absolute;
          background-blend-mode: multiply;
        }

        /* ── HEAVY STONE TEXTURE ── */
        .tlc-front {
          inset: 0;
          border-radius: 6px;
          overflow: hidden;
          transform: translateZ(${DEPTH / 2}px);
          background:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04 0.3' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.85 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"),
            linear-gradient(170deg, #373330 0%, #201e1d 30%, #110e0d 70%, #080605 100%);
          background-blend-mode: multiply;
          box-shadow: inset 0 0 40px rgba(0,0,0,0.9);
        }
        
        /* Chiseled scratch marks */
        .tlc-front::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(65deg,
              transparent 0, transparent 80px,
              rgba(0,0,0,.3) 80px, rgba(0,0,0,.3) 82px,
              transparent 82px, transparent 150px),
            repeating-linear-gradient(145deg,
              transparent 0, transparent 40px,
              rgba(255,255,255,.015) 40px, rgba(255,255,255,.015) 41px,
              transparent 41px, transparent 90px);
          border-radius: 6px;
          pointer-events: none;
        }

        /* ── BACK ── */
        .tlc-back {
          inset: 0;
          border-radius: 6px;
          transform: translateZ(-${DEPTH / 2}px) rotateY(180deg);
          background: #050404;
          box-shadow: 0 0 60px 20px rgba(0,0,0,0.8);
        }

        /* ── SIDE FACES WITH DEEP AMBIENT SHADOWING ── */
        .tlc-side-right {
          top: 0; right: 0;
          width:  ${DEPTH}px; height: ${CARD_H}px;
          transform-origin: right center;
          transform: translateZ(${DEPTH / 2}px) rotateY(90deg);
          background:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='600'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.6'/%3E%3C/svg%3E"),
            linear-gradient(to right, #1a1716, #070505);
          background-blend-mode: multiply;
          box-shadow: inset -3px 0 15px rgba(220,10,10,.6), inset 3px 0 8px rgba(0,0,0,.95);
        }

        .tlc-side-left {
          top: 0; left: 0;
          width:  ${DEPTH}px; height: ${CARD_H}px;
          transform-origin: left center;
          transform: translateZ(${DEPTH / 2}px) rotateY(-90deg);
          background:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='600'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.6'/%3E%3C/svg%3E"),
            linear-gradient(to left, #1a1716, #070505);
          background-blend-mode: multiply;
          box-shadow: inset 3px 0 15px rgba(220,10,10,.6), inset -3px 0 8px rgba(0,0,0,.95);
        }

        .tlc-bottom {
          bottom: 0; left: 0;
          width:  ${CARD_W}px; height: ${DEPTH}px;
          transform-origin: bottom center;
          transform: translateZ(${DEPTH / 2}px) rotateX(-90deg);
          background: #080605;
          box-shadow: inset 0 -4px 15px rgba(220,10,10,.4);
        }

        /* ── VOLUMETRIC NEON OVERLAY ── */
        .tlc-glow-right {
          box-shadow:
            inset -6px 0 30px rgba(255,20,20,.8),
            inset 0 -4px 20px rgba(200,10,10,.6),
            inset 0 0 60px rgba(100,0,0,0.5);
        }
        .tlc-glow-left {
          box-shadow:
            inset 6px 0 30px rgba(255,20,20,.8),
            inset 0 -4px 20px rgba(200,10,10,.6),
            inset 0 0 60px rgba(100,0,0,0.5);
        }

        /* White-hot realistic neon tubes */
        .tlc-neon-v {
          position: absolute;
          top: 0; bottom: 0;
          width: 4px;
          z-index: 4;
          background: linear-gradient(to bottom,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.9) 20%,
            #ffffff 50%,
            rgba(255,255,255,0.9) 80%,
            rgba(255,255,255,0) 100%);
          box-shadow: 
            0 0 5px 2px #fff,
            0 0 15px 5px #ff2a2a, 
            0 0 40px 15px rgba(255, 0, 0, 0.7),
            0 0 80px 30px rgba(200, 0, 0, 0.3);
          animation: tlc-flicker 4s ease-in-out infinite alternate;
        }
        .tlc-neon-v.right { right: -1px; border-radius: 0 3px 3px 0; }
        .tlc-neon-v.left  { left: -1px; border-radius: 3px 0 0 3px; }

        .tlc-neon-h {
          position: absolute;
          bottom: -1px; left: 0; right: 0;
          height: 4px;
          z-index: 4;
          border-radius: 0 0 4px 4px;
          background: #ffffff;
          box-shadow: 
            0 0 5px 1px #fff,
            0 0 15px 4px #ff2a2a,
            0 0 30px 10px rgba(255, 0, 0, 0.6);
          animation: tlc-flicker 5s ease-in-out .5s infinite alternate;
        }

        @keyframes tlc-flicker {
          0%,89%,92%,95%,100% { opacity: 1; filter: brightness(1); }
          90%   { opacity: .5; filter: brightness(0.6); }
          93%   { opacity: .8; filter: brightness(1.2); }
          96%   { opacity: .7; filter: brightness(0.8); }
        }

        /* Ambient haze around text */
        .tlc-mist {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(30,0,0,.4) 0%, rgba(0,0,0,0.8) 100%);
          z-index: 2;
          pointer-events: none;
        }

        /* ── CINEMATIC TYPOGRAPHY ── */
        .tlc-content {
          position: relative;
          z-index: 5;
          padding: 30px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          height: 100%;
          box-sizing: border-box;
        }
        .tlc-title {
          font-family: 'Abril Fatface', Georgia, serif;
          font-size: 1.8rem;
          line-height: 1.15;
          margin: 0 0 12px;
          background: linear-gradient(180deg, #ffffff 0%, #c1b3a3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.95)) drop-shadow(0 0 20px rgba(255,255,255,0.1));
        }
        .tlc-subtitle {
          font-family: 'Crimson Pro', Georgia, serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: #ff3333;
          letter-spacing: .15em;
          margin: 0 0 18px;
          text-shadow: 0 0 12px rgba(255,20,20,.9), 0 0 30px rgba(255,0,0,.5), 0 2px 4px rgba(0,0,0,1);
          animation: tlc-flicker 6s ease-in-out 2s infinite;
        }
        .tlc-divider {
          width: 65%;
          height: 2px;
          flex-shrink: 0;
          margin: 0 0 18px;
          background: linear-gradient(to right,
            transparent,
            rgba(255,50,50,.8) 30%,
            rgba(255,50,50,.8) 70%,
            transparent);
          box-shadow: 0 0 10px rgba(255,0,0,0.5);
        }
        .tlc-body {
          font-family: 'Crimson Pro', Georgia, serif;
          font-size: 1rem;
          line-height: 1.7;
          color: #d1c8bd;
          text-shadow: 0 2px 5px rgba(0,0,0,1);
          font-weight: 400;
          margin: 0;
        }
      `}</style>

      <div
        className={`tlc-scene ${className}`}
        style={{
          transform: `
            rotateY(${rotateY}deg)
            rotateX(5deg)
            rotateZ(${rotateZ}deg)
            scale(${depthScale})
          `,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="tlc-group">

          {/* BACK face */}
          <div className="tlc-face tlc-back" />

          {/* SIDE face — toward the road center */}
          {isLeft
            ? <div className="tlc-face tlc-side-right" />
            : <div className="tlc-face tlc-side-left" />
          }

          {/* BOTTOM face */}
          <div className="tlc-face tlc-bottom" />

          {/* FRONT face — all visual content */}
          <div className="tlc-face tlc-front">
            <div className="tlc-mist" />
            <div className={`tlc-neon-border ${isLeft ? 'tlc-glow-right' : 'tlc-glow-left'}`} />
            <div className={`tlc-neon-v ${isLeft ? 'right' : 'left'}`} />
            <div className="tlc-neon-h" />
            <div className="tlc-content">
              <h2 className="tlc-title">{title}</h2>
              {subtitle && <p className="tlc-subtitle">{subtitle}</p>}
              <div className="tlc-divider" />
              <p className="tlc-body">{content}</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default TimeLineCard;