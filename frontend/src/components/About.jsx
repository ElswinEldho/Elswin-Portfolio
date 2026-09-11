import React from 'react';
import { Code2, Server, Brain, BarChart3, Leaf, CheckCircle } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import ProfileAvatar from './ProfileAvatar';

export default function About() {
  useScrollReveal('.reveal');

  const highlights = [
    {
      title: 'Full Stack Development',
      desc: 'Building responsive frontends in React & Next.js paired with robust backend services in Node.js & Python.',
      icon: Code2,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
      title: 'Software Engineering',
      desc: 'Designing clean REST APIs, database schemas in PostgreSQL & MongoDB, and scalable product architectures.',
      icon: Server,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20'
    },
    {
      title: 'AI-powered Applications',
      desc: 'Integrating machine learning models, explainable AI (SHAP/LIME), audio extraction (Librosa), and RAG pipelines.',
      icon: Brain,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Data & Analytics',
      desc: 'Transforming complex datasets into actionable visual insights with Power BI, Recharts, and automated KPI reporting.',
      icon: BarChart3,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Sustainability Technology',
      desc: 'Engineering specialized ESG assessment platforms, Scope 1/2/3 carbon accounting, and CDP reporting tools.',
      icon: Leaf,
      color: 'text-green-400',
      bg: 'bg-green-500/10 border-green-500/20'
    }
  ];

  return (
    <section id="about" className="py-24 relative border-t border-slate-800/80 bg-[#080d17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col items-start mb-12 reveal">
          <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-3">
            Background & Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            A little about me
          </h2>
        </div>

        {/* 2-column layout: Left (Avatar + Credentials) | Right (Bio + Capabilities) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT — Avatar + Credential chips */}
          <div className="flex flex-col items-center gap-8 reveal reveal-stagger-1">
            <ProfileAvatar />

            {/* Credential chips under avatar */}
            <div className="w-full grid grid-cols-2 gap-3 font-mono text-xs text-slate-300">
              {[
                'B.Tech CSE (8.58 CGPA)',
                'Full-Stack Architecture',
                'REST API Engineering',
                'Practical AI/ML Integration',
              ].map((label) => (
                <div key={label} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Bio text + Core Capabilities */}
          <div className="space-y-8 reveal reveal-stagger-2">

            {/* Bio */}
            <div className="space-y-4 text-slate-300 leading-relaxed font-light">
              <p className="text-lg text-slate-200 font-normal">
                I am a <strong className="text-white font-semibold">Full Stack Developer</strong> and Computer Science graduate who takes pride in turning complex requirements into elegant, high-performing software products.
              </p>
              <p>
                My journey spans building scalable web applications with <strong>React, Next.js, Node.js, and Python</strong>, developing custom REST APIs, managing relational and document databases (PostgreSQL, MongoDB), and implementing ESG software solutions.
              </p>
              <p>
                I believe great software balances <strong>clean architecture</strong>, <strong>intuitive user experiences</strong>, and <strong>practical utility</strong>. Whether developing intelligent speech diagnostic tools for healthcare, building IoT-enabled smart agriculture platforms, or crafting sustainability scorecards for enterprise vendors, I focus on delivering real-world value.
              </p>
            </div>

            {/* Core Capabilities */}
            <div>
              <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">
                Core Capabilities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {highlights.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className={`glass-panel card-premium p-4 rounded-xl border border-slate-800/80 reveal reveal-stagger-${(idx % 4) + 1} flex items-start gap-3 group`}
                    >
                      <div className={`p-2 rounded-lg ${item.bg} group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
