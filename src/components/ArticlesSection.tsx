import React, { useState, useMemo } from 'react';
import { BookOpen, Clock, Sparkles, ChevronLeft, Search, X, Layers } from 'lucide-react';
import { ARTICLES } from '../data/articles';
import { Article } from '../types';

interface ArticlesSectionProps {
  onSelectArticle: (article: Article) => void;
}

type CategoryFilter = 'all' | 'techniques' | 'ai' | 'productivity' | 'mental';

interface CategoryOption {
  id: CategoryFilter;
  label: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'جميع المقالات' },
  { id: 'techniques', label: 'طرق وتقنيات المذاكرة' },
  { id: 'ai', label: 'الذكاء الاصطناعي والدراسة' },
  { id: 'productivity', label: 'الإنتاجية وتنظيم الوقت' },
  { id: 'mental', label: 'الصحة النفسية والتركيز' },
];

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ onSelectArticle }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered articles based on category and search query
  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      // Category filter
      let matchesCategory = true;
      if (selectedCategory === 'techniques') {
        matchesCategory = [
          'spaced-repetition',
          'active-recall',
          'al-moragaa',
          'common-study-mistakes',
          'interleaving-study-method',
        ].includes(article.id);
      } else if (selectedCategory === 'ai') {
        matchesCategory = [
          'ask-dad-gem',
          'ai-retrieval-illusion',
          'passive-ai-pitfall',
          'fun-studying-with-ai',
          'notebook-gemini-guide',
          'three-ai-study-recommendations',
        ].includes(article.id);
      } else if (selectedCategory === 'productivity') {
        matchesCategory = [
          'perfectionism',
          'procrastination',
          'when-to-start-studying',
          'study-with-fun',
        ].includes(article.id);
      } else if (selectedCategory === 'mental') {
        matchesCategory = [
          'burnout-root-causes',
          'fighting-study-boredom',
          'handling-exam-emotions',
          'dua-for-studying',
          'deep-focus-system',
        ].includes(article.id);
      }

      // Search filter
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        article.arabicTitle.toLowerCase().includes(query) ||
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="articles" className="py-14 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE7D8] border border-[#DACBB5] text-xs font-semibold text-[#5A4D39] uppercase tracking-wider mb-3">
          <BookOpen className="w-3.5 h-3.5 text-[#8C6D3F]" />
          <span>Medical Study Playbooks • مقالات المذاكرة الذكية</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#24211D] tracking-tight max-w-3xl mx-auto leading-snug">
          مقالات المذاكرة الذكية: تجارب حقيقية من كلية الطب
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#6E6454] max-w-2xl mx-auto leading-relaxed font-cairo" dir="rtl">
          المقالات غالباً هتغير طريقة مذاكرتك.. لو قلقان من التغيير ابدأ بخطوات بسيطة وأهم حاجة الاستمرارية والتطوير بيجي مع الوقت إن شاء الله.
        </p>
      </div>

      {/* Search and Category Filters Bar */}
      <div className="mb-8 space-y-4" dir="rtl">
        {/* Search Input Box */}
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#8C6D3F]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في عناوين ومحتوى المقالات..."
            className="w-full pr-10 pl-10 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#DACBB5] text-xs sm:text-sm text-[#24211D] placeholder-[#8A7F70] focus:outline-none focus:ring-2 focus:ring-[#8C6D3F]/40 focus:bg-[#FBF8F2] transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#8A7F70] hover:text-[#24211D] transition-colors cursor-pointer"
              title="مسح البحث"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#8C6D3F] text-[#FAF7F2] shadow-xs'
                    : 'bg-[#F2ECE1] text-[#5A4D3A] hover:bg-[#EBE2D2] border border-[#DACBB5]/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" dir="rtl">
          {filteredArticles.map((article) => {
            return (
              <a
                key={article.id}
                href={`/article/${article.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectArticle(article);
                }}
                className="group relative rounded-3xl border border-[#E8DFD1] bg-[#FAF7F2] p-6 sm:p-7 hover:border-[#DACBB5] hover:bg-[#FBF8F2] hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between block no-underline"
              >
                <div>
                  {/* Top meta row */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EBE2D2] text-[#5A4D3A] border border-[#DACBB5]">
                      {article.category}
                    </span>
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
                  <span>اقرأ المقال في صفحته المستقلة</span>
                  <div className="w-7 h-7 rounded-full bg-[#EBE2D2] border border-[#DACBB5] flex items-center justify-center group-hover:bg-[#8C6D3F] group-hover:text-[#FAF7F2] group-hover:border-[#8C6D3F] transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 px-4 rounded-3xl bg-[#FAF7F2] border border-[#DACBB5] max-w-md mx-auto" dir="rtl">
          <Layers className="w-8 h-8 text-[#8C6D3F] mx-auto mb-3 opacity-60" />
          <h4 className="text-base font-bold text-[#24211D] mb-1">لم يتم العثور على مقالات مطابقة</h4>
          <p className="text-xs text-[#7E7465] mb-4">جرب البحث بكلمة أخرى أو اختر تصنيفاً مختلفاً.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-[#8C6D3F] text-[#FAF7F2] text-xs font-bold hover:bg-[#73572E] transition-colors cursor-pointer"
          >
            عرض جميع المقالات
          </button>
        </div>
      )}
    </section>
  );
};
