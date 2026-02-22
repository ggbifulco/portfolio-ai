"use client";
import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";

export default function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 100 });
  const smoothMouseY = useSpring(mouseY, { damping: 20, stiffness: 100 });

  return (
    <section id="hero" className="relative h-screen snap-start flex items-center justify-center overflow-hidden bg-transparent text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center max-w-7xl px-6 pointer-events-none flex flex-col items-center justify-center h-full"
      >
        <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-none mb-10 select-none drop-shadow-2xl uppercase text-white">
          FUTURE <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-800 to-red-950">
            INTELLIGENCE
          </span>
        </h1>
        
        <div className="flex items-center gap-4 text-xl md:text-2xl text-gray-300 font-light tracking-wide italic drop-shadow-lg">
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
            <Sparkles size={28} className="text-red-600 fill-red-600/20" />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator: Freccia che rimbalza */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <p className="text-[8px] uppercase tracking-[0.4em] text-gray-500 font-bold">Scroll</p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-red-700"
        >
          <ChevronDown size={24} strokeWidth={3} />
        </motion.div>
      </motion.div>
    </section>
  );
}
