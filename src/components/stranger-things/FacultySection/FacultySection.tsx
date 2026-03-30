"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { FACULTY_DATA } from "@/data/facultyData";
import styles from "./FacultySection.module.css";

export default function FacultySection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate blocks sequentially into view on load/scroll
            gsap.to(`.${styles.categoryBlock}`, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out",
                delay: 0.2
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className={styles.facultyContainer} ref={containerRef}>
            <div className={styles.bgContainer}>
                <div className={styles.bgParallax}>
                    <Image
                        src="/team_bg/bg (1).jpg"
                        alt="Background"
                        fill
                        className={styles.bgImage}
                        sizes="100vw"
                        priority
                        quality={80}
                    />
                </div>
                <div className={styles.bgDarkOverlay} />
                <div className={styles.bgVignette} />
            </div>
            <div className={styles.facultyContent}>
                {FACULTY_DATA.map((category, index) => {
                    // Make the top 2 categories slightly larger based on data
                    const isTopLevel = category.category === "Chief Patron" || category.category === "Patron";

                    return (
                        <div
                            key={index}
                            className={styles.categoryBlock}
                            data-level={isTopLevel ? "top" : "normal"}
                        >
                            <h2 className={styles.categoryTitle}>{category.category}</h2>
                            <div className={styles.membersGrid}>
                                {category.members.map((member, mIndex) => (
                                    <div key={mIndex} className={styles.memberCard}>
                                        <div className={styles.memberName}>{member.name}</div>
                                        <div className={styles.memberRole}>{member.role}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
