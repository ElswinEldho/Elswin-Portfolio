import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, RefreshCw, AlertCircle, HelpCircle } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Clean Markdown Formatter Component
function FormattedText({ content }) {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        let trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;

        if (trimmed.startsWith('# ')) {
          return <h4 key={idx} className="text-base font-bold text-white mt-3 mb-1">{parseInline(trimmed.substring(2))}</h4>;
        }
        if (trimmed.startsWith('## ')) {
          return <h4 key={idx} className="text-sm font-bold text-indigo-300 mt-2 mb-1">{parseInline(trimmed.substring(3))}</h4>;
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 text-slate-200 pl-2">
              <span className="text-indigo-400 font-bold select-none">•</span>
              <span>{parseInline(trimmed.substring(2))}</span>
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 text-slate-200 pl-2">
              <span className="text-cyan-400 font-mono text-xs select-none">{numMatch[1]}.</span>
              <span>{parseInline(numMatch[2])}</span>
            </div>
          );
        }

        return <p key={idx} className="text-slate-200">{parseInline(line)}</p>;
      })}
    </div>
  );
}

function parseInline(text) {
  const parts = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
    const codeMatch = remaining.match(/`(.*?)`/);

    if (boldMatch && (!codeMatch || boldMatch.index < codeMatch.index)) {
      const matchIndex = boldMatch.index;
      if (matchIndex > 0) {
        parts.push(remaining.substring(0, matchIndex));
      }
      parts.push(
        <strong key={keyIdx++} className="font-bold text-white bg-indigo-500/10 px-1 py-0.5 rounded text-slate-100">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.substring(matchIndex + boldMatch[0].length);
    } else if (codeMatch) {
      const matchIndex = codeMatch.index;
      if (matchIndex > 0) {
        parts.push(remaining.substring(0, matchIndex));
      }
      parts.push(
        <code key={keyIdx++} className="font-mono text-xs text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.substring(matchIndex + codeMatch[0].length);
    } else {
      parts.push(remaining);
      break;
    }
  }

  return parts;
}

export default function AIAssistant() {
  useScrollReveal('.reveal');

  const [messages, setMessages] = useState([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeTokenStream, setActiveTokenStream] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const chatContainerRef = useRef(null);

  const suggestedQuestions = [
    { label: '💼 Experience', query: 'What has Elswin worked on?' },
    { label: '🚀 Projects', query: "What are Elswin's most interesting projects?" },
    { label: '⚙️ Technologies', query: 'What technologies does Elswin use?' },
    { label: '🧠 Machine Learning', query: 'What ML projects has Elswin built?' },
    { label: '🎓 Education', query: "Tell me about Elswin's education." },
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, activeTokenStream]);

  const handleAskQuestion = async (queryText) => {
    const textToSend = queryText || inputQuestion;
    if (!textToSend.trim() || isStreaming) return;

    setErrorMsg(null);
    setInputQuestion('');
    
    const userMessage = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    
    setIsStreaming(true);
    setActiveTokenStream('');

    try {
      const endpoint = `${API_BASE_URL}/api/chat`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textToSend, stream: true }),
      });

      if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedAnswer = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          
          const jsonStr = trimmed.replace(/^data:\s*/, '');
          try {
            const data = JSON.parse(jsonStr);
            if (data.token) {
              accumulatedAnswer += data.token;
              setActiveTokenStream(accumulatedAnswer);
            }
            if (data.done) {
              break;
            }
          } catch (e) {
            // Ignore partial parse
          }
        }
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: accumulatedAnswer || activeTokenStream }
      ]);
    } catch (err) {
      console.error('Chat Streaming Error:', err);
      setErrorMsg('Could not connect to the AI Assistant. Make sure the backend server (api.py) is running on port 8000.');
    } finally {
      setIsStreaming(false);
      setActiveTokenStream('');
    }
  };

  return (
    <section id="ai-assistant" className="py-24 relative border-t border-slate-800/80 bg-[#060a12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono mb-3">
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            Interactive Portfolio RAG Assistant
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Meet my AI assistant
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">
            Have a question about my experience, projects, or skills? Ask away.
          </p>
        </div>

        {/* Chat Window Frame */}
        <div className="max-w-4xl mx-auto glass-panel rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[560px] reveal reveal-stagger-1">
          
          {/* Chat Window Header */}
          <div className="px-5 py-3.5 bg-[#090d18] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#090d18]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Elswin's AI Assistant
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Powered by Qwen & Vector Search
                </p>
              </div>
            </div>

            <button
              onClick={() => { setMessages([]); setActiveTokenStream(''); setErrorMsg(null); }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-xs font-mono flex items-center gap-1 btn-premium"
              title="Reset Chat"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Chat Messages Viewport */}
          <div ref={chatContainerRef} className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#070b14]/90">
            
            {/* Empty State */}
            {messages.length === 0 && !isStreaming && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 my-auto animate-fade-in">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Bot className="w-6 h-6" />
                </div>
                <h4 className="text-base font-semibold text-white">Ask me anything about Elswin.</h4>
                <p className="text-xs text-slate-400 max-w-sm font-light">
                  I can tell you about his experience, projects, skills, education, technologies, and more.
                </p>
              </div>
            )}

            {/* Chat History Messages */}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 animate-fade-in ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-tr-none shadow-md shadow-indigo-600/20 font-medium'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
                  }`}
                >
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <FormattedText content={msg.content} />
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Active Streaming Token Response */}
            {isStreaming && (
              <div className="flex items-start gap-3 justify-start animate-fade-in">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="max-w-[85%] p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg">
                  {activeTokenStream ? (
                    <div>
                      <FormattedText content={activeTokenStream} />
                      <span className="streaming-cursor" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <span>Thinking</span>
                      <span className="inline-flex gap-1 items-center">
                        <span className="thinking-dot" />
                        <span className="thinking-dot" />
                        <span className="thinking-dot" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Quick Suggested Questions Bar */}
          <div className="px-4 py-2.5 bg-[#080c16] border-t border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-indigo-400" /> Prompts:
            </span>
            {suggestedQuestions.map((s, idx) => (
              <button
                key={idx}
                disabled={isStreaming}
                onClick={() => handleAskQuestion(s.query)}
                className="px-3 py-1 rounded-full text-xs font-mono bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-indigo-500/40 hover:text-indigo-200 hover:bg-indigo-500/10 btn-premium flex-shrink-0 disabled:opacity-50 transition-all"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleAskQuestion(); }}
            className="p-3 bg-[#0a0f1d] border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              disabled={isStreaming}
              placeholder="Ask a question about Elswin's projects, experience, or skills..."
              className="flex-1 bg-slate-900/90 text-slate-100 placeholder-slate-500 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500/60 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || isStreaming}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm disabled:opacity-40 transition-all shadow-md shadow-indigo-600/30 btn-premium flex items-center gap-2"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5 icon-shift" />
            </button>
          </form>

        </div>

      </div>
    </section>
  );
}
