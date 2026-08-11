import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { Video, Sparkles, HelpCircle, CheckCircle2, Award, Clock, Send, ChevronRight } from 'lucide-react';
import api from '../utils/axios';

export const InterviewPrep = () => {
  const [company, setCompany] = useState('IBM');
  const [interviewType, setInterviewType] = useState('Technical');
  const [session, setSession] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const companies = ['IBM', 'Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS', 'Oracle', 'NVIDIA'];
  const types = ['Technical', 'HR', 'Behavioral', 'System Design', 'Coding'];

  const handleStartSession = async () => {
    try {
      const res = await api.post('/interviews/start', {
        company_name: company,
        job_title: `${company} AI Developer Intern`,
        interview_type: interviewType
      });
      setSession(res.data);
      setCurrentIndex(0);
      setFeedback(null);
      setAnswer('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!answer.strip?.() && !answer) return;
    setEvaluating(true);
    const q = session.questions[currentIndex];
    try {
      const res = await api.post('/interviews/evaluate-answer', {
        question: q.question,
        answer: answer,
        interview_type: interviewType
      });
      setFeedback(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < session.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setFeedback(null);
      setAnswer('');
      setShowHint(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">AI Mock Interview Simulator</h1>
            <p className="text-sm text-slate-500 mt-1">Practice company-specific technical & HR interview rounds with real-time feedback</p>
          </div>

          {!session ? (
            /* Setup Session Box */
            <div className="glass-card p-8 max-w-xl mx-auto space-y-6">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center mx-auto mb-3">
                  <Video className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Configure Practice Session</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Target Company</label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none"
                >
                  {companies.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Interview Round</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none"
                >
                  {types.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <button
                onClick={handleStartSession}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-teal-600 to-amber-500 hover:opacity-95 flex items-center justify-center gap-2 shadow-lg"
              >
                <Sparkles className="w-5 h-5" /> Start Interactive Session
              </button>
            </div>
          ) : (
            /* Active Question Screen */
            <div className="space-y-6">
              <div className="flex items-center justify-between glass-card p-4">
                <span className="text-xs font-bold uppercase text-teal-600 dark:text-teal-400">
                  {company} • {interviewType} Round (Question {currentIndex + 1} of {session.questions.length})
                </span>
                <button
                  onClick={() => setSession(null)}
                  className="text-xs font-bold text-rose-500 hover:underline"
                >
                  End Session
                </button>
              </div>

              <div className="glass-card p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {session.questions[currentIndex]?.question}
                </h3>

                {session.questions[currentIndex]?.hint && (
                  <div>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" /> {showHint ? 'Hide Hint' : 'Need a Hint?'}
                    </button>
                    {showHint && (
                      <p className="mt-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200">
                        💡 {session.questions[currentIndex].hint}
                      </p>
                    )}
                  </div>
                )}

                <textarea
                  rows="6"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type or dictate your technical response here..."
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>

                <div className="flex gap-3">
                  <button
                    onClick={handleEvaluateAnswer}
                    disabled={evaluating || !answer}
                    className="px-6 py-2.5 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 text-sm flex items-center gap-2"
                  >
                    {evaluating ? 'Analyzing Answer...' : <><Send className="w-4 h-4" /> Submit & Score Answer</>}
                  </button>

                  {currentIndex < session.questions.length - 1 && (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-sm flex items-center gap-1"
                    >
                      Next Question <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Feedback Evaluation Report Card */}
              {feedback && (
                <div className="glass-card p-6 border-l-4 border-teal-500 space-y-4 animate-in fade-in">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-teal-500" /> AI Evaluation Feedback
                  </h4>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
                      <span className="text-2xl font-extrabold text-teal-600">{feedback.overall_score}%</span>
                      <span className="block text-[10px] font-bold uppercase text-slate-400">Overall</span>
                    </div>
                    <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800">
                      <span className="text-2xl font-extrabold text-cyan-600">{feedback.accuracy_score}%</span>
                      <span className="block text-[10px] font-bold uppercase text-slate-400">Accuracy</span>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800">
                      <span className="text-2xl font-extrabold text-amber-600">{feedback.confidence_score}%</span>
                      <span className="block text-[10px] font-bold uppercase text-slate-400">Confidence</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    💡 <span className="font-bold">Tip to Improve:</span> {feedback.improvement_tip}
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};
