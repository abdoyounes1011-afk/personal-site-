import * as pdfjsLib from 'pdfjs-dist';

// Use unpkg worker matching installed pdfjs-dist version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export async function extractTextFromFile(
  file: File,
  onProgress?: (percent: number, status: string) => void
): Promise<string> {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
    onProgress?.(10, 'جاري تهيئة قراءة ملف الـ PDF...');
    const arrayBuffer = await file.arrayBuffer();
    
    onProgress?.(25, 'جاري فحص صفحات المحاضرة...');
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const totalPages = pdf.numPages;

    const textBlocks: string[] = [];
    for (let i = 1; i <= totalPages; i++) {
      const currentPercent = 25 + Math.round((i / totalPages) * 35);
      onProgress?.(currentPercent, `جاري استخراج النصوص من صفحة ${i} من إجمالي ${totalPages}...`);
      
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ');
      
      if (pageText.trim()) {
        textBlocks.push(`=== [صفحة ${i}] ===\n${pageText}`);
      }
    }

    const result = textBlocks.join('\n\n');
    if (!result.trim()) {
      throw new Error('الملف لا يحتوي على نصوص قابلة للاستخراج (قد يكون ملف صور ممسوحة ضوئياً). يُرجى نسخ النص أو رفع ملف نصي.');
    }
    return result;
  } else {
    onProgress?.(30, 'جاري قراءة الملف النصي...');
    const text = await file.text();
    if (!text.trim()) {
      throw new Error('الملف فارغ، يُرجى رفع ملف يحتوي على محتوى المحاضرة.');
    }
    return text.trim();
  }
}
