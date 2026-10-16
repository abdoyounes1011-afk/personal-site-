import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { WhySection } from './components/WhySection';
import { LectureStudioSection } from './components/LectureStudioSection';
import { ToolsSection } from './components/ToolsSection';
import { ArticlesSection } from './components/ArticlesSection';
import { ArticleModal } from './components/ArticleModal';
import { VideosSection } from './components/VideosSection';
import { CourseSection } from './components/CourseSection';
import { Footer } from './components/Footer';
import { PrivacyModal } from './components/PrivacyModal';
import { Article } from './types';

export default function App() {
  const [privacyTab, setPrivacyTab] = useState<'privacy' | 'terms' | 'disclaimer' | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2A26] font-sans antialiased">
      {/* Top Navigation */}
      <Header onOpenPrivacy={(tab) => setPrivacyTab(tab)} />

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
        <ArticlesSection onSelectArticle={(article) => setSelectedArticle(article)} />

        {/* YouTube Videos Section */}
        <VideosSection />

        {/* Flagship Course & Student Feedback */}
        <CourseSection />
      </main>

      {/* Footer with Contact Details & AdSense Info */}
      <Footer onOpenPrivacy={(tab) => setPrivacyTab(tab)} />

      {/* Interactive Article Reading Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}

      {/* Google AdSense Compliant Privacy & Terms Modal */}
      {privacyTab && (
        <PrivacyModal
          initialTab={privacyTab}
          onClose={() => setPrivacyTab(null)}
        />
      )}
    </div>
  );
}
