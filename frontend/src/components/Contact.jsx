import React from 'react';
import { Mail, Phone, Github, Linkedin, ArrowUpRight, Copy, Check } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Contact() {
  useScrollReveal('.reveal');
  const [copied, setCopied] = React.useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('elswin08@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const contactLinks = [
    {
      title: 'Email',
      value: 'elswin08@gmail.com',
      href: 'mailto:elswin08@gmail.com',
      icon: Mail,
      color: 'text-indigo-400',
      action: copyEmail,
      actionText: copied ? 'Copied!' : 'Copy'
    },
    {
      title: 'Phone',
      value: '+91 8086364948',
      href: 'tel:+918086364948',
      icon: Phone,
      color: 'text-emerald-400'
    },
    {
      title: 'GitHub',
      value: 'github.com/ElswinEldho',
      href: 'https://github.com/ElswinEldho',
      icon: Github,
      color: 'text-cyan-400'
    },
    {
      title: 'LinkedIn',
      value: 'linkedin.com/in/elswinpeldho',
      href: 'https://linkedin.com/in/elswinpeldho',
      icon: Linkedin,
      color: 'text-blue-400'
    }
  ];

  return (
    <section id="contact" className="py-24 relative border-t border-slate-800/80 bg-[#070b13]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 reveal">
          <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 inline-block">
            Get In Touch
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Let's build something meaningful.
          </h2>
          <p className="text-slate-400 text-base max-w-lg mx-auto font-light">
            Interested in working together or just want to say hello? Feel free to reach out directly through any of the channels below.
          </p>
        </div>

        {/* Contact Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactLinks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`glass-panel card-premium p-6 rounded-2xl border border-slate-800/90 hover:border-indigo-500/30 transition-all flex flex-col justify-between group reveal reveal-stagger-${idx + 1}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 group-hover:scale-110 transition-transform duration-200">
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    {item.action ? (
                      <button
                        onClick={item.action}
                        className="text-[11px] font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 btn-premium flex items-center gap-1"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {item.actionText}
                      </button>
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors icon-shift" />
                    )}
                  </div>

                  <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors truncate">
                    {item.value}
                  </p>
                </div>

                <a
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors group/link"
                >
                  Connect on {item.title}
                  <ArrowUpRight className="w-3.5 h-3.5 icon-shift" />
                </a>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
