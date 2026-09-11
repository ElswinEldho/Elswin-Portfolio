import React, { useRef } from 'react';
import { ArrowRight, Bot, Sparkles } from 'lucide-react';
import HeroVisual from './HeroVisual';
import { useMouseGlow } from '../hooks/useMouseGlow';

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Hero() {
  const heroRef = useRef(null);
  useMouseGlow(heroRef);

  return (
    <section
      ref={heroRef}
      className="relative pt-32 pb-12 md:pt-40 md:pb-16 overflow-hidden min-h-[88vh] flex flex-col justify-center"
    >
      {/* Mouse-follow glow overlay — pointer-events none so it never blocks clicks */}
      <div className="hero-ambient-glow-overlay" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col gap-10">

        {/* Top: Text left + Visual right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Hero Content */}
          <div className="space-y-6 text-left">

            {/* Availability Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-mono text-slate-300 shadow-sm opacity-0 animate-fade-up delay-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Open to opportunities
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-sans opacity-0 animate-fade-up delay-200">
                Elswin P Eldho
              </h1>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent opacity-0 animate-fade-up delay-300">
                Full Stack Developer
              </div>
            </div>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed opacity-0 animate-fade-up delay-400">
              Building scalable web applications and intelligent software solutions with modern technologies.
            </p>

            {/* Philosophy quote */}
            <p className="text-sm sm:text-base text-slate-400 italic font-normal border-l-2 border-indigo-500/50 pl-4 py-1 opacity-0 animate-fade-up delay-400">
              "I enjoy turning ideas into reliable, useful, and well-crafted digital products."
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap gap-4 items-center opacity-0 animate-fade-up delay-500">
              <button
                onClick={() => scrollToSection('projects')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 hover:shadow-indigo-500/40 btn-premium group flex items-center gap-2"
              >
                View My Work
                <ArrowRight className="w-4 h-4 icon-shift" />
              </button>

              <button
                onClick={() => scrollToSection('ai-assistant')}
                className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 hover:border-indigo-500/60 font-semibold text-sm shadow-lg btn-premium flex items-center gap-2 group"
              >
                <Bot className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform duration-200" />
                Ask My AI
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              </button>
            </div>
          </div>

          {/* Right — Hero Visual */}
          <div className="opacity-0 animate-fade-up delay-400">
            <HeroVisual />
          </div>
        </div>

        {/* Bottom full-width stats bar */}
        <div className="border-t border-slate-800/80 pt-6 opacity-0 animate-fade-up delay-500">
          <div className="grid grid-cols-3 gap-4 text-xs font-mono text-slate-400">
            <div className="flex flex-col">
              <span className="text-slate-200 font-bold text-sm">8.58 CGPA</span>
              <span>B.Tech Computer Science</span>
            </div>
            <div className="flex flex-col border-l border-slate-800 pl-4">
              <span className="text-slate-200 font-bold text-sm">ESG &amp; Web Platforms</span>
              <span>Production Software Experience</span>
            </div>
            <div className="flex flex-col border-l border-slate-800 pl-4">
              <span className="text-slate-200 font-bold text-sm">Full-Stack &amp; AI</span>
              <span>Modern Tech Stack</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
