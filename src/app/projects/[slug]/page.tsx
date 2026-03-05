"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Github, ExternalLink, ArrowLeft, Code2, Layers, Cpu } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { projectsData } from "@/components/Projects";

export default function ProjectDetail() {
  const { t } = useLanguage();
  const params = useParams();
  const [content, setContent] = useState("");
  
  const project = (projectsData.find(p => p.slug === params.slug) || projectsData[0]) as any;
  const techStack = Array.isArray(project?.tech) ? project.tech : [];

  useEffect(() => {
    fetch(`/api/content?type=projects&slug=${params.slug}`)
      .then(res => res.json())
      .then(data => setContent(data.content))
      .catch(() => setContent("Documentazione tecnica in fase di preparazione..."));
  }, [params.slug]);

  return (
    <main className="bg-black min-h-screen text-white pb-32 font-sans">
      <Navbar />

      {/* Project Hero Header */}
      <section className="pt-28 sm:pt-36 lg:pt-48 pb-10 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-10 border-b border-white/5 bg-[radial-gradient(circle_at_50%_0%,rgba(153,0,36,0.15),transparent_50%)]">
        <div className="max-w-6xl mx-auto">
          <Link href="/projects" className="inline-flex items-center gap-2 text-red-700 font-bold mb-8 sm:mb-12 hover:gap-4 transition-all uppercase tracking-widest text-xs">
            <ArrowLeft size={16} /> {t.projects.viewAll}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-end">
            <div>
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                {techStack.map((t: string) => (
                  <span key={t} className="px-3 sm:px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-red-600 uppercase tracking-widest">
                    {t}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none mb-5 sm:mb-8">{project.title}</h1>
              <p className="text-gray-400 text-base sm:text-lg lg:text-xl leading-relaxed font-light italic border-l-4 border-red-900 pl-4 sm:pl-8 py-2">
                {project.desc}
              </p>
            </div>

            <div className="flex gap-3 sm:gap-4 mt-4 lg:mt-0">
              <a href="#" className="flex-grow flex items-center justify-center gap-3 px-5 sm:px-8 py-4 sm:py-5 bg-red-900 text-white font-black rounded-2xl hover:bg-white hover:text-black transition-all uppercase tracking-widest text-xs shadow-xl">
                Live Demo <ExternalLink size={18} />
              </a>
              <a href="#" className="p-4 sm:p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white hover:text-black transition-all group">
                <Github size={22} className="text-white group-hover:text-black" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Project Body: Markdown Content */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">

          {/* Main technical content */}
          <div className="lg:col-span-8">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-widest mb-8 sm:mb-12 text-white flex items-center gap-4">
              Technical Overview <div className="h-px flex-grow bg-white/5" />
            </h2>
            <div className="markdown-content text-gray-300 leading-relaxed text-base sm:text-lg font-light space-y-6">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-8 sm:space-y-12">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-4 sm:mb-6 flex items-center gap-2">  
                <Cpu size={14} className="text-red-700" /> Core Tech
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {techStack.map((t: string) => (
                  <div key={t} className="flex items-center justify-between p-3 sm:p-4 bg-white/5 border border-white/5 rounded-xl"> 
                    <span className="text-sm font-bold text-white">{t}</span>
                    <Layers size={14} className="text-gray-700" />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 sm:p-8 bg-red-900/10 border border-red-900/20 rounded-[2rem]">
              <h3 className="text-sm font-bold text-white mb-3 sm:mb-4 uppercase tracking-tight">Need similar solution?</h3>
              <p className="text-xs text-gray-400 mb-4 sm:mb-6 leading-relaxed">Sviluppo architetture AI personalizzate basate su RAG, Agenti e Fine-tuning.</p>
              <Link href="/?s=about" className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-white transition-colors">Get in touch →</Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
