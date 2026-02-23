"use client";
import React from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, Grid } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import projectsData from "@/data/projects.json";

export { projectsData };

export function ProjectCard({ project, idx }: { project: any, idx: number }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="group relative flex flex-col bg-black/60 backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden hover:border-red-900/30 transition-all duration-500 shadow-xl h-full"
    >
      <Link href={`/projects/${project.slug}`} className="block overflow-hidden aspect-video relative h-32 sm:h-40">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
      </Link>
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-red-500 transition-colors">{project.title}</h3>
        <p className="text-gray-400 text-[11px] leading-relaxed mb-3 sm:mb-4 flex-grow line-clamp-2 font-light">{project.desc}</p>

        <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-5">
          {project.tech.map((tech: string) => (
            <span key={tech} className="px-2 py-0.5 bg-red-950/30 border border-red-900/30 rounded-md text-[7px] font-black uppercase tracking-widest text-red-500/80">
              {tech}
            </span>
          ))}
        </div>

        <div className="mb-3">
          <p className="text-[7px] uppercase tracking-widest text-gray-600 font-bold">{t.common.author}</p>
          <p className="text-[9px] text-white font-medium">Giuseppe Gerardo Bifulco</p>
        </div>
        <Link href={`/projects/${project.slug}`} className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-[9px] flex items-center justify-center gap-2 group-hover:bg-red-900 transition-all uppercase tracking-widest">
          {t.projects.viewCase} <ExternalLink size={12} />
        </Link>
      </div>
    </motion.div>
  );
}

export function ProjectsGrid() {
  const { t } = useLanguage();
  const featuredProjects = projectsData.slice(0, 3);

  return (
    <section id="projects" className="flex flex-col justify-center px-4 sm:px-6 lg:px-10 bg-transparent relative overflow-hidden" style={{ height: "100dvh" }}>
      <div className="max-w-7xl mx-auto w-full relative z-10 pt-16 sm:pt-20">
        <div className="mb-6 sm:mb-8 lg:mb-10 flex flex-wrap justify-between items-end gap-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-xl leading-tight">
            {t.projects.title}
          </h2>
          <Link href="/projects" className="px-5 sm:px-8 py-2.5 sm:py-3 bg-red-950/20 border border-red-800/50 text-red-500 font-bold rounded-full hover:bg-red-900 hover:text-white transition-all uppercase tracking-widest text-[9px] flex items-center gap-2 sm:gap-3 group shadow-lg">
            {t.projects.viewAll} <Grid size={12} className="group-hover:rotate-90 transition-transform duration-500" />
          </Link>
        </div>

        {/* Mobile: horizontal swipe carousel */}
        <div className="md:hidden overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 mb-4">
          <div className="flex gap-3" style={{ width: "max-content" }}>
            {featuredProjects.map((p, i) => (
              <div key={i} className="snap-start flex-shrink-0 w-[78vw]">
                <ProjectCard project={p} idx={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: 3-column grid */}
        <div className="hidden md:grid grid-cols-3 gap-6 mb-6 lg:mb-10">
          {featuredProjects.map((p, i) => (
            <ProjectCard key={i} project={p} idx={i} />
          ))}
        </div>

        <div className="flex flex-col items-center">
          <a
            href="https://github.com/tuo-username"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 sm:px-10 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white hover:bg-red-900 hover:border-red-700 transition-all flex items-center gap-3 uppercase tracking-[0.2em] text-[10px] font-bold shadow-lg group"
          >
            <Github size={18} className="group-hover:scale-110 transition-transform" />
            {t.projects.github}
          </a>
        </div>
      </div>
    </section>
  );
}
