"use client";
import { useState } from "react";
import { Navbar } from "@/components/stranger-things/Navbar";
import StickySection from "@/components/stranger-things/StickySection/StickySection";

export default function TeamsPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <main className="relative bg-black min-h-screen">
            <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} alwaysVisible />
            <StickySection />
        </main>
    );
}
