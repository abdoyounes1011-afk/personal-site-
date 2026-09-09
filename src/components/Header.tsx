import React from 'react';
import { Sparkles, BookOpen, GraduationCap, Shield, Youtube } from 'lucide-react';

interface HeaderProps {
  onOpenPrivacy: (tab: 'privacy' | 'terms' | 'disclaimer') => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPrivacy }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DFD1]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo / Personal Brand */}
        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#EBE2D2] border border-[#DACBB5] flex items-center justify-center text-[#5A4D3A] shadow-xs group-hover:bg-[#E3D6C1] transition-colors">
            <Sparkles className="w-4 h-4 text-[#8C6D3F]" />
          </div>
          <div>
            <span className="font-bold text-[#2D2A26] text-base tracking-tight block leading-tight">
              Abdelrhman Ai
            </span>
            <span className="text-[11px] text-[#7E7465] font-medium block">
              Smarter Way to Study
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#645A4C]">
          <a href="#gems" className="hover:text-[#1F1C18] transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#A28148]" />
            AI Gems
          </a>
          <a href="#videos" className="hover:text-[#1F1C18] transition-colors flex items-center gap-1.5">
            <Youtube className="w-3.5 h-3.5 text-[#DC2626]" />
            Videos
          </a>
          <a href="#articles" className="hover:text-[#1F1C18] transition-colors flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#A28148]" />
            Study Science
          </a>
          <a href="#course" className="hover:text-[#1F1C18] transition-colors flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-[#A28148]" />
            The Course
          </a>
          <button
            onClick={() => onOpenPrivacy('privacy')}
            className="hover:text-[#1F1C18] transition-colors flex items-center gap-1.5 text-xs text-[#8A7F70] cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            Privacy
          </button>
        </nav>

        {/* Action Button - Direct Gem Explorer */}
        <div className="flex items-center gap-2.5">
          <a
            href="#gems"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#2D2A26] text-[#FAF7F2] hover:bg-[#1A1816] transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E6C994]" />
            <span>Explore 7 Gems</span>
          </a>
        </div>
      </div>
    </header>
  );
};
