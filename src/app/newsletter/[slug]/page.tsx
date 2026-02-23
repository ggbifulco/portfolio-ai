"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, User, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import newsIssues from "@/data/newsletter.json";

export default function NewsDetail() {
  const { t } = useLanguage();
  const params = useParams();
  const [content, setContent] = useState("");
  
  const issue = newsIssues.find(n => n.slug === params.slug) || newsIssues[0];

  useEffect(() => {
    // Carichiamo il file markdown corrispondente allo slug
    fetch(`/api/content?type=newsletter&slug=${params.slug}`)
      .then(res => res.json())
      .then(data => setContent(data.content))
      .catch(() => setContent("Articolo in fase di scrittura..."));
  }, [params.slug]);

  return (
    <main className="bg-black min-h-screen text-white pb-32 font-sans">
      <Navbar />
      
      <section className="pt-28 sm:pt-36 lg:pt-48 pb-10 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-10 border-b border-white/5 bg-[radial-gradient(circle_at_50%_0%,rgba(153,0,36,0.1),transparent_50%)]">
        <div className="max-w-4xl mx-auto">
          <Link href="/newsletter" className="inline-flex items-center gap-2 text-red-700 font-bold mb-8 sm:mb-12 hover:gap-4 transition-all uppercase tracking-widest text-xs">
            <ArrowLeft size={16} /> {t.newsletter.archive}
          </Link>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
              <span className="px-3 py-1 bg-red-950/30 border border-red-900/30 rounded-md text-red-500">{issue.category}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> {issue.date}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none">{issue.title}</h1>

            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <User size={18} className="text-red-700" />
              <div>
                <p className="text-[8px] uppercase font-bold text-gray-600 leading-none mb-1">Author</p>
                <p className="text-sm font-bold text-white leading-none">Giuseppe Gerardo Bifulco</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <div className="markdown-content text-gray-300 leading-relaxed text-base sm:text-lg font-light">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </section>
    </main>
  );
}
