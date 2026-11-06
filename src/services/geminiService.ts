import { LectureMode } from './lecturePrompts';

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

export function formatGeminiErrorMessage(raw: unknown): string {
  if (!raw) return 'فشلت معالجة المحاضرة بواسطة نموذج الذكاء الاصطناعي.';
  let text = typeof raw === 'string' ? raw : '';

  if (typeof raw === 'object') {
    const anyObj = raw as any;
    text = anyObj?.message || anyObj?.error?.message || anyObj?.error || '';
    if (!text) {
      try {
        text = JSON.stringify(raw);
      } catch {
        text = String(raw);
      }
    }
  }

  // Handle nested stringified JSON error payloads (e.g. {"error":{"message":"{\n \"error\": ..."}}})
  let attempts = 0;
  while (attempts < 4 && typeof text === 'string' && (text.trim().startsWith('{') || text.trim().startsWith('['))) {
    attempts++;
    try {
      const parsed = JSON.parse(text.trim());
      if (typeof parsed === 'string') {
        text = parsed;
      } else if (parsed && typeof parsed === 'object') {
        text = parsed.error?.message || parsed.message || parsed.error || JSON.stringify(parsed);
      }
    } catch {
      break;
    }
  }

  const lower = String(text || '').toLowerCase();
  if (
    lower.includes('503') ||
    lower.includes('high demand') ||
    lower.includes('unavailable') ||
    lower.includes('spikes in demand') ||
    lower.includes('overloaded')
  ) {
    return 'نموذج الذكاء الاصطناعي يواجه ضغطاً مؤقتاً في هذه اللحظة (High Demand - 503). يُرجى الضغط على زر «إعادة المحاولة الآن» أدناه للمتابعة فوراً دون إعادة رفع الملف.';
  }

  if (
    lower.includes('429') ||
    lower.includes('quota') ||
    lower.includes('resource_exhausted') ||
    lower.includes('rate limit')
  ) {
    return 'تم بلوغ حد الاستخدام المؤقت للنموذج (Rate Limit - 429). يُرجى الانتظار دقيقة واحدة ثم الضغط على «إعادة المحاولة الآن».';
  }

  if (lower.includes('api_key_invalid') || lower.includes('api key not valid') || lower.includes('invalid api key')) {
    return 'مفتاح الـ API غير صالح أو منتهي الصلاحية. يُرجى التحقق من المفتاح في الإعدادات.';
  }

  return String(text || 'حدث خطأ أثناء معالجة المحاضرة.');
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function processLectureDirectWithGenAI({
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
  onStatusUpdate?.('ونقوول بسم الله (المعالجة المباشرة)');
  const { GoogleGenAI } = await import('@google/genai');
  const { getModePrompt, SYSTEM_INSTRUCTION } = await import('./lecturePrompts.ts');

  const ai = new GoogleGenAI({ apiKey });
  const modePrompt = getModePrompt(mode);
  const fullPrompt = `${modePrompt}

=== [SOURCE MEDICAL LECTURE CONTENT] ===
Lecture Title: ${fileName || 'Medical Lecture'}
Content:
${cleanText}

=== [EXECUTE IMMEDIATE HIGH-YIELD ANALYSIS (1,500+ WORDS MINIMUM) NOW] ===`;

  const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
  let lastErr: any = null;

  for (let pass = 0; pass < 2; pass++) {
    if (pass > 0) {
      await sleep(2000);
    }

    for (const model of candidateModels) {
      try {
        const streamResp = await ai.models.generateContentStream({
          model,
          contents: fullPrompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
          },
        });

        let accumulatedText = '';
        for await (const chunk of streamResp) {
          const text = chunk.text;
          if (text) {
            accumulatedText += text;
            onStreamChunk?.(accumulatedText, text);
          }
        }

        if (accumulatedText.trim().length > 0) {
          return accumulatedText;
        }
      } catch (err: any) {
        lastErr = err;
        const msg = String(err?.message || '').toLowerCase();
        if (msg.includes('api_key_invalid') || msg.includes('api key not valid')) {
          break;
        }
        if (msg.includes('503') || msg.includes('high demand') || msg.includes('429')) {
          await sleep(1200);
        }
        continue;
      }
    }
  }

  throw new Error(formatGeminiErrorMessage(lastErr));
}

/**
 * Process a lecture by calling the server-side AI endpoint.
 * This ensures API keys stay secure on the server and work for everyone who opens the website.
 */
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

  const controller = new AbortController();
  // 180-second timeout to allow comprehensive 1,500+ words generation without premature aborts
  const timeoutTimer = setTimeout(() => controller.abort(), 180000);

  try {
    let response: Response | null = null;
    let networkError: any = null;

    try {
      response = await fetch('/api/process-lecture?stream=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream, application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          mode,
          stream: true,
          lectureText: cleanText,
          fileName: fileName || 'Medical Lecture Notes',
          apiKey: candidateKey || undefined,
        }),
      });
    } catch (err: any) {
      networkError = err;
    }

    clearTimeout(timeoutTimer);

    // If fetch failed or server returned 404
    if (!response || response.status === 404) {
      if (candidateKey) {
        return await processLectureDirectWithGenAI({
          apiKey: candidateKey,
          mode,
          cleanText,
          fileName,
          onStatusUpdate,
          onStreamChunk,
        });
      }

      if (!response) {
        throw new Error(
          networkError?.name === 'AbortError'
            ? 'استغرقت معالجة المحاضرة وقتاً أطول من المتوقع، يرجى المحاولة مرة أخرى.'
            : 'تعذر الاتصال بخادم المعالجة. يرجى التحقق من اتصال الإنترنت والضغط على «إعادة المحاولة الآن».'
        );
      }

      throw new Error(
        'STATUS_404_STATIC_HOST: لم يتم العثور على مسار المعالجة (404 Not Found). يرجى إدخال مفتاح Google AI Studio المجاني للمتابعة مباشرة.'
      );
    }

    const contentType = response.headers.get('content-type') || '';

    // If server responded with SSE stream
    if (contentType.includes('text/event-stream') && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;

          const dataStr = trimmed.slice(5).trim();
          if (dataStr === '[DONE]') {
            break;
          }

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.type === 'chunk' && parsed.text) {
              accumulatedText += parsed.text;
              onStreamChunk?.(accumulatedText, parsed.text);
            } else if (parsed.type === 'error' || parsed.error) {
              const formatted = formatGeminiErrorMessage(parsed.error);
              throw new Error(formatted);
            } else if (parsed.type === 'done' && parsed.fullText) {
              accumulatedText = typeof parsed.fullText === 'string' ? parsed.fullText : String(parsed.fullText || '');
              onStreamChunk?.(accumulatedText, '');
            }
          } catch (e: any) {
            const errStr = typeof e?.message === 'string' ? e.message : String(e || '');
            if (errStr && !errStr.includes('Unexpected token') && !errStr.includes('JSON')) {
              throw e instanceof Error ? e : new Error(errStr);
            }
          }
        }
      }

      if (accumulatedText.trim().length > 0) {
        return accumulatedText;
      }
    }

    // Fallback if not an SSE stream or if response is standard JSON
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const rawError = data?.error || data || `خطأ في الخادم (رمز الحالة: ${response.status})`;
      throw new Error(formatGeminiErrorMessage(rawError));
    }

    if (!data?.result || !data.result.trim()) {
      throw new Error('لم يتم استلام نتائج من نموذج الذكاء الاصطناعي.');
    }

    const fullResult = data.result;
    if (onStreamChunk) {
      onStreamChunk(fullResult, fullResult);
    }

    return fullResult;
  } catch (err: any) {
    clearTimeout(timeoutTimer);
    if (err?.name === 'AbortError') {
      throw new Error('استغرقت معالجة المحاضرة وقتاً أطول من المتوقع، يرجى المحاولة مرة أخرى.');
    }
    throw err;
  }
}
