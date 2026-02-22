"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Rocket } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("hero");
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { name: t.nav.home, id: "hero", href: "/?s=hero" },
    { name: t.nav.projects, id: "projects", href: "/?s=projects" },
    { name: t.nav.newsletter, id: "newsletter", href: "/?s=newsletter" },
    { name: t.nav.academy, id: "academy", href: "/?s=academy" },
    { name: t.nav.about, id: "about", href: "/?s=about" },
  ];

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }
    const handleSectionChange = (e: any) => setActiveSection(e.detail);
    window.addEventListener("sectionChanged", handleSectionChange);
    return () => window.removeEventListener("sectionChanged", handleSectionChange);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    if (pathname === "/") {
      e.preventDefault();
      const event = new CustomEvent("navToSection", { detail: id });
      window.dispatchEvent(event);
      setActiveSection(id);
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-10 py-6 backdrop-blur-xl bg-black/40 border-b border-white/5"
    >
      {/* Brand: Logo Neon Razzo */}
      <Link href="/?s=hero" onClick={(e) => handleNavClick(e, "hero")} className="flex items-center group cursor-pointer ml-2">
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ filter: ["drop-shadow(0 0 2px #b00020)", "drop-shadow(0 0 10px #ff0033)", "drop-shadow(0 0 2px #b00020)"] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-white group-hover:text-red-500 transition-colors"
          >
            <Rocket size={36} strokeWidth={2.5} />
          </motion.div>
          <div className="absolute inset-0 bg-red-900/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>

      <div className="flex gap-2 items-center">
        {navLinks.map((link) => {
          const isActive = pathname === "/" && activeSection === link.id;
          return (
            <Link 
              key={link.id} 
              href={link.href}
              onClick={(e) => handleNavClick(e, link.id)}
              className={`
                px-4 py-2 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold transition-all duration-300
                border ${isActive 
                  ? "text-white border-red-700 shadow-[0_0_15px_rgba(153,0,36,0.6)]" 
                  : "text-gray-500 border-white/10 hover:text-white hover:bg-white/5"
                }
              `}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex gap-2 bg-white/5 p-1 rounded-full border border-white/10">
          <button onClick={() => setLanguage("it")} className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === "it" ? "bg-red-900 text-white" : "text-gray-500"}`}>IT</button>
          <button onClick={() => setLanguage("en")} className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === "en" ? "bg-red-900 text-white" : "text-gray-500"}`}>EN</button>
        </div>
        <Link href="/?s=newsletter" onClick={(e) => handleNavClick(e, "newsletter")} className="px-8 py-3 bg-red-900 text-white text-[10px] font-black rounded-full hover:bg-red-700 transition-all uppercase tracking-widest border border-red-700/50 shadow-lg">{t.nav.subscribe}</Link>
      </div>
    </motion.nav>
  );
}
