"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { PlayCircle, Clock, ArrowLeft, Layers, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import { coursesData } from "@/components/Academy";

export default function CourseDetail() {
  const { t } = useLanguage();
  const params = useParams();
  const course = coursesData.find(c => c.slug === params.slug) || coursesData[0];

  return (
    <main className="bg-black min-h-screen text-white pb-32 font-sans">
      <Navbar />
      
      {/* Course Header */}
      <section className="pt-48 pb-20 px-10 border-b border-white/5 bg-[radial-gradient(circle_at_50%_0%,rgba(153,0,36,0.15),transparent_50%)]">
        <div className="max-w-5xl mx-auto">
          <Link href="/academy" className="inline-flex items-center gap-2 text-red-700 font-bold mb-12 hover:gap-4 transition-all uppercase tracking-widest text-xs">
            <ArrowLeft size={16} /> Back to Academy
          </Link>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-red-950/20 border border-red-900/30 rounded-full text-[10px] font-black text-red-600 uppercase tracking-widest">
                {course.level}
              </span>
              <span className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                <Layers size={14} /> {course.modules} Modules
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-4">
              {course.title}
            </h1>
            <p className="text-gray-400 text-xl max-w-3xl leading-relaxed italic border-l-4 border-red-900 pl-8 py-2">
              {course.description}
            </p>

            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <User size={20} className="text-red-700" />
              </div>
              <div>
                <p className="text-[8px] uppercase font-bold text-gray-600 leading-none mb-1">Instructor</p>
                <p className="text-sm font-bold text-white leading-none">Giuseppe Gerardo Bifulco</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Playlist Section */}
      <section className="py-24 px-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black uppercase tracking-widest mb-12 text-white flex items-center gap-4">
            Course Content <div className="h-px flex-grow bg-white/5" />
          </h2>

          <div className="space-y-6">
            {course && course.videos && course.videos.length > 0 ? course.videos.map((video, idx) => (
              <motion.div 
                key={video.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group flex flex-col md:flex-row gap-8 p-6 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/[0.08] hover:border-red-900/30 transition-all cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="w-full md:w-72 aspect-video rounded-2xl overflow-hidden relative border border-white/5">
                  <img src={video.thumb} alt={video.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle size={48} className="text-white drop-shadow-2xl" />
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-md rounded-lg text-[10px] font-bold text-white border border-white/10">
                    {video.duration}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-grow flex flex-col justify-center">
                  <span className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-2">Lesson {video.id}</span>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors">{video.title}</h3>
                  <p className="text-gray-500 text-sm font-light leading-relaxed max-w-xl">{video.desc}</p>
                </div>

                <div className="hidden md:flex items-center">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-red-700 group-hover:bg-red-900 transition-all">
                    <PlayCircle size={24} className="text-white" />
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="p-20 text-center bg-white/5 border border-white/5 border-dashed rounded-[3rem]">
                <PlayCircle size={48} className="mx-auto text-gray-700 mb-6" />
                <p className="text-gray-500 uppercase tracking-widest text-sm font-bold">Videos coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
