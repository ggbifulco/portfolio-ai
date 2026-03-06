"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

const roles = [
  "AI Engineering",
  "LLM Fine-Tuning",
  "RAG Architecture",
  "Agent Orchestration",
  "AI Research",
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setRoleIndex((p) => (p + 1) % roles.length), 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cursor = setInterval(() => setCursorVisible((p) => !p), 530);
    return () => clearInterval(cursor);
  }, []);

  const goTo = (id: string) =>
    window.dispatchEvent(new CustomEvent("navToSection", { detail: id }));

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center overflow-hidden bg-transparent text-white"
      style={{ height: "100dvh" }}
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 hero-grid pointer-events-none" />
      {/* Radial vignette to fade grid at edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_40%,#000_100%)] pointer-events-none" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center max-w-7xl px-4 sm:px-6 flex flex-col items-center justify-center h-full"
      >
        {/* Main title */}
        <motion.h1
          variants={item}
          className="text-[2.6rem] sm:text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-none mb-6 sm:mb-8 select-none drop-shadow-2xl uppercase text-white"
        >
          FUTURE <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-700 to-red-950">
            INTELLIGENCE
          </span>
        </motion.h1>

        {/* Typewriter subtitle */}
        <motion.div
          variants={item}
          className="flex items-center gap-2 text-base sm:text-xl md:text-2xl text-gray-300 font-light tracking-wide italic drop-shadow-lg h-8 sm:h-10 mb-3 sm:mb-4"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {roles[roleIndex]}
            </motion.span>
          </AnimatePresence>
          <span
            className="text-red-600 font-bold text-xl sm:text-2xl leading-none transition-opacity duration-75"
            style={{ opacity: cursorVisible ? 1 : 0 }}
          >
            |
          </span>
        </motion.div>

        {/* Progress dots */}
        <motion.div variants={item} className="flex gap-1.5 mb-8 sm:mb-10">
          {roles.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-500 ${
                i === roleIndex ? "w-5 h-1 bg-red-700" : "w-1 h-1 bg-white/20"
              }`}
            />
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div variants={item} className="flex flex-wrap gap-3 sm:gap-4 justify-center">
          <button
            onClick={() => goTo("projects")}
            className="group flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-red-900 text-white font-black rounded-2xl hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest text-[10px] shadow-lg shadow-red-900/30"
          >
            View Projects
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <button
            onClick={() => goTo("about")}
            className="group flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white/5 border border-white/15 text-white font-black rounded-2xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 uppercase tracking-widest text-[10px]"
          >
            <Mail size={14} className="text-red-500" />
            Contact
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => goTo("projects")}
      >
        <p className="text-[8px] uppercase tracking-[0.4em] text-gray-600 font-bold">Scroll</p>
        <motion.div
          animate={{ scaleY: [0.6, 1, 0.6], opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-red-700 to-transparent origin-top"
        />
      </motion.div>
    </section>
  );
}
