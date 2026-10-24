import React from 'react';
import { Sparkles, GraduationCap, Shield, Youtube, BookOpen, Upload, User } from 'lucide-react';

interface HeaderProps {
  onOpenLegal: (tab: 'privacy' | 'terms' | 'disclaimer' | 'about' | 'contact') => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLegal }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DFD1]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo / Personal Brand */}
        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#DACBB5] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform bg-[#FBF8F2]">
            <img
              src="/favicon.svg"
              alt="د. عبدالرحمن يونس"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-bold text-[#2D2A26] text-base tracking-tight block leading-tight">
              Abdelrhman Ai
            </span>
            <span className="text-[11px] text-[#7E7465] font-medium block">
              د. عبدالرحمن يونس
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-[#645A4C]">
          <a href="#lecture-studio" className="hover:text-[#1F1C18] transition-colors flex items-center gap-1.5 font-bold text-amber-900 bg-amber-100/60 px-2.5 py-1 rounded-lg border border-amber-300/50 lowercase">
            <Upload className="w-3.5 h-3.5 text-amber-600" />
            <span>معالجة المحاضرات</span>
          </a>
          <a href="#gems" className="hover:text-[#1F1C18] transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#A28148]" />
            <span>AI Gems</span>
          </a>
          <a href="#articles" className="hover:text-[#1F1C18] transition-colors flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#A28148]" />
            <span>المقالات</span>
          </a>
          <a href="#videos" className="hover:text-[#1F1C18] transition-colors flex items-center gap-1.5">
            <Youtube className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>الفيديوهات</span>
          </a>
          <a href="#course" className="hover:text-[#1F1C18] transition-colors flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-[#A28148]" />
            <span>MEDstudy OS</span>
          </a>
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              onOpenLegal('about');
            }}
            className="hover:text-[#1F1C18] transition-colors flex items-center gap-1 text-xs text-[#8A7F70] cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>من نحن</span>
          </a>
          <a
            href="/privacy"
            onClick={(e) => {
              e.preventDefault();
              onOpenLegal('privacy');
            }}
            className="hover:text-[#1F1C18] transition-colors flex items-center gap-1 text-xs text-[#8A7F70] cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>الخصوصية</span>
          </a>
        </nav>

        {/* Action Button - Direct Gem Explorer */}
        <div className="flex items-center gap-2.5">
          <a
            href="#gems"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#2D2A26] text-[#FAF7F2] hover:bg-[#1A1816] transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E6C994]" />
            <span>استكشف 7 Gems</span>
          </a>
        </div>
      </div>
    </header>
  );
};
