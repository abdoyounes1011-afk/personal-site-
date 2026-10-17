import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  Check,
  Copy,
  Download,
  RotateCcw,
  AlertCircle,
  Table,
  HelpCircle,
  Zap,
  Brain,
  FileCode,
  CheckCircle2,
  Printer,
  Hash,
  GitFork,
  Key,
  X,
  ExternalLink,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { extractTextFromFile } from '../utils/fileExtractor';
import {
  processLectureWithGemini,
  LECTURE_MODES,
  LectureMode,
  getStoredApiKey,
  setStoredApiKey,
} from '../services/geminiService';

// Helper to clean up any rogue HTML tags like </mark rounded">> and format highlights cleanly
function sanitizeMedicalMarkdown(raw: string): string {
  if (!raw) return '';
  return raw
    // Strip broken or malformed mark tags and leftovers
    .replace(/<\/?mark[^>]*>>?/gi, '')
    .replace(/<\/?mark[^>]*>/gi, '')
    .replace(/rounded"[^>]*>>?/gi, '')
    .replace(/class="[^"]*"/gi, '')
    .replace(/<\/?[a-z0-9_-]+:[^>]*>/gi, '')
    // Convert double-equals highlight ==term== to bold markdown **term**
    .replace(/==([^=\n]+)==/g, '**$1**')
    .trim();
}

export const LectureStudioSection: React.FC = () => {
  // Mode selection state
  const [selectedMode, setSelectedMode] = useState<LectureMode>('tables');

  // File and input states
  const [file, setFile] = useState<File | null>(null);
  const [directText, setDirectText] = useState<string>('');
  const [isTextInputOpen, setIsTextInputOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Processing & progress states
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Custom API key state (supports direct client fallback on GitHub Pages / static hosting)
  const [customApiKey, setCustomApiKey] = useState<string>(() => getStoredApiKey());
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [tempKeyInput, setTempKeyInput] = useState<string>('');

  // Output state
  const [resultText, setResultText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const markdownContainerRef = useRef<HTMLDivElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setErrorMsg(null);
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setErrorMsg(null);
    }
  };

  // Save custom key
  const handleSaveCustomKey = (key: string) => {
    const trimmed = key.trim();
    setStoredApiKey(trimmed);
    setCustomApiKey(trimmed);
    setShowKeyModal(false);
    setErrorMsg(null);
  };

  // Start Lecture Processing
  const handleProcess = async () => {
    if (!file && !directText.trim()) {
      setErrorMsg('يرجى اختيار ملف المحاضرة (PDF أو TXT) أو لصق نص المحاضرة للبدء.');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);
    setProgressPercent(5);
    setProgressStatus('جاري فحص المحاضرة...');
    setResultText(null);

    let progressInterval: any = null;

    try {
      let rawText = '';
      if (file) {
        rawText = await extractTextFromFile(file, (percent, status) => {
          setProgressPercent(percent);
          setProgressStatus(status);
        });
      } else {
        rawText = directText.trim();
        setProgressPercent(35);
        setProgressStatus('تم تجهيز نص المحاضرة...');
      }

      setProgressPercent(50);
      setProgressStatus('جاري إرسال المحاضرة للنموذج الطبي وتوليد المخرجات...');

      // Simulated smooth progress while model streams/generates
      progressInterval = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev >= 92) {
            if (progressInterval) clearInterval(progressInterval);
            return 92;
          }
          return prev + 2;
        });
      }, 700);

      const generatedResult = await processLectureWithGemini({
        apiKey: customApiKey,
        mode: selectedMode,
        lectureText: rawText,
        fileName: file?.name || 'Medical Lecture Notes',
        onStatusUpdate: (status) => setProgressStatus(status),
      });

      if (progressInterval) clearInterval(progressInterval);
      setProgressPercent(100);
      setProgressStatus('تم اكتمال المعالجة بنجاح!');
      setResultText(generatedResult);
    } catch (err: any) {
      if (progressInterval) clearInterval(progressInterval);
      const rawMsg = err.message || 'حدث خطأ أثناء معالجة المحاضرة.';
      const cleanMsg = rawMsg.replace(/^STATUS_404_STATIC_HOST:\s*/i, '');
      setErrorMsg(cleanMsg);
      if (rawMsg.includes('404') || rawMsg.includes('STATUS_404_STATIC_HOST') || rawMsg.includes('API_KEY')) {
        setShowKeyModal(true);
      }
    } finally {
      if (progressInterval) clearInterval(progressInterval);
      setIsProcessing(false);
    }
  };

  // Copy result to clipboard
  const handleCopyResult = async () => {
    if (!resultText) return;
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Download result as Word-compatible document (.doc) with real styled HTML
  const handleDownloadDoc = () => {
    if (!resultText) return;
    const modeTitle = LECTURE_MODES.find((m) => m.id === selectedMode)?.name || 'Medical Analysis';
    const docTitle = `${file?.name?.replace(/\.[^/.]+$/, '') || 'Lecture'}_${selectedMode}`;
    const contentHtml = markdownContainerRef.current?.innerHTML || '';

    const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${docTitle}</title>
  <style>
    body {
      font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1c1917;
      margin: 36px;
    }
    h1 {
      color: #1C1917;
      font-size: 18pt;
      border-bottom: 2px solid #D97706;
      padding-bottom: 6px;
      margin-top: 24px;
      margin-bottom: 12px;
      font-weight: bold;
    }
    h2 {
      color: #78350F;
      font-size: 14pt;
      margin-top: 20px;
      margin-bottom: 10px;
      font-weight: bold;
    }
    h3 {
      color: #292524;
      font-size: 12pt;
      margin-top: 16px;
      margin-bottom: 8px;
      font-weight: bold;
    }
    strong {
      font-weight: bold;
      color: #78350F;
      background-color: #FEF08A;
      padding: 2px 4px;
      border-radius: 3px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 10pt;
    }
    th {
      background-color: #F5EFE6;
      color: #292524;
      border: 1px solid #D6C7B2;
      padding: 6px 10px;
      text-align: left;
      font-weight: bold;
    }
    td {
      border: 1px solid #E7DCD0;
      padding: 6px 10px;
      color: #292524;
      vertical-align: top;
    }
    tr:nth-child(even) td {
      background-color: #FAF6F0;
    }
    p.meta {
      color: #78716C;
      font-size: 10pt;
      margin-bottom: 20px;
      font-style: italic;
    }
    ul, ol {
      margin: 8px 0;
      padding-left: 24px;
    }
    li {
      margin-bottom: 4px;
    }
  </style>
</head>
<body>
  <h1>${modeTitle}</h1>
  <p class="meta">Document: ${file?.name || 'Medical Lecture'} • Mode: ${modeTitle} • Abdelrhman Fawzy MEDstudy OS</p>
  <hr style="border: none; border-top: 1px solid #E7DCD0; margin-bottom: 20px;" />
  <div class="lecture-content">
    ${contentHtml}
  </div>
</body>
</html>`;

    const blob = new Blob(['\ufeff' + htmlDocument], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download result as Markdown file (.md)
  const handleDownloadMd = () => {
    if (!resultText) return;
    const cleanContent = sanitizeMedicalMarkdown(resultText);
    const blob = new Blob([cleanContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name?.replace(/\.[^/.]+$/, '') || 'Lecture'}_${selectedMode}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Direct Download as PDF file (.pdf) with clean headings, highlights, bold and tables
  const handleDownloadPdf = async () => {
    if (!resultText) return;
    setIsExportingPdf(true);

    try {
      const modeTitle = LECTURE_MODES.find((m) => m.id === selectedMode)?.name || 'Medical Analysis';
      const docTitle = `${file?.name?.replace(/\.[^/.]+$/, '') || 'Lecture'}_${selectedMode}`;

      // Create dedicated A4 print container with valid coordinates (not offscreen negative)
      const printContainer = document.createElement('div');
      printContainer.id = 'pdf-export-render-target';
      printContainer.style.position = 'fixed';
      printContainer.style.left = '0';
      printContainer.style.top = '0';
      printContainer.style.zIndex = '-9999';
      printContainer.style.opacity = '1';
      printContainer.style.pointerEvents = 'none';
      printContainer.style.width = '794px'; // 210mm at 96 DPI
      printContainer.style.padding = '36px 44px';
      printContainer.style.boxSizing = 'border-box';
      printContainer.style.backgroundColor = '#FFFFFF';
      printContainer.style.color = '#1C1917';
      printContainer.style.fontFamily = "'Plus Jakarta Sans', Arial, -apple-system, sans-serif";
      printContainer.style.fontSize = '12px';
      printContainer.style.lineHeight = '1.6';
      printContainer.style.direction = 'ltr';
      printContainer.style.textAlign = 'left';

      const headerHtml = `
        <div style="border-bottom: 2px solid #D97706; padding-bottom: 12px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
            <h1 style="font-size: 20px; font-weight: 800; color: #1C1917; margin: 0; letter-spacing: -0.02em;">
              ${modeTitle}
            </h1>
            <span style="font-size: 11px; font-weight: 800; color: #B45309; background: #FEF3C7; padding: 3px 10px; border-radius: 999px; text-transform: uppercase;">
              MEDstudy OS
            </span>
          </div>
          <div style="font-size: 10.5px; color: #78716C; display: flex; gap: 16px;">
            <span><strong>Document:</strong> ${file?.name || 'Medical Lecture'}</span>
            <span><strong>Mode:</strong> ${modeTitle}</span>
            <span><strong>Platform:</strong> Abdelrhman Fawzy AI Ecosystem</span>
          </div>
        </div>
      `;

      const contentHtml = markdownContainerRef.current?.innerHTML || '';

      printContainer.innerHTML = `
        ${headerHtml}
        <div class="pdf-rendered-body">
          ${contentHtml}
        </div>
        <div style="margin-top: 28px; padding-top: 10px; border-top: 1px solid #E7E5E4; text-align: center; font-size: 9px; color: #A8A29E;">
          Abdelrhman Fawzy MEDstudy OS • Medical AI Lecture Studio • Generated for Medical Education
        </div>
      `;

      const styleEl = document.createElement('style');
      styleEl.innerHTML = `
        #pdf-export-render-target * {
          box-sizing: border-box !important;
        }
        #pdf-export-render-target h1 {
          font-size: 16px !important;
          font-weight: 800 !important;
          color: #1C1917 !important;
          margin-top: 20px !important;
          margin-bottom: 10px !important;
          border-bottom: 1.5px solid #E7DCD0 !important;
          padding-bottom: 4px !important;
          page-break-after: avoid !important;
        }
        #pdf-export-render-target h2 {
          font-size: 13.5px !important;
          font-weight: 700 !important;
          color: #78350F !important;
          margin-top: 16px !important;
          margin-bottom: 8px !important;
          page-break-after: avoid !important;
        }
        #pdf-export-render-target h3 {
          font-size: 12px !important;
          font-weight: 700 !important;
          color: #292524 !important;
          margin-top: 14px !important;
          margin-bottom: 6px !important;
          page-break-after: avoid !important;
        }
        #pdf-export-render-target h4 {
          font-size: 11px !important;
          font-weight: 700 !important;
          color: #3D3428 !important;
          margin-top: 12px !important;
          margin-bottom: 5px !important;
          page-break-after: avoid !important;
        }
        #pdf-export-render-target h5 {
          font-size: 10.5px !important;
          font-weight: 700 !important;
          color: #5A4F3D !important;
          margin-top: 10px !important;
          margin-bottom: 4px !important;
          page-break-after: avoid !important;
        }
        #pdf-export-render-target strong {
          font-weight: 700 !important;
          color: #78350F !important;
          background-color: #FEF08A !important;
          padding: 1px 4px !important;
          border-radius: 3px !important;
          box-decoration-break: clone !important;
          -webkit-box-decoration-break: clone !important;
        }
        #pdf-export-render-target table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 12px 0 !important;
          font-size: 9.5px !important;
          line-height: 1.4 !important;
          page-break-inside: auto !important;
        }
        #pdf-export-render-target thead {
          display: table-header-group !important;
        }
        #pdf-export-render-target tr {
          page-break-inside: avoid !important;
        }
        #pdf-export-render-target th {
          background-color: #F5EFE6 !important;
          color: #292524 !important;
          font-weight: 700 !important;
          border: 1px solid #D6C7B2 !important;
          padding: 5px 8px !important;
          text-align: left !important;
        }
        #pdf-export-render-target td {
          border: 1px solid #E7DCD0 !important;
          padding: 5px 8px !important;
          color: #292524 !important;
          vertical-align: top !important;
        }
        #pdf-export-render-target tr:nth-child(even) td {
          background-color: #FCF9F5 !important;
        }
        #pdf-export-render-target ul, #pdf-export-render-target ol {
          margin: 8px 0 !important;
          padding-left: 20px !important;
        }
        #pdf-export-render-target li {
          margin-bottom: 4px !important;
        }
      `;
      printContainer.appendChild(styleEl);
      document.body.appendChild(printContainer);

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      let success = false;
      try {
        await new Promise<void>((resolve, reject) => {
          doc.html(printContainer, {
            callback: (pdf) => {
              try {
                pdf.save(`${docTitle}.pdf`);
                success = true;
                resolve();
              } catch (e) {
                reject(e);
              }
            },
            x: 20,
            y: 20,
            width: 555,
            windowWidth: 794,
            autoPaging: 'text',
            html2canvas: {
              scale: 1.5,
              useCORS: true,
              logging: false,
              backgroundColor: '#FFFFFF',
            },
          });
        });
      } catch (docHtmlErr) {
        console.warn('doc.html attempt encountered an issue, running canvas renderer:', docHtmlErr);
      }

      if (!success) {
        const canvas = await html2canvas(printContainer, {
          scale: 1.5,
          useCORS: true,
          logging: false,
          backgroundColor: '#FFFFFF',
        });

        const imgWidth = 595.28 - 40;
        const pageHeight = 841.89 - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 20;

        const fallbackDoc = new jsPDF('p', 'pt', 'a4');
        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        fallbackDoc.addImage(imgData, 'JPEG', 20, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight + 20;
          fallbackDoc.addPage();
          fallbackDoc.addImage(imgData, 'JPEG', 20, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        fallbackDoc.save(`${docTitle}.pdf`);
      }

      document.body.removeChild(printContainer);
    } catch (err: any) {
      console.error('PDF export error:', err);
      setErrorMsg('حدث خطأ أثناء تحميل الـ PDF، يمكنك استخدام زر Print / PDF كخيار بديل مباشر.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Print or Save as PDF
  const handlePrint = () => {
    window.print();
  };

  // Helper icon for modes
  const renderModeIcon = (modeId: LectureMode) => {
    switch (modeId) {
      case 'tables':
        return <Table className="w-5 h-5" />;
      case 'qa':
        return <HelpCircle className="w-5 h-5" />;
      case 'zaytouna':
        return <Zap className="w-5 h-5" />;
      case 'memory':
        return <Brain className="w-5 h-5" />;
      case 'numbers':
        return <Hash className="w-5 h-5" />;
      case 'why':
        return <GitFork className="w-5 h-5" />;
    }
  };

  return (
    <section id="lecture-studio" className="py-16 px-4 sm:px-6 relative overflow-hidden font-cairo">
      {/* Background aesthetics matching Beige warmth */}
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-5xl font-black text-[#24211D] tracking-tight mb-2 font-sans lowercase">
            lecture digestion
          </h2>
          <p className="text-base sm:text-xl font-bold text-[#8C6D3F] max-w-2xl mx-auto" dir="rtl">
            ارفعلي المحاضر وسيبني اشوف شغلي
          </p>
        </div>

        {/* Main Workspace Card */}
        <div className="rounded-3xl bg-[#FBF8F2] border border-[#E3D9C9] p-6 sm:p-8 md:p-10 shadow-sm" dir="rtl">
          {/* STEP 1: Select Mode */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#8C6D3F] uppercase tracking-wider">
                1. اختر المود المطلوب
              </span>
              <span className="text-xs text-[#7E7465]">
                اضغط على المود لتفعيله وإضاءته
              </span>
            </div>

            {/* Grid of 6 Modes with ONLY English names and glowing effect when selected */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {LECTURE_MODES.map((mode) => {
                const isSelected = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedMode(mode.id)}
                    className={`relative p-5 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer min-h-[92px] ${
                      isSelected
                        ? 'border-2 border-amber-400 bg-gradient-to-b from-[#FFFDF7] to-[#FEF3C7]/40 text-amber-950 font-bold shadow-[0_0_24px_rgba(245,158,11,0.35)] ring-2 ring-amber-400/80 scale-[1.02]'
                        : 'border border-[#E2D6C3] bg-[#FAF7F2] text-[#5A4F3D] hover:border-[#D5C2A5] hover:bg-[#F5EFE6] opacity-90'
                    }`}
                  >
                    {/* Glowing highlight indicator */}
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 shadow-[0_0_8px_#F59E0B] flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                      </span>
                    )}

                    {/* Mode Icon */}
                    <div
                      className={`mb-2.5 transition-colors ${
                        isSelected ? 'text-amber-600' : 'text-[#8C6D3F]'
                      }`}
                    >
                      {renderModeIcon(mode.id)}
                    </div>

                    {/* STRICT REQUIREMENT: ONLY English name, NOTHING underneath */}
                    <span className="text-sm sm:text-base font-extrabold tracking-tight leading-snug">
                      {mode.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: File Upload Area */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#8C6D3F] uppercase tracking-wider">
                2. ملف المحاضرة
              </span>
              <button
                type="button"
                onClick={() => setIsTextInputOpen(!isTextInputOpen)}
                className="text-xs text-[#1E40AF] hover:underline flex items-center gap-1 font-semibold"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{isTextInputOpen ? 'الرجوع لرفع الملف' : 'أو الصق نص المحاضرة مباشرة'}</span>
              </button>
            </div>

            {!isTextInputOpen ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all duration-200 ${
                  file
                    ? 'border-emerald-500/80 bg-emerald-50/30'
                    : 'border-[#DACBB5] hover:border-[#F59E0B] bg-[#FAF7F2] hover:bg-[#F5ECE0]/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.md,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {file ? (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-[#24211D] text-base">{file.name}</p>
                      <p className="text-xs text-[#7E7465] mt-0.5">
                        الحجم: {(file.size / (1024 * 1024)).toFixed(2)} MB • اضغط لتغيير الملف
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#EFE7D8] text-[#6A5A43] flex items-center justify-center shadow-2xs">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-[#24211D] text-sm sm:text-base">
                        اسحب ملف المحاضرة هنا أو اضغط للاختيار
                      </p>
                      <p className="text-xs text-[#7E7465] mt-1">
                        يدعم ملفات PDF والمستندات النصية (TXT, MD)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <textarea
                  value={directText}
                  onChange={(e) => setDirectText(e.target.value)}
                  placeholder="انسخ والصق محتوى المحاضرة الطبية هنا..."
                  rows={6}
                  className="w-full rounded-2xl border border-[#DACBB5] bg-[#FAF7F2] p-4 text-sm text-[#24211D] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 placeholder:text-[#A09380]"
                />
                <p className="text-xs text-[#7E7465] mt-1 text-left" dir="ltr">
                  Characters: {directText.length}
                </p>
              </div>
            )}
          </div>

          {/* STEP 3: Medical AI Ready Status & Optional Key Settings */}
          <div className="mb-8 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="text-right">
                <span className="font-bold text-xs sm:text-sm text-emerald-950 block">
                  محرك الذكاء الاصطناعي الطبي متصل (Google Gemini Medical Engine)
                </span>
                {customApiKey ? (
                  <span className="text-[11px] text-emerald-700 block">
                    تم ربط مفتاح API مخصص للتشغيل المباشر على GitHub Pages
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-700 block">
                    يعمل تلقائياً عبر الخادم، ومتاح إضافة مفتاح للعمل بدون خادم
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setTempKeyInput(customApiKey);
                  setShowKeyModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 bg-white/90 hover:bg-emerald-100/60 text-emerald-900 text-xs font-bold transition-colors cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-emerald-700" />
                <span>{customApiKey ? 'تعديل المفتاح' : 'إعدادات المفتاح'}</span>
              </button>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>جاهز للمعالجة</span>
              </span>
            </div>
          </div>

          {/* Error Message Alert with Direct Resolution Button */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">تنبيه:</p>
                  <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
                </div>
              </div>
              {(errorMsg.includes('404') || errorMsg.includes('STATUS_404_STATIC_HOST') || !customApiKey) && (
                <button
                  type="button"
                  onClick={() => {
                    setTempKeyInput(customApiKey);
                    setShowKeyModal(true);
                  }}
                  className="shrink-0 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>إدخال مفتاح API للمتابعة فوراً</span>
                </button>
              )}
            </div>
          )}

          {/* STRICT REQUIREMENT: Progress Loading Bar when processing */}
          {isProcessing && (
            <div className="mb-8 p-6 rounded-2xl bg-amber-50/80 border border-amber-200">
              <div className="flex items-center justify-between text-xs font-bold text-amber-950 mb-2">
                <span>{progressStatus || 'جاري معالجة المحاضرة...'}</span>
                <span>{progressPercent}%</span>
              </div>
              {/* Animated Progress Bar */}
              <div className="w-full h-3 rounded-full bg-amber-200/60 overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 rounded-full transition-all duration-300 relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  {/* Subtle glowing bar pulse */}
                  <div className="absolute inset-0 bg-white/30 animate-pulse" />
                </div>
              </div>
              <p className="text-[11px] text-[#8C6D3F] mt-2 text-center">
                يتم الآن تجهيز المحاضرة بدقة متناهية وفق متطلبات المود المختار... يرجى الانتظار ثوانٍ معدودة.
              </p>
            </div>
          )}

          {/* Action Trigger Button */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleProcess}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${
                isProcessing
                  ? 'bg-[#DACBB5] text-[#7E7465] cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/20'
              }`}
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>
                {isProcessing ? 'جاري المعالجة والتحويل...' : 'ابدأ معالجة المحاضرة الآن'}
              </span>
            </button>
          </div>
        </div>

        {/* STEP 4: Results Display Section */}
        {resultText && (
          <div className="mt-10 rounded-3xl bg-[#FBF8F2] border border-[#E3D9C9] p-6 sm:p-9 shadow-sm" dir="ltr">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#E8DFD1]">
              <div className="text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Ready in English</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#24211D]">
                  {LECTURE_MODES.find((m) => m.id === selectedMode)?.name}
                </h3>
              </div>

              {/* Action Buttons: Download Options, Copy, Print, Reset */}
              <div className="flex items-center gap-2 flex-wrap no-print">
                <button
                  type="button"
                  disabled={isExportingPdf}
                  onClick={handleDownloadPdf}
                  className={`px-3.5 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer ${
                    isExportingPdf
                      ? 'bg-amber-400 cursor-wait'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                  title="تحميل فوري كملف PDF منسق وجاهز بدون رموز شباك مع هايلايتس وبولد"
                >
                  <Download className={`w-3.5 h-3.5 text-white ${isExportingPdf ? 'animate-bounce' : ''}`} />
                  <span>{isExportingPdf ? 'جاري تجهيز الـ PDF...' : 'Download .pdf'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadDoc}
                  className="px-3.5 py-2 rounded-xl bg-[#24211D] text-white hover:bg-[#3D3730] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                  title="تحميل كملف Word منسق يدعم الجداول والهايلايت"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download .doc (Word)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadMd}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#DACBB5] text-[#24211D] hover:bg-[#FAF7F2] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  title="تحميل كملف Markdown"
                >
                  <Download className="w-3.5 h-3.5 text-[#8C6D3F]" />
                  <span>Download .md</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-2 rounded-xl bg-white border border-[#DACBB5] text-[#24211D] hover:bg-[#FAF7F2] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  title="طباعة أو حفظ كملف PDF عبر المتصفح"
                >
                  <Printer className="w-3.5 h-3.5 text-[#5A4F3D]" />
                  <span>Print / PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyResult}
                  className="px-3 py-2 rounded-xl bg-white border border-[#DACBB5] text-[#24211D] hover:bg-[#FAF7F2] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setResultText(null)}
                  className="px-3 py-2 rounded-xl bg-[#EFE7D8] text-[#5C4F3B] hover:bg-[#E3D6C1] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="معالجة محاضرة جديدة"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>New Lecture</span>
                </button>
              </div>
            </div>

            {/* Markdown Viewer with rich table formatting in pure English LTR */}
            <div
              ref={markdownContainerRef}
              id="lecture-printable-area"
              className="prose prose-amber max-w-none text-[#2D2A26] leading-relaxed text-sm sm:text-base overflow-x-auto text-left font-sans"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({ ...props }) => (
                    <div className="my-6 overflow-x-auto rounded-2xl border border-[#DACBB5] shadow-2xs">
                      <table className="w-full text-left border-collapse bg-white font-sans text-sm" {...props} />
                    </div>
                  ),
                  thead: ({ ...props }) => (
                    <thead className="bg-[#EFE7D8] text-[#3D3221] border-b border-[#DACBB5] font-bold text-xs uppercase tracking-wider" {...props} />
                  ),
                  th: ({ ...props }) => (
                    <th className="px-4 py-3 border border-[#DACBB5] font-extrabold text-[#24211D]" {...props} />
                  ),
                  td: ({ ...props }) => (
                    <td className="px-4 py-2.5 border border-[#EADBCE] text-xs sm:text-sm leading-normal text-[#2D2A26]" {...props} />
                  ),
                  tr: ({ ...props }) => (
                    <tr className="even:bg-[#FAF7F2] hover:bg-amber-50/50 transition-colors" {...props} />
                  ),
                  h1: ({ ...props }) => (
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24211D] mt-8 mb-4 border-b border-[#E3D9C9] pb-2" {...props} />
                  ),
                  h2: ({ ...props }) => (
                    <h2 className="text-xl sm:text-2xl font-bold text-amber-900 mt-6 mb-3" {...props} />
                  ),
                  h3: ({ ...props }) => (
                    <h3 className="text-lg font-bold text-[#24211D] mt-5 mb-2" {...props} />
                  ),
                  h4: ({ ...props }) => (
                    <h4 className="text-base font-bold text-[#3D3428] mt-4 mb-2" {...props} />
                  ),
                  h5: ({ ...props }) => (
                    <h5 className="text-sm font-bold text-[#5A4F3D] mt-3 mb-1.5" {...props} />
                  ),
                  ul: ({ ...props }) => (
                    <ul className="list-disc list-inside space-y-1.5 my-3 pl-2" {...props} />
                  ),
                  ol: ({ ...props }) => (
                    <ol className="list-decimal list-inside space-y-1.5 my-3 pl-2" {...props} />
                  ),
                  strong: ({ ...props }) => (
                    <strong className="font-extrabold text-amber-950 bg-amber-200/80 px-1.5 py-0.5 rounded shadow-2xs mx-0.5 border border-amber-300/40 inline-block my-0.5" {...props} />
                  ),
                }}
              >
                {sanitizeMedicalMarkdown(resultText)}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Sleek API Key Modal for GitHub Pages & Custom Environments */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-[#FAF7F2] border border-[#DACBB5] p-6 sm:p-7 shadow-2xl relative text-right">
            <button
              type="button"
              onClick={() => setShowKeyModal(false)}
              className="absolute top-5 left-5 p-1.5 rounded-full hover:bg-[#EADBCE] text-[#7E7465] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#24211D]">
                  ربط مفتاح Gemini API
                </h3>
                <p className="text-xs text-[#7E7465]">
                  للتشغيل المباشر على GitHub Pages والاستضافات الثابتة
                </p>
              </div>
            </div>

            <p className="text-xs text-[#5D5548] leading-relaxed mb-4">
              إذا كنت تستخدم التطبيق من GitHub Pages أو بدون خادم Node نشط، يمكنك إدخال مفتاحك المجاني من Google AI Studio ليقوم المتصفح بمعالجة المحاضرة مباشرة دون أي أخطاء 404.
            </p>

            <div className="space-y-3 mb-5">
              <label className="block text-xs font-bold text-[#3D3428]">
                مفتاح API الخاص بك (Google AI Studio Key):
              </label>
              <input
                type="text"
                value={tempKeyInput}
                onChange={(e) => setTempKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                dir="ltr"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DACBB5] text-xs font-mono text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
              <div className="flex items-center justify-between text-[11px]">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-800 hover:text-amber-900 font-semibold inline-flex items-center gap-1 hover:underline"
                >
                  <span>الحصول على مفتاح مجاني من Google</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                {customApiKey && (
                  <button
                    type="button"
                    onClick={() => {
                      setTempKeyInput('');
                      handleSaveCustomKey('');
                    }}
                    className="text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                  >
                    حذف المفتاح المحفوظ
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#7E7465] hover:bg-[#EADBCE]/50 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => handleSaveCustomKey(tempKeyInput)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition-all cursor-pointer"
              >
                حفظ والمتابعة
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
