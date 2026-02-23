"use client";
import React, { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Don't show custom cursor on touch/pointer-coarse devices (mobile, tablet)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <motion.div
      style={{
        left: mouseX,
        top: mouseY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        scale: isHovering ? 2.5 : 1,
        borderColor: isHovering ? "#990024" : "#6b001a",
        backgroundColor: isHovering ? "rgba(153, 0, 36, 0.1)" : "rgba(0, 0, 0, 0)",
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        left: { duration: 0 },
        top: { duration: 0 }
      }}
      className="fixed top-0 left-0 w-6 h-6 border-2 rounded-full z-[9999] pointer-events-none mix-blend-difference shadow-[0_0_10px_rgba(153,0,36,0.3)]"
    />
  );
}
