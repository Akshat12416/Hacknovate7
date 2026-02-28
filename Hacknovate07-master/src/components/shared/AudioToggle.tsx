"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface AudioToggleProps {
    videoRef?: React.RefObject<HTMLVideoElement | null>;
}

export function AudioToggle({ videoRef }: AudioToggleProps) {
    const [isMuted, setIsMuted] = useState(true);
    const bgAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        bgAudioRef.current = new Audio("/assets/audio/stranger_things.mp3");
        bgAudioRef.current.loop = true;

        return () => {
            bgAudioRef.current?.pause();
            bgAudioRef.current = null;
        };
    }, []);

    const toggleAudio = () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);

        if (bgAudioRef.current) {
            if (!newMuted) {
                bgAudioRef.current.play().catch(console.error);
                if (videoRef?.current) videoRef.current.muted = false;
            } else {
                bgAudioRef.current.pause();
                if (videoRef?.current) videoRef.current.muted = true;
            }
        }
    };

    return (
        <button
            onClick={toggleAudio}
            className="fixed bottom-4 md:bottom-6 left-4 md:left-6 z-[100] p-3 rounded-full bg-black/50 border border-white/20 text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle audio"
        >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
    );
}
