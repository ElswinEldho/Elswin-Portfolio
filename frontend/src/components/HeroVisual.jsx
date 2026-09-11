import React, { useState } from 'react';
import { Terminal, Cpu, Database, Layers, Code2, Server, CheckCircle2, Activity } from 'lucide-react';

export default function HeroVisual() {
  const [activeTab, setActiveTab] = useState('stack');

  const stackCode = `{
  "developer": "Elswin P Eldho",
  "role": "Full Stack Developer",
  "frontend": ["React", "Next.js", "TypeScript", "Tailwind"],
  "backend": ["Node.js", "Express", "Python", "FastAPI"],
  "database": ["PostgreSQL", "MongoDB"],
  "ai_capabilities": ["ML Models", "SHAP/LIME", "RAG Pipelines"],
  "status": "Available for high-impact software roles"
}`;

  const architectureSnippet = `export async function buildProduct(req: ProductSpec) {
  const system = new FullStackArchitecture({
    frontend: "Next.js / React UI",
    api: "FastAPI + REST Services",
    database: "PostgreSQL Analytics",
    intelligence: "Embedded AI / ML Pipeline"
  });

  return await system.deployScalableProduct();
}`;

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Background Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Workspace Window */}
      <div className="relative rounded-2xl bg-[#0d1322]/90 border border-slate-800/90 shadow-2xl shadow-black/80 overflow-hidden backdrop-blur-xl group hover:border-slate-700/80 transition-all duration-300">
        
        {/* Window Topbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#080c16] border-b border-slate-800/80">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              elswin-workspace.ts
            </span>
          </div>

          {/* 3D Glass Avatar Badge & Status */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-indigo-400/40 shadow-sm shadow-indigo-500/30 flex-shrink-0 bg-slate-900">
              <img src="/avatar.jpg" alt="Elswin Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active Stack
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center px-3 bg-[#0a0f1d] border-b border-slate-800/60 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('stack')}
            className={`px-3 py-2 text-xs font-mono flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'stack'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            techstack.json
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-2 text-xs font-mono flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'architecture'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            architecture.ts
          </button>
        </div>

        {/* Code Content Viewport */}
        <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto text-slate-300 min-h-[260px] bg-[#070b14]/70">
          {activeTab === 'stack' ? (
            <pre className="text-slate-300">
              {stackCode.split('\n').map((line, idx) => (
                <div key={idx} className="flex">
                  <span className="w-6 text-slate-600 select-none text-right pr-3">{idx + 1}</span>
                  <span>
                    {line.includes('"developer"') && <span className="text-indigo-400">{line}</span>}
                    {line.includes('"role"') && <span className="text-cyan-400">{line}</span>}
                    {line.includes('"frontend"') && <span className="text-emerald-400">{line}</span>}
                    {line.includes('"backend"') && <span className="text-amber-400">{line}</span>}
                    {line.includes('"database"') && <span className="text-purple-400">{line}</span>}
                    {!line.includes('"developer"') && !line.includes('"role"') && !line.includes('"frontend"') && !line.includes('"backend"') && !line.includes('"database"') && (
                      <span className="text-slate-300">{line}</span>
                    )}
                  </span>
                </div>
              ))}
            </pre>
          ) : (
            <pre className="text-slate-300">
              {architectureSnippet.split('\n').map((line, idx) => (
                <div key={idx} className="flex">
                  <span className="w-6 text-slate-600 select-none text-right pr-3">{idx + 1}</span>
                  <span className="text-slate-300">{line}</span>
                </div>
              ))}
            </pre>
          )}
        </div>

        {/* Interactive Floating Badge Bar */}
        <div className="p-3 bg-[#0a0e1a] border-t border-slate-800/80 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-300">
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">React</span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">Next.js</span>
            <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300">TypeScript</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">Node.js</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">Python</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">PostgreSQL</span>
          </div>

          <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            200 OK
          </div>
        </div>
      </div>
    </div>
  );
}
