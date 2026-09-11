import React from 'react';
import { Code, Server, Database, Brain, BarChart, Wrench, Check } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Skills() {
  useScrollReveal('.reveal');

  const skillCategories = [
    {
      title: 'Frontend Development',
      icon: Code,
      color: 'text-indigo-400',
      skills: ['React', 'Next.js', 'TypeScript', 'JavaScript (ES6+)', 'Tailwind CSS', 'Vite', 'Recharts', 'HTML5/CSS3']
    },
    {
      title: 'Backend Engineering',
      icon: Server,
      color: 'text-cyan-400',
      skills: ['Node.js', 'Express', 'Python', 'Django', 'FastAPI', 'REST APIs', 'JWT Auth', 'Validation Logic']
    },
    {
      title: 'Databases & Storage',
      icon: Database,
      color: 'text-emerald-400',
      skills: ['PostgreSQL', 'MongoDB', 'Mongoose', 'Firebase', 'Relational Schema Design', 'Query Optimization']
    },
    {
      title: 'AI & Machine Learning',
      icon: Brain,
      color: 'text-purple-400',
      skills: ['Machine Learning (98% RF)', 'Scikit-learn', 'Explainable AI (SHAP/LIME)', 'Audio Extraction (Librosa)', 'IoT Sensors (ESP32)', 'RAG Pipelines']
    },
    {
      title: 'Data & Analytics',
      icon: BarChart,
      color: 'text-amber-400',
      skills: ['Power BI', 'MS Excel', 'Data Structuring', 'KPI Research', 'Emissions Analytics', 'PDF Reporting']
    },
    {
      title: 'Tools & Ecosystem',
      icon: Wrench,
      color: 'text-rose-400',
      skills: ['VS Code', 'GitHub', 'Git', 'Docker', 'BitBucket', 'Jira', 'Postman', 'Vercel']
    }
  ];

  return (
    <section id="skills" className="py-24 relative border-t border-slate-800/80 bg-[#070a12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16 reveal">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3">
            Technical Matrix
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Skills & Capabilities
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl">
            A comprehensive overview of production-tested frameworks, tools, and technical domain knowledge.
          </p>
        </div>

        {/* Skill Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className={`glass-panel card-premium p-6 rounded-2xl border border-slate-800/90 hover:border-indigo-500/30 transition-all group reveal reveal-stagger-${(idx % 4) + 1}`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 group-hover:scale-110 transition-transform duration-200">
                    <Icon className={`w-5 h-5 ${cat.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {cat.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-900/80 text-slate-300 border border-slate-800 flex items-center gap-1.5 hover:border-slate-700 hover:text-white transition-colors"
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
