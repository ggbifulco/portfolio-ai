"use client";
import React from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Twitter, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", company: "", message: "" });
      } else {
        const data = await response.json();
        setError(data.error || "Errore durante l'invio");
      }
    } catch (err) {
      setError("Errore di connessione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="h-screen snap-start flex flex-col justify-between pt-32 pb-10 px-10 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative z-10 flex-grow flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center w-full">
          <div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-6xl font-black text-white mb-6 uppercase tracking-tighter drop-shadow-xl">
              {t.contact.title} <br /><span className="text-red-800">{t.contact.subtitle}</span>
            </motion.h2>
            <p className="text-gray-300 text-lg font-light max-w-md leading-relaxed mb-8 drop-shadow-md">{t.contact.desc}</p>
            <div className="space-y-4">
              <a href="mailto:tuamail@esempio.com" className="flex items-center gap-4 text-white hover:text-red-700 transition-all group">
                <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 group-hover:border-red-900/50"><Mail size={20} /></div>
                <div><p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">{t.contact.labelName}</p><p className="text-sm font-medium">tuamail@esempio.com</p></div>
              </a>
              <div className="flex gap-4"><a href="#" className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-red-900 transition-all"><Linkedin size={18} /></a><a href="#" className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-red-700 transition-all"><Twitter size={18} /></a></div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="bg-black/60 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] shadow-2xl">
            {submitted ? (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center p-4 bg-green-500/10 rounded-full text-green-500 mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Messaggio Inviato!</h3>
                <p className="text-gray-400 text-sm">Ti risponderò il prima possibile.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-red-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                >
                  Invia un altro messaggio
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">{t.contact.labelName}</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-red-900 transition-all text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">{t.contact.labelCompany}</label>
                    <input 
                      type="text" 
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-red-900 transition-all text-sm" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">{t.contact.labelMessage}</label>
                  <textarea 
                    rows={3} 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-red-900 transition-all text-sm" 
                  />
                </div>
                <button 
                  disabled={loading}
                  className="w-full py-4 bg-red-900 text-white font-black rounded-xl hover:bg-white hover:text-black transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {loading ? "Invio in corso..." : t.contact.btn} <ArrowUpRight size={14} />
                </button>
                {error && <p className="text-red-500 text-[10px] uppercase tracking-widest text-center mt-2">{error}</p>}
              </form>
            )}
          </motion.div>
        </div>
      </div>

      <footer className="text-center w-full max-w-4xl mx-auto border-t border-white/5 pt-10 mt-10">
        <h2 className="text-xl font-black text-white mb-1 uppercase tracking-[0.2em] drop-shadow-md">Giuseppe Gerardo Bifulco</h2>
        <p className="text-[10px] text-red-800 font-bold uppercase tracking-[0.3em] mb-4">Advanced Machine Learning Engineer</p>
        <div className="text-[8px] text-gray-800 tracking-[0.5em] uppercase">© 2026 Crafted for Intelligence</div>
      </footer>
    </section>
  );
}
