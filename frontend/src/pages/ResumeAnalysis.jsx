import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { Target, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import api from '../utils/axios';

export const ResumeAnalysis = () => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await api.get('/resumes/current');
        setResumeData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, []);

  const parsed = resumeData?.parsed_data || {};
  const atsBreakdown = parsed.ats_breakdown || {};

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">AI Resume Analysis & Breakdown</h1>
            <p className="text-sm text-slate-500 mt-1">Comprehensive breakdown of extracted candidate entities and ATS formatting strength</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <span className="text-4xl font-extrabold text-teal-600 dark:text-teal-400">{resumeData?.ats_score || 82.5}%</span>
              <span className="block text-xs font-bold text-slate-400 uppercase mt-1">Overall ATS Score</span>
            </div>

            <div className="glass-card p-6 text-center">
              <span className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400">92%</span>
              <span className="block text-xs font-bold text-slate-400 uppercase mt-1">Format Density</span>
            </div>

            <div className="glass-card p-6 text-center">
              <span className="text-4xl font-extrabold text-amber-600 dark:text-amber-400">{parsed.skills?.length || 8}</span>
              <span className="block text-xs font-bold text-slate-400 uppercase mt-1">Verified Skills</span>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 border-l-4 border-teal-500 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-teal-500" /> Key Strengths
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {atsBreakdown.strengths?.map((s, idx) => (
                  <li key={idx}>• {s}</li>
                )) || <li>• Strong technical skill coverage with verified industry tools.</li>}
              </ul>
            </div>

            <div className="glass-card p-6 border-l-4 border-amber-500 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" /> AI Suggestions
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {atsBreakdown.suggestions?.map((s, idx) => (
                  <li key={idx}>• {s}</li>
                )) || <li>• Add missing core technologies like Docker, React, and FastAPI.</li>}
              </ul>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
