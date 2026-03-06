"use client";
import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import { ProjectsGrid } from "@/components/Projects";
import NewsletterPreview from "@/components/Newsletter";
import Academy from "@/components/Academy";

const Scene3D = dynamic(() => import("@/components/Scene3D"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black z-0" />
});

const sections = [
  { id: "hero",       label: "Home",       component: <Hero /> },
  { id: "projects",   label: "Projects",   component: <ProjectsGrid /> },
  { id: "newsletter", label: "Newsletter", component: <NewsletterPreview /> },
  { id: "academy",    label: "Academy",    component: <Academy /> },
  { id: "about",      label: "About",      component: <About /> },
];

function HomeContent() {
  const [index, setIndex] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(0);
  const isScrolling = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const searchParams = useSearchParams();

  // Compute actual viewport height (fixes iOS Safari 100vh bug)
  useEffect(() => {
    const updateHeight = () => setSectionHeight(window.innerHeight);
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const scrollToSection = useCallback((newIndex: number) => {
    if (newIndex >= 0 && newIndex < sections.length && !isScrolling.current) {
      isScrolling.current = true;
      setIndex(newIndex);
      window.dispatchEvent(new CustomEvent("sectionChanged", { detail: sections[newIndex].id }));
      setTimeout(() => { isScrolling.current = false; }, 800);
    }
  }, []);

  // Sync with URL query params
  useEffect(() => {
    const s = searchParams.get("s");
    if (s) {
      const targetIndex = sections.findIndex(sec => sec.id === s);
      if (targetIndex !== -1 && targetIndex !== index) {
        setIndex(targetIndex);
        window.dispatchEvent(new CustomEvent("sectionChanged", { detail: s }));
      }
    }
    window.scrollTo(0, 0);
  }, [searchParams]);

  // Custom nav events
  useEffect(() => {
    const handleNav = (e: any) => {
      const targetId = e.detail;
      const targetIndex = sections.findIndex(s => s.id === targetId);
      if (targetIndex !== -1) scrollToSection(targetIndex);
    };
    window.addEventListener("navToSection", handleNav);
    return () => window.removeEventListener("navToSection", handleNav);
  }, [scrollToSection]);

  // Mouse wheel scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling.current) return;
      if (Math.abs(e.deltaY) > 20) {
        if (e.deltaY > 0) scrollToSection(index + 1);
        else scrollToSection(index - 1);
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [index, scrollToSection]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        scrollToSection(index + 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        scrollToSection(index - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, scrollToSection]);

  // Touch / swipe scroll for mobile
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 50) {
        if (delta > 0) scrollToSection(index + 1);
        else scrollToSection(index - 1);
      }
      touchStartY.current = null;
    };
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [index, scrollToSection]);

  const translateY = sectionHeight > 0
    ? `-${index * sectionHeight}px`
    : `-${index * 100}dvh`;

  return (
    <>
      <Scene3D sectionIndex={index} />
      <motion.div
        animate={{ y: translateY }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="h-full w-full relative z-10"
      >
        {sections.map((section) => (
          <div
            key={section.id}
            className="w-screen overflow-hidden"
            style={{ height: sectionHeight > 0 ? `${sectionHeight}px` : "100dvh" }}
          >
            {section.component}
          </div>
        ))}
      </motion.div>

      {/* Section navigation dots — hidden on xs, visible from sm */}
      <div className="hidden sm:flex fixed right-3 md:right-8 top-1/2 -translate-y-1/2 z-50 flex-col gap-3 md:gap-4">
        {sections.map((section, i) => (
          <div key={i} className="relative group flex items-center justify-end">
            {/* Tooltip label */}
            <span className="absolute right-6 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-[8px] uppercase tracking-widest font-bold text-white/50 whitespace-nowrap bg-black/90 border border-white/5 px-2.5 py-1 rounded-lg pointer-events-none backdrop-blur-sm">
              {section.label}
            </span>
            <button
              onClick={() => scrollToSection(i)}
              aria-label={`Go to ${section.label}`}
              className={`rounded-full transition-all duration-500 ${
                index === i
                  ? "bg-red-700 h-7 w-1.5 shadow-[0_0_12px_rgba(153,0,36,0.6)]"
                  : "w-1.5 h-1.5 bg-white/10 hover:bg-white/25 hover:scale-125"
              }`}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default function Home() {
  return (
    <main
      className="overflow-hidden bg-black relative font-sans"
      style={{ height: "100dvh", width: "100vw" }}
    >
      <Navbar />
      <Suspense fallback={<div style={{ height: "100dvh", width: "100vw" }} className="bg-black" />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
