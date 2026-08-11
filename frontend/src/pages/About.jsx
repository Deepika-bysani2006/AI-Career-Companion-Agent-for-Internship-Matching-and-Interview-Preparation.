import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ShieldCheck, Cpu, Database, Award, Code2 } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">
            About <span className="bg-gradient-to-r from-teal-600 to-amber-500 bg-clip-text text-transparent">SkillBridge</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            SkillBridge is an advanced AI Internship Application Agent designed to bridge the gap between student competencies and modern tech industry demands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              We empower students, engineering candidates, and early-career developers to automatically optimize their resumes for ATS algorithms, discover real internship postings across top career portals, and prepare with AI-driven mock interviews.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-teal-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Production-Ready Architecture</span>
              </div>
              <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-cyan-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">FastAPI & PyMuPDF NLP AI Pipeline</span>
              </div>
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Neon PostgreSQL Cloud Integration</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl space-y-6">
            <h3 className="text-xl font-bold text-teal-400">Technology Stack</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <p className="font-bold text-amber-400">Frontend</p>
                <p className="text-xs text-slate-300">React.js, Vite, Tailwind CSS, Framer Motion</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <p className="font-bold text-teal-400">Backend</p>
                <p className="text-xs text-slate-300">FastAPI, Python 3.12, Uvicorn</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <p className="font-bold text-cyan-400">Database</p>
                <p className="text-xs text-slate-300">Neon PostgreSQL & SQLAlchemy ORM</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <p className="font-bold text-purple-400">Security</p>
                <p className="text-xs text-slate-300">JWT, Google OAuth, bcrypt Hashing</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
