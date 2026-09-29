import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Sparkles, Brain, ArrowUpRight, CheckCircle2, Clock, HeartHandshake } from 'lucide-react';
import { GEM_TOOLS, TOOLS_SUMMARY, TOOLS_FINAL_NOTE } from '../data/gems';
import { GemTool, HoverTheme } from '../types';

export const ToolsSection: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (tool: GemTool, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(tool.url);
    setCopiedId(tool.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Dynamic visual hover color classes (Yellow, Orange, Baby-blue)
  const getHoverClasses = (theme: HoverTheme): {
    containerHover: string;
    badgeBg: string;
    accentText: string;
    tagBorder: string;
    useBoxBg: string;
    bulletDot: string;
  } => {
    switch (theme) {
      case 'yellow':
        return {
          containerHover:
            'hover:bg-[#FFFDF3] hover:border-[#EAB308] hover:shadow-lg hover:shadow-amber-200/40 hover:-translate-y-0.5',
          badgeBg: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
          accentText: 'text-[#B45309]',
          tagBorder: 'border-[#FDE68A]',
          useBoxBg: 'bg-[#FEF9E7]/80 border-[#F6E05E]/60',
          bulletDot: 'bg-[#D97706]'
        };
      case 'orange':
        return {
          containerHover:
            'hover:bg-[#FFF8F3] hover:border-[#F97316] hover:shadow-lg hover:shadow-orange-200/40 hover:-translate-y-0.5',
          badgeBg: 'bg-[#FFEDD5] text-[#9A3412] border-[#FED7AA]',
          accentText: 'text-[#C2410C]',
          tagBorder: 'border-[#FED7AA]',
          useBoxBg: 'bg-[#FFF3E8]/80 border-[#FDBA74]/60',
          bulletDot: 'bg-[#EA580C]'
        };
      case 'baby-blue':
        return {
          containerHover:
            'hover:bg-[#F2FAFF] hover:border-[#38BDF8] hover:shadow-lg hover:shadow-sky-200/40 hover:-translate-y-0.5',
          badgeBg: 'bg-[#E0F2FE] text-[#075985] border-[#BAE6FD]',
          accentText: 'text-[#0284C7]',
          tagBorder: 'border-[#BAE6FD]',
          useBoxBg: 'bg-[#EFF8FF]/80 border-[#7DD3FC]/60',
          bulletDot: 'bg-[#0284C7]'
        };
    }
  };

  return (
    <section id="gems" className="py-14 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Section Pre-heading */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE7D8] border border-[#DACBB5] text-xs font-semibold text-[#5A4D39] uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#8C6D3F]" />
          Custom Gemini Ecosystem
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#24211D] tracking-tight max-w-3xl mx-auto leading-snug">
          GEM ai tools
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#685E4F] max-w-2xl mx-auto font-cairo" dir="rtl">
          كل أداة مبنية ومخصصة لحل عقبة معينة في المذاكرة، اضغط على الأداة لفتحها مباشرة على Gemini.
        </p>
      </div>

      {/* Tools Stacked Vertically */}
      <div className="space-y-6">
        {GEM_TOOLS.map((tool, index) => {
          const styleConfig = getHoverClasses(tool.hoverColor);

          return (
            <div
              key={tool.id}
              className={`group relative rounded-2xl bg-[#FBF8F2] border border-[#E3D9C9] p-5 sm:p-7 transition-all duration-200 ease-out shadow-2xs ${styleConfig.containerHover}`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                {/* Main Content Area (Arabic Content as requested) */}
                <div className="flex-1 font-cairo text-right" dir="rtl">
                  {/* Top Bar with Badges and Actions for mobile */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#ECE2D2] text-[#4A3E2F] border border-[#DACBB5]">
                        أداة #{index + 1}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${styleConfig.badgeBg}`}>
                        {tool.category}
                      </span>
                    </div>

                    {/* Quick action buttons on mobile */}
                    <div className="flex md:hidden items-center gap-1.5">
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2D2A26] text-[#FAF7F2] text-xs font-semibold shadow-xs"
                      >
                        <span>فتح الأداة</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Tool Title as requested */}
                  <h3 className="text-xl sm:text-2xl font-bold text-[#24211D] tracking-tight group-hover:text-black transition-colors mb-3">
                    {tool.arabicTitle}
                  </h3>

                  {/* Overview Text */}
                  <div className="text-sm sm:text-base text-[#3A3226] leading-relaxed mb-3 whitespace-pre-line font-medium">
                    {tool.arabicOverview}
                  </div>

                  {/* Bulleted Breakdown (if any) */}
                  {tool.arabicBreakdown && tool.arabicBreakdown.length > 0 && (
                    <ul className="space-y-2 mb-4 pr-1 text-sm text-[#473E31]">
                      {tool.arabicBreakdown.map((item, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5">
                          <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${styleConfig.bulletDot}`} />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* "تستخدمها إمتى؟" Section */}
                  <div className={`p-4 rounded-xl border ${styleConfig.useBoxBg} mt-3`}>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-[#2E271F] mb-2">
                      <Clock className={`w-4 h-4 ${styleConfig.accentText}`} />
                      <span>تستخدمها إمتى؟</span>
                    </div>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-[#4A3F31]">
                      {tool.whenToUse.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${styleConfig.accentText}`} />
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Desktop Action Buttons */}
                <div className="hidden md:flex flex-col items-stretch gap-2.5 shrink-0 w-44 pt-1">
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2D2A26] hover:bg-[#1A1816] text-[#FAF7F2] text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-98"
                  >
                    <span>فتح في Gemini</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={(e) => handleCopyLink(tool, e)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#EFE7D8] hover:bg-[#E5DBCA] text-[#423727] border border-[#DACBB5] text-xs font-medium transition-colors cursor-pointer"
                    title="Copy Gem Share Link"
                  >
                    {copiedId === tool.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold font-cairo">تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#7A6E5D]" />
                        <span className="font-cairo">نسخ الرابط</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quranic Verse directly after the last Gem with 80% opacity */}
      <div className="text-center py-8 my-6 opacity-80" style={{ opacity: 0.8 }} dir="rtl">
        <p className="font-cairo text-lg sm:text-2xl font-bold text-[#2D2A26] tracking-wide leading-relaxed">
          " وَاللَّهُ يَدْعُو إِلَىٰ دَارِ السَّلَامِ وَيَهْدِي مَن يَشَاءُ إِلَىٰ صِرَاطٍ مُّسْتَقِيمٍ "
        </p>
      </div>

      {/* Final Advice Card as requested */}
      <div className="mb-8 p-6 sm:p-7 rounded-2xl bg-[#F6EFE3] border border-[#DDCFBC] text-center font-cairo" dir="rtl">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#EADCC7] text-[#7A6237] mb-3">
          <HeartHandshake className="w-5 h-5 text-[#8C6D3F]" />
        </div>
        <p className="text-base sm:text-lg font-bold text-[#24211D] leading-relaxed max-w-2xl mx-auto">
          {TOOLS_FINAL_NOTE.text.split('\n\n')[0]}
        </p>
        <p className="mt-3 text-base sm:text-lg font-extrabold text-[#8C6D3F]">
          {TOOLS_FINAL_NOTE.text.split('\n\n')[1]}
        </p>
      </div>

      {/* Brief Summary Card directly following tools as explicitly requested */}
      <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#F5ECE0] to-[#EFE5D5] border border-[#DACBB5] shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-[#E6D8C2]/40 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[#E7DAC6] border border-[#DACBB5] flex items-center justify-center text-[#594C39] shrink-0 mt-0.5">
            <Brain className="w-5 h-5 text-[#8C6D3F]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C6D3F] uppercase tracking-wider mb-1">
              Cognitive Architecture Overview
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#24211D] mb-3">
              {TOOLS_SUMMARY.title}
            </h3>
            <div className="text-sm sm:text-base text-[#564C3D] leading-relaxed font-normal space-y-3">
              {TOOLS_SUMMARY.description.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[#4B3F2E]">
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF6F0] border border-[#DACBB5]">
                ✓ Eliminates Manual Transcription
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF6F0] border border-[#DACBB5]">
                ✓ Instantly Formats High-Yield Bullet Points
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF6F0] border border-[#DACBB5]">
                ✓ Turns Video Into Active Recall Decks
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
