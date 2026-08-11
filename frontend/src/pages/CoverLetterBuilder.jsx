import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { FileEdit, Sparkles, Copy, Download, Check } from 'lucide-react';
import api from '../utils/axios';

export const CoverLetterBuilder = () => {
  const [companyName, setCompanyName] = useState('IBM');
  const [jobTitle, setJobTitle] = useState('AI Developer Intern');
  const [tone, setTone] = useState('Professional');
  const [content, setContent] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const tones = ['Professional', 'Confident', 'Friendly', 'Formal', 'Student', 'Software Engineer'];

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/cover-letter/generate', {
        company_name: companyName,
        job_title: jobTitle,
        tone: tone
      });
      setContent(res.data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">AI Cover Letter Generator</h1>
            <p className="text-sm text-slate-500 mt-1">Generate tailored cover letters across 6 tone profiles</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Input Options */}
            <div className="glass-card p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Tone Profile</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {tones.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-teal-600 to-amber-500 hover:opacity-95 flex items-center justify-center gap-2"
              >
                {generating ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Sparkles className="w-4 h-4" /> Generate Cover Letter</>}
              </button>
            </div>

            {/* Generated Output Editor */}
            <div className="lg:col-span-2 glass-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Generated Cover Letter Document</h3>
                {content && (
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5"
                  >
                    {copied ? <><Check className="w-3.5 h-3.5 text-teal-500" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Text</>}
                  </button>
                )}
              </div>

              <textarea
                rows="16"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Click 'Generate Cover Letter' to create personalized document..."
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm leading-relaxed outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              ></textarea>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
