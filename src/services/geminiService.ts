import { GoogleGenAI } from '@google/genai';

export type LectureMode = 'tables' | 'qa' | 'zaytouna' | 'memory' | 'numbers' | 'why';

export interface LectureModeInfo {
  id: LectureMode;
  name: string; // ONLY English name as strictly requested by user
  iconName: string;
}

export const LECTURE_MODES: LectureModeInfo[] = [
  {
    id: 'tables',
    name: 'Comprehensive Tables OS',
    iconName: 'Table',
  },
  {
    id: 'qa',
    name: 'Clinical Medical Q&A Simulator',
    iconName: 'HelpCircle',
  },
  {
    id: 'zaytouna',
    name: 'Zaytouna Exam Rules & Traps',
    iconName: 'Zap',
  },
  {
    id: 'memory',
    name: 'Mnemonics & Memory Schemas',
    iconName: 'Brain',
  },
  {
    id: 'numbers',
    name: 'Numbers Bank',
    iconName: 'Hash',
  },
  {
    id: 'why',
    name: 'Why Chains',
    iconName: 'HelpCircle',
  },
];

export async function processLectureWithGemini({
  apiKey,
  mode,
  lectureText,
  fileName,
  onStatusUpdate,
}: {
  apiKey: string;
  mode: LectureMode;
  lectureText: string;
  fileName?: string;
  onStatusUpdate?: (status: string) => void;
}): Promise<string> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    throw new Error('يرجى إدخال مفتاح Google AI Studio Gemini API للمتابعة.');
  }

  onStatusUpdate?.('جاري تهيئة نموذج الذكاء الاصطناعي الطبي...');
  const ai = new GoogleGenAI({ apiKey: cleanKey });

  let modePrompt = '';

  if (mode === 'tables') {
    modePrompt = `
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
    modePrompt = `
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
    modePrompt = `
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
    modePrompt = `
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
    modePrompt = `
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
| < X | ... | ... |
| X – Y | ... | ... |
| > Y | ... | ... |

If numbers define consecutive disease stages or escalations, use the sequential progression chain format:
5 → 10 → 20
⬇️
Monitor → Start treatment → Escalate

2. 🎯 NUMBER → DECISION
Every single number that alters clinical management, diagnosis, or severity must be converted to an actionable, high-velocity decision rule:
Format:
[Number / Threshold] → [Clinical Decision]
(For example: instead of writing "Treatment starts at 10 mg", write: "10 mg → Start first-line treatment")
(For example: "5 mmHg → Monitor", "10 mmHg → Initiate monotherapy", "20 mmHg → Hospitalize & escalate")
Focus heavily on numbers that shift:
- Diagnosis
- Severity Grading
- Management & Next Best Step
- Drug Choice / Dose

3. ⚠️ COMPARE SIMILAR NUMBERS
If there are numbers that look similar, share identical digits, or are easy for students to confuse:
STRICTLY FORBIDDEN to present them as separate disconnected lists. Group them into a single comparative matrix:
| Condition / Situation | Number | Meaning / Decision | Key Difference & Discriminator |
Followed by:
- Why are these numbers easy to confuse?
- What is the easiest mental hook to differentiate them?
Link similar numbers together in the same table so the student never mixes them up.

4. 🚨 EXAM TRAPS
Extract all numbers that frequently cause exam mistakes, especially:
- Similar numbers or overlapping ranges
- Similar units (e.g., mg vs mcg, mmol/L vs mg/dL)
- Different cut-offs for initial vs diagnostic vs treatment
- Numbers belonging to different diseases or distinct severity stages in the lecture
- Numbers that students often interchange
For EACH trap:
- Trap Title: [Number A vs Number B]
- The Confusion: Why examiners trick students with this.
- The Correct Distinction: The exact clinical truth.
- How to Remember the Difference: High-yield memory anchor.

5. 🔥 FINAL HIGH-YIELD SHEET (NUMBERS YOU MUST KNOW)
Conclude with an ultra high-density, rapid-review sheet:
Order the numbers strictly from HIGHEST exam yield to lowest (NOT chronological order of the lecture).
Start with the numbers that directly determine diagnosis, severity, next best step, and life-saving management.
Format each item strictly as:
- 🔢 Number: ...
- 🧠 Meaning: ...
- 🎯 Decision: ...
- ⚠️ Exam Trap: ...
Keep this final sheet ultra-concise, dense, and ideal for 5-minute review before the exam.
`;
  } else if (mode === 'why') {
    modePrompt = `
PRIMARY OBJECTIVE: 🔬 "WHY CHAINS" — DEEP MECHANISTIC UNDERSTANDING & ROOT CAUSE REASONING
Deconstruct the lecture into deep, intuitive physiological and pharmacological causal chains so the student understands the fundamental "WHY" behind every fact rather than memorizing blindly.
LANGUAGE: 100% in English (Professional Medical English).

STRUCTURE YOUR ENTIRE OUTPUT INTO THE FOLLOWING 3 MASTER PILLARS:

1. 🧬 ETIOLOGY WHY-CHAINS & GROUPED MEMORIZATION
- Group related causes together into logical families (e.g., hemodynamic vs toxic vs autoimmune vs infectious).
- For each group of causes, explain step-by-step MECHANISTICALLY: HOW exactly do they produce the cellular and organ pathology? (Step 1 -> Step 2 -> Step 3 -> Tissue Damage).
- Provide the 2 best, easiest memory methods/hooks to permanently retain this group of etiologies without forgetting.

2. 🩺 SYMPTOMS & SIGNS: THE STEP-BY-STEP "WHY"
- Extract every cardinal symptom and physical examination sign from the lecture.
- Explain the pathophysiological trajectory: How exactly does the underlying disease reach this specific clinical symptom step-by-step?
  (e.g., "Why does the patient develop dyspnea? -> Elevated left ventricular end-diastolic pressure -> Increased pulmonary capillary wedge pressure -> Fluid extravasation into alveoli -> Impaired gas exchange -> Stimulation of J-receptors -> Dyspnea").
- For each symptom cluster, suggest the most effective, intuitive memorization hook or mental image.

3. 💊 TREATMENT RATIONALE: THE ITERATIVE "WHY" (WHY THIS DRUG FOR THIS CONDITION?)
- Extract each pharmacological and non-pharmacological treatment option in the lecture.
- Explain WHY this specific treatment is indicated by repeatedly answering "Why?" until the full cellular, physiological, and clinical picture is completely closed and understood.
  (e.g.:
   Drug X is given ->
   Why? Because it blocks Receptor Y. ->
   Why? Because blocking Receptor Y prevents Intracellular Calcium influx. ->
   Why? Because lower intracellular calcium causes arteriolar smooth muscle relaxation. ->
   Why? Because arteriolar vasodilation drops systemic vascular resistance and afterload. ->
   Why? Because reduced afterload relieves myocardial oxygen demand and aborts ischemia!).
- Highlight any paradoxical or contraindicated treatments and explain WHY they are dangerous.
`;
  }

  const systemInstruction = `You are a distinguished medical professor, board examination contributor, and master clinical educator.
ABSOLUTE CORE RULES:
1. LANGUAGE: The entire response MUST BE 100% IN PURE ENGLISH (Medical English). Do not write Arabic in the generated output.
2. FORMATTING: Use pure Markdown (headers, tables, lists, bold text).
3. NO RAW HTML TAGS: Strictly DO NOT output raw HTML tags like <mark>, <span>, <div>, or broken tags like </mark rounded">>. To emphasize key facts, use standard Markdown bolding like **CRITICAL PEARL** or wrap with double equals like ==Key Differentiating Feature==.
4. COMPLETENESS: Never omit, delete, or skip any detail, number, dose, or clinical nuance from the input lecture.`;

  onStatusUpdate?.('Sending lecture to Medical AI Model...');

  const fullPrompt = `
${modePrompt}

==================================================
DOCUMENT TITLE: ${fileName || 'Medical Lecture'}
COMPLETE LECTURE CONTENT:
${lectureText}
==================================================

Generate the complete, exhaustive English output now using clean Markdown:
`;

  const CANDIDATE_MODELS = [
    'gemini-3.5-flash',
    'gemini-3.8-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
  ];

  let lastError: any = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      onStatusUpdate?.(`جاري توليد التحليل الطبي بالذكاء الاصطناعي...`);

      const response = await ai.models.generateContent({
        model: modelName,
        contents: fullPrompt,
        config: {
          systemInstruction,
          temperature: 0.2, // low temperature for absolute factual fidelity and zero hallucination
        },
      });

      const outputText = response.text;
      if (outputText && outputText.trim()) {
        return outputText;
      }
    } catch (err: any) {
      console.warn(`Model ${modelName} encountered an issue:`, err?.message || err);
      lastError = err;
      // If 404 or 503, continue to next candidate model
      const msg = err?.message || '';
      if (msg.includes('404') || msg.includes('NOT_FOUND') || msg.includes('503') || msg.includes('UNAVAILABLE')) {
        onStatusUpdate?.('جاري التبديل التلقائي إلى نموذج طبي بديل...');
        continue;
      }
      // If invalid key or other fatal auth error, break early
      if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
        break;
      }
    }
  }

  // Handle final error reporting with clear Arabic guidance
  console.error('All Gemini processing attempts failed:', lastError);
  const message = lastError?.message || 'حدث خطأ أثناء معالجة المحاضرة.';
  if (message.includes('API key not valid') || message.includes('API_KEY_INVALID')) {
    throw new Error('مفتاح Google AI Studio API غير صالح أو غير مفعل. يُرجى التحقق من المفتاح أو استخراج مفتاح مجاني جديد من الرابط بجانب زر التفعيل.');
  }
  if (message.includes('Resource has been exhausted') || message.includes('429')) {
    throw new Error('تم تجاوز حد الاستخدام المجاني المؤقت لمفتاحك، يُرجى الانتظار 30 ثانية والمحاولة مجدداً.');
  }
  if (message.includes('404') || message.includes('NOT_FOUND')) {
    throw new Error('تعذر العثور على النموذج المطلوب. يُرجى التأكد من استخراج مفتاح حديث من Google AI Studio.');
  }
  throw new Error(message);
}
