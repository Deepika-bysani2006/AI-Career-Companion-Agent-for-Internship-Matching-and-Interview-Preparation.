import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { MessageSquareCode, Send, Sparkles, User, Bot, Briefcase, ExternalLink, Cpu } from 'lucide-react';
import api from '../utils/axios';

export const AIChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      content: 'Hello! I am your **SkillBridge Gemini AI Career Assistant**. Ask me about software internships, resume ATS optimization, skill gap analysis, or technical interview questions!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [prompts, setPrompts] = useState([
    "Find AI & Python internships",
    "How can I improve my resume ATS score?",
    "What skills should I learn for Data Science?",
    "Prepare me for a technical interview",
    "Find jobs matching my skills"
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await api.get('/chat/prompts');
        if (res.data && res.data.length > 0) {
          setPrompts(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPrompts();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend = null) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    const historyForBackend = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      content: m.content
    }));

    try {
      const res = await api.post('/chat', {
        session_id: sessionId,
        message: query,
        conversation_history: historyForBackend
      });
      
      setSessionId(res.data.session_id);
      setMessages((prev) => [
        ...prev, 
        { 
          sender: 'ai', 
          content: res.data.message || res.data.response,
          source: res.data.source || 'gemini',
          model: res.data.model || 'gemini-2.5-flash',
          jobs: res.data.jobs || []
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev, 
        { sender: 'ai', content: "Sorry, I encountered an error connecting to the Gemini AI backend." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 flex flex-col h-[calc(100vh-4rem)]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> SkillBridge Gemini AI Career Assistant
              </h1>
              <p className="text-xs text-slate-500">Google Gemini-powered intelligent mentor for database job matching, resume review & interview prep</p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              <Cpu className="w-3.5 h-3.5" /> Powered by Gemini 2.5 Flash
            </span>
          </div>

          {/* Suggested Prompts Banner */}
          <div className="py-3 flex flex-wrap gap-2 overflow-x-auto">
            {prompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-colors whitespace-nowrap"
              >
                💡 {p}
              </button>
            ))}
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 glass-card my-2 rounded-2xl">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-amber-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  {/* Render RAG Job Cards if matching jobs returned */}
                  {m.jobs && m.jobs.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                      <p className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" /> Verified PostgreSQL Database Matches ({m.jobs.length})
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {m.jobs.map((j, jidx) => (
                          <div key={jidx} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{j.title} — <span className="text-teal-600 dark:text-teal-400">{j.company}</span></p>
                              <p className="text-[11px] text-slate-500">{j.location} • {j.salary_stipend}</p>
                            </div>
                            <a
                              href={j.url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-teal-500 text-white font-semibold text-[11px] flex items-center gap-1 hover:bg-teal-600"
                            >
                              Apply <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center text-xs text-slate-400 animate-pulse">
                <Bot className="w-5 h-5 text-teal-500" /> Gemini AI Career Assistant is thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2 pt-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Gemini AI Assistant (e.g. 'Find AI internships in Hyderabad' or 'Review my resume skills')..."
              className="flex-1 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3.5 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
};
