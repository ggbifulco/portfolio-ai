"use client";
import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Layers, Trophy, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Courses() {
  const { t } = useLanguage();
  const courses = [
    { title: "Mastering RAG Architectures", description: "Dall'ingestione dei dati al re-ranking avanzato.", modules: 12, duration: "8 ore", level: "Advanced", gradient: "from-red-900 to-red-600" },
    { title: "AI Agents Ecosystem", description: "Multi-agent systems con CrewAI e LangGraph.", modules: 8, duration: "5 ore", level: "Intermediate", gradient: "from-red-800 to-red-500" },
    { title: "LLM Fine-Tuning Workshop", description: "QLoRA e Unsloth per modelli verticali.", modules: 6, duration: "4 ore", level: "Expert", gradient: "from-red-950 to-red-700" }
  ];

  return (
    <section id="courses" className="h-screen snap-start flex flex-col justify-center px-10 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="mb-20">
          <h2 className="text-5xl font-black text-white mb-6 uppercase tracking-tight leading-none drop-shadow-xl">
            {t.courses.title} <span className="text-red-800">{t.courses.subtitle}</span>
          </h2>
          <p className="text-gray-400 max-w-xl text-sm font-light uppercase tracking-widest">{t.courses.desc}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }} className="group relative flex flex-col h-full bg-black/60 backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden hover:border-red-900/30 transition-all duration-500 shadow-xl">
              <div className={`h-2 w-full bg-gradient-to-r ${course.gradient}`} />
              <div className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform"><BookOpen size={24} className="text-white" /></div>
                  <span className="text-[9px] uppercase tracking-widest font-bold px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-400">{course.level}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-500 transition-colors leading-tight">{course.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-8 flex-grow line-clamp-2">{course.description}</p>
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-[10px] flex items-center justify-center gap-2 group-hover:bg-red-900 group-hover:border-red-900 transition-all uppercase tracking-[0.2em]">{t.courses.discover} <ArrowRight size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
