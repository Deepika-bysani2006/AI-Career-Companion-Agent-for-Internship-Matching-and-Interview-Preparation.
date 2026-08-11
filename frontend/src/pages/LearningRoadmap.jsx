import React from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { Map, Clock, BookOpen, CheckCircle } from 'lucide-react';

export const LearningRoadmap = () => {
  const weeks = [
    {
      week: 1,
      title: 'Foundations of Docker Containerization',
      desc: 'Master container environments, Dockerfiles, and multi-container orchestration with Docker Compose.',
      hours: 8,
      topics: ['Docker Engine & Images', 'Building custom Dockerfiles', 'Docker Compose YAML configuration']
    },
    {
      week: 2,
      title: 'Redis Caching & Key-Value Stores',
      desc: 'Implement high-speed in-memory caching layers in FastAPI endpoints to reduce PostgreSQL latency.',
      hours: 10,
      topics: ['Redis Data Structures', 'Cache expiration policies', 'Celery Task Queue Integration']
    },
    {
      week: 3,
      title: 'AWS Cloud Services & Deployment',
      desc: 'Deploy full-stack applications using AWS EC2, S3 bucket storage, and NGINX reverse proxies.',
      hours: 12,
      topics: ['EC2 Instance launch', 'S3 file uploads', 'SSL certificate configuration with Certbot']
    },
    {
      week: 4,
      title: 'System Design & Portfolio Capstone',
      desc: 'Synthesize microservices architecture, prepare mock technical interviews, and publish live project.',
      hours: 6,
      topics: ['REST vs gRPC architecture', 'Database indexing & sharding', 'AI Mock Interview simulation']
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Personalized 4-Week Learning Roadmap</h1>
            <p className="text-sm text-slate-500 mt-1">Targeted skill development roadmap based on missing skills detected in job matches</p>
          </div>

          <div className="space-y-6 relative border-l-2 border-teal-500/30 ml-4 pl-6">
            {weeks.map((w) => (
              <div key={w.week} className="glass-card p-6 relative">
                <div className="absolute -left-[35px] top-6 w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center border-4 border-slate-50 dark:border-slate-950 shadow-md">
                  W{w.week}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{w.title}</h3>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200">
                    <Clock className="w-3.5 h-3.5" /> ~{w.hours} Hours
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{w.desc}</p>

                <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {w.topics.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-500" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
