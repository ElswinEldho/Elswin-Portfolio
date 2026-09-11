import React, { useState } from 'react';
import { ExternalLink, Github, Sparkles, ShieldCheck } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Projects() {
  const [filter, setFilter] = useState('all');
  useScrollReveal('.reveal', [filter]);

  const projects = [
    {
      id: 'ensogo',
      title: 'EnSoGo – Sustainability Readiness Intelligence Platform',
      category: 'fullstack',
      tagline: 'Enterprise ESG assessment chatbot and analytics web application scoring Scope 1/2/3 emissions readiness.',
      problemSolved:
        'Built a complete web application utilizing the SAM BRD v2.0 framework to evaluate and score organizational sustainability readiness across Scope 1, Scope 2, and Scope 3 emissions.',
      tech: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'Recharts', 'JWT'],
      highlights: [
        'Interactive Recharts dashboards for emissions analytics',
        'JWT-authenticated backend API with Node.js & Express',
        'MongoDB document storage for dynamic questionnaire schemas'
      ],
      github: 'https://github.com/ElswinEldho',
      demo: 'https://elswineldho.github.io/Portfolio/',
      featured: true
    },
    {
      id: 'smart-agri',
      title: 'AI-Driven Smart Agriculture & Explainable AI Platform',
      category: 'ai-ml',
      tagline: 'IoT-enabled precision agriculture system providing real-time soil analysis, crop recommendations, and SHAP/LIME explainability.',
      problemSolved:
        'Engineered an end-to-end smart agriculture solution using ESP32 IoT sensors for soil metrics, integrated with FastAPI and ML models to deliver transparent, explainable crop and fertilizer advice.',
      tech: ['Python', 'FastAPI', 'React', 'Streamlit', 'ESP32 IoT', 'SHAP', 'LIME', 'Machine Learning'],
      highlights: [
        'ESP32 hardware integration for real-time sensor ingestion',
        'Explainable AI (SHAP/LIME) to justify model recommendations',
        'Interactive chatbot interface for farmer advisory'
      ],
      github: 'https://github.com/ElswinEldho',
      demo: 'https://elswineldho.github.io/Portfolio/',
      featured: true
    },
    {
      id: 'vendor-iq',
      title: 'Vendor-IQ – Vendor ESG Screening Platform',
      category: 'fullstack',
      tagline: 'Enterprise sustainability screening system for vendor risk classification, scorecards, and performance roadmaps.',
      problemSolved:
        'Designed a structured ESG screening platform allowing organizations to assess vendor sustainability metrics, generate annualized PDF scorecards, and track historical risk trends over time.',
      tech: ['React', 'Node.js', 'PostgreSQL', 'Express', 'PDF Generation', 'ESG Scoring', 'REST APIs'],
      highlights: [
        'Automated ESG risk classification algorithms',
        'PDF report & scorecard generator for monthly/annual audits',
        'Historical performance tracking and remediation roadmaps'
      ],
      github: 'https://github.com/ElswinEldho',
      demo: 'https://elswineldho.github.io/Portfolio/',
      featured: false
    },
    {
      id: 'speech-tool',
      title: 'AI Speech Analysis Tool for Speech Therapists',
      category: 'ai-ml',
      tagline: 'Clinical web application assisting speech therapists in diagnosing dysarthria with 98% accuracy ML classification.',
      problemSolved:
        'Developed a Django web application integrating real-time audio capture, Librosa MFCC feature extraction, and a 98% accurate Random Forest model to aid speech disorder diagnosis. Presented at ICIMRBE 2025.',
      tech: ['Python', 'Django', 'Librosa', 'Scikit-learn', 'Random Forest', 'Matplotlib', 'Audio Processing'],
      highlights: [
        '98% classification accuracy Random Forest model',
        'Real-time MFCC audio feature extraction using Librosa',
        'Presented at ICIMRBE conference (April 2025)'
      ],
      github: 'https://github.com/ElswinEldho',
      demo: 'https://elswineldho.github.io/Portfolio/',
      featured: false
    }
  ];

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-24 relative border-t border-slate-800/80 bg-[#080c16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 reveal">
          <div>
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-3 inline-block">
              Portfolio & Case Studies
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Projects
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Scalable web platforms, intelligent software products, and practical engineering solutions.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter('fullstack')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                filter === 'fullstack'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Full Stack
            </button>
            <button
              onClick={() => setFilter('ai-ml')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                filter === 'ai-ml'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              AI & Intelligent Apps
            </button>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              className={`glass-panel card-premium p-7 sm:p-8 rounded-2xl border border-slate-800/90 hover:border-indigo-500/40 transition-all flex flex-col justify-between group reveal reveal-stagger-${(idx % 4) + 1}`}
            >
              <div>
                
                {/* Header Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {project.category === 'fullstack' ? 'Full Stack Web Platform' : 'Intelligent AI Application'}
                  </span>

                  {project.featured && (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>

                {/* Project Title */}
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                  {project.title}
                </h3>

                {/* Tagline */}
                <p className="text-xs font-mono text-slate-400 mb-4 leading-relaxed">
                  {project.tagline}
                </p>

                {/* Problem Solved */}
                <div className="mb-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 group-hover:border-slate-700/80 transition-colors">
                  <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-1 font-semibold">
                    What I Built / Solved
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    {project.problemSolved}
                  </p>
                </div>

                {/* Key Highlights */}
                <div className="space-y-1.5 mb-6">
                  {project.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 icon-shift" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Bottom Tech & Action Links */}
              <div>
                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6 pt-4 border-t border-slate-800/60">
                  {project.tech.map((t, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200 transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Action Links */}
                <div className="flex items-center justify-between gap-4">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-white transition-colors group/link"
                  >
                    <Github className="w-4 h-4 text-indigo-400 group-hover/link:scale-110 transition-transform" />
                    GitHub Source
                  </a>

                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-xs font-mono border border-indigo-500/30 btn-premium group/btn"
                  >
                    View Project
                    <ExternalLink className="w-3.5 h-3.5 icon-shift" />
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
