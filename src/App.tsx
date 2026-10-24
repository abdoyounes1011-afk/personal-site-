import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { WhySection } from './components/WhySection';
import { LectureStudioSection } from './components/LectureStudioSection';
import { ToolsSection } from './components/ToolsSection';
import { ArticlesSection } from './components/ArticlesSection';
import { ArticlePage } from './components/ArticlePage';
import { VideosSection } from './components/VideosSection';
import { CourseSection } from './components/CourseSection';
import { Footer } from './components/Footer';
import { LegalPage, LegalTab } from './components/LegalPage';
import { CookieBanner } from './components/CookieBanner';
import { Article } from './types';
import { ARTICLES } from './data/articles';

function parseArticleFromUrl(): Article | null {
  if (typeof window === 'undefined') return null;

  // 1. Check real path /article/:id or /articles/:id
  const pathname = window.location.pathname;
  const pathMatch = pathname.match(/^\/articles?\/([^/]+)\/?$/);
  if (pathMatch && pathMatch[1]) {
    const found = ARTICLES.find((a) => a.id === pathMatch[1]);
    if (found) return found;
  }

  // 2. Check hash fallback #article-:id
  const hash = window.location.hash;
  if (hash.startsWith('#article-')) {
    const articleId = hash.replace('#article-', '');
    const found = ARTICLES.find((a) => a.id === articleId);
    if (found) return found;
  }

  return null;
}

function parseLegalTabFromUrl(): LegalTab | null {
  if (typeof window === 'undefined') return null;
  const pathname = window.location.pathname.toLowerCase();

  if (pathname === '/privacy' || pathname === '/privacy-policy') return 'privacy';
  if (pathname === '/terms' || pathname === '/terms-of-service') return 'terms';
  if (pathname === '/disclaimer' || pathname === '/medical-disclaimer') return 'disclaimer';
  if (pathname === '/about' || pathname === '/about-us') return 'about';
  if (pathname === '/contact' || pathname === '/contact-us') return 'contact';

  return null;
}

export default function App() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(() => parseArticleFromUrl());
  const [legalTab, setLegalTab] = useState<LegalTab | null>(() => parseLegalTabFromUrl());

  // Synchronize route on browser back/forward and hash changes
  useEffect(() => {
    const syncRoute = () => {
      const legal = parseLegalTabFromUrl();
      if (legal) {
        setLegalTab(legal);
        setSelectedArticle(null);
        return;
      }
      setLegalTab(null);

      const article = parseArticleFromUrl();
      setSelectedArticle(article);
    };

    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  // Open an article in its dedicated URL page (/article/:id)
  const handleOpenArticle = (article: Article) => {
    setLegalTab(null);
    setSelectedArticle(article);
    const targetUrl = `/article/${article.id}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ articleId: article.id }, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Open a legal / compliance page (/privacy, /terms, /disclaimer, /about, /contact)
  const handleOpenLegal = (tab: LegalTab) => {
    setSelectedArticle(null);
    setLegalTab(tab);
    const targetUrl = `/${tab}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ legalTab: tab }, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Return to the main page & scroll smoothly
  const handleBackToHome = () => {
    setSelectedArticle(null);
    setLegalTab(null);
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Dedicated Legal & Policy Page (Privacy, Terms, Disclaimer, About, Contact)
  if (legalTab) {
    return (
      <div className="min-h-screen bg-[#FAF7F2]">
        <LegalPage
          initialTab={legalTab}
          onBack={handleBackToHome}
          onNavigateTab={handleOpenLegal}
        />
        <CookieBanner onOpenPrivacy={() => handleOpenLegal('privacy')} />
      </div>
    );
  }

  // 2. Dedicated Article Page (/article/:id)
  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-[#FAF7F2]">
        <ArticlePage
          article={selectedArticle}
          onBack={handleBackToHome}
          onSelectArticle={handleOpenArticle}
        />
        <CookieBanner onOpenPrivacy={() => handleOpenLegal('privacy')} />
      </div>
    );
  }

  // 3. Main Landing Page
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2A26] font-sans antialiased">
      {/* Top Navigation */}
      <Header onOpenLegal={handleOpenLegal} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Why does this website exist Section */}
        <WhySection />

        {/* AI Lecture Processing Studio - 4 Modes */}
        <LectureStudioSection />

        {/* 7 AI Gems Tools Section */}
        <ToolsSection />

        {/* Smart Medical Study Articles Section */}
        <ArticlesSection onSelectArticle={handleOpenArticle} />

        {/* YouTube Videos Section */}
        <VideosSection />

        {/* Flagship Course & Student Feedback */}
        <CourseSection />
      </main>

      {/* Footer with Contact Details & AdSense Info */}
      <Footer onOpenLegal={handleOpenLegal} />

      {/* Cookie Consent Banner for AdSense and GDPR */}
      <CookieBanner onOpenPrivacy={() => handleOpenLegal('privacy')} />
    </div>
  );
}
