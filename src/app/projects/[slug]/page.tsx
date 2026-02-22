"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import { projectsData } from "@/components/Projects";
import { motion } from "framer-motion";
import { ArrowLeft, Github, Code, Layout, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function ProjectDetail() {
  const { t } = useLanguage();
  const params = useParams();
  const project = projectsData.find(p => p.slug === params.slug) || projectsData[0];

  return (
    <main className="bg-black min-h-screen text-white pb-32 font-sans selection:bg-red-900">
      <Navbar />
      
      {/* Header Compatto */}
      <section className="pt-40 pb-16 px-10 border-b border-white/5 bg-[radial-gradient(circle_at_50%_0%,rgba(153,0,36,0.1),transparent_50%)]">
        <div className="max-w-4xl mx-auto">
          <Link href="/projects" className="inline-flex items-center gap-2 text-red-700 font-bold mb-10 hover:gap-4 transition-all uppercase tracking-widest text-[10px]">
            <ArrowLeft size={14} /> {t.common.back}
          </Link>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              {project.tech.map((tech, i) => (
                <span key={i} className="text-[8px] text-red-600 font-black uppercase tracking-widest bg-red-950/20 px-3 py-1 rounded-full border border-red-900/20">
                  {tech}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight">
              {project.title}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl leading-relaxed font-light italic border-l-2 border-red-900 pl-6 py-1">
              {project.desc}
            </p>
          </div>
        </div>
      </section>

      {/* Immagine Ridotta */}
      <div className="max-w-4xl mx-auto px-10 -mt-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl aspect-[21/9] relative group bg-white/5 backdrop-blur-3xl"
        >
          <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-8 right-8">
            <a href="#" className="px-8 py-3 bg-red-900 text-white font-black rounded-xl hover:bg-white hover:text-black transition-all text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl">
              GitHub Repo <Github size={14} />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Contenuto Strutturato */}
      <section className="py-20 px-10">
        <div className="max-w-4xl mx-auto space-y-20">
          
          {/* 1. Descrizione */}
          <div className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white flex items-center gap-4">
              <Layout size={20} className="text-red-700" /> {t.projects.descTitle}
            </h2>
            <div className="text-gray-400 leading-relaxed font-light text-lg space-y-4">
              <p>Questo progetto affronta la sfida di scalare architetture neurali in ambienti di produzione. L'obiettivo primario è stato ottimizzare il tempo di inferenza senza sacrificare la precisione dei risultati.</p>
              <p>Attraverso un approccio modulare, abbiamo implementato una pipeline robusta che gestisce l'intero ciclo di vita del dato, dalla pre-elaborazione fino al serving del modello finale.</p>
            </div>
          </div>

          {/* 2. Tecnologie */}
          <div className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white flex items-center gap-4">
              <Code size={20} className="text-red-700" /> {t.projects.techTitle}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.tech.map((tech, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-red-500 hover:border-red-900/30 transition-all">
                  {tech}
                </div>
              ))}
            </div>
          </div>

          {/* 3. Come eseguirlo */}
          <div className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white flex items-center gap-4">
              <PlayCircle size={20} className="text-red-700" /> {t.projects.runTitle}
            </h2>
            <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8 font-mono text-sm space-y-4">
              <div className="space-y-2">
                <p className="text-gray-600 text-[10px] uppercase font-bold tracking-widest"># Clone the repository</p>
                <code className="text-red-400 block">git clone https://github.com/tuo-username/{project.slug}.git</code>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600 text-[10px] uppercase font-bold tracking-widest"># Install dependencies</p>
                <code className="text-red-400 block">pip install -r requirements.txt</code>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600 text-[10px] uppercase font-bold tracking-widest"># Run the main application</p>
                <code className="text-red-400 block">python main.py</code>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
