"use client";
import React from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Grid } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export const newsIssues = [
  {"slug":"articolo-2","title":"Nuova News","date":"05 Mar 2026","excerpt":"Sommario della news...articolo 2","category":"AI Research","image":"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800"},
  {"slug":"articolo-test","title":"Questo è  un articolo di prova","date":"05 Mar 2026","excerpt":"sottotitolo home articolo di prova","category":"AI Research","image":"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800"},
  {"slug":"deepseek-v4-deep-dive"},
  {"slug":"grok-4-20-parallel-agents"},
  {"slug":"liquid-neural-networks"},
  {"slug":"rag-renaissance"},
  {"slug":"sovereign-llm"},
  {"slug":"ttt-layers-deep-dive"},
  {"slug":"vla-robotics"}
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
      <Link href={`/newsletter/${issue.slug}`} className="block overflow-hidden aspect-video relative h-28 sm:h-32">
        <img src={issue.image} alt={issue.title} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
      </Link>

      <div className="p-4 sm:p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <span className="px-2 py-0.5 bg-red-950/30 border border-red-900/30 rounded-md text-[7px] font-black uppercase tracking-widest text-red-500/80">
            {issue.category}
          </span>
          <span className="text-gray-500 text-[8px] font-bold tracking-widest uppercase">
            <Calendar size={10} className="inline mr-1" /> {issue.date}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-red-500 transition-colors leading-tight">{issue.title}</h3>
        <p className="text-gray-400 text-[10px] mb-3 sm:mb-4 leading-relaxed line-clamp-2 font-light">{issue.excerpt}</p>

        <div className="mt-auto">
          <div className="mb-3 border-t border-white/5 pt-3">
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
    <section id="newsletter" className="flex flex-col justify-center px-4 sm:px-6 lg:px-10 bg-transparent relative overflow-hidden" style={{ height: "100dvh" }}>
      <div className="max-w-7xl mx-auto w-full relative z-10 pt-16 sm:pt-20">
        <div className="mb-6 sm:mb-8 lg:mb-12 flex flex-wrap justify-between items-end gap-3">
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none drop-shadow-xl">
            {t.newsletter.title}
          </h2>
          <Link
            href="/newsletter"
            className="px-5 sm:px-8 py-2.5 sm:py-3 bg-red-950/20 border border-red-800/50 text-red-500 font-bold rounded-full hover:bg-red-900 hover:text-white transition-all uppercase tracking-widest text-[9px] flex items-center gap-2 sm:gap-3 group shadow-lg"     
          >
            {t.newsletter.archive}
            <Grid size={12} className="group-hover:rotate-90 transition-transform duration-500" />
          </Link>
        </div>

        {/* Mobile: horizontal swipe carousel */}
        <div className="md:hidden overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 mb-4">
          <div className="flex gap-3" style={{ width: "max-content" }}>
            {latestIssues.map((issue, idx) => (
              <div key={issue.slug} className="snap-start flex-shrink-0 w-[78vw]">
                <NewsCard issue={issue} idx={idx} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: 3-column grid */}
        <div className="hidden md:grid grid-cols-3 gap-6 mb-6 lg:mb-12">
          {latestIssues.map((issue, idx) => (
            <NewsCard key={issue.slug} issue={issue} idx={idx} />
          ))}
        </div>

        {/* Compact subscribe row */}
        <div className="sm:hidden flex gap-2 mb-4">
          <input
            type="email"
            placeholder={t.newsletter.placeholder}
            className="flex-1 min-w-0 px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-red-900 text-xs"
          />
          <button className="flex-shrink-0 px-4 py-2.5 bg-red-900 text-white font-black rounded-xl text-[9px] uppercase tracking-widest shadow-lg">
            {t.newsletter.btn}
          </button>
        </div>

        {/* Full subscribe CTA */}
        <div className="hidden sm:block relative p-5 sm:p-8 bg-gradient-to-br from-red-900/30 to-black/30 backdrop-blur-xl rounded-2xl sm:rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-8">       
            <div className="max-w-md">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1 uppercase tracking-tight">{t.newsletter.ctaTitle}</h3>     
              <p className="text-gray-300 text-[10px] font-light">{t.newsletter.ctaDesc}</p>
            </div>
            <div className="w-full lg:w-auto flex gap-2 sm:gap-3">
              <input
                type="email"
                placeholder={t.newsletter.placeholder}
                className="flex-1 min-w-0 px-4 sm:px-6 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-red-900 text-xs backdrop-blur-md"
              />
              <button className="flex-shrink-0 px-5 sm:px-10 py-3 bg-red-900 text-white font-black rounded-xl hover:bg-white hover:text-black transition-all uppercase tracking-widest text-[9px] shadow-lg whitespace-nowrap">
                {t.newsletter.btn}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
