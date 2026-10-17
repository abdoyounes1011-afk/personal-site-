import { GoogleGenAI } from '@google/genai';
import { getModePrompt, SYSTEM_INSTRUCTION, LectureMode } from './lecturePrompts';

export type { LectureMode };

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

const STORAGE_KEY = 'medstudy_gemini_api_key';

export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  } catch {
    return '';
  }
}

export function setStoredApiKey(key: string): void {
  try {
    if (key?.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

// Client-side fallback generator using @google/genai
async function processLectureClientSide({
  apiKey,
  mode,
  cleanText,
  fileName,
  onStatusUpdate,
}: {
  apiKey: string;
  mode: LectureMode;
  cleanText: string;
  fileName?: string;
  onStatusUpdate?: (status: string) => void;
}): Promise<string> {
  onStatusUpdate?.('جاري معالجة المحاضرة عبر محرك الذكاء الاصطناعي الطبي المباشر...');

  const ai = new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const modePrompt = getModePrompt(mode);
  const fullPrompt = `
${modePrompt}

==================================================
DOCUMENT TITLE: ${fileName || 'Medical Lecture'}
COMPLETE LECTURE CONTENT:
${cleanText}
==================================================

Generate the complete, exhaustive English output now using clean Markdown:
`;

  const candidateModels = [
    'gemini-3.8-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
  ];

  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      onStatusUpdate?.('جاري توليد التحليل الطبي المتكامل...');
      const response = await ai.models.generateContent({
        model: modelName,
        contents: fullPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2,
        },
      });

      if (response.text && response.text.trim()) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`[Gemini Client Fallback] Model ${modelName} error:`, err?.message || err);
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

  const errText = lastError?.message || '';
  if (errText.includes('API_KEY_INVALID') || errText.includes('API key not valid')) {
    throw new Error('مفتاح Gemini API غير صالح أو انتهت صلاحيته. يُرجى التحقق من المفتاح في الإعدادات.');
  }
  if (errText.includes('429') || errText.includes('quota') || errText.includes('Resource has been exhausted')) {
    throw new Error('تم بلوغ حد الاستخدام المجاني المؤقت، يُرجى الانتظار 30 ثانية ثم إعادة المحاولة.');
  }

  throw new Error(lastError?.message || 'تعذرت معالجة المحاضرة عبر نموذج الذكاء الاصطناعي.');
}

export async function processLectureWithGemini({
  apiKey,
  mode,
  lectureText,
  fileName,
  onStatusUpdate,
}: {
  apiKey?: string;
  mode: LectureMode;
  lectureText: string;
  fileName?: string;
  onStatusUpdate?: (status: string) => void;
}): Promise<string> {
  onStatusUpdate?.('جاري تهيئة نموذج الذكاء الاصطناعي الطبي...');

  const cleanText = lectureText.trim();
  if (!cleanText) {
    throw new Error('محتوى المحاضرة فارغ، يرجى التأكد من اختيار ملف صالح أو كتابة النص.');
  }

  onStatusUpdate?.('جاري إرسال المحاضرة للمعالجة...');

  // Step 1: Try server-side endpoint first
  let serverReturned404 = false;
  try {
    const response = await fetch('/api/process-lecture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode,
        lectureText: cleanText,
        fileName: fileName || 'Medical Lecture Notes',
        apiKey: apiKey?.trim() || undefined,
      }),
    });

    if (response.status === 404) {
      console.warn('[GeminiService] Server endpoint /api/process-lecture returned 404. Attempting client-side fallback...');
      serverReturned404 = true;
    } else {
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg = data?.error || `حدث خطأ في الخادم (رمز الحالة: ${response.status})`;
        throw new Error(errorMsg);
      }

      if (!data?.result) {
        throw new Error('لم يتم استلام نتائج من نموذج الذكاء الاصطناعي.');
      }

      return data.result;
    }
  } catch (err: any) {
    if (serverReturned404 || err?.message?.includes('404') || err?.message?.includes('Failed to fetch')) {
      serverReturned404 = true;
    } else {
      throw err;
    }
  }

  // Step 2: If server returned 404 (e.g. running on GitHub Pages or static host), fall back to client-side
  if (serverReturned404) {
    const candidateKey = apiKey?.trim() || getStoredApiKey();

    if (!candidateKey) {
      throw new Error(
        'STATUS_404_STATIC_HOST: لم يتم العثور على خادم المعالجة (رمز الحالة 404) نظراً لكون الموقع يعمل على استضافة ثابتة بدون خادم (مثل GitHub Pages). يرجى إدخال مفتاح Gemini API المجاني الخاص بك للمتابعة مباشرة.'
      );
    }

    return await processLectureClientSide({
      apiKey: candidateKey,
      mode,
      cleanText,
      fileName,
      onStatusUpdate,
    });
  }

  throw new Error('تعذرت معالجة المحاضرة.');
}
