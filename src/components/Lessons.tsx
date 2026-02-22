"use client";
import React from "react";
import { motion } from "framer-motion";
import { PlayCircle, Clock, BarChart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Lessons() {
  const { t } = useLanguage();
  const lessons = [
    { id: 1, title: "Codificare un RAG da Zero", duration: "18:45", level: "Intermedio", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800" },
    { id: 2, title: "Deploy LLM con Ollama", duration: "12:30", level: "Avanzato", image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800" },
    { id: 3, title: "Self-Attention Visualizzato", duration: "25:10", level: "Fondamenti", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800" },
  ];

  return (
    <section id="lessons" className="h-screen snap-start flex flex-col justify-center px-10 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <h2 className="text-6xl font-black text-white mb-6 uppercase tracking-tighter drop-shadow-xl">
              {t.lessons.title} <span className="text-red-800 underline decoration-red-900/20">{t.lessons.subtitle}</span>
            </h2>
            <p className="text-gray-300 max-w-xl text-lg font-light leading-relaxed drop-shadow-md">
              {t.lessons.desc}
            </p>
          </div>
          <button className="px-10 py-4 border border-red-900/20 rounded-full text-red-700 hover:bg-red-900 hover:text-white transition-all backdrop-blur-3xl font-bold uppercase tracking-widest text-[10px] shadow-lg">{t.lessons.youtube} →</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {lessons.map((lesson, idx) => (
            <motion.div key={lesson.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="group cursor-pointer">
              <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 border border-white/5 shadow-2xl transition-all group-hover:border-red-900/30">
                <img src={lesson.image} alt={lesson.title} className="w-full h-full object-cover grayscale opacity-50 transition-all group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><PlayCircle size={64} className="text-white drop-shadow-2xl" /></div>
                <div className="absolute bottom-4 left-4 flex gap-3">
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-full text-[9px] text-white flex items-center gap-1 border border-white/10"><Clock size={10} className="text-red-700" /> {lesson.duration}</span>
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-full text-[9px] text-white flex items-center gap-1 border border-white/10"><BarChart size={10} className="text-red-900" /> {lesson.level}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors leading-snug tracking-tight drop-shadow-md">{lesson.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
