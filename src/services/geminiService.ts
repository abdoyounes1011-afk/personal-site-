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

  onStatusUpdate?.('جاري معالجة المحاضرة عبر الخادم الطبي الذكي...');

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
