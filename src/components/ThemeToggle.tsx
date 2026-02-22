"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed bottom-10 right-24 z-[100] flex items-center">
      <div 
        onClick={toggleTheme}
        className="relative w-16 h-8 bg-white/5 border border-white/10 rounded-full flex items-center px-1 cursor-pointer overflow-hidden backdrop-blur-md"
      >
        <motion.div
          animate={{ x: theme === "dark" ? 32 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          {theme === "dark" ? (
            <Moon size={12} className="text-black" />
          ) : (
            <Sun size={12} className="text-orange-500" />
          )}
        </motion.div>
        
        {/* Etichetta dinamica invisibile per accessibilità */}
        <span className="sr-only">Toggle Theme</span>
      </div>
    </div>
  );
}
