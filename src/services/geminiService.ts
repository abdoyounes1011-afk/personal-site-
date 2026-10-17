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

  // Standard public Google AI Studio models available to all user keys, followed by preview aliases
  const candidateModels = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash',
    'gemini-flash-latest',
  ];

  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      onStatusUpdate?.(`جاري توليد التحليل الطبي (${modelName})...`);
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
      const msg = (err?.message || '').toLowerCase();
      if (msg.includes('api_key_invalid') || msg.includes('api key not valid') || msg.includes('unregistered caller')) {
        break;
      }
      continue;
    }
  }

  const errText = (lastError?.message || '').toLowerCase();
  if (errText.includes('api_key_invalid') || errText.includes('api key not valid') || errText.includes('unregistered caller')) {
    throw new Error('مفتاح Gemini API غير صالح أو لم يتم تفعيله. يُرجى التحقق من المفتاح في الإعدادات.');
  }
  if (errText.includes('429') || errText.includes('quota') || errText.includes('resource has been exhausted')) {
    throw new Error('تم بلوغ حد الاستخدام المجاني المؤقت، يُرجى الانتظار دقيقة واحدة ثم إعادة المحاولة.');
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

  const candidateKey = apiKey?.trim() || getStoredApiKey();

  // If user already has a custom API key, try direct client-side processing if in static/GitHub Pages environment
  const isLikelyStatic = typeof window !== 'undefined' && (
    window.location.hostname.includes('github.io') ||
    window.location.hostname.includes('pages.dev') ||
    window.location.hostname.includes('vercel.app') ||
    window.location.protocol === 'file:'
  );

  if (isLikelyStatic && candidateKey) {
    return await processLectureClientSide({
      apiKey: candidateKey,
      mode,
      cleanText,
      fileName,
      onStatusUpdate,
    });
  }

  onStatusUpdate?.('جاري إرسال المحاضرة للمعالجة...');

  // Step 1: Try server-side endpoint first
  let shouldFallbackToClient = false;
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
        apiKey: candidateKey || undefined,
      }),
    });

    if (response.status === 404 || response.status === 405 || response.status === 502) {
      console.warn('[GeminiService] Server endpoint returned ' + response.status + '. Falling back to client-side...');
      shouldFallbackToClient = true;
    } else {
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // If server failed with 500 or 503 and we have a custom key, try client fallback
        if (candidateKey && (response.status === 500 || response.status === 503)) {
          shouldFallbackToClient = true;
        } else {
          const errorMsg = data?.error || `حدث خطأ في الخادم (رمز الحالة: ${response.status})`;
          throw new Error(errorMsg);
        }
      } else {
        if (!data?.result) {
          throw new Error('لم يتم استلام نتائج من نموذج الذكاء الاصطناعي.');
        }
        return data.result;
      }
    }
  } catch (err: any) {
    if (shouldFallbackToClient || err?.message?.includes('404') || err?.message?.includes('Failed to fetch') || err?.name === 'TypeError') {
      shouldFallbackToClient = true;
    } else {
      throw err;
    }
  }

  // Step 2: Fall back to client-side processing for GitHub Pages / static hosting
  if (shouldFallbackToClient) {
    if (!candidateKey) {
      throw new Error(
        'STATUS_404_STATIC_HOST: لم يتم العثور على خادم معالجة نشط (الموقع يعمل على استضافة ثابتة مثل GitHub Pages). يرجى الضغط أدناه وإدخال مفتاح Gemini API المجاني الخاص بك لتعمل المعالجة مباشرة وبدون خادم.'
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
