import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Free forever for students. Upgrade for unlimited AI interview evaluations and automated cover letter exports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="glass-card p-8 border-2 border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Student Free</h3>
            <p className="text-sm text-slate-500 mt-1">Essential tools for landing your first internship.</p>
            <div className="my-6">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">₹0</span>
              <span className="text-slate-500">/forever</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 mb-8">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-500" /> Resume Upload & ATS Score</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-500" /> AI Job Search (300+ listings)</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-500" /> 3 AI Cover Letters / month</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-500" /> 2 Mock Interview sessions</li>
            </ul>
            <Link to="/register" className="block text-center w-full py-3 rounded-xl font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-white dark:bg-slate-800 dark:hover:bg-slate-700">
              Get Started Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="glass-card p-8 border-2 border-teal-500 relative">
            <span className="absolute -top-3 right-6 px-3 py-1 bg-gradient-to-r from-teal-600 to-amber-500 text-white font-bold text-xs rounded-full">
              POPULAR
            </span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Career Booster Pro</h3>
            <p className="text-sm text-slate-500 mt-1">Unlimited AI agents, custom roadmaps, and interview practice.</p>
            <div className="my-6">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">₹499</span>
              <span className="text-slate-500">/month</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 mb-8">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-500" /> Everything in Student Free</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-500" /> Unlimited Cover Letter Generations</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-500" /> Unlimited Mock Interview Sessions</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-500" /> 24/7 AI Career Assistant RAG Chat</li>
            </ul>
            <Link to="/register" className="block text-center w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-teal-600 to-amber-500 hover:opacity-95 shadow-lg">
              Start 14-Day Trial
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
