import React from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { Target, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SkillGapAnalysis = () => {
  const verifiedSkills = ['Python', 'FastAPI', 'React', 'SQL', 'Git', 'Tailwind CSS'];
  const missingSkills = ['Docker', 'AWS Cloud', 'Redis Caching', 'System Design'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">AI Skill Gap Analysis</h1>
            <p className="text-sm text-slate-500 mt-1">Comparison between your current resume skills and top IBM/Google internship requirements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-6 space-y-4 border-l-4 border-teal-500">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-500" /> Verified Candidate Competencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {verifiedSkills.map((s, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 space-y-4 border-l-4 border-amber-500">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" /> High-Priority Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((s, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200">
                    {s}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link to="/roadmap" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-amber-500 shadow">
                  Generate 4-Week Roadmap <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
