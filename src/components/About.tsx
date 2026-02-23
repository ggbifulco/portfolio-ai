"use client";
import React from "react";
import { motion } from "framer-motion";
import { Download, Brain, Code2, Users, Linkedin, Github, Youtube, Twitter, ArrowUpRight, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  const stats = [
    { label: t.about.experience, val: "5+", icon: <Code2 size={18} className="text-red-600" /> },
    { label: t.about.projects, val: "20+", icon: <Brain size={18} className="text-red-700" /> },
    { label: t.about.mentorship, val: "500+", icon: <Users size={18} className="text-red-800" /> },
  ];

  return (
    <section id="about" className="flex flex-col justify-between px-4 sm:px-6 lg:px-10 bg-transparent relative overflow-hidden" style={{ height: "100dvh" }}>
      <div className="max-w-7xl mx-auto w-full relative z-10 flex-grow flex items-center pt-16 sm:pt-20 lg:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-16 items-start w-full">

          {/* Left Column */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6 lg:space-y-10">
            <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden border-2 border-red-800/30 shadow-2xl flex-shrink-0">
                <img
                  src="/foto.jpg"
                  alt="Me"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"; }}
                />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-3">
                  {t.about.title}
                </h2>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <a href="#" className="p-2 sm:p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-red-900 hover:border-red-700 transition-all group" title="LinkedIn">
                    <Linkedin size={15} className="text-gray-400 group-hover:text-white" />
                  </a>
                  <a href="#" className="p-2 sm:p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-red-900 hover:border-red-700 transition-all group" title="GitHub">
                    <Github size={15} className="text-gray-400 group-hover:text-white" />
                  </a>
                  <a href="#" className="p-2 sm:p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-red-900 hover:border-red-700 transition-all group" title="YouTube">
                    <Youtube size={15} className="text-gray-400 group-hover:text-white" />
                  </a>
                  <a href="#" className="p-2 sm:p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-red-900 hover:border-red-700 transition-all group" title="X">
                    <Twitter size={15} className="text-gray-400 group-hover:text-white" />
                  </a>
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-sm sm:text-base lg:text-lg font-light leading-relaxed italic border-l-2 border-red-900/30 pl-4 sm:pl-6">
              {t.about.desc}
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="p-3 sm:p-4 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-md">
                  <div className="text-lg sm:text-xl font-black text-white mb-0.5 tracking-tighter">{stat.val}</div>
                  <div className="text-[7px] uppercase tracking-widest text-gray-500 font-bold leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="/cv.pdf" download className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 bg-red-900 text-white font-black rounded-xl hover:bg-white hover:text-black transition-all uppercase tracking-widest text-[9px] shadow-lg">
                {t.about.cv} <Download size={13} />
              </a>
              {/* Contact link visible on mobile instead of form */}
              <a href="mailto:hello@example.com" className="lg:hidden inline-flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 text-white font-black rounded-xl hover:bg-red-900 hover:border-red-700 transition-all uppercase tracking-widest text-[9px] shadow-lg">
                <Mail size={13} /> {t.contact.btn}
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form — desktop only */}
          <div className="hidden lg:block lg:col-span-7">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="bg-black/60 backdrop-blur-xl border border-white/5 p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl">
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-6 lg:mb-8 uppercase tracking-tight flex items-center gap-4">
                {t.contact.title} <span className="text-red-800">{t.contact.subtitle}</span>
              </h3>
              <form className="space-y-5 lg:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">{t.contact.labelName}</label>
                    <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 lg:px-5 py-3 lg:py-4 focus:outline-none focus:ring-1 focus:ring-red-900 transition-all text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">{t.contact.labelCompany}</label>
                    <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 lg:px-5 py-3 lg:py-4 focus:outline-none focus:ring-1 focus:ring-red-900 transition-all text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">{t.contact.labelMessage}</label>
                  <textarea rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 lg:px-5 py-3 lg:py-4 focus:outline-none focus:ring-1 focus:ring-red-900 transition-all text-sm" />
                </div>
                <button className="w-full py-4 lg:py-5 bg-red-900 text-white font-black rounded-2xl hover:bg-white hover:text-black transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg">
                  {t.contact.btn} <ArrowUpRight size={16} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center w-full max-w-4xl mx-auto border-t border-white/5 pt-4 sm:pt-6 lg:pt-10 mt-4 sm:mt-6 pb-4 sm:pb-6">
        <h2 className="text-base sm:text-xl font-black text-white mb-0.5 uppercase tracking-[0.2em] drop-shadow-md">Giuseppe Gerardo Bifulco</h2>
        <p className="text-[10px] text-red-800 font-bold uppercase tracking-[0.3em] mb-2 sm:mb-4">Advanced Machine Learning Engineer</p>
        <div className="text-[8px] text-gray-800 tracking-[0.5em] uppercase">© 2026 Crafted for Intelligence</div>
      </footer>
    </section>
  );
}
