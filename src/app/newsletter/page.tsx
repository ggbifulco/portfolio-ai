"use client";
import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { newsIssues, NewsCard } from "@/components/Newsletter";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Search, Filter, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function NewsletterArchive() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  // Estrazione dinamica delle categorie (tags)
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    categories.add("All");
    newsIssues.forEach(issue => categories.add(issue.category));
    return Array.from(categories);
  }, []);

  // Logica di filtraggio
  const filteredIssues = useMemo(() => {
    return newsIssues.filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            issue.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag === "All" || issue.category === selectedTag;
      return matchesSearch && matchesTag;
    });
  }, [searchQuery, selectedTag]);

  return (
    <main className="bg-black min-h-screen text-white font-sans">
      <Navbar />
      
      {/* Header compatto */}
      <section className="pt-28 sm:pt-36 lg:pt-40 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-10 border-b border-white/5 bg-[radial-gradient(circle_at_50%_-20%,rgba(153,0,36,0.1),transparent_50%)]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-3 sm:mb-4 leading-none text-white">
              {t.newsletter.title}
            </h1>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-light mb-6 sm:mb-8">
              {t.newsletter.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                placeholder={t.newsletter.placeholder}
                className="flex-1 min-w-0 px-4 sm:px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-red-900 w-full text-xs"
              />
              <button className="px-6 sm:px-8 py-3 bg-red-900 text-white font-black rounded-xl hover:bg-white hover:text-black transition-all uppercase tracking-widest text-[9px] shadow-lg whitespace-nowrap">
                {t.newsletter.btn}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sezione Contenuti: Filtri + Griglia */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">

          {/* Barra di ricerca + Categorie */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 mb-8 sm:mb-16 items-start lg:items-center">
            <div className="relative w-full max-w-md group">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-red-700 transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca tra gli articoli..." 
                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-1 focus:ring-red-900 transition-all text-xs font-medium" 
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <Filter size={14} className="text-red-800 mr-2" />
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedTag(cat)}
                  className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border ${
                    selectedTag === cat 
                    ? "bg-red-900 border-red-700 text-white shadow-lg" 
                    : "bg-white/5 border-white/10 text-gray-500 hover:border-red-900/50 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Griglia Articoli Filtrata */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            <AnimatePresence mode="popLayout">
              {filteredIssues.map((issue, idx) => (
                <motion.div
                  key={issue.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <NewsCard issue={issue} idx={idx} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredIssues.length === 0 && (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
              <p className="text-gray-500 uppercase tracking-widest text-sm font-bold">Nessun articolo trovato.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer ultra-compatto */}
      <footer className="py-4 text-center border-t border-white/5">
        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] leading-none mb-1">Giuseppe Gerardo Bifulco</h2>
        <p className="text-[7px] text-red-800 font-bold uppercase tracking-[0.3em] leading-none mb-1">Advanced Machine Learning Engineer</p>
        <div className="text-[6px] text-gray-800 tracking-[0.5em] uppercase leading-none">© 2026 Crafted for Intelligence</div>
      </footer>
    </main>
  );
}
