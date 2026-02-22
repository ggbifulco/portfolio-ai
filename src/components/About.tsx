"use client";
import React from "react";
import { motion } from "framer-motion";
import { Download, Brain, Code2, Users, Mail, Linkedin, Github, Youtube, Twitter, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  const stats = [
    { label: t.about.experience, val: "5+", icon: <Code2 size={18} className="text-red-600" /> },
    { label: t.about.projects, val: "20+", icon: <Brain size={18} className="text-red-700" /> },
    { label: t.about.mentorship, val: "500+", icon: <Users size={18} className="text-red-800" /> },
  ];

  return (
    <section id="about" className="h-screen snap-start flex flex-col justify-between pt-32 pb-10 px-10 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative z-10 flex-grow flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start w-full">
          
          {/* Colonna Sinistra: Immagine e Bio */}
          <div className="lg:col-span-5 space-y-10">
            <div className="flex items-center gap-8">
              <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-2 border-red-800/30 shadow-2xl flex-shrink-0">
                <img 
                  src="/foto.jpg" 
                  alt="Me" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"; }}
                />
              </div>
              <div>
                <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                  {t.about.title}
                </h2>
                {/* Social Buttons */}
                <div className="flex flex-wrap gap-2">
                  <a href="#" className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-red-900 hover:border-red-700 transition-all group" title="LinkedIn">
                    <Linkedin size={18} className="text-gray-400 group-hover:text-white" />
                  </a>
                  <a href="#" className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-red-900 hover:border-red-700 transition-all group" title="GitHub">
                    <Github size={18} className="text-gray-400 group-hover:text-white" />
                  </a>
                  <a href="#" className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-red-900 hover:border-red-700 transition-all group" title="YouTube">
                    <Youtube size={18} className="text-gray-400 group-hover:text-white" />
                  </a>
                  <a href="#" className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-red-900 hover:border-red-700 transition-all group" title="X">
                    <Twitter size={18} className="text-gray-400 group-hover:text-white" />
                  </a>
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-lg font-light leading-relaxed italic border-l-2 border-red-900/30 pl-6">
              {t.about.desc}
            </p>

            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-md">
                  <div className="text-xl font-black text-white mb-0.5 tracking-tighter">{stat.val}</div>
                  <div className="text-[7px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</div>
                </div>
              ))}
            </div>

            <a href="/cv.pdf" download className="inline-flex items-center gap-3 px-8 py-4 bg-red-900 text-white font-black rounded-xl hover:bg-white hover:text-black transition-all uppercase tracking-widest text-[9px] shadow-lg">
              {t.about.cv} <Download size={14} />
            </a>
          </div>

          {/* Colonna Destra: Form Contatti */}
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="bg-black/60 backdrop-blur-xl border border-white/5 p-10 rounded-[3rem] shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-8 uppercase tracking-tight flex items-center gap-4">
                {t.contact.title} <span className="text-red-800">{t.contact.subtitle}</span>
              </h3>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">{t.contact.labelName}</label>
                    <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-red-900 transition-all text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">{t.contact.labelCompany}</label>
                    <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-red-900 transition-all text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">{t.contact.labelMessage}</label>
                  <textarea rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-red-900 transition-all text-sm" />
                </div>
                <button className="w-full py-5 bg-red-900 text-white font-black rounded-2xl hover:bg-white hover:text-black transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg">
                  {t.contact.btn} <ArrowUpRight size={16} />
                </button>
              </form>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Footer Unificato */}
      <footer className="text-center w-full max-w-4xl mx-auto border-t border-white/5 pt-10 mt-10">
        <h2 className="text-xl font-black text-white mb-1 uppercase tracking-[0.2em] drop-shadow-md">Giuseppe Gerardo Bifulco</h2>
        <p className="text-[10px] text-red-800 font-bold uppercase tracking-[0.3em] mb-4">Advanced Machine Learning Engineer</p>
        <div className="text-[8px] text-gray-800 tracking-[0.5em] uppercase">© 2026 Crafted for Intelligence</div>
      </footer>
    </section>
  );
}
