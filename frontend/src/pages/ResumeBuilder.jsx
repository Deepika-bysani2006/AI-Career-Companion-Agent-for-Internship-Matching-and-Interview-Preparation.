import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { FileCheck, Download, Sparkles, Layout, Printer, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ResumeBuilder = () => {
  const { user } = useAuth();
  const [template, setTemplate] = useState('Modern');
  const [skillsStr, setSkillsStr] = useState('Python, React.js, FastAPI, PostgreSQL, Tailwind CSS, Docker');
  const [summary, setSummary] = useState('Enthusiastic Computer Science student with hands-on experience building full-stack web applications and AI tools.');

  const templates = ['Modern', 'Professional', 'Minimal', 'Corporate', 'Student', 'Software Engineer'];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">AI Resume Builder & ATS Optimizer</h1>
              <p className="text-sm text-slate-500 mt-1">Generate ATS-ready formatted resumes tailored for target tech roles</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 glass-card hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print / Export PDF
              </button>
            </div>
          </div>

          {/* Template Selection Tabs */}
          <div className="flex flex-wrap gap-2">
            {templates.map((t) => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  template === t
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {t} Template
              </button>
            ))}
          </div>

          {/* Builder Form & Live Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Form Editor */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Resume Information</h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Professional Summary
                </label>
                <textarea
                  rows="3"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Technical Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Live Resume Sheet Preview */}
            <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 min-h-[600px] font-sans">
              <div className="border-b-2 border-slate-900 pb-4 mb-6">
                <h2 className="text-2xl font-extrabold uppercase tracking-tight">{user?.full_name || 'Alex Smith'}</h2>
                <p className="text-xs text-slate-600 font-semibold mt-1">
                  {user?.email} • {user?.phone || '+91 9876543210'} • {user?.college || 'Engineering College'}
                </p>
              </div>

              <div className="space-y-6 text-sm">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-teal-700 border-b border-slate-200 pb-1 mb-2">
                    Professional Summary
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-teal-700 border-b border-slate-200 pb-1 mb-2">
                    Technical Skills
                  </h4>
                  <p className="text-xs text-slate-700">{skillsStr}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-teal-700 border-b border-slate-200 pb-1 mb-2">
                    Featured Project
                  </h4>
                  <p className="font-bold text-xs">SkillBridge AI Internship Application Agent</p>
                  <p className="text-xs text-slate-600">Built full-stack application using React, FastAPI, PostgreSQL, and PyMuPDF resume parsing algorithms.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
