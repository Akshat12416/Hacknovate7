"use client";

import React from "react";
import Image from "next/image";
import { SERVICES } from "@/data/services";
import styles from "./EventsGallery.module.css";

// Extended data to match the screenshot provided by user
const EVENT_METADATA = [
    {
        label: "Meme Competition",
        status: "LIVE",
    },
    {
        label: "Online Doubt Session",
        status: "ENDED",
    },
    {
        label: "Social Media Contest",
        status: "LIVE",
    }
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
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={service.img}
                                        alt={service.label}
                                        width={800}
                                        height={1000}
                                        className={styles.eventImage}
                                        unoptimized
                                    />
                                </div>

                                <div className={styles.cardContent}>
                                    <h2 className={styles.cardLabel}>{service.label}</h2>
                                    <p className={styles.cardDescription}>{service.description}</p>

                                    <div className={styles.cardFooter}>
                                        <div className={`${styles.statusTag} ${statusClass}`}>
                                            {status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
