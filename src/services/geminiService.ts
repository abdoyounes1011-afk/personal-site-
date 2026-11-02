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
    const response = await fetch('/api/process-lecture?stream=true', {
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

    clearTimeout(timeoutTimer);

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
              const err = parsed.error || 'حدث خطأ أثناء معالجة المحاضرة.';
              throw new Error(err);
            } else if (parsed.type === 'done' && parsed.fullText) {
              accumulatedText = parsed.fullText;
              onStreamChunk?.(accumulatedText, '');
            }
          } catch (e: any) {
            if (e?.message && !e.message.includes('Unexpected token') && !e.message.includes('JSON')) {
              throw e;
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
      const rawError = data?.error || `حدث خطأ في الخادم (رمز الحالة: ${response.status})`;
      if (rawError.includes('429') || rawError.includes('quota') || rawError.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('تم بلوغ حد الاستخدام المؤقت للنموذج، يُرجى الانتظار دقيقة واحدة ثم إعادة المحاولة.');
      }
      throw new Error(rawError);
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
