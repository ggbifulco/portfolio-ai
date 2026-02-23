"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="relative flex items-center justify-center overflow-hidden bg-transparent text-white" style={{ height: "100dvh" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center max-w-7xl px-4 sm:px-6 pointer-events-none flex flex-col items-center justify-center h-full"
      >
        <h1 className="text-[2.6rem] sm:text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-none mb-6 sm:mb-10 select-none drop-shadow-2xl uppercase text-white">
          FUTURE <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-800 to-red-950">
            INTELLIGENCE
          </span>
        </h1>

        <div className="flex items-center gap-3 text-base sm:text-xl md:text-2xl text-gray-300 font-light tracking-wide italic drop-shadow-lg">
          <span>AI Engineering & other stuffs</span>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            }}
          >
            <Sparkles size={22} className="text-red-600 fill-red-600/20 sm:w-7 sm:h-7" />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <p className="text-[8px] uppercase tracking-[0.4em] text-gray-500 font-bold">Scroll</p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-red-700"
        >
          <ChevronDown size={22} strokeWidth={3} />
        </motion.div>
      </motion.div>
    </section>
  );
}
