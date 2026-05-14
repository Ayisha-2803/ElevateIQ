import { motion } from "motion/react";
import { AssessmentResult } from "../services/geminiService";
import { Trophy, TrendingUp, AlertCircle, CheckCircle2, RotateCcw, Share2 } from "lucide-react";

interface ResultProps {
  result: AssessmentResult;
  onReset: () => void;
}

export default function Result({ result, onReset }: ResultProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-yellow-400";
    return "text-rose-400";
  };

  const scoreColor = getScoreColor(result.overallScore);

  return (
    <div className="min-h-screen py-20 px-4 bg-[#09090b]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 mb-8 relative"
        >
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="92"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="transparent"
                  className="text-white/5"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="92"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={578}
                  initial={{ strokeDashoffset: 578 }}
                  animate={{ strokeDashoffset: 578 - (578 * result.overallScore) / 100 }}
                  transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                  className="text-white"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="serif text-7xl font-bold tracking-tighter">{result.overallScore}</span>
                <span className="text-[#71717a] text-[10px] font-mono uppercase tracking-widest">Readiness Index</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="badge mb-4">Audit Complete</div>
              <h1 className="serif text-5xl mb-4 leading-tight">Your Interview<br />Readiness.</h1>
              <p className="text-[#a1a1aa] text-lg leading-relaxed mb-6 font-light">
                Profile categorization: <span className="text-white font-medium">{result.overallScore >= 80 ? "Tier 1: High Hireability" : result.overallScore >= 60 ? "Tier 2: Competent" : "Tier 3: Developmental"}</span>
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(result.subScores).map(([key, val]) => (
                  <div key={key} className="stat-card !p-4">
                    <div className="text-[10px] text-[#71717a] uppercase font-mono mb-1 tracking-wider">{key}</div>
                    <div className="text-xl font-bold">{val}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="stat-card"
          >
            <h3 className="section-title !mb-6 text-emerald-500">Institutional Strengths</h3>
            <ul className="space-y-4">
              {result.feedback.strengths.map((s, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex gap-4 text-sm text-[#a1a1aa] leading-relaxed"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  {s}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="stat-card"
          >
            <h3 className="section-title !mb-6 text-rose-500">Critical Gaps Detected</h3>
            <ul className="space-y-4">
              {result.feedback.weaknesses.map((w, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex gap-4 text-sm text-[#a1a1aa] leading-relaxed"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                  {w}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-10 mb-12 border-t-4 border-t-white"
        >
          <h3 className="serif text-3xl mb-10">Strategic Growth Roadmap</h3>
          
          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 rounded-none border border-white flex items-center justify-center font-mono text-xs">01</div>
                <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-white">Immediate Mitigation (7 Days)</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-12">
                {result.roadmap.immediate.map((item, i) => (
                  <div key={i} className="bg-[#18181b] p-5 border border-[#27272a] text-sm text-[#a1a1aa] leading-relaxed">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 rounded-none border border-zinc-700 flex items-center justify-center font-mono text-xs text-zinc-500">02</div>
                <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500">Long-Term Skill Synthesis</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-12">
                {result.roadmap.longTerm.map((item, i) => (
                  <div key={i} className="bg-[#18181b] p-5 border border-[#27272a] text-sm text-zinc-600 leading-relaxed">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-center border-t border-[#27272a] pt-12">
          <button
            onClick={onReset}
            className="btn-secondary"
          >
            Reset Auditor
          </button>
          <button className="btn-primary">
            Export Report (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
