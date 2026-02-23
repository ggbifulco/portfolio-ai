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
  { id: "hero", component: <Hero /> },
  { id: "projects", component: <ProjectsGrid /> },
  { id: "newsletter", component: <NewsletterPreview /> },
  { id: "academy", component: <Academy /> },
  { id: "about", component: <About /> },
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
      <div className="hidden sm:flex fixed right-3 md:right-10 top-1/2 -translate-y-1/2 z-50 flex-col gap-3 md:gap-4">
        {sections.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSection(i)}
            aria-label={`Go to section ${i + 1}`}
            className={`rounded-full transition-all duration-500 shadow-lg ${
              index === i
                ? "bg-red-700 h-8 w-1.5 shadow-[0_0_10px_rgba(185,28,28,0.5)]"
                : "w-1.5 h-1.5 bg-white/10 hover:bg-white/30"
            }`}
          />
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
