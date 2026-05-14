import { useState, useRef, ChangeEvent } from "react";
import { motion } from "motion/react";
import { ArrowRight, FileText, Globe, User, Upload, CheckCircle2, Loader2, X } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface SetupProps {
  onComplete: (data: SetupData) => void;
}

export interface SetupData {
  role: string;
  resumeText: string;
  portfolioUrl: string;
}

export default function Setup({ onComplete }: SetupProps) {
  const [data, setData] = useState<SetupData>({
    role: "",
    resumeText: "",
    portfolioUrl: "",
  });

  const [step, setStep] = useState(1);
  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const roles = [
    "Frontend Engineer", "Backend Engineer", "Fullstack Developer", 
    "Product Designer", "Data Scientist", "Mobile Developer", 
    "Product Manager"
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onComplete(data);
  };

  const extractTextFromPdf = async (file: File) => {
    setIsParsing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + "\n";
      }
      
      setData({ ...data, resumeText: fullText });
      setFileName(file.name);
    } catch (error) {
      console.error("PDF Parsing Error:", error);
      alert("Failed to parse PDF. Please try again or use plain text.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        extractTextFromPdf(file);
      } else {
        alert("Please upload a PDF file for audit precision.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-xl p-10 relative overflow-hidden"
      >
        <div className="scan-line" />
        
        <div className="flex justify-between items-center mb-12">
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-[2px] w-12 transition-all duration-500 ${
                  s <= step ? "bg-white" : "bg-white/10"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-widest">Entry Phase 0{step}</span>
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="serif text-3xl mb-2">Select Your Target Role</h2>
            <p className="text-[#a1a1aa] text-sm mb-8">Role-specific analysis requires a clear target.</p>
            <div className="grid grid-cols-1 gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setData({ ...data, role })}
                  className={`p-4 text-left transition-all border text-sm uppercase tracking-wider font-medium ${
                    data.role === role 
                      ? "bg-white text-[#09090b] border-white" 
                      : "bg-[#18181b] border-[#27272a] text-[#a1a1aa] hover:border-zinc-600"
                  }`}
                >
                  {role}
                </button>
              ))}
              <input
                type="text"
                placeholder="Custom Role..."
                className="input-field mt-2"
                value={data.role && !roles.includes(data.role) ? data.role : ""}
                onChange={(e) => setData({ ...data, role: e.target.value })}
              />
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="serif text-3xl mb-2">Resume Submission</h2>
            <p className="text-[#a1a1aa] text-sm mb-8">Upload your resume for a structural and semantic audit.</p>
            
            {!fileName && !isParsing ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group border-2 border-dashed border-[#27272a] hover:border-zinc-500 transition-all cursor-pointer p-12 text-center flex flex-col items-center gap-4 bg-[#18181b]/50"
              >
                <div className="w-16 h-16 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="text-[#71717a] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-widest mb-1">Click to Upload PDF</p>
                  <p className="text-xs text-[#71717a]">Maximum precision audit via PDF analysis</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="application/pdf"
                  onChange={handleFileUpload}
                />
              </div>
            ) : isParsing ? (
              <div className="h-48 flex flex-col items-center justify-center bg-[#18181b] border border-[#27272a]">
                <Loader2 className="animate-spin text-white mb-4" />
                <p className="text-xs font-mono text-[#71717a] animate-pulse uppercase tracking-[0.2em]">Extracting Document Data...</p>
              </div>
            ) : (
              <div className="p-8 border border-emerald-500/30 bg-emerald-500/5 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="text-emerald-500 mb-4" size={48} />
                <h3 className="font-bold text-lg mb-1">{fileName}</h3>
                <p className="text-xs text-[#71717a] mb-6">Resume successfully synthesized for auditing.</p>
                <button 
                  onClick={() => { setFileName(null); setData({ ...data, resumeText: "" }); }}
                  className="text-[10px] uppercase tracking-widest text-[#71717a] hover:text-white transition-colors"
                >
                  Remove & Re-upload
                </button>
              </div>
            )}

            <div className="mt-8 flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-[#27272a]" />
              <span className="text-[10px] font-mono text-[#52525b] uppercase tracking-widest">Or Manual entry</span>
              <div className="h-[1px] flex-1 bg-[#27272a]" />
            </div>

            <textarea
              className="input-field w-full h-32 resize-none font-mono text-[10px] mt-6"
              placeholder="Or paste plain text here..."
              value={data.resumeText}
              onChange={(e) => setData({ ...data, resumeText: e.target.value })}
            />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="serif text-3xl mb-2">Professional Profile</h2>
            <p className="text-[#a1a1aa] text-sm mb-8">Portfolio or LinkedIn for comprehensive auditing.</p>
            <input
              type="url"
              className="input-field w-full"
              placeholder="https://..."
              value={data.portfolioUrl}
              onChange={(e) => setData({ ...data, portfolioUrl: e.target.value })}
            />
          </motion.div>
        )}

        <div className="flex justify-between mt-12 pt-8 border-t border-[#27272a]">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="btn-secondary"
            >
              Back
            </button>
          ) : <div />}
          <button
            onClick={handleNext}
            disabled={step === 1 && !data.role || step === 2 && !data.resumeText || isParsing}
            className="btn-primary"
          >
            {step === 3 ? "Process Profile" : "Next Phase"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
