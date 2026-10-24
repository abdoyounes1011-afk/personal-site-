import React, { useEffect, useState } from 'react';
import { 
  ArrowRight, 
  Clock, 
  Tag, 
  Share2, 
  Check, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Home, 
  Compass,
  BookmarkCheck
} from 'lucide-react';
import { Article } from '../types';
import { ARTICLES } from '../data/articles';

interface ArticlePageProps {
  article: Article;
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({ 
  article, 
  onBack, 
  onSelectArticle 
}) => {
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // SEO & Head Metadata synchronization for search engine indexing
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const fullTitle = `${article.arabicTitle} | د. عبدالرحمن يونس`;
    document.title = fullTitle;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', article.summary);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    const articleCanonicalUrl = `${window.location.origin}/article/${article.id}`;
    canonical.setAttribute('href', articleCanonicalUrl);

    // Update robots meta tag
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // Update OpenGraph properties
    const setOg = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };
    setOg('og:title', fullTitle);
    setOg('og:description', article.summary);
    setOg('og:url', articleCanonicalUrl);
    setOg('og:type', 'article');

    // Inject Schema.org JSON-LD structured data for article indexing
    let jsonLdScript = document.getElementById('article-schema-script');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'article-schema-script';
      jsonLdScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": articleCanonicalUrl
      },
      "headline": article.arabicTitle,
      "description": article.summary,
      "articleSection": article.category,
      "image": `${window.location.origin}/og-image.png`,
      "author": {
        "@type": "Person",
        "name": "د. عبدالرحمن يونس",
        "jobTitle": "طبيب وباحث في تقنيات المذاكرة الطبية والذكاء الاصطناعي"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Abdelrhman Ai",
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/icon-512.png`
        }
      },
      "datePublished": "2025-01-01",
      "dateModified": "2026-10-23"
    });

    return () => {
      document.title = 'د. عبدالرحمن يونس | Abdelrhman Ai';
      jsonLdScript?.remove();
    };
  }, [article]);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut: Escape to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/article/${article.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Find previous and next articles
  const currentIndex = ARTICLES.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? ARTICLES[currentIndex - 1] : null;
  const nextArticle = currentIndex < ARTICLES.length - 1 ? ARTICLES[currentIndex + 1] : null;

  // Related articles (same category or others, excluding current)
  const relatedArticles = ARTICLES.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3);
  const fallbackRelated = relatedArticles.length > 0 
    ? relatedArticles 
    : ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);

  // Formatter for rich paragraphs
  const renderParagraph = (text: string, index: number) => {
    const trimmed = text.trim();

    // Quranic verses or Dua
    const isQuran = trimmed.startsWith('قال تعالى') || 
                    trimmed.includes('﴿') || 
                    trimmed.includes('﴾') || 
                    trimmed.startsWith('﴿');
    if (isQuran) {
      return (
        <div key={index} className="my-6 p-5 sm:p-6 rounded-3xl bg-[#F5ECE0] border-2 border-[#DFCBB0] text-[#4A3D2C] shadow-xs text-center">
          <div className="flex items-center justify-center gap-2 mb-2 text-[#8C6D3F]">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold tracking-wider">آية كريمة</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-base sm:text-lg font-bold font-serif leading-loose text-[#2D2418]">
            {trimmed}
          </p>
        </div>
      );
    }

    // Hadiths or Core Quotes
    const isQuote = trimmed.startsWith('"') || 
                    trimmed.startsWith('«') || 
                    trimmed.startsWith('قال رسول الله') || 
                    trimmed.includes('صلى الله عليه وسلم');
    if (isQuote) {
      return (
        <blockquote key={index} className="my-5 p-4 sm:p-5 rounded-2xl bg-[#F8F2E8] border-r-4 border-[#8C6D3F] text-[#443828] font-medium italic shadow-2xs leading-relaxed">
          {trimmed}
        </blockquote>
      );
    }

    // Subheadings / Key Question Headers
    const isHeading = trimmed.startsWith('طب إيه') || 
                      trimmed.startsWith('إزاي') || 
                      trimmed.startsWith('ليه') || 
                      trimmed.startsWith('أولاً') || 
                      trimmed.startsWith('ثانياً') || 
                      trimmed.startsWith('ثالثاً') || 
                      trimmed.startsWith('رابعاً') || 
                      trimmed.startsWith('خامساً') ||
                      (trimmed.endsWith('؟') && trimmed.length < 70);
    if (isHeading) {
      return (
        <h3 key={index} className="text-lg sm:text-xl font-bold text-[#24211D] pt-4 pb-1 border-b border-[#E8DFD1]/60 font-cairo">
          {trimmed}
        </h3>
      );
    }

    // Bullet points
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
      return (
        <div key={index} className="flex items-start gap-3 my-2 pr-2 text-[#3D3528]">
          <span className="w-2 h-2 rounded-full bg-[#8C6D3F] mt-2.5 shrink-0" />
          <p className="text-sm sm:text-base leading-relaxed flex-1">
            {trimmed.replace(/^[-•*]\s*/, '')}
          </p>
        </div>
      );
    }

    // Standard paragraph
    return (
      <p key={index} className="text-sm sm:text-base text-[#383127] leading-relaxed sm:leading-loose">
        {trimmed}
      </p>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#24211D] font-sans antialiased" dir="rtl">
      {/* Sticky Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#E8DFD1] z-50">
        <div 
          className="h-full bg-gradient-to-r from-[#B4884B] to-[#8C6D3F] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Page Header Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#DACBB5] px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Back Navigation Button */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#F2ECE1] hover:bg-[#8C6D3F] text-[#423728] hover:text-[#FAF7F2] border border-[#DACBB5] text-xs sm:text-sm font-bold transition-all cursor-pointer group shadow-2xs"
            title="العودة إلى جميع المقالات"
          >
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            <span>العودة إلى المقالات</span>
          </button>

          {/* Breadcrumbs Navigation with Crawlable Anchors */}
          <div className="hidden md:flex items-center gap-2 text-xs text-[#7A6F5E] truncate">
            <a 
              href="/" 
              onClick={(e) => { e.preventDefault(); onBack(); }} 
              className="hover:text-[#8C6D3F] transition-colors cursor-pointer flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </a>
            <span>/</span>
            <a 
              href="/#articles" 
              onClick={(e) => { e.preventDefault(); onBack(); }} 
              className="hover:text-[#8C6D3F] transition-colors cursor-pointer"
            >
              المقالات
            </a>
            <span>/</span>
            <span className="font-semibold text-[#24211D] truncate max-w-xs">
              {article.arabicTitle}
            </span>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#DACBB5] text-xs font-semibold text-[#5A4D39] transition-all cursor-pointer shadow-2xs"
              title="نسخ رابط المقال"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">تم النسخ</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#8C6D3F]" />
                  <span className="hidden sm:inline">مشاركة</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Article Container */}
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6">
        <article className="max-w-3xl mx-auto" itemScope itemType="https://schema.org/Article">
          {/* Article Header Metadata */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EFE7D8] text-[#5A4D3A] border border-[#DACBB5]" itemProp="articleSection">
                <Tag className="w-3.5 h-3.5 text-[#8C6D3F]" />
                {article.category}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5EFE6] text-[#7A6F5E] border border-[#E2D6C4]">
                <Clock className="w-3.5 h-3.5 text-[#A28148]" />
                وقت القراءة: {article.readTime}
              </span>
            </div>

            {/* Main Article Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#24211D] tracking-tight leading-snug font-cairo" itemProp="headline">
              {article.arabicTitle}
            </h1>

            {/* English Title if distinct and meaningful */}
            {article.title && article.title !== article.arabicTitle && (
              <p className="text-xs sm:text-sm font-semibold text-[#8C6D3F] uppercase tracking-wider">
                {article.title}
              </p>
            )}
          </div>

          {/* Article Summary Box */}
          <div className="bg-[#F5ECE0] border-r-4 border-[#8C6D3F] p-4 sm:p-6 rounded-3xl border border-[#E5D7C3] mb-8 shadow-xs">
            <div className="flex items-center gap-2 mb-2 text-[#8C6D3F] text-xs font-bold">
              <BookmarkCheck className="w-4 h-4" />
              <span>خلاصة المقال</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-[#3D3528] leading-relaxed" itemProp="description">
              {article.summary}
            </p>
          </div>

          {/* Article Full Content */}
          <div className="space-y-4 font-cairo bg-[#FAF7F2] rounded-3xl" itemProp="articleBody">
            {article.content.map((paragraph, idx) => renderParagraph(paragraph, idx))}
          </div>

          {/* Completion Badge */}
          <div className="mt-12 p-6 rounded-3xl bg-[#F5ECE0]/70 border border-[#DACBB5] text-center">
            <div className="w-10 h-10 rounded-full bg-[#EBE2D2] border border-[#DACBB5] flex items-center justify-center mx-auto mb-3 text-[#8C6D3F]">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#24211D] mb-1">
              أحسنت! أتممت قراءة المقال
            </h4>
            <p className="text-xs sm:text-sm text-[#6E6454] max-w-md mx-auto mb-4">
              خطوة صغيرة تطبقها من هذا المقال كل يوم ستصنع فارقاً حقيقياً في رحلتك الدراسية.
            </p>
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-2xl bg-[#8C6D3F] hover:bg-[#73572E] text-[#FAF7F2] text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <span>العودة لجميع المقالات</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Previous & Next Article Navigation with Crawlable Anchors */}
          <div className="mt-8 pt-8 border-t border-[#E8DFD1] grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevArticle ? (
              <a
                href={`/article/${prevArticle.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectArticle(prevArticle);
                }}
                className="group p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5ECE0] border border-[#DACBB5] text-right transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs block no-underline"
              >
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-[#8C6D3F] flex items-center gap-1 mb-1">
                    <ChevronRight className="w-3.5 h-3.5" />
                    المقال السابق
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-[#24211D] group-hover:text-[#8C6D3F] transition-colors truncate">
                    {prevArticle.arabicTitle}
                  </p>
                </div>
              </a>
            ) : <div className="hidden sm:block" />}

            {nextArticle ? (
              <a
                href={`/article/${nextArticle.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectArticle(nextArticle);
                }}
                className="group p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5ECE0] border border-[#DACBB5] text-left sm:text-left transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs block no-underline"
              >
                <div className="min-w-0 flex-1 text-right sm:text-left">
                  <span className="text-[11px] font-semibold text-[#8C6D3F] flex items-center justify-start sm:justify-end gap-1 mb-1">
                    المقال التالي
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-[#24211D] group-hover:text-[#8C6D3F] transition-colors truncate">
                    {nextArticle.arabicTitle}
                  </p>
                </div>
              </a>
            ) : <div className="hidden sm:block" />}
          </div>

          {/* Related Articles Cards with Crawlable Anchors */}
          {fallbackRelated.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[#E8DFD1]">
              <div className="flex items-center gap-2 mb-4 text-[#8C6D3F]">
                <Compass className="w-4 h-4" />
                <h3 className="text-sm font-bold text-[#24211D]">مقالات قد تهمك أيضاً</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {fallbackRelated.map((rel) => (
                  <a
                    key={rel.id}
                    href={`/article/${rel.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectArticle(rel);
                    }}
                    className="p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#FBF8F2] border border-[#E8DFD1] hover:border-[#DACBB5] transition-all cursor-pointer group flex flex-col justify-between shadow-2xs block no-underline"
                  >
                    <div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EBE2D2] text-[#5A4D3A] inline-block mb-2">
                        {rel.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-[#24211D] group-hover:text-[#8C6D3F] transition-colors line-clamp-2 leading-snug mb-1 font-cairo">
                        {rel.arabicTitle}
                      </h4>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-[#8C6D3F] font-semibold">
                      <span>اقرأ المقال</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      {/* Page Footer */}
      <footer className="mt-12 py-6 border-t border-[#DACBB5] bg-[#F5ECE0]/60 text-center text-xs text-[#7A6F5E]">
        <p>© {new Date().getFullYear()} د. عبدالرحمن يونس • جميع المقالات مخصصة لطلاب الطب والعلم</p>
      </footer>
    </div>
  );
};
