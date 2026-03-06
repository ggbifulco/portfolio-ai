"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, Brain, Code2, Users, Linkedin, Github, Youtube, Twitter, ArrowUpRight, Mail, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const SOCIAL_LINKS = [
  {
    icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn",
    hoverBg: "#0077b5", hoverBorder: "#0077b5",
  },
  {
    icon: Github, href: "https://github.com/ggbifulco", label: "GitHub",
    hoverBg: "#333", hoverBorder: "#555",
  },
  {
    icon: Youtube, href: "https://youtube.com", label: "YouTube",
    hoverBg: "#ff0000", hoverBorder: "#cc0000",
  },
  {
    icon: Twitter, href: "https://twitter.com", label: "X / Twitter",
    hoverBg: "#1DA1F2", hoverBorder: "#1a91da",
  },
];

const inputClass = "w-full bg-black/40 border border-white/10 rounded-xl px-4 lg:px-5 py-3 lg:py-4 focus:outline-none transition-all duration-300 text-sm text-white placeholder-gray-700";

function FormInput({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] uppercase tracking-widest text-gray-600 font-bold flex items-center gap-1">
        {label} {required && <span className="text-red-700">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function About() {
  const { t } = useLanguage();
  const [formState, setFormState] = useState({ name: "", company: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const stats = [
    { label: t.about.experience, val: "5+", icon: <Code2 size={16} className="text-red-600" /> },
    { label: t.about.projects, val: "20+", icon: <Brain size={16} className="text-red-700" /> },
    { label: t.about.mentorship, val: "500+", icon: <Users size={16} className="text-red-800" /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 900);
  };

  const focusStyle = (field: string) => focusedField === field
    ? { borderColor: "rgba(153,0,36,0.6)", boxShadow: "0 0 0 1px rgba(153,0,36,0.25), 0 0 16px rgba(107,0,26,0.1)" }
    : {};

  return (
    <section id="about" className="flex flex-col justify-between px-4 sm:px-6 lg:px-10 bg-transparent relative overflow-hidden" style={{ height: "100dvh" }}>
      <div className="max-w-7xl mx-auto w-full relative z-10 flex-grow flex items-center pt-16 sm:pt-20 lg:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-16 items-start w-full">

          {/* Left Column */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6 lg:space-y-8">
            <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden border-2 border-red-900/30 shadow-2xl">
                  <img
                    src="/foto.jpg"
                    alt="Me"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"; }}
                  />
                </div>
                {/* Online indicator */}
                <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black shadow" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter leading-none mb-3">
                  {t.about.title}
                </h2>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {SOCIAL_LINKS.map(({ icon: Icon, href, label, hoverBg, hoverBorder }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={label}
                      className="p-2 sm:p-2.5 bg-white/5 border border-white/10 rounded-xl transition-all duration-300 group"
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.backgroundColor = hoverBg;
                        el.style.borderColor = hoverBorder;
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.backgroundColor = "";
                        el.style.borderColor = "";
                      }}
                    >
                      <Icon size={15} className="text-gray-400 group-hover:text-white transition-colors duration-200" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-sm sm:text-base font-light leading-relaxed italic border-l-2 border-red-900/40 pl-4 sm:pl-5">
              {t.about.desc}
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {stats.map((stat, i) => (
                <div key={i} className="p-3 sm:p-4 bg-white/[0.03] border border-white/5 rounded-2xl backdrop-blur-md hover:border-red-900/20 transition-all duration-300">
                  <div className="mb-1.5">{stat.icon}</div>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-tighter leading-none">{stat.val}</div>
                  <div className="text-[7px] uppercase tracking-widest text-gray-600 font-bold leading-tight mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/cv.pdf"
                download
                className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 bg-red-900 text-white font-black rounded-xl hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest text-[9px] shadow-lg shadow-red-900/20"
              >
                {t.about.cv} <Download size={13} />
              </a>
              <a
                href="mailto:contact@giuseppebifulco.dev"
                className="lg:hidden inline-flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 text-white font-black rounded-xl hover:bg-red-900 hover:border-red-700 transition-all duration-300 uppercase tracking-widest text-[9px] shadow-lg"
              >
                <Mail size={13} /> {t.contact.btn}
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form — desktop only */}
          <div className="hidden lg:block lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="bg-black/50 backdrop-blur-xl border border-white/5 p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl"
            >
              <h3 className="text-xl lg:text-2xl font-black text-white mb-6 lg:mb-8 uppercase tracking-tight flex items-center gap-3">
                {t.contact.title} <span className="text-red-800 font-light">{t.contact.subtitle}</span>
              </h3>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 gap-4 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  >
                    <CheckCircle size={48} className="text-green-500" />
                  </motion.div>
                  <p className="text-white font-black uppercase tracking-widest text-sm">Messaggio inviato!</p>
                  <p className="text-gray-500 text-xs">Ti risponderò il prima possibile.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label={t.contact.labelName} required>
                      <input
                        type="text"
                        value={formState.name}
                        onChange={(e) => setFormState(s => ({ ...s, name: e.target.value }))}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={inputClass}
                        style={focusStyle("name")}
                      />
                    </FormInput>
                    <FormInput label={t.contact.labelCompany}>
                      <input
                        type="text"
                        value={formState.company}
                        onChange={(e) => setFormState(s => ({ ...s, company: e.target.value }))}
                        onFocus={() => setFocusedField("company")}
                        onBlur={() => setFocusedField(null)}
                        className={inputClass}
                        style={focusStyle("company")}
                      />
                    </FormInput>
                  </div>
                  <FormInput label="Email" required>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState(s => ({ ...s, email: e.target.value }))}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={inputClass}
                      style={focusStyle("email")}
                    />
                  </FormInput>
                  <FormInput label={t.contact.labelMessage} required>
                    <textarea
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState(s => ({ ...s, message: e.target.value }))}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`${inputClass} resize-none`}
                      style={focusStyle("message")}
                    />
                  </FormInput>
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full py-4 lg:py-5 bg-red-900 text-white font-black rounded-2xl hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 disabled:opacity-60 overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {loading ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full"
                          />
                          Invio in corso...
                        </>
                      ) : (
                        <>{t.contact.btn} <ArrowUpRight size={16} /></>
                      )}
                    </span>
                    <span className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center w-full max-w-4xl mx-auto border-t border-white/5 pt-4 sm:pt-6 lg:pt-8 mt-4 sm:mt-6 pb-4 sm:pb-6">
        <h2 className="text-base sm:text-xl font-black text-white mb-0.5 uppercase tracking-[0.2em] drop-shadow-md">Giuseppe Gerardo Bifulco</h2>
        <p className="text-[10px] text-red-800 font-bold uppercase tracking-[0.3em] mb-2 sm:mb-3">Advanced Machine Learning Engineer</p>
        <div className="text-[8px] text-gray-800 tracking-[0.5em] uppercase">© 2026 Crafted for Intelligence</div>
      </footer>
    </section>
  );
}
