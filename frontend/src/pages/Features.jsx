import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FileUp, Search, FileEdit, Video, MessageSquare, Shield, Target, Map } from 'lucide-react';

export const Features = () => {
  const modules = [
    { title: 'Resume Upload & Parsing', desc: 'PDF & DOCX parsing using PyMuPDF and regex entity recognition.', icon: FileUp, color: 'text-teal-500' },
    { title: 'ATS Compatibility Scorer', desc: 'Evaluates resume structure, formatting density, and keyword match scores.', icon: Target, color: 'text-amber-500' },
    { title: 'AI Job Search Engine', desc: 'Aggregates 300+ listings across LinkedIn, Naukri, Unstop, Internshala, and Indeed.', icon: Search, color: 'text-cyan-500' },
    { title: 'AI Cover Letter Generator', desc: 'Creates customized cover letters in 6 tones (Professional, Confident, Student, etc.).', icon: FileEdit, color: 'text-purple-500' },
    { title: 'Interactive Mock Interview', desc: 'Simulates technical and HR interview rounds with company question banks.', icon: Video, color: 'text-rose-500' },
    { title: '4-Week Learning Roadmap', desc: 'Generates step-by-step weekly plans to cover missing job skill requirements.', icon: Map, color: 'text-emerald-500' },
    { title: 'RAG AI Career Assistant', desc: 'ChatGPT-style chat assistant for instant resume reviews and career guidance.', icon: MessageSquare, color: 'text-indigo-500' },
    { title: 'Role-Based Admin Panel', desc: 'Full administration dashboard to manage users, jobs, companies, and system audit logs.', icon: Shield, color: 'text-blue-500' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">
            AI Platform Features
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Explore the comprehensive tools built into SkillBridge to streamline your internship application workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} className="glass-card p-6 hover:scale-[1.02] transition-all">
                <Icon className={`w-8 h-8 ${m.color} mb-4`} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{m.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};
