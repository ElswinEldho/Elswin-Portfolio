import React from 'react';

export default function Footer() {
  return (
    <footer className="py-8 bg-[#050810] border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Single row: copyright | signature | stack */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Left — copyright */}
          <p className="text-xs font-mono text-slate-500 order-2 sm:order-1">
            © 2026 <span className="text-slate-300 font-semibold">Elswin P Eldho</span>. All rights reserved.
          </p>

          {/* Center — signature */}
          <div className="order-1 sm:order-2 flex-shrink-0">
            <img
              src="/signature-clean.png"
              alt="Elswin P Eldho Signature"
              className="h-9 w-auto object-contain select-none opacity-60 hover:opacity-90 transition-opacity duration-300"
            />
          </div>

          {/* Right — stack */}
          <p className="text-xs font-mono text-slate-500 order-3">
            Full Stack Developer&nbsp;<span className="text-slate-700">•</span>&nbsp;Built with React &amp; Vite
          </p>

        </div>
      </div>
    </footer>
  );
}
