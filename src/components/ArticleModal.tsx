import React, { useEffect } from 'react';
import { X, BookOpen, Clock, Tag, ArrowRight, Share2, Check } from 'lucide-react';
import { Article } from '../types';

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '#article-' + article.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#FAF7F2] rounded-3xl border border-[#DACBB5] shadow-2xl flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-[#E8DFD1] bg-[#F5ECE0]/80 backdrop-blur-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6D3F]">
            <BookOpen className="w-4 h-4 text-[#8C6D3F]" />
            <span>مقالات المذاكرة الذكية</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="مشاركة رابط المقال"
              className="p-2 rounded-xl text-[#7E7465] hover:text-[#2D2A26] hover:bg-[#EBE2D2] transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#7E7465] hover:text-[#2D2A26] hover:bg-[#EBE2D2] transition-colors cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Article Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 md:px-10 py-6 sm:py-8" dir="rtl">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4 text-xs font-medium">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBE2D2] text-[#5A4D3A] border border-[#DACBB5]">
              <Tag className="w-3 h-3 text-[#8C6D3F]" />
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4EB] text-[#7E7465] border border-[#E8DDCD]">
              <Clock className="w-3 h-3 text-[#A28148]" />
              وقت القراءة: {article.readTime}
            </span>
          </div>

          {/* Article Title */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24211D] tracking-tight leading-snug mb-3 font-cairo">
            {article.arabicTitle}
          </h2>

          {/* Subtle English subtitle if distinct */}
          {article.title !== article.arabicTitle && (
            <p className="text-xs sm:text-sm font-semibold text-[#8C6D3F] mb-6 uppercase tracking-wider">
              {article.title}
            </p>
          )}

          {/* Article Summary Box */}
          <div className="bg-[#F5ECE0] border-r-4 border-[#8C6D3F] p-4 sm:p-5 rounded-2xl border border-[#E5D7C3]/80 mb-8 shadow-xs">
            <p className="text-sm sm:text-base font-medium text-[#3D3528] leading-relaxed">
              {article.summary}
            </p>
          </div>

          {/* Article Paragraphs with Rich Semantic Formatting */}
          <div className="space-y-4 font-cairo text-[#2D2A26] text-sm sm:text-base leading-relaxed sm:leading-loose">
            {article.content.map((paragraph, index) => {
              const trimmed = paragraph.trim();

              // Quranic verse
              if (trimmed.startsWith('﴿') || (trimmed.includes('﴿') && trimmed.includes('﴾'))) {
                return (
                  <div
                    key={index}
                    className="my-5 p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-950 font-serif text-base sm:text-lg text-center leading-loose shadow-2xs"
                  >
                    <span className="font-bold text-amber-900">{trimmed}</span>
                  </div>
                );
              }

              // Hadith or sacred quotation in «...»
              if (trimmed.startsWith('«') && trimmed.endsWith('»')) {
                return (
                  <div
                    key={index}
                    className="my-4 p-3.5 sm:p-4 rounded-xl bg-[#F4EDE2] border-r-4 border-[#8C6D3F] text-[#3D3528] font-semibold text-sm sm:text-base"
                  >
                    <span>{trimmed}</span>
                  </div>
                );
              }

              // Section Sub-headings (e.g. أولًا:, 1., الخلاصة, أسباب, etc.)
              const isSubHeading = 
                /^(أولًا|ثانيًا|تالتًا|رابعًا|خامسًا|الخلاصة|توصيتي|أول غلطة|الغلطة|أول ميزة|1\.|2\.|3\.|4\.|5\.)/i.test(trimmed) ||
                (trimmed.length < 50 && (trimmed.endsWith(':') || trimmed.endsWith('؟') || trimmed.startsWith('**')));

              if (isSubHeading && !trimmed.includes('؟ لأنك')) {
                const cleanHeading = trimmed.replace(/\*\*/g, '');
                return (
                  <h4
                    key={index}
                    className="text-base sm:text-lg font-bold text-[#24211D] pt-4 pb-1 border-b border-[#E8DFD1]/60 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-4.5 rounded-full bg-[#8C6D3F]" />
                    <span>{cleanHeading}</span>
                  </h4>
                );
              }

              // Bullet points
              if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
                return (
                  <div key={index} className="flex items-start gap-2.5 pr-2 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D3F] mt-2.5 shrink-0" />
                    <span className="text-[#3A3329] font-medium leading-relaxed">{trimmed.replace(/^[•\-]\s*/, '')}</span>
                  </div>
                );
              }

              // Highlight key insight or callout
              const isCallout = trimmed.startsWith('المهم إن') || trimmed.startsWith('والسؤال ده لوحده') || trimmed.startsWith('طب إيه هو') || trimmed.startsWith('القاعدة دي');

              return (
                <p 
                  key={index}
                  className={
                    isCallout
                      ? "p-3.5 rounded-xl bg-[#FAF3E8] border border-[#E7DAC6] font-semibold text-[#24211D]"
                      : "text-[#3A3329]"
                  }
                >
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* Footer of the article */}
          <div className="mt-10 pt-6 border-t border-[#E8DFD1] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#7E7465] font-medium text-center sm:text-right">
              كتب بواسطة عبدالرحمن • مؤسس Abdelrhman Fawzy
            </div>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2D2A26] text-[#FAF7F2] hover:bg-[#1A1816] transition-colors text-xs font-semibold shadow-xs cursor-pointer"
            >
              <span>العودة لصفحة المقالات</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
