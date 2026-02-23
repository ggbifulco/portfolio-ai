"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Rocket, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    if (pathname === "/") {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("navToSection", { detail: id }));
      setActiveSection(id);
    }
  };

  const handleNavClickMobile = (id: string) => {
    setIsMenuOpen(false);
    if (pathname === "/") {
      window.dispatchEvent(new CustomEvent("navToSection", { detail: id }));
      setActiveSection(id);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-4 sm:px-6 lg:px-10 py-4 sm:py-5 lg:py-6 backdrop-blur-xl bg-black/40 border-b border-white/5"
      >
        {/* Brand Logo */}
        <Link href="/?s=hero" onClick={(e) => handleNavClick(e, "hero")} className="flex items-center group cursor-pointer">
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ filter: ["drop-shadow(0 0 2px #b00020)", "drop-shadow(0 0 10px #ff0033)", "drop-shadow(0 0 2px #b00020)"] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-white group-hover:text-red-500 transition-colors"
            >
              <Rocket size={28} strokeWidth={2.5} className="sm:w-8 sm:h-8 lg:w-9 lg:h-9" />
            </motion.div>
            <div className="absolute inset-0 bg-red-900/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex gap-2 items-center">
          {navLinks.map((link) => {
            const isActive = pathname === "/" && activeSection === link.id;
            return (
              <Link
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`px-4 py-2 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold transition-all duration-300 border ${
                  isActive
                    ? "text-white border-red-700 shadow-[0_0_15px_rgba(153,0,36,0.6)]"
                    : "text-gray-500 border-white/10 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          {/* Language Toggle */}
          <div className="flex gap-1 bg-white/5 p-1 rounded-full border border-white/10">
            <button
              onClick={() => setLanguage("it")}
              className={`px-2 sm:px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === "it" ? "bg-red-900 text-white" : "text-gray-500"}`}
            >
              IT
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 sm:px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === "en" ? "bg-red-900 text-white" : "text-gray-500"}`}
            >
              EN
            </button>
          </div>

          {/* Subscribe button — desktop only */}
          <Link
            href="/?s=newsletter"
            onClick={(e) => handleNavClick(e, "newsletter")}
            className="hidden lg:block px-8 py-3 bg-red-900 text-white text-[10px] font-black rounded-full hover:bg-red-700 transition-all uppercase tracking-widest border border-red-700/50 shadow-lg"
          >
            {t.nav.subscribe}
          </Link>

          {/* Hamburger — mobile/tablet only */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-red-500 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-[90] bg-black/97 backdrop-blur-2xl flex flex-col items-center justify-center gap-6"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            {navLinks.map((link) => {
              const isActive = pathname === "/" && activeSection === link.id;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => handleNavClickMobile(link.id)}
                  className={`text-2xl font-black uppercase tracking-widest transition-colors ${
                    isActive ? "text-red-500" : "text-white hover:text-red-400"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <Link
              href="/?s=newsletter"
              onClick={() => handleNavClickMobile("newsletter")}
              className="mt-4 px-10 py-4 bg-red-900 text-white font-black rounded-full hover:bg-red-700 transition-all uppercase tracking-widest text-sm border border-red-700/50 shadow-lg"
            >
              {t.nav.subscribe}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
