import React, { useEffect, useRef } from 'react';
import { X, Download } from 'lucide-react';

export default function ResumeModal({ isOpen, onClose }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const handleWheel = (e) => {
      // Prevent Ctrl + Scroll wheel zooming inside modal
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      const wrapperEl = wrapperRef.current;
      if (wrapperEl) {
        wrapperEl.addEventListener('wheel', handleWheel, { passive: false });
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
      const wrapperEl = wrapperRef.current;
      if (wrapperEl) {
        wrapperEl.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center overflow-y-auto py-6 px-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Modal Wrapper - Prevents backdrop click when clicking inside */}
      <div
        ref={wrapperRef}
        className="w-full max-w-[860px] flex flex-col items-center my-auto min-h-full touch-pan-y select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar with Centered Download PDF Button & Right Close Button */}
        <div className="w-full flex items-center justify-between mb-5 px-2 relative">
          
          {/* Empty spacer for flex centering balance */}
          <div className="w-10" />

          {/* Centered DOWNLOAD PDF Button (Matching Reference Design) */}
          <a
            href="/Elswin_P_Eldho_New.pdf"
            download="Elswin_P_Eldho_Resume.pdf"
            className="px-6 py-2.5 rounded-sm border border-slate-600 hover:border-slate-300 bg-black hover:bg-slate-900 text-white text-xs font-mono tracking-widest uppercase flex items-center gap-2.5 transition-all shadow-lg group"
          >
            <Download className="w-3.5 h-3.5 text-slate-300 group-hover:text-white transition-colors" />
            <span>Download PDF</span>
          </a>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 rounded-full transition-colors focus:outline-none"
            aria-label="Close resume preview"
            title="Close (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Outer Glass Card Wrapper */}
        <div className="w-full p-2.5 sm:p-3.5 bg-[#090e1a]/95 border border-slate-800/90 rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] backdrop-blur-xl overflow-hidden">
          {/* Resume Paper Preview Container */}
          <div className="w-full bg-white rounded-xl overflow-hidden h-[82vh] sm:h-[85vh] border border-slate-700/40 relative">
            <iframe
              src="/Elswin_P_Eldho_New.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH&pagemode=none"
              className="w-full h-full border-0 select-none overflow-x-hidden"
              title="Elswin P Eldho Resume"
              style={{ overflowX: 'hidden' }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
