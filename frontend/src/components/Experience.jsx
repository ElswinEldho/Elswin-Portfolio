import React from 'react';
import { Briefcase, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Experience() {
  useScrollReveal('.reveal');

  const experiences = [
    {
      role: 'Junior Developer',
      company: 'SAM Corporate',
      location: 'Kakkanad, Kochi, India',
      period: '08/2026 – Present',
      type: 'Full-Time',
      description:
        'Engineer complete web applications from initial business requirement documents (BRDs) into scalable, user-ready digital products.',
      contributions: [
        'Develop end-to-end full-stack features using React, Next.js, TypeScript, Node.js, and PostgreSQL.',
        'Architect REST APIs, validate data pipelines, and design relational database schemas.',
        'Build custom reporting workflows and ESG software modules for client demonstrations.'
      ],
      tech: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST APIs', 'ESG Solutions']
    },
    {
      role: 'Full Stack Developer Intern',
      company: 'SAM Corporate',
      location: 'Kakkanad, India',
      period: '04/2026 – 07/2026',
      type: 'Internship',
      description:
        'Developed intelligent ESG and sustainability software platforms to automate carbon accounting and enterprise compliance reporting.',
      contributions: [
        'Built scalable frontend interfaces and secure backend API microservices.',
        'Implemented Scope 1, Scope 2, and Scope 3 carbon accounting calculation modules.',
        'Collaborated with cross-functional teams to integrate business workflows and optimize system performance.'
      ],
      tech: ['React', 'Vite', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'JWT', 'Carbon Accounting']
    },
    {
      role: 'ESG Presales Consultant Intern',
      company: 'SAM Corporate',
      location: 'Kakkanad, India',
      period: '02/2026 – 04/2026',
      type: 'Internship',
      description:
        'Supported ESG solution architecture, business data analytics, client demonstrations, and custom analytics tool development.',
      contributions: [
        'Created interactive Power BI dashboards for enterprise ESG target tracking and KPI visualization.',
        'Developed the CDPAnalysis Android Application for streamlined sustainability assessment data input.',
        'Structured complex dataset upload pipelines in Excel for seamless backend ingestion.'
      ],
      tech: ['Power BI', 'MS Excel', 'Android (Java/Kotlin)', 'Data Structuring', 'KPI Analytics', 'CDP Framework']
    }
  ];

  return (
    <section id="experience" className="py-24 relative border-t border-slate-800/80 bg-[#070a12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16 reveal">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-3">
            Career Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Professional Experience
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl">
            A timeline of software development roles, internships, and production engineering contributions.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l border-slate-800/90 space-y-12">
          {experiences.map((exp, index) => (
            <div key={index} className={`relative group reveal reveal-stagger-${index + 1}`}>
              
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500 group-hover:border-cyan-400 group-hover:scale-125 transition-all duration-300 shadow-md shadow-indigo-500/30" />

              {/* Main Card */}
              <div className="glass-panel card-premium p-6 sm:p-8 rounded-2xl border border-slate-800/90 hover:border-indigo-500/40 transition-all">
                
                {/* Card Top Details */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {exp.role}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {exp.type}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-cyan-400 mt-1 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      {exp.company}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end text-xs font-mono text-slate-400 space-y-1">
                    <span className="flex items-center gap-1 bg-slate-900/80 px-3 py-1 rounded-md border border-slate-800 group-hover:border-slate-700 transition-colors">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Short Overview */}
                <p className="text-sm text-slate-300 font-light mb-4 leading-relaxed">
                  {exp.description}
                </p>

                {/* Key Contributions */}
                <div className="space-y-2 mb-6">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
                    Key Contributions
                  </span>
                  {exp.contributions.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0 icon-shift" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-800/60">
                  {exp.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-indigo-500/30 hover:text-indigo-200 transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
