"use client";
import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { projectsData, ProjectCard } from "@/components/Projects";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Search, Filter } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ProjectsArchive() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    tags.add("All");
    projectsData.forEach(p => p.tech.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, []);

  const filteredProjects = useMemo(() => {
    return projectsData.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            project.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag === "All" || project.tech.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [searchQuery, selectedTag]);

  return (
    <main className="bg-black min-h-screen text-white font-sans">
      <Navbar />
      
      <section className="pt-40 pb-12 px-10 border-b border-white/5 bg-[radial-gradient(circle_at_50%_-20%,rgba(153,0,36,0.1),transparent_50%)]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-none text-white">
              {t.projects.title}
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed font-light mb-8">
              Tutti i case studies e le soluzioni implementate.
            </p>
            
            <a href="https://github.com/tuo-username" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-red-900 text-white border border-red-700 rounded-xl hover:bg-white hover:text-black hover:border-white transition-all uppercase tracking-widest text-[10px] font-black shadow-lg group">
              <Github size={16} className="group-hover:scale-110 transition-transform" /> 
              {t.projects.github}
            </a>
          </motion.div>
        </div>
      </section>

      <section className="pt-12 pb-20 px-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col lg:flex-row gap-8 mb-16 items-start lg:items-center">
            <div className="relative w-full max-w-md group">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-red-700 transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca progetti..." 
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

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProjectCard project={project} idx={idx} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
              <p className="text-gray-500 uppercase tracking-widest text-sm font-bold">Nessun progetto trovato per questi criteri.</p>
            </div>
          )}
        </div>
      </section>

      <footer className="py-4 text-center border-t border-white/5">
        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] leading-none mb-1">Giuseppe Gerardo Bifulco</h2>
        <p className="text-[7px] text-red-800 font-bold uppercase tracking-[0.3em] leading-none mb-1">Advanced Machine Learning Engineer</p>
        <div className="text-[6px] text-gray-800 tracking-[0.5em] uppercase leading-none">© 2026 Crafted for Intelligence</div>
      </footer>
    </main>
  );
}
