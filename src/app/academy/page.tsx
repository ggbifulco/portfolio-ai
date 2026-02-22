"use client";
import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, PlayCircle, Clock, Zap, Search, Filter, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { coursesData, pillsData } from "@/components/Academy";

export default function AcademyArchive() {
  const { t } = useLanguage();

  // Stato per i Corsi
  const [courseSearch, setCourseSearch] = useState("");
  const [courseTag, setCourseTag] = useState("All");

  // Stato per le Pills
  const [pillSearch, setPillSearch] = useState("");
  const [pillTag, setPillTag] = useState("All");

  // Estrazione Tag
  const courseTags = useMemo(() => {
    const tags = new Set<string>();
    tags.add("All");
    coursesData.forEach(c => tags.add(c.category));
    return Array.from(tags);
  }, []);

  const pillTags = useMemo(() => {
    const tags = new Set<string>();
    tags.add("All");
    pillsData.forEach(p => tags.add(p.category));
    return Array.from(tags);
  }, []);

  // Logica di Filtraggio
  const filteredCourses = useMemo(() => {
    return coursesData.filter(c => {
      const matchS = c.title.toLowerCase().includes(courseSearch.toLowerCase());
      const matchT = courseTag === "All" || c.category === courseTag;
      return matchS && matchT;
    });
  }, [courseSearch, courseTag]);

  const filteredPills = useMemo(() => {
    return pillsData.filter(p => {
      const matchS = p.title.toLowerCase().includes(pillSearch.toLowerCase());
      const matchT = pillTag === "All" || p.category === pillTag;
      return matchS && matchT;
    });
  }, [pillSearch, pillTag]);

  return (
    <main className="bg-black min-h-screen text-white pb-32 font-sans">
      <Navbar />
      
      {/* Header */}
      <section className="pt-40 pb-12 px-10 border-b border-white/5 bg-[radial-gradient(circle_at_50%_-20%,rgba(153,0,36,0.1),transparent_50%)]">
        <div className="max-w-7xl mx-auto">
          <Link href="/?s=academy" className="inline-flex items-center gap-2 text-red-700 font-bold mb-8 hover:gap-4 transition-all uppercase tracking-widest text-[10px]">
            <ArrowLeft size={14} /> Academy Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-none text-white">
            AI <span className="text-red-800">ACADEMY</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed font-light max-w-2xl">
            La libreria completa dei percorsi strutturati e delle pillole tecnologiche rapide.
          </p>
        </div>
      </section>

      {/* --- SEZIONE CORSI --- */}
      <section id="all-courses" className="py-20 px-10 border-b border-white/5 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-black uppercase tracking-widest mb-8 flex items-center gap-4">
              <div className="w-8 h-1 bg-red-800" /> {t.academy.coursesTitle}
            </h2>
            
            {/* Filtri Corsi: Sotto il titolo */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="relative w-full md:w-80 group">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-red-700 transition-colors" />
                <input value={courseSearch} onChange={e => setCourseSearch(e.target.value)} type="text" placeholder="Cerca corsi..." className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-red-900 transition-all" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Filter size={14} className="text-red-800 mr-2 self-center" />
                {courseTags.map(tag => (
                  <button key={tag} onClick={() => setCourseTag(tag)} className={`px-3 py-1.5 rounded-lg text-[8px] font-bold uppercase border transition-all ${courseTag === tag ? "bg-red-900 border-red-700 text-white" : "bg-white/5 border-white/10 text-gray-500 hover:text-white"}`}>{tag}</button>
                ))}
              </div>
            </div>
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course) => (
                <motion.div key={course.slug} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="group bg-black/40 border border-white/5 rounded-3xl overflow-hidden hover:border-red-900/30 transition-all shadow-2xl">
                  <div className="aspect-video relative overflow-hidden">
                    <img src={course.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={course.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <span className="absolute top-4 right-4 px-3 py-1 bg-red-900/80 backdrop-blur-md rounded-full text-[8px] font-black uppercase">{course.level}</span>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold mb-4 group-hover:text-red-500 transition-colors">{course.title}</h3>
                    <div className="flex items-center gap-4 text-[9px] text-gray-500 font-bold uppercase mb-8">
                      <span className="flex items-center gap-1"><Zap size={12} className="text-red-700" /> {course.modules} MODULI</span>
                      <span className="px-2 py-0.5 bg-red-950/30 rounded text-red-500">#{course.category}</span>
                    </div>
                    <Link href={`/academy/courses/${course.slug}`} className="block w-full py-4 bg-red-900 text-white font-black rounded-xl hover:bg-white hover:text-black transition-all text-center text-[10px] uppercase tracking-widest">{t.common.start}</Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* --- SEZIONE TECH PILLS --- */}
      <section id="all-pills" className="py-24 px-10 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-black uppercase tracking-widest mb-8 flex items-center gap-4">
              <div className="w-8 h-1 bg-red-800" /> {t.academy.pillsTitle}
            </h2>
            
            {/* Filtri Pills: Sotto il titolo */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="relative w-full md:w-80 group">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-red-700 transition-colors" />
                <input value={pillSearch} onChange={e => setPillSearch(e.target.value)} type="text" placeholder="Cerca pills..." className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-red-900 transition-all" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Filter size={14} className="text-red-800 mr-2 self-center" />
                {pillTags.map(tag => (
                  <button key={tag} onClick={() => setPillTag(tag)} className={`px-3 py-1.5 rounded-lg text-[8px] font-bold uppercase border transition-all ${pillTag === tag ? "bg-red-900 border-red-700 text-white" : "bg-white/5 border-white/10 text-gray-500 hover:text-white"}`}>{tag}</button>
                ))}
              </div>
            </div>
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredPills.map((pill) => (
                <motion.div key={pill.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="group bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-red-900/30 transition-all flex flex-col h-full shadow-lg">
                  <div className="aspect-video relative overflow-hidden bg-red-900/10">
                    <img src={pill.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={pill.title} />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <PlayCircle size={32} className="text-white" />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-sm mb-4 group-hover:text-red-500 transition-colors line-clamp-2">{pill.title}</h3>
                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                      <span className="text-[8px] text-gray-500 font-black uppercase flex items-center gap-1"><Clock size={10} /> {pill.duration}</span>
                      <span className="px-2 py-0.5 bg-red-950/30 rounded text-[7px] font-bold text-red-500">#{pill.category}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
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
