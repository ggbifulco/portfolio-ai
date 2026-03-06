"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Grid, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const CATEGORY_COLORS: Record<string, string> = {
  "AI Research":    "bg-red-950/50 border-red-900/40 text-red-400",
  "Agents":         "bg-purple-950/50 border-purple-900/40 text-purple-400",
  "Research":       "bg-blue-950/50 border-blue-900/40 text-blue-400",
  "RAG":            "bg-amber-950/50 border-amber-900/40 text-amber-400",
  "Infrastructure": "bg-emerald-950/50 border-emerald-900/40 text-emerald-400",
  "Robotics":       "bg-cyan-950/50 border-cyan-900/40 text-cyan-400",
};

function categoryClass(cat: string): string {
  return CATEGORY_COLORS[cat] || "bg-zinc-900/50 border-zinc-700/40 text-zinc-400";
}

function readingTime(text: string): string {
  const words = (text || "").split(/\s+/).filter(Boolean).length;
  const mins = Math.max(3, Math.round(words / 50) + 3);
  return `${mins} min`;
}

export const newsIssues = [
  {"slug":"articolo-2","title":"Nuova News","date":"05 Mar 2026","excerpt":"Sommario della news...articolo 2","category":"AI Research","image":"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800"},
  {"slug":"articolo-test","title":"Questo è  un articolo di prova","date":"05 Mar 2026","excerpt":"sottotitolo home articolo di prova","category":"AI Research","image":"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800"},
  {"slug":"deepseek-v4-deep-dive","title":"DeepSeek V4: Deep Dive","date":"01 Mar 2026","excerpt":"A comprehensive analysis of DeepSeek V4 capabilities and architecture insights.","category":"AI Research","image":"https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"},
  {"slug":"grok-4-20-parallel-agents","title":"Grok 4.20 & Parallel Agents","date":"20 Feb 2026","excerpt":"How xAI's Grok 4.20 handles parallel agent orchestration at scale.","category":"Agents","image":"https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&q=80&w=800"},
  {"slug":"liquid-neural-networks","title":"Liquid Neural Networks","date":"15 Feb 2026","excerpt":"Understanding adaptive computation in liquid neural network architectures.","category":"Research","image":"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"},
  {"slug":"rag-renaissance","title":"The RAG Renaissance","date":"10 Feb 2026","excerpt":"Why Retrieval-Augmented Generation is evolving beyond simple vector search.","category":"RAG","image":"https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"},
  {"slug":"sovereign-llm","title":"Sovereign LLM Strategies","date":"05 Feb 2026","excerpt":"Building AI infrastructure with full data sovereignty and compliance.","category":"Infrastructure","image":"https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800"},
  {"slug":"ttt-layers-deep-dive","title":"TTT Layers: Deep Dive","date":"28 Jan 2026","excerpt":"Test-Time Training layers and their impact on long-context reasoning.","category":"Research","image":"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800"},
  {"slug":"vla-robotics","title":"VLA Models for Robotics","date":"20 Jan 2026","excerpt":"Vision-Language-Action models bridging AI and physical world manipulation.","category":"Robotics","image":"https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=800"}
];

export function NewsCard({ issue, idx, featured = false }: { issue: any, idx: number, featured?: boolean }) {
  const { t } = useLanguage();
  if (!issue?.title || !issue?.image) return null;

  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="group bg-black/60 backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-500 shadow-xl flex flex-col sm:flex-row h-full"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(107,0,26,0.2), 0 0 0 1px rgba(153,0,36,0.2)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.5)"; }}
      >
        <Link href={`/newsletter/${issue.slug}`} className="block sm:w-2/5 overflow-hidden relative h-44 sm:h-auto flex-shrink-0">
          <img src={issue.image} alt={issue.title} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60 sm:bg-gradient-to-r" />
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-900/80 border border-red-700/50 rounded-lg text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
            Featured
          </span>
        </Link>
        <div className="p-5 sm:p-7 flex flex-col flex-grow">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`px-2 py-0.5 border rounded-md text-[7px] font-black uppercase tracking-widest ${categoryClass(issue.category)}`}>
              {issue.category}
            </span>
            <span className="text-gray-600 text-[8px] font-bold tracking-widest uppercase flex items-center gap-1">
              <Clock size={9} /> {readingTime(issue.excerpt)}
            </span>
            <span className="text-gray-600 text-[8px] tracking-widest uppercase flex items-center gap-1 ml-auto">
              <Calendar size={9} /> {issue.date}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mb-4 group-hover:text-red-400 transition-colors duration-300 leading-tight">
            {issue.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed font-light mb-6 flex-grow">{issue.excerpt}</p>
          <div className="border-t border-white/5 pt-5">
            <Link
              href={`/newsletter/${issue.slug}`}
              className="inline-flex items-center gap-2 text-white font-black text-[9px] uppercase tracking-widest group/link"
            >
              <span className="group-hover/link:text-red-400 transition-colors">{t.common.read}</span>
              <ArrowRight size={13} className="text-red-700 group-hover/link:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
      transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-black/60 backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-500 shadow-xl h-full flex flex-col"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(107,0,26,0.2), 0 0 0 1px rgba(153,0,36,0.2)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)"; }}
    >
      <Link href={`/newsletter/${issue.slug}`} className="block overflow-hidden relative h-28 sm:h-32">
        <img src={issue.image} alt={issue.title} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
      </Link>

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`px-2 py-0.5 border rounded-md text-[7px] font-black uppercase tracking-widest ${categoryClass(issue.category)}`}>
            {issue.category}
          </span>
          <span className="text-gray-600 text-[8px] font-bold tracking-widest uppercase flex items-center gap-1 ml-auto">
            <Clock size={9} /> {readingTime(issue.excerpt)}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors duration-300 leading-tight">
          {issue.title}
        </h3>
        <p className="text-gray-500 text-[10px] mb-4 leading-relaxed line-clamp-2 font-light flex-grow">
          {issue.excerpt}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
          <span className="text-gray-700 text-[8px] tracking-widest uppercase flex items-center gap-1">
            <Calendar size={9} /> {issue.date}
          </span>
          <Link
            href={`/newsletter/${issue.slug}`}
            className="inline-flex items-center gap-1.5 text-white font-bold text-[9px] uppercase tracking-widest group/link"
          >
            <span className="group-hover/link:text-red-400 transition-colors">{t.common.read}</span>
            <ArrowRight size={11} className="text-red-700 group-hover/link:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function SubscribeForm({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 900);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-2.5 text-green-400 font-black text-[10px] uppercase tracking-widest ${compact ? "" : "justify-center"}`}
      >
        <CheckCircle size={16} className="flex-shrink-0" /> Iscritto con successo!
      </motion.div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.newsletter.placeholder}
          className="flex-1 min-w-0 px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-900/60 focus:ring-1 focus:ring-red-900/40 text-xs transition-all duration-300"
        />
        <button
          type="submit"
          disabled={loading}
          className="relative flex-shrink-0 px-4 py-2.5 bg-red-900 text-white font-black rounded-xl text-[9px] uppercase tracking-widest shadow-lg disabled:opacity-60 overflow-hidden group"
        >
          <span className="relative z-10">{loading ? "..." : t.newsletter.btn}</span>
          <span className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full lg:w-auto flex gap-2 sm:gap-3">
      <div className="relative flex-1 min-w-0">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={t.newsletter.placeholder}
          className="w-full px-4 sm:px-6 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none text-xs backdrop-blur-md transition-all duration-300"
          style={{
            borderColor: focused ? "rgba(153,0,36,0.6)" : undefined,
            boxShadow: focused ? "0 0 0 1px rgba(153,0,36,0.3), 0 0 16px rgba(107,0,26,0.15)" : undefined,
          }}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="relative flex-shrink-0 px-5 sm:px-10 py-3 bg-red-900 text-white font-black rounded-xl hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest text-[9px] shadow-lg whitespace-nowrap disabled:opacity-60 overflow-hidden group"
      >
        <span className="relative z-10">{loading ? "..." : t.newsletter.btn}</span>
        <span className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
    </form>
  );
}

export default function NewsletterPreview() {
  const { t } = useLanguage();
  const validIssues = newsIssues.filter((i: any) => i.title && i.image);
  const [featured, ...rest] = validIssues;
  const sideIssues = rest.slice(0, 2);
  const mobileIssues = validIssues.slice(0, 3);

  return (
    <section id="newsletter" className="h-full flex flex-col justify-center px-4 sm:px-6 lg:px-10 bg-transparent relative overflow-hidden pt-16 sm:pt-20 lg:pt-24 pb-4">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="mb-5 sm:mb-7 flex flex-wrap justify-between items-end gap-3">
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none drop-shadow-xl">
            {t.newsletter.title}
          </h2>
          <Link
            href="/newsletter"
            className="px-5 sm:px-8 py-2.5 sm:py-3 bg-red-950/20 border border-red-800/50 text-red-500 font-bold rounded-full hover:bg-red-900 hover:text-white transition-all duration-300 uppercase tracking-widest text-[9px] flex items-center gap-2 sm:gap-3 group shadow-lg"
          >
            {t.newsletter.archive}
            <Grid size={12} className="group-hover:rotate-90 transition-transform duration-500" />
          </Link>
        </div>

        {/* Mobile: horizontal swipe carousel */}
        <div className="md:hidden overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 mb-4">
          <div className="flex gap-3" style={{ width: "max-content" }}>
            {mobileIssues.map((issue, idx) => (
              <div key={issue.slug} className="snap-start flex-shrink-0 w-[78vw]">
                <NewsCard issue={issue} idx={idx} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: featured + 2 side cards */}
        <div className="hidden md:grid grid-cols-3 gap-5 mb-5 lg:mb-7" style={{ gridTemplateRows: "1fr" }}>
          <div className="col-span-2">
            <NewsCard issue={featured} idx={0} featured />
          </div>
          <div className="flex flex-col gap-5">
            {sideIssues.map((issue, idx) => (
              <div key={issue.slug} className="flex-1">
                <NewsCard issue={issue} idx={idx + 1} />
              </div>
            ))}
          </div>
        </div>

        {/* Compact subscribe row — mobile only */}
        <div className="sm:hidden mb-4">
          <SubscribeForm compact />
        </div>

        {/* Full subscribe CTA — tablet/desktop */}
        <div className="hidden sm:block relative p-5 sm:p-6 bg-gradient-to-br from-red-900/20 to-black/30 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] border border-red-900/20 overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-8">
            <div className="max-w-md">
              <h3 className="text-base sm:text-lg font-black text-white mb-1 uppercase tracking-tight">{t.newsletter.ctaTitle}</h3>
              <p className="text-gray-400 text-[10px] font-light">{t.newsletter.ctaDesc}</p>
            </div>
            <SubscribeForm />
          </div>
        </div>
      </div>
    </section>
  );
}
