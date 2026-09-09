import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { WhySection } from './components/WhySection';
import { ToolsSection } from './components/ToolsSection';
import { VideosSection } from './components/VideosSection';
import { ArticlesSection } from './components/ArticlesSection';
import { CourseSection } from './components/CourseSection';
import { Footer } from './components/Footer';
import { PrivacyModal } from './components/PrivacyModal';

export default function App() {
  const [privacyTab, setPrivacyTab] = useState<'privacy' | 'terms' | 'disclaimer' | null>(null);

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

        {/* 7 AI Gems Tools Section */}
        <ToolsSection />

        {/* YouTube Videos Section - Placed directly before articles */}
        <VideosSection />

        {/* Science-Backed Study Articles */}
        <ArticlesSection />

        {/* Flagship Course & Student Feedback */}
        <CourseSection />
      </main>

      {/* Footer with Contact Details & AdSense Info */}
      <Footer onOpenPrivacy={(tab) => setPrivacyTab(tab)} />

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
