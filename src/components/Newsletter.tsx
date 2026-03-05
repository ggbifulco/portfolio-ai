\use client\;
import React from \react\;
import { motion } from \framer-motion\;
import { Calendar, ArrowRight, Grid } from \lucide-react\;
import Link from \next/link\;
import { useLanguage } from \@/context/LanguageContext\;

export const newsIssues = [
  { slug: \ttt-layers-deep-dive\, title: \TTT-Layers: La fine del Cache KV e l'era della Memoria Infinita\, date: \05 Mar 2026\, excerpt: \Il Modello come Stato. Come le Test-Time Training Layers stanno superando i limiti di memoria dei Transformer.\, category: \Architecture\, image: \https://images.unsplash.com/photo-1675557009875-436f297b3a5e?auto=format&fit=crop&q=80&w=800\ },
  { slug: \liquid-neural-networks\, title: \Liquid Neural Networks: Oltre i Transformer\, date: \05 Mar 2026\, excerpt: \Dinamicità biologica e tempo continuo. Come le LNN stanno sfidando il dominio dell'architettura Transformer.\, category: \AI Research\, image: \https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800\ },
  { slug: \vla-robotics\, title: \The Convergence: VLA Models and Physical AI\, date: \05 Mar 2026\, excerpt: \Dagli LLM ai corpi fisici. Come i modelli Vision-Language-Action stanno rivoluzionando la robotica umanoide.\, category: \Robotics\, image: \https://images.unsplash.com/photo-1546776230-bb86256870ce?auto=format&fit=crop&q=80&w=800\ },
  { slug: \sovereign-llm\, title: \The Sovereign LLM: L'Alba dell'Indipendenza Open-Source\, date: \05 Mar 2026\, excerpt: \Il divario tra Closed e Open Source si chiude. Analisi tecnica di Llama 4 e DeepSeek-V4.\, category: \Open Source\, image: \https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800\ },
  { slug: \deepseek-v4-deep-dive\, title: \DeepSeek-V4: Anatomia di un Gigante MoE\, date: \05 Mar 2026\, excerpt: \Sparsity 2.0, Engram e Multi-Token Prediction. Analisi tecnica dell'architettura da 1 Trilione di parametri.\, category: \Architecture\, image: \https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800\ },
  { slug: \grok-4-20-parallel-agents\, title: \Grok 4.20: Il Trionfo del Parallelismo Multi-Agente\, date: \05 Mar 2026\, excerpt: \xAI riscrive le regole con 4 agenti paralleli interni. Efficienza e ragionamento estremi.\, category: \LLM Architecture\, image: \https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800\ },
  { slug: \rag-renaissance\, title: \The RAG Renaissance\, date: \15 Feb 2026\, excerpt: \Perché il cosine similarity non basta più? Intro a Hybrid Search.\, category: \Architecture\, image: \https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800\ },
  { slug: \agentic-workflows\, title: \Agentic Workflows\, date: \01 Feb 2026\, excerpt: \La differenza tra Chat e Agente. Architetture ReAct.\, category: \Agents\, image: \https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&q=80&w=800\ },
  { slug: \local-llm-optimization\, title: \Local LLM\, date: \18 Gen 2026\, excerpt: \Analisi tecnica della quantizzazione 4-bit e 8-bit.\, category: \Optimization\, image: \https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800\ },
  { slug: \multimodality-vision\, title: \Vision Encoders\, date: \05 Gen 2026\, excerpt: \How CLIP and SigLIP are changing vision pipelines.\, category: \Vision\, image: \https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800\ }, 
  { slug: \ai-governance\, title: \AI Governance\, date: \20 Dic 2025\, excerpt: \The EU AI Act explained for software engineers.\, category: \Ethics\, image: \https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800\ },
  { slug: \efficient-finetuning\, title: \Efficient Fine-Tuning\, date: \10 Dic 2025\, excerpt: \Training models with limited GPU memory using PEFT.\, category: \Training\, image: \https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800\ }
];

export function NewsCard({ issue, idx }: { issue: any, idx: number }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className=\bg-black/60 backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden hover:border-red-900/30 transition-all group shadow-xl h-full flex flex-col\
    >
      <Link href={`/newsletter/${issue.slug}`} className=\block overflow-hidden aspect-video relative h-28 sm:h-32\>
        <img src={issue.image} alt={issue.title} className=\w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700\ />
        <div className=\absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80\ />
      </Link>

      <div className=\p-4 sm:p-6 flex flex-col flex-grow\>
        <div className=\flex justify-between items-center mb-3 sm:mb-4\>
          <span className=\px-2 py-0.5 bg-red-950/30 border border-red-900/30 rounded-md text-[7px] font-black uppercase tracking-widest text-red-500/80\>
            {issue.category}
          </span>
          <span className=\text-gray-500 text-[8px] font-bold tracking-widest uppercase\>
            <Calendar size={10} className=\inline mr-1\ /> {issue.date}
          </span>
        </div>

        <h3 className=\text-base sm:text-lg font-bold text-white mb-2 group-hover:text-red-500 transition-colors leading-tight\>{issue.title}</h3>
        <p className=\text-gray-400 text-[10px] mb-3 sm:mb-4 leading-relaxed line-clamp-2 font-light\>{issue.excerpt}</p>

        <div className=\mt-auto\>
          <div className=\mb-3 border-t border-white/5 pt-3\>
            <p className=\text-[6px] uppercase tracking-widest text-gray-600 font-bold mb-1\>{t.common.author}</p>
            <p className=\text-[9px] text-white font-medium\>Giuseppe Gerardo Bifulco</p>
          </div>
          <Link href={`/newsletter/${issue.slug}`} className=\inline-flex items-center gap-2 text-white font-bold text-[9px] uppercase tracking-widest hover:gap-3 transition-all\>
            {t.common.read} <ArrowRight size={12} className=\text-red-700\ />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function NewsletterPreview() {
  const { t } = useLanguage();
  const latestIssues = newsIssues.slice(0, 3);

  return (
    <section id=\newsletter\ className=\flex flex-col justify-center px-4 sm:px-6 lg:px-10 bg-transparent relative overflow-hidden\ style={{ height: \100dvh\ }}>
      <div className=\max-w-7xl mx-auto w-full relative z-10 pt-16 sm:pt-20\>
        <div className=\mb-6 sm:mb-8 lg:mb-12 flex flex-wrap justify-between items-end gap-3\>
          <h2 className=\text-3xl sm:text-4xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none drop-shadow-xl\>
            {t.newsletter.title}
          </h2>
          <Link
            href=\/newsletter\
            className=\px-5 sm:px-8 py-2.5 sm:py-3 bg-red-950/20 border border-red-800/50 text-red-500 font-bold rounded-full hover:bg-red-900 hover:text-white transition-all uppercase tracking-widest text-[9px] flex items-center gap-2 sm:gap-3 group shadow-lg\     
          >
            {t.newsletter.archive}
            <Grid size={12} className=\group-hover:rotate-90 transition-transform duration-500\ />
          </Link>
        </div>

        {/* Mobile: horizontal swipe carousel */}
        <div className=\md:hidden overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 mb-4\>
          <div className=\flex gap-3\ style={{ width: \max-content\ }}>
            {latestIssues.map((issue, idx) => (
              <div key={issue.slug} className=\snap-start flex-shrink-0 w-[78vw]\>
                <NewsCard issue={issue} idx={idx} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: 3-column grid */}
        <div className=\hidden md:grid grid-cols-3 gap-6 mb-6 lg:mb-12\>
          {latestIssues.map((issue, idx) => (
            <NewsCard key={issue.slug} issue={issue} idx={idx} />
          ))}
        </div>

        {/* Compact subscribe row */}
        <div className=\sm:hidden flex gap-2 mb-4\>
          <input
            type=\email\
            placeholder={t.newsletter.placeholder}
            className=\flex-1 min-w-0 px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-red-900 text-xs\
          />
          <button className=\flex-shrink-0 px-4 py-2.5 bg-red-900 text-white font-black rounded-xl text-[9px] uppercase tracking-widest shadow-lg\>
            {t.newsletter.btn}
          </button>
        </div>

        {/* Full subscribe CTA */}
        <div className=\hidden sm:block relative p-5 sm:p-8 bg-gradient-to-br from-red-900/30 to-black/30 backdrop-blur-xl rounded-2xl sm:rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl\>
          <div className=\relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-8\>       
            <div className=\max-w-md\>
              <h3 className=\text-lg sm:text-xl font-bold text-white mb-1 uppercase tracking-tight\>{t.newsletter.ctaTitle}</h3>     
              <p className=\text-gray-300 text-[10px] font-light\>{t.newsletter.ctaDesc}</p>
            </div>
            <div className=\w-full lg:w-auto flex gap-2 sm:gap-3\>
              <input
                type=\email\
                placeholder={t.newsletter.placeholder}
                className=\flex-1 min-w-0 px-4 sm:px-6 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-red-900 text-xs backdrop-blur-md\
              />
              <button className=\flex-shrink-0 px-5 sm:px-10 py-3 bg-red-900 text-white font-black rounded-xl hover:bg-white hover:text-black transition-all uppercase tracking-widest text-[9px] shadow-lg whitespace-nowrap\>
                {t.newsletter.btn}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




