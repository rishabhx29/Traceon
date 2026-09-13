'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled up to given distance
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the top cordinate to 0
    // make scrolling smooth
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 sm:right-8 z-50 p-2.5 rounded-full bg-[#111114]/80 border border-[#27272a] text-[#a1a1aa] hover:text-[#10b981] hover:border-[#10b981]/50 backdrop-blur-md shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-1 focus:ring-[#10b981]/50 cursor-pointer"
            aria-label="Scroll to top"
        >
            <ArrowUp size={18} />
        </button>
    );
}
