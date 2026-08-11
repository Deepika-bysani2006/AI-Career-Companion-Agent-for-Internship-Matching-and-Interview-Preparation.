import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PlatformBadge } from '../components/PlatformBadge';
import { Sparkles, ArrowRight, CheckCircle, ShieldCheck, Zap, Bot, Cpu, Rocket } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-teal-500/20 via-cyan-500/20 to-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 text-xs font-bold text-teal-700 dark:text-teal-300 mb-8 animate-bounce">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>SkillBridge – AI Internship Application Agent</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Connecting <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-amber-500 bg-clip-text text-transparent">Skills</span> to <span className="bg-gradient-to-r from-amber-500 via-teal-600 to-cyan-600 bg-clip-text text-transparent">Opportunities</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Upload your resume, analyze your ATS score, discover top-matched internships across LinkedIn, Naukri, Unstop & Internshala, and prepare with AI Mock Interviews.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-teal-600 via-cyan-600 to-amber-500 hover:opacity-95 shadow-xl shadow-teal-500/20 transition-all flex items-center justify-center gap-2 group hover:scale-[1.02]"
            >
              Start Free AI Career Setup
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/features"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 glass-card hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              Explore AI Features
            </Link>
          </div>

          {/* Supported Platforms Banner */}
          <div className="mt-16 pt-8 border-t border-slate-200/80 dark:border-slate-800/80">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
              AI Job Matcher Aggregates Listings From Top Platforms
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <PlatformBadge platform="LinkedIn" />
              <PlatformBadge platform="Naukri" />
              <PlatformBadge platform="Unstop" />
              <PlatformBadge platform="Internshala" />
              <PlatformBadge platform="Indeed" />
              <PlatformBadge platform="Google" />
              <PlatformBadge platform="Microsoft" />
              <PlatformBadge platform="IBM" />
              <PlatformBadge platform="Amazon" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 bg-slate-100/60 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              End-to-End AI Internship Suite
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">
              Everything you need to stand out, pass ATS filters, and land software engineering and AI internships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 hover:border-teal-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Resume Parser & ATS Score</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Extract skills, projects, and education from PDF/DOCX resumes. Get instant ATS scores with strengths, weaknesses, and improvement tips.
              </p>
            </div>

            <div className="glass-card p-8 hover:border-cyan-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-6">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Compatibility Job Matching</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Automatically compare your candidate profile against 300+ internships. View percentage match scores and missing skill alerts.
              </p>
            </div>

            <div className="glass-card p-8 hover:border-amber-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Cover Letters & Mock Prep</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Generate 6-tone customized cover letters and practice company-specific mock interviews for IBM, Google, Microsoft, and Amazon.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
