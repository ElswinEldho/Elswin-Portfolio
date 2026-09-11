import React from 'react';

export default function ProfileAvatar({ className = '' }) {
  return (
    <div className={`relative group flex items-center justify-center ${className}`}>
      
      {/* Background Soft Glow Aura */}
      <div className="absolute inset-0 bg-indigo-500/15 rounded-full blur-2xl group-hover:bg-indigo-500/25 transition-colors duration-500 pointer-events-none" />
      
      {/* 3D Glass Sphere Image Container */}
      <div className="relative w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[500px] transition-transform duration-500 group-hover:scale-[1.02]">
        <img
          src="/elswin.png"
          alt="Elswin P Eldho - Profile Avatar"
          className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(99,102,241,0.25)] rounded-full"
        />

        {/* Floating Status Pill Overlay */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080d17]/85 border border-emerald-500/30 text-emerald-400 text-xs font-mono shadow-xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Elswin P Eldho ● Available for roles</span>
        </div>
      </div>

    </div>
  );
}
