import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  FileText,
  Key,
  ExternalLink,
  Sparkles,
  Check,
  Eye,
  EyeOff,
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

  // API Key state (saved in localStorage)
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('medstudy_gemini_api_key') || '';
  });
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [tempKey, setTempKey] = useState<string>('');
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [keySavedNotice, setKeySavedNotice] = useState(false);

  // Processing & progress states
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Output state
  const [resultText, setResultText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync temp key on mount
  useEffect(() => {
    if (apiKey) {
      setTempKey(apiKey);
    }
  }, [apiKey]);

  // Handle saving API key
  const handleSaveApiKey = (e?: React.FormEvent) => {
    e?.preventDefault();
    const clean = tempKey.trim();
    if (!clean) {
      setErrorMsg('يرجى إدخال مفتاح الـ API قبل التفعيل.');
      return;
    }
    setApiKey(clean);
    localStorage.setItem('medstudy_gemini_api_key', clean);
    setShowKeyInput(false);
    setErrorMsg(null);
    setKeySavedNotice(true);
    setTimeout(() => setKeySavedNotice(false), 3000);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setErrorMsg(null);
      // Prompt student for API key if not yet set
      if (!apiKey) {
        setShowKeyInput(true);
      }
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setErrorMsg(null);
      if (!apiKey) {
        setShowKeyInput(true);
      }
    }
  };

  // Start Lecture Processing
  const handleProcess = async () => {
    if (!file && !directText.trim()) {
      setErrorMsg('يرجى اختيار ملف المحاضرة (PDF أو TXT) أو لصق نص المحاضرة للبدء.');
      return;
    }

    if (!apiKey) {
      setShowKeyInput(true);
      setErrorMsg('يرجى إدخال مفتاح Google AI Studio Gemini API للمتابعة.');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);
    setProgressPercent(5);
    setProgressStatus('جاري فحص المحاضرة...');
    setResultText(null);

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
      const progressInterval = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev >= 92) {
            clearInterval(progressInterval);
            return 92;
          }
          return prev + 3;
        });
      }, 700);

      const generatedResult = await processLectureWithGemini({
        apiKey,
        mode: selectedMode,
        lectureText: rawText,
        fileName: file?.name || 'Medical Lecture Notes',
        onStatusUpdate: (status) => setProgressStatus(status),
      });

      clearInterval(progressInterval);
      setProgressPercent(100);
      setProgressStatus('تم اكتمال المعالجة بنجاح!');
      setResultText(generatedResult);
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء معالجة المحاضرة.');
    } finally {
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

  // Download result as Word-compatible document (.doc) with styling
  const handleDownloadDoc = () => {
    if (!resultText) return;
    const cleanContent = sanitizeMedicalMarkdown(resultText);
    const modeTitle = LECTURE_MODES.find((m) => m.id === selectedMode)?.name || 'Medical Analysis';
    const docTitle = `${file?.name?.replace(/\.[^/.]+$/, '') || 'Lecture'}_${selectedMode}`;

    const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${docTitle}</title>
  <style>
    body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #1e1e1e; margin: 30px; }
    h1 { color: #8C6D3F; font-size: 20pt; border-bottom: 2px solid #E2D6C3; padding-bottom: 6px; margin-bottom: 10px; }
    h2 { color: #5A472E; font-size: 15pt; margin-top: 20px; }
    h3 { color: #333333; font-size: 13pt; }
    p.meta { color: #666; font-size: 10pt; margin-bottom: 20px; font-style: italic; }
    pre { white-space: pre-wrap; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.6; }
  </style>
</head>
<body>
  <h1>${modeTitle}</h1>
  <p class="meta">Document: ${file?.name || 'Medical Lecture'} • Mode: ${modeTitle} • Abdelrhman Fawzy MEDstudy OS</p>
  <hr/>
  <pre>${cleanContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
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

  // Direct Download as PDF file (.pdf)
  const handleDownloadPdf = () => {
    if (!resultText) return;
    const cleanContent = sanitizeMedicalMarkdown(resultText);
    const modeTitle = LECTURE_MODES.find((m) => m.id === selectedMode)?.name || 'Medical Analysis';
    const docTitle = `${file?.name?.replace(/\.[^/.]+$/, '') || 'Lecture'}_${selectedMode}`;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const maxLineWidth = pageWidth - margin * 2;

    // Header Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(36, 33, 29);
    doc.text(modeTitle, margin, 45);

    // Subtitle / Document Info
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(140, 109, 63);
    doc.text(`Document: ${file?.name || 'Medical Lecture'} • MEDstudy OS by Abdelrhman Fawzy`, margin, 60);

    // Separator Line
    doc.setDrawColor(226, 214, 195);
    doc.setLineWidth(1);
    doc.line(margin, 68, pageWidth - margin, 68);

    // Body text formatting
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(45, 42, 38);

    const lines = doc.splitTextToSize(cleanContent, maxLineWidth);
    let y = 88;
    const lineHeight = 13;

    for (let i = 0; i < lines.length; i++) {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      const currentLine = lines[i];
      if (currentLine.startsWith('# ')) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(36, 33, 29);
        y += 6;
        doc.text(currentLine.replace(/^#\s*/, ''), margin, y);
        y += 3;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(45, 42, 38);
      } else if (currentLine.startsWith('## ') || currentLine.startsWith('### ')) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(140, 109, 63);
        y += 5;
        doc.text(currentLine.replace(/^###?\s*/, ''), margin, y);
        y += 2;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(45, 42, 38);
      } else {
        doc.text(currentLine, margin, y);
      }
      y += lineHeight;
    }

    doc.save(`${docTitle}.pdf`);
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

          {/* STEP 3: API Key Section (Prompt user for API Key + Google AI Studio Link Button) */}
          <div className="mb-8 p-5 rounded-2xl bg-[#F4ECE1] border border-[#DACBB5]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#F59E0B]" />
                <span className="font-bold text-sm text-[#24211D]">
                  مفتاح Google AI Studio API:
                </span>
                {apiKey ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>المفتاح مفعل ومحفوظ</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    <span>مطلوب تفعيل المفتاح</span>
                  </span>
                )}
              </div>

              {/* Toggle input card or change key */}
              <button
                type="button"
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="text-xs text-[#1E40AF] hover:underline font-semibold"
              >
                {apiKey ? (showKeyInput ? 'إخفاء الإعدادات' : 'تغيير المفتاح') : 'إدخال المفتاح الآن'}
              </button>
            </div>

            {/* Notice when key saved */}
            {keySavedNotice && (
              <div className="mb-3 text-xs text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>تم حفظ وتفعيل مفتاح Google AI Studio بنجاح!</span>
              </div>
            )}

            {/* Input Form with Save Button & Google AI Studio Link Button side-by-side */}
            {(showKeyInput || !apiKey) && (
              <form onSubmit={handleSaveApiKey} className="space-y-3 pt-2">
                <div className="relative">
                  <input
                    type={isKeyVisible ? 'text' : 'password'}
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder="ألصق مفتاح الـ API هنا (AIzaSy...)"
                    className="w-full rounded-xl border border-[#DACBB5] bg-white px-4 py-2.5 text-sm text-[#24211D] pr-10 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setIsKeyVisible(!isKeyVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C6D3F] hover:text-[#24211D]"
                    title={isKeyVisible ? 'إخفاء' : 'إظهار'}
                  >
                    {isKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* STRICT REQUIREMENT: Activation button + Google AI Studio website button right beside it */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#24211D] hover:bg-[#3D3730] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>تفعيل المفتاح</span>
                  </button>

                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#1E40AF] border border-[#DACBB5] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 hover:border-[#1E40AF] active:scale-95"
                  >
                    <span>الحصول على مفتاح من Google AI Studio</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-[11px] text-[#7E7465] leading-relaxed">
                  * المفتاح مجاني تماماً ويُحفظ محلياً على متصفحك فقط لإرسال المحاضرة مباشرة عبر سيرفرات جوجل الذكية بأعلى سرعة وأمان.
                </p>
              </form>
            )}
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">تنبيه:</p>
                <p className="mt-0.5">{errorMsg}</p>
              </div>
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
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                  title="تحميل فوري كملف PDF قابل للحفظ"
                >
                  <Download className="w-3.5 h-3.5 text-white" />
                  <span>Download .pdf</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadDoc}
                  className="px-3.5 py-2 rounded-xl bg-[#24211D] text-white hover:bg-[#3D3730] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                  title="تحميل كملف Word يدعم الجداول بالكامل"
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
                  title="طباعة أو حفظ كملف PDF"
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
            <div className="prose prose-amber max-w-none text-[#2D2A26] leading-relaxed text-sm sm:text-base overflow-x-auto text-left font-sans">
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
                  ul: ({ ...props }) => (
                    <ul className="list-disc list-inside space-y-1.5 my-3 pl-2" {...props} />
                  ),
                  ol: ({ ...props }) => (
                    <ol className="list-decimal list-inside space-y-1.5 my-3 pl-2" {...props} />
                  ),
                  strong: ({ ...props }) => (
                    <strong className="font-extrabold text-amber-950 bg-amber-200/60 px-1 py-0.5 rounded shadow-2xs" {...props} />
                  ),
                }}
              >
                {sanitizeMedicalMarkdown(resultText)}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
