"use client";

import { useState } from "react";
import { Navbar } from "@/components/stranger-things/Navbar";
import { EventsGallery } from "@/components/stranger-things/EventsGallery/EventsGallery";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export default function EventsPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    useSmoothScroll();

    return (
        <main className="relative bg-black min-h-screen">
            <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} alwaysVisible />
            <EventsGallery />
        </main>
    );
}
