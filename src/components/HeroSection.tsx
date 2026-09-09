import React from 'react';
import { ArrowDown, Sparkles, BookOpen, BrainCircuit, Stethoscope, MessageCircle } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="pt-12 pb-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Subtle warm decorative background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-[#F2EAE0]/80 via-[#F7F2EB]/50 to-transparent -z-10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE7D8] border border-[#DACBB5] text-[#5C4F3B] text-xs font-semibold uppercase tracking-wider mb-6 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Abdelrhman Ai • Medical AI & Cognitive Study Ecosystem</span>
        </div>

        {/* Main Required Greeting */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#24211D] tracking-tight leading-[1.15] mb-6">
          welcome to your smarter way to study
        </h1>

        {/* Required Subtitle Bio with "I am Abdelrahman," */}
        <p className="text-lg sm:text-xl text-[#5F5547] leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
          I am Abdelrahman, medical student, prompt engineer, and content creator — exploring how AI can transform the way we learn, work, and create.
        </p>

        {/* Roles Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F4EDE2] border border-[#DDD1BE] text-xs font-medium text-[#4C4030]">
            <Stethoscope className="w-3.5 h-3.5 text-[#8C6D3F]" />
            Medical Student
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F4EDE2] border border-[#DDD1BE] text-xs font-medium text-[#4C4030]">
            <BrainCircuit className="w-3.5 h-3.5 text-[#8C6D3F]" />
            Prompt Engineer
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F4EDE2] border border-[#DDD1BE] text-xs font-medium text-[#4C4030]">
            <BookOpen className="w-3.5 h-3.5 text-[#8C6D3F]" />
            Content Creator
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
          <a
            href="#gems"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2D2A26] hover:bg-[#1A1816] text-[#FAF7F2] font-semibold text-sm shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-4 h-4 text-[#E6C994]" />
            Explore 7 AI Study Gems
          </a>

          <a
            href="#videos"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#EFE6D6] hover:bg-[#E5DBC7] text-[#3D3325] font-semibold text-sm border border-[#DACBB5] shadow-2xs transition-all active:scale-98"
          >
            <span>شاهد الفيديوهات على يوتيوب</span>
          </a>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left max-w-3xl mx-auto pt-6 border-t border-[#E8DFCFC0]">
          <div className="p-3.5 rounded-xl bg-[#F6F0E6]/70 border border-[#E5DBCB]">
            <div className="text-xs font-bold text-[#3B3224] mb-0.5">7 Custom AI Gems</div>
            <div className="text-xs text-[#736756] leading-relaxed">Built specifically for the high-volume realities of medical curriculum.</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F6F0E6]/70 border border-[#E5DBCB]">
            <div className="text-xs font-bold text-[#3B3224] mb-0.5">Evidence-Based Science</div>
            <div className="text-xs text-[#736756] leading-relaxed">Spaced repetition, active retrieval, and behavioral habit mechanics.</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F6F0E6]/70 border border-[#E5DBCB]">
            <div className="text-xs font-bold text-[#3B3224] mb-0.5">Free & Accessible</div>
            <div className="text-xs text-[#736756] leading-relaxed">Publicly shared on Google Gemini for immediate student workflows.</div>
          </div>
        </div>
      </div>
    </section>
  );
};
