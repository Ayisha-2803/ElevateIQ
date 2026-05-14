import { motion } from "motion/react";
import { Briefcase, Zap, ShieldCheck, Sparkles, Play } from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090b]">
      {/* Header */}
      <header className="h-[72px] border-bottom border-[#27272a] flex items-center justify-between px-10 border-b">
        <div className="flex items-center gap-2">
          <div className="serif italic text-2xl font-bold tracking-tighter">ElevateIQ.</div>
        </div>
        <div className="flex items-center gap-5">
          <div className="badge">Secured Access</div>
        </div>
      </header>

      {/* Main Split Section */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px]">
        {/* Left Pane */}
        <div className="p-10 md:p-24 flex flex-col justify-center border-r border-[#27272a]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 id="hero-title" className="serif text-6xl md:text-8xl leading-[0.9] mb-8 tracking-tighter">
              The Approach<br />That Wins.
            </h1>
            
            <p className="text-xl text-[#a1a1aa] max-w-[500px] mb-4 leading-relaxed italic border-l-2 border-white/10 pl-6 py-2">
              “Know if you’re truly interview-ready.”
            </p>

            <p className="text-sm text-[#71717a] max-w-[400px] mb-12 leading-relaxed font-mono uppercase tracking-tight">
              A clean, structured, and performant AI solution designed to audit your profile in under 2 minutes.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                id="start-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStart}
                className="btn-primary"
              >
                Begin Audit
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Right Pane */}
        <div className="hidden lg:flex flex-col p-12 bg-[#09090b]">
          <div className="text-[11px] uppercase tracking-[2px] font-bold text-[#71717a] mb-6">Auditor Insights</div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="stat-card mb-4"
          >
            <span className="text-xs text-[#71717a] block mb-1">Efficiency Increase</span>
            <span className="text-2xl font-medium">+42.8%</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="stat-card"
          >
            <span className="text-xs text-[#71717a] block mb-1">Success Precision</span>
            <span className="text-2xl font-medium">98/100</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-[11px] uppercase tracking-[2px] font-bold text-[#71717a] mt-12 mb-6">Internal Architecture</div>
            <p className="text-sm text-[#a1a1aa] leading-relaxed mb-6">
              Modular AI micro-assessment using adaptive questions and semantic resume analysis.
            </p>
            
            <div className="flex flex-wrap gap-2">
              {['Gemini 3.0', 'React 19', 'TypeScript', 'Motion', 'Tailwind'].map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.05 }}
                  className="text-[11px] bg-[#27272a] px-2 py-1 rounded-sm text-[#a1a1aa]"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="text-[11px] uppercase tracking-[2px] font-bold text-[#71717a] mt-12 mb-6">Status Checks</div>
            <div className="space-y-3">
              {[
                "Public GitHub Repo Verified",
                "README Documentation Finalized",
                "Live Demo Environment Stable"
              ].map((check, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  {check}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="h-[64px] border-t border-[#27272a] flex items-center justify-between px-10 text-xs text-[#52525b]">
        <div>Built with Winner's Mindset</div>
      </footer>
    </div>
  );
}
