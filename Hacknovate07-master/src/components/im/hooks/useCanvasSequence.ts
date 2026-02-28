"use client";
import { useCallback } from "react";

export function useCanvasSequence() {
    const drawFrame = useCallback(
        (
            ctx: CanvasRenderingContext2D,
            img: HTMLImageElement,
            canvas: HTMLCanvasElement
        ) => {
            if (!ctx || !img) return;

            // Object-fit: cover logic
            const canvasRatio = canvas.width / canvas.height;
            const imgRatio = img.width / img.height;
            let drawWidth, drawHeight, offsetX, offsetY;

            if (canvasRatio > imgRatio) {
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgRatio;
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            } else {
                drawWidth = canvas.height * imgRatio;
                drawHeight = canvas.height;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            }

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        },
        []
    );

    return { drawFrame };
}
