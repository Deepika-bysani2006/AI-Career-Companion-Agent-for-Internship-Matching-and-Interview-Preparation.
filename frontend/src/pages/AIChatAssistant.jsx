import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { MessageSquareCode, Send, Sparkles, User, Bot, Copy, Check, Plus, Trash2 } from 'lucide-react';
import api from '../utils/axios';

export const AIChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      content: 'Hello! I am your **SkillBridge AI Career Assistant**. Ask me anything about resume ATS optimization, IBM or Google internship recommendations, cover letter tips, or technical interview concepts!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await api.get('/chat/prompts');
        setPrompts(res.data);
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

    try {
      const res = await api.post('/chat', {
        session_id: sessionId,
        message: query
      });
      setSessionId(res.data.session_id);
      setMessages((prev) => [...prev, { sender: 'ai', content: res.data.message }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'ai', content: "Sorry, I encountered an error connecting to the AI backend." }]);
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
                <Sparkles className="w-5 h-5 text-amber-500" /> AI RAG Career Assistant
              </h1>
              <p className="text-xs text-slate-500">24/7 intelligent career mentor for resume review and interview guidance</p>
            </div>
          </div>

          {/* Suggested Prompts Banner */}
          <div className="py-3 flex flex-wrap gap-2 overflow-x-auto">
            {prompts.slice(0, 3).map((p, idx) => (
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
                  className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center text-xs text-slate-400 animate-pulse">
                <Bot className="w-5 h-5 text-teal-500" /> AI Career Assistant is thinking...
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
              placeholder="Ask AI Career Assistant (e.g. 'How can I optimize my ATS score for IBM?')..."
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
