"use client";

import Image from "next/image";
import { useState } from "react";
import { SERVICES } from "@/data/services";
import styles from "./EventsGallery.module.css";

const EVENT_METADATA = [
    { label: "Meme Competition", status: "LIVE" },
    { label: "Online Doubt Session", status: "ENDED" },
    { label: "Social Media Contest", status: "LIVE" },
];

// Extracted mini-component for premium Image Loading Effects
const OptimizedEventImage = ({ src, alt, className, priority }: { src: string, alt: string, className: string, priority: boolean }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <>
            {/* Thematic Skeleton Loader while NextJS fetches optimized WebP */}
            {!isLoaded && (
                <div className="absolute inset-0 z-0 flex items-center justify-center bg-black/40 rounded animate-pulse">
                    <div className="w-8 h-8 rounded-full border-2 border-red-900 border-t-red-500 animate-spin" />
                </div>
            )}
            <Image
                src={src}
                alt={alt}
                width={800}
                height={1000}
                quality={85} // Premium quality, highly compressed compared to unoptimized
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                className={`${className} transition-all duration-700 ease-in-out ${isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-[1.05] blur-md"}`}
                onLoad={() => setIsLoaded(true)}
            />
        </>
    );
};

export const EventsGallery = () => {
    return (
        <section className={styles.gallerySection}>
            <div className={styles.backgroundLayer} />
            <div className={styles.noise} />
            <div className={styles.scanlines} />
            <div className={styles.redGlow} />

            <div className={styles.contentContainer}>
                <h1 className={styles.heading}>Mini Events</h1>

                <div className={styles.grid}>
                    {SERVICES.map((service, index) => {
                        const metadata = EVENT_METADATA.find(m => m.label === service.label);
                        const status = metadata ? metadata.status : "COMING SOON";

                        let statusClass = styles.comingSoon;
                        const upperStatus = status.toUpperCase();
                        if (upperStatus === "ENDED") statusClass = styles.ended;
                        else if (upperStatus === "LIVE") statusClass = styles.live;

                        return (
                            <div key={index} className={styles.card}>

                                {/* imageWrapper gets the src as a CSS var for the blurred bg fill */}
                                <div
                                    className={styles.imageWrapper}
                                    style={{ "--poster-src": `url(${service.img})` } as React.CSSProperties}
                                >
                                    {/* Blurred bg fill — covers side gaps without cropping poster */}
                                    <div className={styles.imageBg} />

                                    {/* Switched to premium OptimizedEventImage */}
                                    <OptimizedEventImage
                                        src={service.img}
                                        alt={service.label}
                                        className={styles.eventImage}
                                        priority={index === 0} // First image loads immediately
                                    />
                                </div>

                                {/* Content panel — slides up on hover (lg only) */}
                                <div className={styles.cardContent}>
                                    <div className={styles.cardHeader}>
                                        <h2 className={styles.cardLabel}>{service.label}</h2>
                                        <div className={`${styles.statusBadge} ${statusClass}`}>
                                            {upperStatus === "LIVE" && <span className={styles.pulseDot} />}
                                            {status}
                                        </div>
                                    </div>
                                    <p className={styles.cardDescription}>{service.description}</p>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};