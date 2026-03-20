"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface AudioToggleProps {
    videoRef?: React.RefObject<HTMLVideoElement | null>;
}

export function AudioToggle({ videoRef }: AudioToggleProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const bgAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = new Audio("/assets/audio/stranger_things.mp3");
        audio.loop = true;
        audio.volume = 0.6;
        bgAudioRef.current = audio;

        const interactionEvents = ["click", "keydown", "touchstart", "pointerdown"];

        const playOnInteraction = () => {
            if (!bgAudioRef.current) return;
            bgAudioRef.current.play()
                .then(() => {
                    setIsPlaying(true);
                    if (videoRef?.current) videoRef.current.muted = false;
                })
                .catch(() => {
                    // Still blocked — ignore silently
                });
            interactionEvents.forEach(ev =>
                document.removeEventListener(ev, playOnInteraction)
            );
        };

        // Attempt autoplay immediately
        audio.play()
            .then(() => {
                setIsPlaying(true);
                if (videoRef?.current) videoRef.current.muted = false;
            })
            .catch((err: unknown) => {
                // NotAllowedError is 100% expected on page load —
                // browsers block autoplay before any user gesture.
                // Silently fall back to interaction-triggered play.
                const isAutoplayBlock =
                    err instanceof DOMException && err.name === "NotAllowedError";

                if (!isAutoplayBlock) {
                    // Something else went wrong — worth logging
                    console.error("[AudioToggle] Unexpected play error:", err);
                }

                setIsPlaying(false);
                if (videoRef?.current) videoRef.current.muted = true;

                interactionEvents.forEach(ev =>
                    document.addEventListener(ev, playOnInteraction, { once: true })
                );
            });

        return () => {
            audio.pause();
            audio.src = "";
            bgAudioRef.current = null;
            interactionEvents.forEach(ev =>
                document.removeEventListener(ev, playOnInteraction)
            );
        };
    }, [videoRef]);

    const toggleAudio = () => {
        if (!bgAudioRef.current) return;

        if (isPlaying) {
            bgAudioRef.current.pause();
            setIsPlaying(false);
            if (videoRef?.current) videoRef.current.muted = true;
        } else {
            bgAudioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(console.error);
            if (videoRef?.current) videoRef.current.muted = false;
        }
    };

    return (
        <button
            onClick={toggleAudio}
            className="fixed bottom-4 md:bottom-6 left-4 md:left-6 z-[100] p-3 rounded-full bg-black/50 border border-white/20 text-white hover:bg-white/10 transition-colors"
            aria-label={isPlaying ? "Mute audio" : "Unmute audio"}
        >
            {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
    );
}