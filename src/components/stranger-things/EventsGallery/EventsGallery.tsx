"use client";

import Image from "next/image";
import { SERVICES } from "@/data/services";
import styles from "./EventsGallery.module.css";

const EVENT_METADATA = [
    { label: "Meme Competition", status: "LIVE" },
    { label: "Online Doubt Session", status: "ENDED" },
    { label: "Social Media Contest", status: "LIVE" },
];

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

                                    <Image
                                        src={service.img}
                                        alt={service.label}
                                        width={800}
                                        height={1000}
                                        loading="lazy"
                                        className={styles.eventImage}
                                        unoptimized
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