"use client";
import React, { useState, useEffect, CSSProperties } from 'react';

export default function CustomButton({ 
  link = "#", 
  imageSrc = "", 
  buttonText = "Apply with Devfolio",
  width = "260px", 
  height = "56px",
  fontSize = "18px",
  iconSize = "32px", 
  borderRadius = "6px",
  applyInvert = false,
  gap = "8px"
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noreferrer"
      className="inline-block no-underline"
    >
      <button 
        className="
          group flex items-center justify-center
          bg-white transition-all duration-300
          active:scale-95
          border border-red-500/20 hover:border-red-500/60
          shadow-[0_2px_10px_rgba(239,68,68,0.15)]
          hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]
          text-gray-600 hover:text-[#ef4444]
          font-semibold
         w-(--btn-width)
          h-[48px] sm:h-(--btn-height)
          text-[14px] 
          overflow-hidden
        "
        style={{
          "--btn-width": width,
          "--btn-height": height,
          "--btn-font": fontSize,
          borderRadius: borderRadius,
          gap: gap
        } as CSSProperties} 
      >
        {imageSrc && (
          <span className="flex items-center justify-center shrink-0">
            <img 
              alt="icon" 
              src={imageSrc}
              className={`
                transition-all duration-300
                grayscale opacity-70
                group-hover:grayscale-0 group-hover:opacity-100
                object-contain
                ${applyInvert ? 'invert' : ''}
                w-(--icon-size) h-(--icon-size)
              `}
              style={{ 
                "--icon-size": iconSize,
              } as CSSProperties} 
            />
          </span>
        )}
        <span className="whitespace-nowrap">
          {buttonText}
        </span>
      </button>
    </a>
  );
}