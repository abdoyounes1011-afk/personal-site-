import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type LectureMode = 'tables' | 'qa' | 'zaytouna' | 'memory' | 'numbers' | 'why';

function getModePrompt(mode: LectureMode): string {
  if (mode === 'tables') {
    return `
PRIMARY OBJECTIVE: Transform the entire medical lecture into an exhaustive, highly organized dossier of detailed tables.

STRICT MANDATORY RULES:
1. LANGUAGE: Output MUST be 100% in English (Professional Medical English).
2. NO DATA OMISSION: You are STRICTLY FORBIDDEN from deleting, omitting, summarizing away, or ignoring ANY fact, number, classification, exception, or detail from the lecture. Every single detail must be integrated into its corresponding table.
3. MINIMUM 14 TABLES: You must generate at least 14 comprehensive, organized tables (scale up to 15, 16, 17+ tables if the lecture covers multiple disorders or broader scope).
4. CLEAN FORMATTING & NO RAW HTML:
   - Use clean Markdown syntax.
   - Bold key medical terms and exam keywords with **Term**.
   - Use ==Key Highlight== for pathognomonic signs and golden pearls.
   - DO NOT USE raw HTML tags like <mark>, <span>, or </mark>. Strictly use Markdown formatting only.
5. REQUIRED CORE 14 TABLES (MINIMUM):
   - Table 1: Core Definitions, Etymology, Anatomy & Physiological Foundations
   - Table 2: Etiology, Causative Pathogens, Transmission & Risk Factors (Modifiable vs Non-Modifiable)
   - Table 3: Pathophysiology, Molecular Pathways & Chronological Disease Progression
   - Table 4: Clinical Presentation (Cardinal Symptoms vs Physical Examination Signs)
   - Table 5: Diagnostic Criteria, Clinical Scoring Systems & Staging Classifications
   - Table 6: Laboratory Investigations, Biomarkers & Quantitative Interpretation Guide
   - Table 7: Imaging Modalities, Radiological Signs, Endoscopy & Histopathology
   - Table 8: Pharmacological Management (Drug Classes, Mechanisms, Doses/Regimens, Adverse Effects & Contraindications)
   - Table 9: Non-Pharmacological, Supportive, Interventional & Surgical Management
   - Table 10: Complications, Acute Emergencies, Monitoring & Prognostic Indicators
   - Table 11: Comprehensive Differential Diagnosis (Suspected Condition vs Definitive Differentiating Features)
   - Table 12: Special Populations (Pediatrics, Pregnancy/Lactation, Geriatrics, Renal/Hepatic Impairment)
   - Table 13: Clinical Practice Guidelines, High-Risk Red Flags & Critical Warnings
   - Table 14: High-Yield Board Exam Buzzwords & Master Takeaways Summary Table
   (Add Table 15, 16... for any additional subtopics or clinical entities in the lecture).
`;
  } else if (mode === 'qa') {
    return `
PRIMARY OBJECTIVE: Transform the entire medical lecture into an exhaustive exam revision and self-testing bank simulating medical school essay exams, viva examinations, and clinical case vignettes.

STRICT MANDATORY RULES:
1. LANGUAGE: Output MUST be 100% in English (Professional Medical English).
2. MINIMUM 16 DETAILED QUESTIONS & ANSWERS: You must provide at least 16 rigorous, high-yield questions covering the entire lecture from start to finish.
3. DIVERSE MEDICAL EXAM QUESTION TYPES:
   - Classical Essay: "Enumerate and classify...", "Define and describe the pathogenesis of..."
   - Comparative: "Compare and contrast between X and Y regarding presentation, diagnosis, and management"
   - Algorithmic: "Outline the step-by-step diagnostic and therapeutic algorithm for..."
   - Clinical Vignettes: Realistic patient case scenarios with acute presentations, requiring diagnosis, initial investigation, most accurate test, and first-line treatment.
4. MODEL ANSWER STRUCTURE:
   - For every question, provide an exhaustive Model Answer.
   - Highlight **Key Scoring Points** and essential keywords that examiners require for full credit.
   - Provide clear, high-yield clinical reasoning.
5. NO RAW HTML: Strictly do NOT output any HTML tags (<mark>, <span>, etc.). Use Markdown bolding **Keywords** and ==Highlights==.
`;
  } else if (mode === 'zaytouna') {
    return `
PRIMARY OBJECTIVE: Deconstruct the lecture into its high-yield exam essence ("Zaytouna" - Exam Traps, Decision Rules, and Discriminators).

STRICT MANDATORY RULES:
1. LANGUAGE: Output MUST be 100% in English (Professional Medical English).
2. SECTION-BY-SECTION EXAM DECONSTRUCTION:
   - Break down every topic in the lecture and detail: "How examiners write questions on this specific section" and "The Common Exam Traps & Distractors".
3. FIXED CLINICAL DECISION RULES:
   - Format clear, actionable clinical heuristics:
     "WHEN YOU SEE [Clinical Sign / Presentation / Lab Finding] -> CHOOSE [Diagnosis / Next Best Step / Drug of Choice] IMMEDIATELY"
   - Include Best Initial Test vs Most Accurate Test, Next Step in Management vs Most Definitive Treatment, and contraindicated choices.
4. SIMILARITIES VS DISTINGUISHERS MATRIX:
   - Catalog all overlapping diseases, symptoms, or drugs in this lecture that confuse students.
   - For each pair, clearly define the single "Pathognomonic Differentiating Feature" that eliminates the wrong choice instantly.
5. NO RAW HTML: Strictly use standard Markdown (**Bold**, lists, tables, ==Highlights==). No <mark> or broken HTML tags.
`;
  } else if (mode === 'memory') {
    return `
PRIMARY OBJECTIVE: Generate a master memorization system, mnemonics, and structured memory schemas ("Taskeemat") for the entire lecture.

STRICT MANDATORY RULES:
1. LANGUAGE: Output MUST be 100% in English (Professional Medical English).
2. LISTS & CRITERIA MNEMONICS:
   - Scan the lecture for all bulleted points, diagnostic criteria, triads/tetrads, classifications, etiology lists, and adverse effects.
   - Create memorable, creative medical mnemonics for each list, spelling out each letter with its clinical meaning and cognitive anchor.
3. MEMORY SCHEMAS & TASKEEMAT (Cognitive Frameworks):
   - For confusing or multi-step information that easily gets mixed up, design structured cognitive schemas, visual mental pegs, phonetic links, and comparison matrices so the student never confuses them.
4. QUICK-RECALL ANCHOR TABLE:
   - A high-yield table linking complex clinical facts to instant memory triggers.
5. NO RAW HTML: Strictly use standard Markdown formatting. Do NOT use <mark>, <span>, or any HTML tags.
`;
  } else if (mode === 'numbers') {
    return `
PRIMARY OBJECTIVE: 🧠 MEDICAL LECTURE NUMBERS → EXAM-READY SYSTEM
Extract all vital numbers, cut-offs, lab values, doses, time windows, and statistical thresholds from the lecture and reorganize them into the most high-yield exam format.
MANDATORY CONSTRAINT: STRICTLY DO NOT invent, hallucinate, or extrapolate numbers not present in the lecture. Every single number must be strictly grounded in the lecture.
LANGUAGE: 100% in English (Professional Medical English).

STRUCTURE YOUR ENTIRE OUTPUT INTO THE FOLLOWING 5 SECTIONS:

1. 🔢 CUT-OFF TABLE
Extract all numbers representing:
- Normal ranges
- Diagnostic cut-offs & thresholds
- Severity thresholds
- Treatment & intervention thresholds
- Staging cut-offs
DO NOT present them as a plain list. Convert them into a structured Cut-off Decision Table:
| Number / Range | What does it mean? (Clinical Significance) | Clinical Decision / Next Step |
| :--- | :--- | :--- |

2. 🎯 NUMBER → DECISION
Every single number that alters clinical management, diagnosis, or severity must be converted to an actionable, high-velocity decision rule:
Format: [Number / Threshold] → [Clinical Decision]

3. ⚠️ COMPARE SIMILAR NUMBERS
Group overlapping or easily confused numbers into a single comparative matrix with discriminators and mental hooks.

4. 🚨 EXAM TRAPS
Extract all numbers that frequently cause exam mistakes with the exact trap, confusion, and correct distinction.

5. 🔥 FINAL HIGH-YIELD SHEET (NUMBERS YOU MUST KNOW)
Conclude with an ultra high-density, rapid-review sheet ordered from highest exam yield to lowest.
`;
  } else if (mode === 'why') {
    return `
PRIMARY OBJECTIVE: 🔬 "WHY CHAINS" — DEEP MECHANISTIC UNDERSTANDING & ROOT CAUSE REASONING
Deconstruct the lecture into deep, intuitive physiological and pharmacological causal chains so the student understands the fundamental "WHY" behind every fact rather than memorizing blindly.
LANGUAGE: 100% in English (Professional Medical English).

STRUCTURE YOUR ENTIRE OUTPUT INTO THE FOLLOWING 3 MASTER PILLARS:

1. 🧬 ETIOLOGY WHY-CHAINS & GROUPED MEMORIZATION
- Group related causes together into logical families.
- Explain step-by-step MECHANISTICALLY: HOW exactly do they produce the cellular and organ pathology? (Step 1 -> Step 2 -> Step 3 -> Tissue Damage).
- Provide the 2 best memory hooks.

2. 🩺 SYMPTOMS & SIGNS: THE STEP-BY-STEP "WHY"
- Extract every cardinal symptom and physical examination sign.
- Explain the pathophysiological trajectory step-by-step.

3. 💊 TREATMENT RATIONALE: THE ITERATIVE "WHY"
- Extract each pharmacological and non-pharmacological treatment option.
- Explain WHY this specific treatment is indicated by repeatedly answering "Why?" down to cellular level.
`;
  }
  return '';
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isDev = process.env.NODE_ENV !== 'production';

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Route: Process Lecture with Gemini AI
  app.post('/api/process-lecture', async (req, res) => {
    try {
      const { mode, lectureText, fileName } = req.body;

      if (!lectureText || typeof lectureText !== 'string' || !lectureText.trim()) {
        return res.status(400).json({ error: 'محتوى المحاضرة مطلوب للبدء.' });
      }

      const apiKey = process.env.GEMINI_API_KEY || (req.body.apiKey ? String(req.body.apiKey).trim() : '');

      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY غير مهيأ على الخادم. يرجى التأكد من إضافة المفتاح في لوحة التحكم.',
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const modePrompt = getModePrompt(mode || 'tables');
      const systemInstruction = `You are a distinguished medical professor, board examination contributor, and master clinical educator.
ABSOLUTE CORE RULES:
1. LANGUAGE: The entire response MUST BE 100% IN PURE ENGLISH (Medical English). Do not write Arabic in the generated output.
2. FORMATTING: Use pure Markdown (headers, tables, lists, bold text).
3. NO RAW HTML TAGS: Strictly DO NOT output raw HTML tags like <mark>, <span>, <div>, or broken tags like </mark rounded">>. To emphasize key facts, use standard Markdown bolding like **CRITICAL PEARL** or wrap with double equals like ==Key Differentiating Feature==.
4. COMPLETENESS: Never omit, delete, or skip any detail, number, dose, or clinical nuance from the input lecture.`;

      const fullPrompt = `
${modePrompt}

==================================================
DOCUMENT TITLE: ${fileName || 'Medical Lecture'}
COMPLETE LECTURE CONTENT:
${lectureText}
==================================================

Generate the complete, exhaustive English output now using clean Markdown:
`;

      const candidateModels = [
        'gemini-3.8-flash',
        'gemini-3.1-flash-lite',
        'gemini-flash-latest',
      ];

      let lastError: any = null;
      let outputText = '';

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: fullPrompt,
            config: {
              systemInstruction,
              temperature: 0.2,
            },
          });

          if (response.text && response.text.trim()) {
            outputText = response.text;
            break;
          }
        } catch (err: any) {
          console.warn(`[AI Studio] Model ${modelName} error:`, err?.message || err);
          lastError = err;
          const msg = err?.message || '';
          if (msg.includes('404') || msg.includes('NOT_FOUND') || msg.includes('503') || msg.includes('UNAVAILABLE')) {
            continue;
          }
          if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
            break;
          }
        }
      }

      if (outputText) {
        return res.json({ result: outputText });
      }

      const errMsg = lastError?.message || 'فشلت معالجة المحاضرة بواسطة نموذج الذكاء الاصطناعي.';
      return res.status(500).json({ error: errMsg });
    } catch (error: any) {
      console.error('[AI Studio] Server error in /api/process-lecture:', error);
      return res.status(500).json({ error: error?.message || 'حدث خطأ داخلي في الخادم.' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Serve static assets or mount Vite
  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI Studio] Server listening on http://0.0.0.0:${PORT} (${isDev ? 'development' : 'production'})`);
  });
}

startServer().catch((err) => {
  console.error('[AI Studio] Failed to start server:', err);
  process.exit(1);
});
