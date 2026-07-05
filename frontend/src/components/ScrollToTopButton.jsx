// src/components/ScrollToTopButton.jsx
import React, { useState, useEffect, useCallback } from "react";
import { ArrowUp } from "lucide-react";

const SCROLL_THRESHOLD = 400; // px scrolled before the button appears

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-[#0b0b0c] border border-[#c8a45c]/30 text-[#c8a45c] hover:bg-[#c8a45c] hover:text-[#0b0b0c] transition-all duration-300 shadow-lg ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ArrowUp size={20} strokeWidth={1.5} />
    </button>
  );
};

export default ScrollToTopButton;