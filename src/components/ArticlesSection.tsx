import React from 'react';
import { BookOpen, Clock, ArrowLeft, Sparkles, ChevronLeft } from 'lucide-react';
import { ARTICLES } from '../data/articles';
import { Article } from '../types';

interface ArticlesSectionProps {
  onSelectArticle: (article: Article) => void;
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ onSelectArticle }) => {
  return (
    <section id="articles" className="py-14 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE7D8] border border-[#DACBB5] text-xs font-semibold text-[#5A4D39] uppercase tracking-wider mb-3">
          <BookOpen className="w-3.5 h-3.5 text-[#8C6D3F]" />
          Medical Study Playbooks
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#24211D] tracking-tight max-w-3xl mx-auto leading-snug">
          مقالات المذاكرة الذكية: تجارب حقيقية من كلية الطب
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#6E6454] max-w-2xl mx-auto leading-relaxed font-cairo" dir="rtl">
          المقالات غالبا هتغير طريقة مذاكرتك , لو قلقان من التغيير ابدا بخطوات بسيطه واهم حاجه الاستمراريه والتطوير بيجي مع الوقت ان شاء الله
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" dir="rtl">
        {ARTICLES.map((article, idx) => {
          const isFirst = idx === 0;
          return (
            <article
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className={`group relative rounded-3xl border p-6 sm:p-7 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isFirst
                  ? 'md:col-span-2 bg-[#FBF8F2] border-[#DFCBB0] shadow-xs hover:border-[#8C6D3F] hover:shadow-md hover:-translate-y-0.5'
                  : 'bg-[#FAF7F2] border-[#E8DFD1] hover:border-[#DACBB5] hover:bg-[#FBF8F2] hover:shadow-xs hover:-translate-y-0.5'
              }`}
            >
              <div>
                {/* Top meta row */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EBE2D2] text-[#5A4D3A] border border-[#DACBB5]">
                      {article.category}
                    </span>
                    {isFirst && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                        <Sparkles className="w-3 h-3 text-[#B45309]" />
                        المقال الافتتاحي
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#8A7F70]">
                    <Clock className="w-3.5 h-3.5 text-[#A28148]" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                {/* Article Title */}
                <h3 className="text-lg sm:text-xl font-bold text-[#24211D] group-hover:text-[#8C6D3F] transition-colors leading-snug mb-2 font-cairo">
                  {article.arabicTitle}
                </h3>

                {/* Article Short Summary */}
                <p className="text-xs sm:text-sm text-[#615647] font-normal leading-relaxed line-clamp-3 mb-5">
                  {article.summary}
                </p>
              </div>

              {/* Read Action CTA */}
              <div className="pt-4 border-t border-[#EDE4D6] flex items-center justify-between text-xs font-semibold text-[#8C6D3F] group-hover:text-[#5A4523] transition-colors">
                <span>اقرأ المقال كاملاً</span>
                <div className="w-7 h-7 rounded-full bg-[#EBE2D2] border border-[#DACBB5] flex items-center justify-center group-hover:bg-[#8C6D3F] group-hover:text-[#FAF7F2] group-hover:border-[#8C6D3F] transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
