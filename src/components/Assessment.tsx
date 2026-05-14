import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { generateQuestions } from "../services/geminiService";
import { Brain, ArrowRight, Loader2 } from "lucide-react";

interface AssessmentProps {
  role: string;
  onComplete: (answers: { question: string; answer: string }[]) => void;
}

interface Question {
  id: number;
  type: "SUBJECTIVE" | "MCQ";
  skill: string;
  question: string;
  options?: string[];
}

export default function Assessment({ role, onComplete }: AssessmentProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const q = await generateQuestions(role);
        setQuestions(q);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [role]);

  const handleNext = () => {
    const newAnswers = [...answers, { question: questions[currentIdx].question, answer: currentAnswer }];
    setAnswers(newAnswers);
    setCurrentAnswer("");

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b]">
        <Loader2 className="text-white animate-spin mb-6" size={40} />
        <p className="text-[#a1a1aa] font-mono tracking-[0.3em] uppercase text-[10px]">Assembling Adaptive Audit...</p>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-12 flex justify-between items-end border-b border-[#27272a] pb-6">
          <div>
            <h1 className="text-[#71717a] font-mono text-[10px] uppercase tracking-[0.2em] mb-4">Phase Assessment // Protocol 104</h1>
            <h2 className="serif text-4xl">{currentQ.skill} {currentQ.type === 'MCQ' ? 'Assessment' : 'Logic'}</h2>
          </div>
          <div className="text-right">
            <span className="text-white font-mono text-xl">{currentIdx + 1}</span>
            <span className="text-[#71717a] font-mono text-xl"> : {questions.length}</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="glass-card p-10"
          >
            <p className="text-2xl mb-12 leading-tight serif italic">
              "{currentQ.question}"
            </p>

            {currentQ.type === "MCQ" ? (
              <div className="grid grid-cols-1 gap-3">
                {currentQ.options?.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentAnswer(option)}
                    className={`p-4 text-left border transition-all text-sm uppercase tracking-wider font-medium ${
                      currentAnswer === option
                        ? "bg-white text-[#09090b] border-white"
                        : "bg-[#18181b] border-[#27272a] text-[#a1a1aa] hover:border-zinc-600"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <textarea
                autoFocus
                className="input-field w-full h-40 resize-none text-lg font-light leading-relaxed"
                placeholder="Synthesize your response..."
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && currentAnswer.trim()) {
                    e.preventDefault();
                    handleNext();
                  }
                }}
              />
            )}

            <div className="flex justify-end mt-10 pt-8 border-t border-[#27272a]">
              <button
                onClick={handleNext}
                disabled={!currentAnswer.trim()}
                className="btn-primary"
              >
                Next Segment
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-16 flex items-center justify-between text-[#52525b]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest">Active Monitoring</span>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em]">Semantic Analysis Active</p>
        </div>
      </div>
    </div>
  );
}
