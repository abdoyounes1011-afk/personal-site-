import { GoogleGenAI, ThinkingLevel } from '@google/genai';
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
    name: 'Written Essay Q&A (Enumerate & List)',
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
    return localStorage.getItem(STORAGE_KEY) || '';
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

export function clearStoredApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('user_gemini_api_key');
    localStorage.removeItem('gemini_api_key');
  } catch {
    // Ignore storage errors
  }
}

// Client-side streaming generator using @google/genai
async function processLectureClientSide({
  apiKey,
  mode,
  cleanText,
  fileName,
  onStatusUpdate,
  onStreamChunk,
}: {
  apiKey: string;
  mode: LectureMode;
  cleanText: string;
  fileName?: string;
  onStatusUpdate?: (status: string) => void;
  onStreamChunk?: (accumulatedText: string, latestChunk: string) => void;
}): Promise<string> {
  onStatusUpdate?.('ونقوول بسم الله');

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

CORE REQUIREMENTS:
- Provide exhaustive, university-level medical details, comprehensive tables, in-depth pathophysiological mechanisms, and complete clinical breakdowns without any omissions or shortcuts.
- STRICTLY DO NOT output emojis, arrows (-> or -->), or decorative symbols (such as ==). Use pure clean text, bold keywords, and neat tables.

Generate the complete, exhaustive English output now using clean Markdown:
`;

  const candidateModels = [
    'gemini-3.8-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite',
  ];

  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      onStatusUpdate?.('ونقوول بسم الله');
      const responseStream = await ai.models.generateContentStream({
        model: modelName,
        contents: fullPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      let accumulated = '';
      let chunkCount = 0;

      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          accumulated += text;
          chunkCount++;
          onStreamChunk?.(accumulated, text);
        }
      }

      if (accumulated.trim() && chunkCount > 0) {
        return accumulated;
      }
    } catch (err: any) {
      console.warn(`[AI Engine] Streaming model error:`, err?.message || err);
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
  onStreamChunk,
}: {
  apiKey?: string;
  mode: LectureMode;
  lectureText: string;
  fileName?: string;
  onStatusUpdate?: (status: string) => void;
  onStreamChunk?: (accumulatedText: string, latestChunk: string) => void;
}): Promise<string> {
  onStatusUpdate?.('ونقوول بسم الله');

  const cleanText = lectureText.trim();
  if (!cleanText) {
    throw new Error('محتوى المحاضرة فارغ، يرجى التأكد من اختيار ملف صالح أو كتابة النص.');
  }

  const candidateKey = apiKey?.trim() || getStoredApiKey();

  if (!candidateKey) {
    throw new Error('يرجى إدخال مفتاح Gemini API المجاني الخاص بك للبدء.');
  }

  // Process directly with low-latency client engine (<2s first token) with real-time streaming
  return await processLectureClientSide({
    apiKey: candidateKey,
    mode,
    cleanText,
    fileName,
    onStatusUpdate,
    onStreamChunk,
  });

  onStatusUpdate?.('ونقوول بسم الله');

  // Step 1: Try server-side endpoint with 45s timeout constraint
  let shouldFallbackToClient = false;
  try {
    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), 45000);

    const response = await fetch('/api/process-lecture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        mode,
        lectureText: cleanText,
        fileName: fileName || 'Medical Lecture Notes',
        apiKey: candidateKey || undefined,
      }),
    });
    clearTimeout(timeoutTimer);

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
