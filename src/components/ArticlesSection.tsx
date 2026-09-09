import React, { useState } from 'react';
import { BookOpen, Clock, ArrowRight, X, Sparkles, Share2, Check, Bookmark } from 'lucide-react';
import { ARTICLES } from '../data/articles';
import { Article } from '../types';

export const ArticlesSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  const handleShare = () => {
    if (navigator.share && selectedArticle) {
      navigator.share({
        title: selectedArticle.title,
        text: selectedArticle.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section id="articles" className="py-14 px-4 sm:px-6 bg-[#F4EFE6]/60 border-y border-[#E8DFD1]">
      <div className="max-w-5xl mx-auto">
        {/* Section Header as explicitly requested */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBE2D2] border border-[#D8C9B3] text-xs font-semibold text-[#5A4D39] uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[#8C6D3F]" />
            Cognitive Psychology & Habits
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#24211D] tracking-tight max-w-2xl mx-auto">
            Science-backed ideas for better studying and better habits.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#685E4F] max-w-2xl mx-auto">
            مقالات حصرية باللهجة المصرية تشرح كيمياء المخ، والتكرار المتباعد، وعلم النفس المعرفي لمساعدتك على التفوق بأقل مجهود.
          </p>
        </div>

        {/* Articles List / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ARTICLES.map((article, idx) => (
            <article
              key={article.id}
              className="flex flex-col justify-between rounded-2xl bg-[#FBF8F2] border border-[#E3D9C9] p-6 hover:border-[#DAC7AF] hover:shadow-md hover:bg-[#FFFDF9] transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#847867] mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EFE7D8] text-[#554937] font-semibold border border-[#DACBB5]">
                    مقال #{idx + 1}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium">
                    <Clock className="w-3 h-3 text-[#9A8D7C]" />
                    {article.readTime}
                  </span>
                </div>

                {/* Article Title */}
                <h3
                  className="font-cairo text-lg sm:text-xl font-bold text-[#24211D] mb-2 leading-snug cursor-pointer hover:text-[#8C6D3F] transition-colors"
                  dir="rtl"
                  onClick={() => setSelectedArticle(article)}
                >
                  {article.title}
                </h3>

                <p className="text-xs text-[#8A7E6E] font-medium mb-3">
                  {article.englishTitle}
                </p>

                {/* First few lines preview as instructed */}
                <p
                  className="font-cairo text-sm text-[#5D5345] leading-relaxed line-clamp-3 mb-5"
                  dir="rtl"
                >
                  {article.excerpt}
                </p>
              </div>

              {/* Read More button as requested */}
              <div className="pt-3 border-t border-[#EFE5D5] flex items-center justify-between">
                <span className="text-xs font-medium text-[#877A69]">
                  {article.category}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(article)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#2D2A26] text-[#FAF7F2] hover:bg-[#1C1A17] transition-all cursor-pointer shadow-2xs hover:gap-2"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-3 h-3 text-[#DACBB5]" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Full Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-[#FAF6EE] border border-[#DACBB5] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-[#E8DFD1] bg-[#F4EFE6] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E7DAC5] text-[#4A3E2F] text-xs font-bold">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-[#7A6E5D] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {selectedArticle.readTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Font size toggle */}
                <button
                  onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
                  className="px-2 py-1 text-xs font-bold rounded-md bg-[#EBE2D2] text-[#4F4332] hover:bg-[#DFD3BF] transition-colors"
                  title="Toggle font size"
                >
                  {fontSize === 'normal' ? 'A+' : 'A-'}
                </button>

                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-lg bg-[#EBE2D2] text-[#4F4332] hover:bg-[#DFD3BF] transition-colors cursor-pointer"
                  title="Share article"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-1.5 rounded-lg bg-[#E8DDD0] hover:bg-[#DBCABA] text-[#332B20] transition-colors cursor-pointer"
                  title="Close reader"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / Article Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div dir="rtl" className="text-right">
                <h2 className="font-cairo text-2xl sm:text-3xl font-extrabold text-[#24211D] leading-tight mb-2">
                  {selectedArticle.title}
                </h2>
                <div className="text-sm text-[#7D705F] font-sans font-medium" dir="ltr">
                  {selectedArticle.englishTitle}
                </div>
              </div>

              <div className="w-full h-px bg-[#E5DAC8]" />

              {/* Egyptian Arabic Paragraphs */}
              <div
                dir="rtl"
                className={`font-cairo text-[#383126] space-y-5 leading-loose ${
                  fontSize === 'large' ? 'text-lg' : 'text-base'
                }`}
              >
                {selectedArticle.content.map((para, pIdx) => {
                  const isSubheading = para.includes(':\n') || para.endsWith(':');
                  if (isSubheading) {
                    const parts = para.split(':\n');
                    return (
                      <div key={pIdx} className="space-y-2 pt-2">
                        <h3 className="text-xl font-bold text-[#1E1A16] text-[#8C6D3F]">
                          {parts[0]}
                        </h3>
                        {parts[1] && <p className="text-[#3A3329] leading-relaxed">{parts[1]}</p>}
                      </div>
                    );
                  }
                  return (
                    <p key={pIdx} className="leading-relaxed text-[#3A3329]">
                      {para}
                    </p>
                  );
                })}
              </div>

              {/* Fast Takeaway Box */}
              <div dir="rtl" className="p-5 rounded-2xl bg-[#EFE6D6] border border-[#DAC7AE] text-right">
                <div className="font-cairo font-bold text-[#2C2417] text-base mb-2 flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-[#8C6D3F]" />
                  ملخص سريع ومباشر للتطبيق:
                </div>
                <p className="font-cairo text-sm text-[#4E4334] leading-relaxed">
                  {selectedArticle.summary}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E8DFD1] bg-[#F4EFE6] flex items-center justify-between shrink-0 text-xs text-[#786D5D]">
              <span>Abdelrhman Ai • Evidence-Based Learning</span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-1.5 rounded-lg bg-[#2D2A26] text-[#FAF7F2] font-semibold hover:bg-black transition-colors"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
