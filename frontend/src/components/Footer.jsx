import React from 'react';
import { Link } from 'react-router-dom';
import { PlatformBadge } from './PlatformBadge';

export const Footer = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-amber-400 flex items-center justify-center text-slate-950 font-black text-lg">
                SB
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                SkillBridge
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Connecting Skills to Opportunities. Production-ready AI Internship Application Agent powered by FastAPI, React, PostgreSQL, and NLP.
            </p>
          </div>

          {/* Column 2: Supported Job Sources */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Supported Sources</h4>
            <div className="flex flex-wrap gap-2">
              <PlatformBadge platform="LinkedIn" />
              <PlatformBadge platform="Naukri" />
              <PlatformBadge platform="Unstop" />
              <PlatformBadge platform="Internshala" />
              <PlatformBadge platform="Google" />
              <PlatformBadge platform="Microsoft" />
              <PlatformBadge platform="IBM" />
              <PlatformBadge platform="Amazon" />
            </div>
          </div>

          {/* Column 3: Quick Navigation Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-teal-400 transition-colors">About SkillBridge</Link></li>
              <li><Link to="/features" className="hover:text-teal-400 transition-colors">Features & Modules</Link></li>
              <li><Link to="/pricing" className="hover:text-teal-400 transition-colors">Pricing Plans</Link></li>
              <li><Link to="/jobs" className="hover:text-teal-400 transition-colors">AI Job Search</Link></li>
              <li><Link to="/login" className="hover:text-teal-400 transition-colors">Student Login</Link></li>
            </ul>
          </div>

          {/* Column 4: Technology Stack */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Tech Architecture</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Frontend: React 18, Vite, Tailwind CSS</li>
              <li>• Backend: FastAPI, Python 3.12</li>
              <li>• Database: Neon PostgreSQL & Docker</li>
              <li>• Security: JWT, Google OAuth, bcrypt</li>
              <li>• AI/NLP: Sentence Transformers, PyMuPDF</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SkillBridge – AI Internship Application Agent. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://github.com/Deepika-bysani2006/SkillBridge-AI-Internship-Agent.git" target="_blank" rel="noreferrer" className="hover:text-teal-400">GitHub Repository</a>
            <a href="/docs" className="hover:text-teal-400">API Docs</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
