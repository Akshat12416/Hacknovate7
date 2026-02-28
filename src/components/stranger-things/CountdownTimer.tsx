"use client";

import { useState, useEffect, forwardRef } from "react";

interface CountdownTimerProps {
    isMenuOpen?: boolean;
}

export const CountdownTimer = forwardRef<HTMLDivElement, CountdownTimerProps>(
({ isMenuOpen }, ref) => {

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const targetDate = new Date("March 20, 2026 00:00:00").getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor(
                (distance % (1000 * 60)) / 1000
            );

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div
            ref={ref}
            className={`
                flex flex-col items-center
                pointer-events-auto select-none
                transition-opacity duration-300
                ${isMenuOpen ? "opacity-0 invisible" : "opacity-100 visible"}
            `}
            style={{ fontFamily: "'ITC Benguiat Std', sans-serif" }}
            data-cursor-flip="true"
        >
            {/* Heading */}
            <p className="text-white font-bold text-sm  lg:text-lg tracking-[0.35em] mb-3">
                Resgistration Closing in
            </p>

            <div className="flex gap-2 md:gap-3 text-2xl md:text-4xl lg:text-5xl font-black italic tracking-tighter">

                {/* Days */}
                <div className="flex flex-col items-center">
                    <span
                        style={{
                            WebkitTextStroke: "1px #ff4d4d",
                            color: "transparent",
                            textShadow:
                                "0 0 8px rgba(255, 0, 0, 0.8), 0 0 15px rgba(255, 0, 0, 0.5)",
                        }}
                    >
                        {String(timeLeft.days).padStart(2, "0")}
                    </span>
                    <span className="text-[8px] md:text-[10px] uppercase text-red-500 font-sans font-bold tracking-[0.2em] mt-0.5 opacity-80">
                        Days
                    </span>
                </div>

                <span className="text-red-500 mt-1.5 opacity-80">:</span>

                {/* Hours */}
                <div className="flex flex-col items-center">
                    <span
                        style={{
                            WebkitTextStroke: "1px #ff4d4d",
                            color: "transparent",
                            textShadow:
                                "0 0 8px rgba(255, 0, 0, 0.8), 0 0 15px rgba(255, 0, 0, 0.5)",
                        }}
                    >
                        {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[8px] md:text-[10px] uppercase text-red-500 font-sans font-bold tracking-[0.2em] mt-0.5 opacity-80">
                        Hours
                    </span>
                </div>

                <span className="text-red-500 mt-1.5 opacity-80">:</span>

                {/* Minutes */}
                <div className="flex flex-col items-center">
                    <span
                        style={{
                            WebkitTextStroke: "1px #ff4d4d",
                            color: "transparent",
                            textShadow:
                                "0 0 8px rgba(255, 0, 0, 0.8), 0 0 15px rgba(255, 0, 0, 0.5)",
                        }}
                    >
                        {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[8px] md:text-[10px] uppercase text-red-500 font-sans font-bold tracking-[0.2em] mt-0.5 opacity-80">
                        Mins
                    </span>
                </div>

                <span className="text-red-500 mt-1.5 opacity-80">:</span>

                {/* Seconds */}
                <div className="flex flex-col items-center">
                    <span
                        style={{
                            WebkitTextStroke: "1px #ff4d4d",
                            color: "transparent",
                            textShadow:
                                "0 0 8px rgba(255, 0, 0, 0.8), 0 0 15px rgba(255, 0, 0, 0.5)",
                        }}
                    >
                        {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[8px] md:text-[10px] uppercase text-red-500 font-sans font-bold tracking-[0.2em] mt-0.5 opacity-80">
                        Secs
                    </span>
                </div>

            </div>
        </div>
    );
});

CountdownTimer.displayName = "CountdownTimer";