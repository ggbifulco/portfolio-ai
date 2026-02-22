"use client";
import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { motion, useAnimation } from "framer-motion";

export default function Scene3D({ sectionIndex }: { sectionIndex: number }) {
  const [mounted, setMounted] = useState(false);
  const prevIndex = useRef(0);
  const controls = useAnimation();

  const getPos = (index: number) => ({
    x: 10 + (index * 13),
    y: 85 - (index * 12)
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const animateFlight = async () => {
      const isGoingForward = sectionIndex > prevIndex.current;
      const isGoingBack = sectionIndex < prevIndex.current;
      const target = getPos(sectionIndex);
      const start = getPos(prevIndex.current);

      const targetOpacity = sectionIndex === 0 ? 1.0 : 0.4;

      controls.stop();

      if (isGoingForward) {
        await controls.start({
          left: `${target.x}%`,
          top: `${target.y}%`,
          rotate: 0,
          opacity: targetOpacity,
          transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
        });
      } else if (isGoingBack) {
        const midX = Math.max(start.x, target.x) + 20; 
        const midY = (start.y + target.y) / 2;

        await controls.start({
          left: [`${start.x}%`, `${midX}%`, `${target.x}%`],
          top: [`${start.y}%`, `${midY}%`, `${target.y}%`],
          rotate: [0, 45, 0], 
          opacity: targetOpacity,
          transition: { 
            duration: 1.8, 
            ease: "easeInOut",
            times: [0, 0.5, 1],
            rotate: { duration: 1.8, ease: "linear" }
          }
        });
      }
      prevIndex.current = sectionIndex;
    };

    animateFlight();
  }, [sectionIndex, controls]);

  if (!mounted) return <div className="fixed inset-0 bg-black z-0" />;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
      </div>

      <motion.div
        animate={controls}
        initial={{ left: "10%", top: "85%", rotate: 0, opacity: 1.0, x: "-50%", y: "-50%" }}
        className="absolute z-10 w-56 h-56 flex items-center justify-center origin-center"
      >
        <img 
          src="/rocket.gif" 
          alt="Rocket" 
          className="w-full h-full object-contain relative z-10"
          style={{ 
            filter: `
              grayscale(100%) 
              brightness(1.4) 
              contrast(1.2) 
              drop-shadow(0 0 2px #b00020) 
              drop-shadow(0 0 10px #b00020) 
              drop-shadow(0 0 30px #990024)
              drop-shadow(0 0 50px #6b001a)
            `,
            transform: "translateZ(0)"
          }}
        />
        <div className="absolute inset-0 bg-[#b00020]/10 blur-[120px] rounded-full -z-10" style={{ transform: "scale(0.7, 1.6)" }} />
      </motion.div>

      <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/90 via-transparent to-black/90 pointer-events-none" />
    </div>
  );
}
