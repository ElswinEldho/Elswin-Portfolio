import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Send, Maximize2 } from 'lucide-react';

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Navbar({ onResumeClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoModalOpen, setLogoModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLogoModalOpen(false);
    };
    if (logoModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [logoModalOpen]);

  const navLinks = [
    { name: 'About', id: 'about' },
    { name: 'Experience', id: 'experience' },
    { name: 'Projects', id: 'projects' },
    { name: 'Skills', id: 'skills' },
    { name: 'AI Assistant', id: 'ai-assistant', highlight: true },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#070a11]/90 backdrop-blur-xl border-b border-slate-800/80 py-3 shadow-xl shadow-black/30'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand — Signature as primary identity mark */}
          <div className="flex items-center gap-3 opacity-0 animate-fade-up">
            {/* Expandable logo thumbnail */}
            <button
              onClick={() => setLogoModalOpen(true)}
              className="relative group w-8 h-8 rounded-lg overflow-hidden border border-indigo-500/30 shadow-sm hover:border-indigo-400/60 hover:shadow-indigo-500/30 transition-all duration-300 flex-shrink-0 bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              title="Click to view full logo"
            >
              <img
                src="/elswin-logo.jpg"
                alt="Elswin Logo"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize2 className="w-3 h-3 text-white" />
              </div>
            </button>

            {/* Signature — primary personal identity mark */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="focus:outline-none group"
            >
              <img
                src="/signature-clean.png"
                alt="Elswin P Eldho — Signature"
                className="h-8 md:h-9 w-auto object-contain select-none opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link, idx) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all opacity-0 animate-fade-up ${
                  link.highlight
                    ? 'text-indigo-300 hover:text-indigo-200 bg-indigo-500/10 border border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-500/20 flex items-center gap-1.5'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
                style={{ animationDelay: `${(idx + 1) * 80}ms` }}
              >
                {link.highlight && <Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
                {link.name}
              </button>
            ))}

            {/* Resume Preview & Download CTA */}
            <button
              onClick={onResumeClick}
              className="ml-2 px-3.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 text-sm font-medium transition-all opacity-0 animate-fade-up delay-400"
            >
              Resume
            </button>

            {/* Let's Connect CTA */}
            <button
              onClick={() => scrollToSection('contact')}
              className="ml-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-medium shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 btn-premium flex items-center gap-2 opacity-0 animate-fade-up delay-500"
            >
              Let's Connect
              <Send className="w-3.5 h-3.5" />
            </button>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700/50"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0f1d]/95 backdrop-blur-xl border-b border-slate-800 px-4 pt-4 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => { scrollToSection(link.id); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  link.highlight
                    ? 'text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 flex items-center gap-2'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {link.highlight && <Sparkles className="w-4 h-4 text-indigo-400" />}
                {link.name}
              </button>
            ))}

            <button
              onClick={() => { onResumeClick(); setMobileMenuOpen(false); }}
              className="flex items-center justify-center w-full text-center mt-3 px-4 py-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium shadow-md"
            >
              Resume
            </button>

            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center mt-2 px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/30 btn-premium"
            >
              Let's Connect
            </a>
          </div>
        )}
      </header>

      {/* Expandable Image Modal Lightbox */}
      {logoModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setLogoModalOpen(false)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] p-2 bg-[#0c1220] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden group"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLogoModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-colors shadow-lg"
              title="Close image"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Expanded High-Res Logo Image */}
            <img
              src="/elswin-logo.jpg"
              alt="Elswin Logo Full View"
              className="w-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </>
  );
}

