"use client";
import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { projectsData, ProjectCard } from "@/components/Projects";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Github } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ProjectsArchive() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    tags.add("All");
    projectsData.forEach((p: any) => {
      if (p && Array.isArray(p.tech)) {
        p.tech.forEach((t: string) => tags.add(t));
      }
    });
    return Array.from(tags);
  }, []);

  const filteredProjects = useMemo(() => {
    return projectsData.filter((p: any) => {
      if (!p) return false;
      const title = p.title || "";
      const desc = p.desc || p.excerpt || "";
      
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag === "All" || (Array.isArray(p.tech) && p.tech.includes(selectedTag));
      return matchesSearch && matchesTag;
    });
  }, [searchQuery, selectedTag]);

  return (
    <main className="bg-black min-h-screen text-white font-sans">
      <Navbar />

      <section className="pt-28 sm:pt-36 lg:pt-40 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-10 border-b border-white/5 bg-[radial-gradient(circle_at_50%_-20%,rgba(153,0,36,0.1),transparent_50%)]">
        <div className="max-w-7xl mx-auto text-center lg:text-left">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tighter mb-4 leading-none">
            {t.projects.title}
          </motion.h1>
          <p className="text-gray-400 text-sm sm:text-lg max-w-2xl font-light">
            Sistemi intelligenti, agenti autonomi e architetture neurali avanzate.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 mb-8 sm:mb-16 items-start lg:items-center">
            <div className="relative w-full max-w-md group">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-red-700 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca nei progetti..."
                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-1 focus:ring-red-900 transition-all text-xs font-medium"
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <Filter size={14} className="text-red-800 mr-2" />
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border ${
                    selectedTag === tag
                    ? "bg-red-900 border-red-700 text-white shadow-lg"
                    : "bg-white/5 border-white/10 text-gray-500 hover:border-red-900/50 hover:text-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((p, i) => (
                <motion.div key={p.slug} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}>
                  <ProjectCard project={p} idx={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
              <p className="text-gray-500 uppercase tracking-widest text-sm font-bold">Nessun progetto trovato.</p>
            </div>
          )}
        </div>
      </section>

      <footer className="py-10 text-center border-t border-white/5">
        <a href="https://github.com/tuo-username" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gray-600 hover:text-red-700 transition-colors uppercase tracking-widest text-[10px] font-black">
          <Github size={16} /> full laboratory on github
        </a>
      </footer>
    </main>
  );
}
