/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Landing from "./components/Landing";
import Setup, { SetupData } from "./components/Setup";
import Assessment from "./components/Assessment";
import Result from "./components/Result";
import { analyzeReadiness, AssessmentResult } from "./services/geminiService";
import { Loader2 } from "lucide-react";

enum AppState {
  LANDING = "LANDING",
  SETUP = "SETUP",
  ASSESSMENT = "ASSESSMENT",
  ANALYZING = "ANALYZING",
  RESULT = "RESULT",
}

export default function App() {
  const [state, setState] = useState<AppState>(AppState.LANDING);
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const startSetup = () => setState(AppState.SETUP);

  const completeSetup = (data: SetupData) => {
    setSetupData(data);
    setState(AppState.ASSESSMENT);
  };

  const completeAssessment = async (answers: { question: string; answer: string }[]) => {
    setAssessmentAnswers(answers);
    setState(AppState.ANALYZING);

    try {
      if (setupData) {
        const analysis = await analyzeReadiness(
          setupData.role,
          setupData.resumeText,
          setupData.portfolioUrl,
          answers
        );
        setResult(analysis);
        setState(AppState.RESULT);
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      // Fallback or error state
      alert("Analysis failed. Please try again.");
      setState(AppState.LANDING);
    }
  };

  const reset = () => {
    setSetupData(null);
    setAssessmentAnswers([]);
    setResult(null);
    setState(AppState.LANDING);
  };

  return (
    <div className="bg-[#050505] text-[#FAFAFA] min-h-screen">
      <AnimatePresence mode="wait">
        {state === AppState.LANDING && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Landing onStart={startSetup} />
          </motion.div>
        )}

        {state === AppState.SETUP && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Setup onComplete={completeSetup} />
          </motion.div>
        )}

        {state === AppState.ASSESSMENT && setupData && (
          <motion.div
            key="assessment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Assessment role={setupData.role} onComplete={completeAssessment} />
          </motion.div>
        )}

        {state === AppState.ANALYZING && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center technical-grid"
          >
            <div className="relative">
              <Loader2 className="text-[#F27D26] animate-spin mb-8" size={60} />
              <div className="absolute inset-0 bg-[#F27D26] blur-[40px] opacity-20 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Analyzing Performance</h2>
            <p className="text-white/40 font-mono text-sm tracking-widest uppercase">
              Recruiter Brain Engaging...
            </p>
            <div className="w-64 h-1 bg-white/5 rounded-full mt-8 overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-full h-full bg-[#F27D26]"
              />
            </div>
          </motion.div>
        )}

        {state === AppState.RESULT && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Result result={result} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Branding Footer */}
      <footer className="fixed bottom-6 left-6 z-50 pointer-events-none opacity-20 hidden md:block">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase">
          ElevateIQ // Secure Audit Protocol V1.0.4
        </div>
      </footer>
    </div>
  );
}

