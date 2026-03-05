"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Script from "next/script";
import newsIssues from "@/data/newsletter.json";

export default function NewsDetail() {
  const { t } = useLanguage();
  const params = useParams();
  const [content, setContent] = useState("");
  
  const issue = newsIssues.find(n => n.slug === params.slug) || newsIssues[0];

  useEffect(() => {
    fetch(`/api/content?type=newsletter&slug=${params.slug}`)
      .then(res => res.json())
      .then(data => setContent(data.content))
      .catch(() => setContent("Articolo in fase di scrittura..."));
  }, [params.slug]);

  const markdownComponents: any = {
    h1: ({node, ...props}: any) => <h1 className="text-4xl font-black uppercase tracking-tighter mb-10 mt-16 text-white border-b-2 border-red-700 pb-4" {...props} />,
    h2: ({node, ...props}: any) => <h2 className="text-2xl font-black uppercase tracking-tight mb-8 mt-12 text-white flex items-center gap-3"><span className="w-2 h-8 bg-red-700 block"></span>{props.children}</h2>,
    h3: ({node, ...props}: any) => <h3 className="text-xl font-bold uppercase mb-6 mt-10 text-red-500" {...props} />,
    p: ({node, ...props}: any) => {
      const children = props.children;
      if (typeof children === "string" && children.startsWith("$$") && children.endsWith("$$")) {
        return <div className="math-block my-12 text-center text-white bg-red-950/10 p-8 rounded-2xl border border-red-900/10 overflow-x-auto shadow-inner">{children.slice(2, -2)}</div>;
      }
      return <p className="mb-8 leading-relaxed text-gray-300 text-lg font-light text-justify" {...props} />;
    },
    ul: ({node, ...props}: any) => <ul className="list-disc list-outside mb-8 space-y-4 text-gray-300 ml-6" {...props} />,
    li: ({node, ...props}: any) => <li className="pl-2" {...props} />,
    strong: ({node, ...props}: any) => <strong className="font-bold text-white bg-red-900/20 px-1 rounded" {...props} />,
    blockquote: ({node, ...props}: any) => <blockquote className="border-l-4 border-red-700 pl-8 my-10 italic text-xl text-gray-400 font-serif" {...props} />,
    code: ({node, className, children, ...props}: any) => {
      return !className ? (
        <code className="bg-red-950/30 px-2 py-0.5 rounded text-red-400 font-mono text-sm border border-red-900/20" {...props}>
          {children}
        </code>
      ) : (
        <div className="relative my-10 group">
          <div className="absolute -inset-2 bg-gradient-to-r from-red-900/20 to-transparent rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <pre className="relative bg-[#0a0a0a] border border-white/10 p-6 rounded-xl overflow-x-auto shadow-2xl font-mono text-sm leading-relaxed text-gray-300">
            <div className="flex gap-1.5 mb-4 border-b border-white/5 pb-4">
              <div className="w-3 h-3 rounded-full bg-red-900/40"></div>
              <div className="w-3 h-3 rounded-full bg-gray-800"></div>
              <div className="w-3 h-3 rounded-full bg-gray-800"></div>
            </div>
            <code className={className} {...props}>{children}</code>
          </pre>
        </div>
      );
    },
    img: ({node, ...props}: any) => (
      <figure className="my-12">
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <img className="w-full h-auto object-cover" {...props} />
        </div>
        {props.alt && <figcaption className="mt-4 text-center text-sm font-medium text-gray-500 italic uppercase tracking-widest">{props.alt}</figcaption>}
      </figure>
    ),
  };

  return (
    <main className="bg-black min-h-screen text-white pb-32 font-sans">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" integrity="sha384-nAnmEnC99465+3+8c+X6pW9d3+69N9N9N9N9N9N9N9N9N9N9N9N9N9N9N9N9N9" crossOrigin="anonymous" />
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
          <div className="markdown-content text-gray-300">
            <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
            <Script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js" strategy="afterInteractive" onLoad={() => {
                const renderMath = () => {
                    (document.querySelectorAll(".math-block") as any).forEach((el: any) => {
                        try {
                            if (window && (window as any).katex) {
                                (window as any).katex.render(el.textContent, el, { displayMode: true, throwOnError: false });
                            }
                        } catch (e) { console.error(e); }
                    });
                };
                renderMath();
            }} />
          </div>
        </div>
      </section>
    </main>
  );
}
