"use client";
import React from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Mail, Grid } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export const newsIssues = [
  { slug: "rag-renaissance", title: "The RAG Renaissance", date: "15 Feb 2026", excerpt: "Perché il cosine similarity non basta più? Intro a Hybrid Search.", category: "Architecture", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800" },
  { slug: "agentic-workflows", title: "Agentic Workflows", date: "01 Feb 2026", excerpt: "La differenza tra Chat e Agente. Architetture ReAct.", category: "Agents", image: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&q=80&w=800" },
  { slug: "local-llm-optimization", title: "Local LLM", date: "18 Gen 2026", excerpt: "Analisi tecnica della quantizzazione 4-bit e 8-bit.", category: "Optimization", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800" },
  { slug: "multimodality-vision", title: "Vision Encoders", date: "05 Gen 2026", excerpt: "How CLIP and SigLIP are changing vision pipelines.", category: "Vision", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800" },
  { slug: "ai-governance", title: "AI Governance", date: "20 Dic 2025", excerpt: "The EU AI Act explained for software engineers.", category: "Ethics", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800" },
  { slug: "efficient-finetuning", title: "Efficient Fine-Tuning", date: "10 Dic 2025", excerpt: "Training models with limited GPU memory using PEFT.", category: "Training", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800" }
];

export function NewsCard({ issue, idx }: { issue: any, idx: number }) {
  const { t } = useLanguage();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      transition={{ delay: idx * 0.1 }} 
      className="bg-black/60 backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden hover:border-red-900/30 transition-all group shadow-xl h-full flex flex-col"
    >
      {/* Immagine Anteprima News */}
      <Link href={`/newsletter/${issue.slug}`} className="block overflow-hidden aspect-video relative h-32">
        <img src={issue.image} alt={issue.title} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-4">
          <span className="px-2 py-0.5 bg-red-950/30 border border-red-900/30 rounded-md text-[7px] font-black uppercase tracking-widest text-red-500/80">
            {issue.category}
          </span>
          <span className="text-gray-500 text-[8px] font-bold tracking-widest uppercase">
            <Calendar size={10} className="inline mr-1" /> {issue.date}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-500 transition-colors leading-tight">{issue.title}</h3>
        <p className="text-gray-400 text-[10px] mb-4 leading-relaxed line-clamp-2 font-light">{issue.excerpt}</p>
        
        <div className="mt-auto">
          <div className="mb-4 border-t border-white/5 pt-3">
            <p className="text-[6px] uppercase tracking-widest text-gray-600 font-bold mb-1">{t.common.author}</p>
            <p className="text-[9px] text-white font-medium">Giuseppe Gerardo Bifulco</p>
          </div>
          <Link href={`/newsletter/${issue.slug}`} className="inline-flex items-center gap-2 text-white font-bold text-[9px] uppercase tracking-widest hover:gap-3 transition-all">
            {t.common.read} <ArrowRight size={12} className="text-red-700" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function NewsletterPreview() {
  const { t } = useLanguage();
  const latestIssues = newsIssues.slice(0, 3);

  return (
    <section id="newsletter" className="h-screen snap-start flex flex-col justify-center px-10 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative z-10 pt-20">
        <div className="mb-12 flex justify-between items-end">
          <h2 className="text-6xl font-black text-white uppercase tracking-tight leading-none drop-shadow-xl">
            {t.newsletter.title}
          </h2>
          <Link 
            href="/newsletter" 
            className="px-8 py-3 bg-red-950/20 border border-red-800/50 text-red-500 font-bold rounded-full hover:bg-red-900 hover:text-white transition-all uppercase tracking-widest text-[9px] flex items-center gap-3 group shadow-lg"
          >
            {t.newsletter.archive}
            <Grid size={12} className="group-hover:rotate-90 transition-transform duration-500" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {latestIssues.map((issue, idx) => (
            <NewsCard key={issue.slug} issue={issue} idx={idx} />
          ))}
        </div>

        <div className="relative p-8 bg-gradient-to-br from-red-900/30 to-black/30 backdrop-blur-xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <h3 className="text-xl font-bold text-white mb-1 uppercase tracking-tight">{t.newsletter.ctaTitle}</h3>
              <p className="text-gray-300 text-[10px] font-light">{t.newsletter.ctaDesc}</p>
            </div>
            <div className="w-full lg:w-auto flex gap-3">
              <input type="email" placeholder={t.newsletter.placeholder} className="px-6 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-red-900 min-w-[280px] text-xs backdrop-blur-md" />
              <button className="px-10 py-3 bg-red-900 text-white font-black rounded-xl hover:bg-white hover:text-black transition-all transform hover:scale-105 uppercase tracking-widest text-[9px] shadow-lg">{t.newsletter.btn}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
