"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import { newsIssues } from "@/components/Newsletter";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Mail, Clock, Share2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function NewsletterArticle() {
  const params = useParams();
  const issue = newsIssues.find(i => i.slug === params.slug) || newsIssues[0];

  return (
    <main className="bg-black min-h-screen text-white pb-32 font-sans">
      <Navbar />
      
      <section className="pt-48 pb-20 px-10 border-b border-white/5 bg-[radial-gradient(circle_at_50%_0%,rgba(153,0,36,0.1),transparent_50%)]">
        <div className="max-w-4xl mx-auto">
          <Link href="/newsletter" className="inline-flex items-center gap-2 text-red-700 font-bold mb-12 hover:gap-4 transition-all uppercase tracking-widest text-xs">
            <ArrowLeft size={16} /> Archivio
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            <div className="flex gap-4 items-center">
              <span className="text-[10px] text-red-600 font-bold uppercase tracking-widest bg-red-950/20 px-3 py-1 rounded-full border border-red-900/20">{issue.category}</span>
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest"><Calendar size={14} className="inline mr-1" /> {issue.date}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8">{issue.title}</h1>
            <p className="text-gray-400 text-2xl leading-relaxed italic border-l-4 border-red-900 pl-8 py-4 mb-12">{issue.excerpt}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-10">
        <div className="max-w-3xl mx-auto text-gray-300 font-light text-xl leading-relaxed space-y-8">
          <p>L'intelligenza artificiale sta evolvendo a ritmi senza precedenti. In questa edizione approfondiamo gli aspetti tecnici più rilevanti...</p>
          <div className="p-8 bg-red-950/10 border border-red-900/20 rounded-3xl">
            <h3 className="text-xl font-bold text-red-500 mb-4 uppercase">Insight Tecnico:</h3>
            <p className="text-red-100 text-lg mb-0">L'ottimizzazione del recupero vettoriale è fondamentale per ridurre la latenza nei sistemi RAG.</p>
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight pt-8">Codice di Esempio</h2>
          <pre className="bg-white/5 p-8 rounded-3xl border border-white/5 text-red-400 overflow-x-auto text-sm font-mono">
            {`# Optimization Logic
def optimize_retrieval(query):
    results = vector_store.search(query, k=5)
    return rerank_results(results)`}
          </pre>
        </div>
      </section>

      <section className="py-32 px-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-red-900 to-black rounded-[3rem] p-16 text-center border border-red-900/20">
          <Mail size={40} className="mx-auto text-white mb-6" />
          <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-tight">Ricevi la prossima issue</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input type="email" placeholder="La tua email" className="px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white focus:ring-1 focus:ring-red-700 w-full" />
            <button className="px-10 py-4 bg-red-900 text-white font-black rounded-2xl hover:bg-white hover:text-black transition-all text-xs uppercase tracking-widest">ISCRIVITI</button>
          </div>
        </div>
      </section>
    </main>
  );
}
