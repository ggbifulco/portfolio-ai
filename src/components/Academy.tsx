"use client";
import React from "react";
import { motion } from "framer-motion";
import { BookOpen, PlayCircle, Clock, Zap, Youtube, ArrowRight, Grid } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export const coursesData = [
  { slug: "mastering-rag", title: "Mastering RAG", modules: 12, level: "Advanced", gradient: "from-red-900 to-red-600", category: "RAG", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800", description: "Deep dive into Retrieval-Augmented Generation." },
  { slug: "ai-agents", title: "AI Agents Ecosystem", modules: 8, level: "Intermediate", gradient: "from-red-800 to-red-500", category: "Agents", image: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&q=80&w=800", description: "Building autonomous agents." },
  { slug: "llm-fine-tuning", title: "LLM Fine-Tuning", modules: 6, level: "Expert", gradient: "from-red-950 to-red-700", category: "Training", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800", description: "Hands-on QLoRA and Unsloth." },
  { slug: "synthetic-data", title: "Synthetic Data Gen", modules: 5, level: "Advanced", gradient: "from-red-700 to-red-900", category: "Data", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800", description: "Generating datasets for AI." }
];

export const pillsData = [
  { id: 1, title: "Ollama & Docker Setup", duration: "5 min", category: "Ops", image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=400" },
  { id: 2, title: "Llama 3.1 Overview", duration: "8 min", category: "Models", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400" },
  { id: 3, title: "CrewAI 0.5 Update", duration: "4 min", category: "Agents", image: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&q=80&w=400" },
  { id: 4, title: "Mistral Large 2 Test", duration: "10 min", category: "Models", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400" },
  { id: 5, title: "vLLM Optimization", duration: "6 min", category: "Performance", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400" },
  { id: 6, title: "LangSmith Debugging", duration: "7 min", category: "Tooling", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400" }
];

export default function Academy() {
  const { t } = useLanguage();
  const featuredCourses = coursesData.slice(0, 4);
  const featuredPills = pillsData.slice(0, 6);

  const AuthorTag = () => (
    <div className="mt-3 border-t border-white/5 pt-3">
      <p className="text-[7px] uppercase tracking-widest text-gray-600 font-bold leading-none mb-1">{t.common.author}</p>
      <p className="text-[10px] text-white font-medium leading-none">Giuseppe Gerardo Bifulco</p>
    </div>
  );

  return (
    <section id="academy" className="h-screen snap-start flex flex-col justify-center px-10 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative z-10 pt-20">
        <div className="mb-10 flex justify-between items-end">
          <h2 className="text-6xl font-black text-white uppercase tracking-tighter drop-shadow-xl leading-tight">
            {t.academy.title}
          </h2>
          <Link href="/academy" className="px-8 py-3 bg-red-950/20 border border-red-800/50 text-red-500 font-bold rounded-full hover:bg-red-900 hover:text-white transition-all uppercase tracking-widest text-[9px] flex items-center gap-3 group shadow-lg">
            {t.academy.viewAll} <Grid size={12} className="group-hover:rotate-90 transition-transform duration-500" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-10">
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold flex items-center gap-2 border-b border-white/5 pb-2">
              <BookOpen size={12} className="text-red-700" /> {t.academy.coursesTitle}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {featuredCourses.map((course, i) => (
                <div key={i} className="group relative bg-black/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:border-red-900/30 transition-all shadow-xl flex flex-col justify-between overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${course.gradient}`} />
                  <div>
                    <span className="text-[7px] uppercase font-bold text-gray-500 block mb-1">{course.level}</span>
                    <h4 className="text-sm font-bold text-white mb-2 group-hover:text-red-500 transition-colors leading-tight">{course.title}</h4>
                    <div className="text-[8px] text-gray-400 flex items-center gap-1">
                      <Zap size={10} className="text-red-700" /> {course.modules} {t.common.modules}
                    </div>
                  </div>
                  <div className="mt-4">
                    <AuthorTag />
                    <Link href={`/academy/courses/${course.slug}`} className="block w-full mt-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-[8px] font-bold uppercase tracking-widest text-center hover:bg-white hover:text-black transition-all">{t.common.start}</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold flex items-center gap-2 border-b border-white/5 pb-2">
              <PlayCircle size={12} className="text-red-700" /> {t.academy.pillsTitle}
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {featuredPills.map((pill, i) => (
                <div key={i} className="group flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl backdrop-blur-sm hover:bg-red-950/10 transition-all">
                  <div className="flex items-center gap-4">
                    <PlayCircle size={18} className="text-red-700" />
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-red-500 transition-colors">{pill.title}</h4>
                      <p className="text-[7px] text-gray-500 font-medium">{t.common.author}: Giuseppe Gerardo Bifulco</p>
                    </div>
                  </div>
                  <span className="text-[8px] text-gray-500 font-bold uppercase">{pill.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <a 
            href="#" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white hover:bg-red-900 hover:border-red-700 transition-all flex items-center gap-3 uppercase tracking-[0.2em] text-[10px] font-bold shadow-lg group"
          >
            <Youtube size={18} className="group-hover:scale-110 transition-transform" />
            {t.common.youtube}
          </a>
        </div>
      </div>
    </section>
  );
}
