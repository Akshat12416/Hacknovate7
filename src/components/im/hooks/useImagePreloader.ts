"use client";
import { useState, useEffect } from "react";

export function useImagePreloader(path: string, frameCount: number, skipIncrement: number = 1) {
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;
        const totalToLoad = Math.ceil(frameCount / skipIncrement);

        for (let i = 1; i <= frameCount; i += skipIncrement) {
            const img = new Image();
            const frameIndex = i.toString().padStart(3, "0");
            img.src = `${path}/ezgif-frame-${frameIndex}.jpg`;
            img.onload = () => {
                loadedCount++;
                setProgress((loadedCount / totalToLoad) * 100);
                if (loadedCount === totalToLoad) setLoaded(true);
            };
            img.onerror = () => {
                loadedCount++;
                setProgress((loadedCount / totalToLoad) * 100);
                if (loadedCount === totalToLoad) setLoaded(true);
            };
            loadedImages.push(img);
        }
        setImages(loadedImages);
    }, [path, frameCount, skipIncrement]);

    return { images, loaded, progress };
}
