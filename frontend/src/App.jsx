import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import AIAssistant from './components/AIAssistant';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ResumeModal from './components/ResumeModal';

export default function App() {
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar onResumeClick={() => setResumeOpen(true)} />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <AIAssistant />
        <Contact />
      </main>
      <Footer />
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}
