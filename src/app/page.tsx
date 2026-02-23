"use client";
import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
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
  const isScrolling = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const scrollToSection = useCallback((newIndex: number) => {
    if (newIndex >= 0 && newIndex < sections.length && !isScrolling.current) {
      isScrolling.current = true;
      setIndex(newIndex);
      window.dispatchEvent(new CustomEvent("sectionChanged", { detail: sections[newIndex].id }));
      setTimeout(() => { isScrolling.current = false; }, 800);
    }
  }, []);

  // SINCRONIZZAZIONE CON URL QUERY PARAMS
  useEffect(() => {
    const s = searchParams.get("s");
    if (s) {
      const targetIndex = sections.findIndex(sec => sec.id === s);
      if (targetIndex !== -1 && targetIndex !== index) {
        setIndex(targetIndex);
        window.dispatchEvent(new CustomEvent("sectionChanged", { detail: s }));
      }
    }
    // Forza il browser a rimanere in alto per evitare sfasamenti
    window.scrollTo(0, 0);
  }, [searchParams]);

  useEffect(() => {
    const handleNav = (e: any) => {
      const targetId = e.detail;
      const targetIndex = sections.findIndex(s => s.id === targetId);
      if (targetIndex !== -1) scrollToSection(targetIndex);
    };
    window.addEventListener("navToSection", handleNav);
    return () => window.removeEventListener("navToSection", handleNav);
  }, [scrollToSection]);

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

  return (
    <>
      <Scene3D sectionIndex={index} />
      <motion.div
        animate={{ y: `-${index * 100}vh` }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="h-full w-full relative z-10"
      >
        {sections.map((section) => (
          <div key={section.id} className="h-screen w-screen overflow-hidden">
            {section.component}
          </div>
        ))}
      </motion.div>

      <div className="fixed right-10 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {sections.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSection(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 shadow-lg ${
              index === i ? "bg-red-700 h-10 w-1.5 shadow-[0_0_10px_rgba(185,28,28,0.5)]" : "bg-white/10 hover:bg-white/30"
            }`}
          />
        ))}
      </div>
    </>
  );
}

// Version Stable 1.0 - Ready for Deploy
export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-black relative font-sans">
      <Navbar />
      <Suspense fallback={<div className="h-screen w-screen bg-black" />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
