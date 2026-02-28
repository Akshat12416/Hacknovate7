"use client";

import React,
{
    useImperativeHandle,
    useRef,
    forwardRef,
    useEffect,
    useState
} from "react";
import gsap from "gsap";

export interface PortalGlitchRef {
    setActive: (active: boolean) => void;
}

type Slice = {
    height: string;
    top: string;
    clipPath?: string;
};

const PortalGlitch = forwardRef<PortalGlitchRef, {}>((props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const layer1Ref = useRef<HTMLDivElement>(null);
    const layer2Ref = useRef<HTMLDivElement>(null);
    const burstTimerRef = useRef<gsap.core.Tween | null>(null);

    const [layer1Slices, setLayer1Slices] = useState<Slice[]>([]);
    const [layer2Slices, setLayer2Slices] = useState<Slice[]>([]);

    const random = (min: number, max: number) =>
        Math.random() * (max - min) + min;

    // ✅ Generate random slice layout ONLY after mount (prevents hydration mismatch)
    useEffect(() => {
        const l1 = [...Array(8)].map(() => ({
            height: `${random(1, 12)}%`,
            top: `${random(0, 88)}%`,
            clipPath: `polygon(0 ${random(0, 10)}%, 100% ${random(
                0,
                10
            )}%, 100% ${random(90, 100)}%, 0 ${random(90, 100)}%)`
        }));

        const l2 = [...Array(8)].map(() => ({
            height: `${random(1, 10)}%`,
            top: `${random(0, 90)}%`
        }));

        setLayer1Slices(l1);
        setLayer2Slices(l2);
    }, []);

    const createBurst = () => {
        if (!containerRef.current || !layer1Ref.current || !layer2Ref.current)
            return;

        const burstTl = gsap.timeline();

        burstTl.set(containerRef.current, {
            visibility: "visible",
            opacity: 1
        });

        // Layer 1 (Reddish split)
        burstTl
            .fromTo(
                layer1Ref.current,
                {
                    opacity: 0,
                    x: 0,
                    scale: 1,
                    skewX: 0
                },
                {
                    opacity: random(0.2, 0.5),
                    x: random(-25, -5),
                    skewX: random(-8, 8),
                    scale: random(1.01, 1.03),
                    duration: 0.05,
                    ease: "power3.inOut"
                },
                0
            )
            .to(
                layer1Ref.current,
                {
                    opacity: 0,
                    x: 0,
                    skewX: 0,
                    scale: 1,
                    duration: 0.04,
                    ease: "power3.out"
                },
                0.07
            );

        // Layer 2 (Cyanish split)
        burstTl
            .fromTo(
                layer2Ref.current,
                {
                    opacity: 0,
                    x: 0,
                    scale: 1,
                    skewX: 0
                },
                {
                    opacity: random(0.15, 0.4),
                    x: random(5, 25),
                    skewX: random(-8, 8),
                    scale: random(1.01, 1.03),
                    duration: 0.05,
                    ease: "power3.inOut"
                },
                0.02
            )
            .to(
                layer2Ref.current,
                {
                    opacity: 0,
                    x: 0,
                    skewX: 0,
                    scale: 1,
                    duration: 0.04,
                    ease: "power3.out"
                },
                0.09
            );

        burstTl.set(containerRef.current, {
            visibility: "hidden",
            opacity: 0
        }, "+=0.12");
    };

    const scheduleBurst = () => {
        const delay = random(0.4, 2.5);
        burstTimerRef.current = gsap.delayedCall(delay, () => {
            createBurst();
            scheduleBurst();
        });
    };

    useImperativeHandle(ref, () => ({
        setActive: (active: boolean) => {
            if (active) {
                if (!burstTimerRef.current) {
                    scheduleBurst();
                }
            } else {
                if (burstTimerRef.current) {
                    burstTimerRef.current.kill();
                    burstTimerRef.current = null;
                }
                gsap.set(containerRef.current, {
                    visibility: "hidden",
                    opacity: 0
                });
            }
        }
    }));

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: 25, visibility: "hidden" }}
        >
            {/* Layer 1 */}
            <div
                ref={layer1Ref}
                className="absolute inset-[-5%] w-[110%] h-[110%] opacity-0 pointer-events-none"
                style={{ mixBlendMode: "color-dodge" }}
            >
                {layer1Slices.map((slice, i) => (
                    <div
                        key={i}
                        className="absolute w-full bg-[#ff330008]"
                        style={slice}
                    />
                ))}
            </div>

            {/* Layer 2 */}
            <div
                ref={layer2Ref}
                className="absolute inset-[-5%] w-[110%] h-[110%] opacity-0 pointer-events-none"
                style={{ mixBlendMode: "screen" }}
            >
                {layer2Slices.map((slice, i) => (
                    <div
                        key={i}
                        className="absolute w-full bg-[#00ffff06]"
                        style={slice}
                    />
                ))}
            </div>

            {/* Center Glitch Line */}
            <div
                className="absolute w-full h-[1px] bg-white/10 top-1/2 -translate-y-1/2 opacity-20"
                style={{ boxShadow: "0 0 20px rgba(255,255,255,0.1)" }}
            />
        </div>
    );
});

PortalGlitch.displayName = "PortalGlitch";
export default PortalGlitch;