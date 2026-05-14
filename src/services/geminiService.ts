import { GoogleGenAI, Type } from "@google/genai";

let genAI: GoogleGenAI | null = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please set it in your environment variables on Vercel.");
    }
    genAI = new GoogleGenAI(apiKey);
  }
  return genAI;
};

export interface AssessmentResult {
  overallScore: number;
  subScores: {
    technical: number;
    resume: number;
    portfolio: number;
    communication: number;
  };
  feedback: {
    strengths: string[];
    weaknesses: string[];
  };
  roadmap: {
    immediate: string[];
    longTerm: string[];
  };
}

export const analyzeReadiness = async (
  role: string,
  resumeText: string,
  portfolioUrl: string,
  answers: { question: string; answer: string }[]
): Promise<AssessmentResult> => {
  const ai = getGenAI();
  const prompt = `
    Analyze the following candidate data for the role of ${role}.
    
    Resume Info: ${resumeText}
    Portfolio: ${portfolioUrl}
    Assessment Answers:
    ${answers.map((a) => `Q: ${a.question}\nA: ${a.answer}`).join("\n")}

    Based on this, provide an overall "Interview Readiness Score" (0-100) and detailed feedback.
    Be objective and critical as a recruiter from a top tech company.
  `;

  const model = ai.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.INTEGER },
          subScores: {
            type: Type.OBJECT,
            properties: {
              technical: { type: Type.INTEGER },
              resume: { type: Type.INTEGER },
              portfolio: { type: Type.INTEGER },
              communication: { type: Type.INTEGER },
            },
            required: ["technical", "resume", "portfolio", "communication"],
          },
          feedback: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["strengths", "weaknesses"],
          },
          roadmap: {
            type: Type.OBJECT,
            properties: {
              immediate: { type: Type.ARRAY, items: { type: Type.STRING } },
              longTerm: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["immediate", "longTerm"],
          },
        },
        required: ["overallScore", "subScores", "feedback", "roadmap"],
      },
    },
  });

  return JSON.parse(result.response.text());
};

export const generateQuestions = async (role: string, level: string = "Junior") => {
  const ai = getGenAI();
  const prompt = `Generate exactly 5 interview questions for the role of ${role} at ${level} level. 
  MANDATORY STRUCTURE:
  - 3 questions must be 'SUBJECTIVE' (open-ended technical or situational).
  - 2 questions must be 'MCQ' (multiple choice with 4 options).
  
  Keep them challenging. Subjective questions should be answerable in 1-2 sentences.
  Each question should target a different skill (e.g. logic, framework, system design, soft skills, portfolio).`;

  const model = ai.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            type: { type: Type.STRING, enum: ["SUBJECTIVE", "MCQ"] },
            skill: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Only provide for MCQ type"
            },
          },
          required: ["id", "type", "skill", "question"],
        },
      },
    },
  });

  return JSON.parse(result.response.text());
};
