"use client";
import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { motion, useAnimation } from "framer-motion";

export default function Scene3D({ sectionIndex }: { sectionIndex: number }) {
  const [mounted, setMounted] = useState(false);
  const prevIndex = useRef(0);
  const controls = useAnimation();

  // Calcolo coordinate diagonali pulite
  const getPos = (index: number) => ({
    x: 10 + (index * 16),
    y: 85 - (index * 15)
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

      if (isGoingForward) {
        // AVANZAMENTO: Segue la diagonale mantenendo la posa originale (0 gradi)
        // Aggiungiamo un leggero "rollio" di 10 gradi solo durante il movimento
        await controls.start({
          left: `${target.x}%`,
          top: `${target.y}%`,
          rotate: [0, 10, 0], 
          transition: { 
            duration: 1.2, 
            ease: [0.22, 1, 0.36, 1],
            rotate: { times: [0, 0.5, 1], duration: 1.2 }
          }
        });
      } else if (isGoingBack) {
        // RITORNO: Arco parabolico esterno
        const midX = (start.x + target.x) / 2 + 10;
        const midY = (start.y + target.y) / 2 - 10;

        // Ruota leggermente verso la direzione dell'arco (-20 gradi) e torna a 0
        await controls.start({
          left: [`${start.x}%`, `${midX}%`, `${target.x}%`],
          top: [`${start.y}%`, `${midY}%`, `${target.y}%`],
          rotate: [0, -20, 0], 
          transition: { 
            duration: 1.5, 
            ease: "easeInOut",
            times: [0, 0.5, 1]
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
      {/* 1. CIELO STELLATO */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
      </div>

      {/* 2. RAZZO (Rotazione 0 = Diagonale della GIF originale) */}
      <motion.div
        animate={controls}
        initial={{ 
          left: "10%", 
          top: "85%", 
          rotate: 0,
          x: "-50%", 
          y: "-50%" 
        }}
        className="absolute z-10 w-56 h-56 flex items-center justify-center origin-center"
      >
        <img 
          src="/rocket.gif" 
          alt="Rocket" 
          className="w-full h-full object-contain relative z-10"
          style={{ 
            opacity: 0.8,
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
        {/* Glow ellittico statico per non causare flip */}
        <div 
          className="absolute inset-0 bg-[#b00020]/10 blur-[120px] rounded-full -z-10" 
          style={{ transform: "scale(0.7, 1.6)" }}
        />
      </motion.div>

      {/* 3. OVERLAY GRADIENTE */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/90 via-transparent to-black/90 pointer-events-none" />
    </div>
  );
}
