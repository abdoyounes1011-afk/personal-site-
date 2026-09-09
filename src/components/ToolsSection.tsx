import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Sparkles, Brain, ArrowUpRight, Zap, Info } from 'lucide-react';
import { GEM_TOOLS, TOOLS_SUMMARY } from '../data/gems';
import { GemTool, HoverTheme } from '../types';

export const ToolsSection: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (tool: GemTool, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(tool.url);
    setCopiedId(tool.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Dynamic visual hover color classes (Yellow, Orange, Baby-blue) without displaying color name text
  const getHoverClasses = (theme: HoverTheme): {
    containerHover: string;
    badgeBg: string;
    accentText: string;
    tagBorder: string;
  } => {
    switch (theme) {
      case 'yellow':
        return {
          containerHover:
            'hover:bg-[#FFFCEB] hover:border-[#EAB308] hover:shadow-lg hover:shadow-amber-200/40 hover:-translate-y-0.5',
          badgeBg: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
          accentText: 'text-[#B45309]',
          tagBorder: 'border-[#FDE68A]'
        };
      case 'orange':
        return {
          containerHover:
            'hover:bg-[#FFF5ED] hover:border-[#F97316] hover:shadow-lg hover:shadow-orange-200/40 hover:-translate-y-0.5',
          badgeBg: 'bg-[#FFEDD5] text-[#9A3412] border-[#FED7AA]',
          accentText: 'text-[#C2410C]',
          tagBorder: 'border-[#FED7AA]'
        };
      case 'baby-blue':
        return {
          containerHover:
            'hover:bg-[#F0F8FF] hover:border-[#38BDF8] hover:shadow-lg hover:shadow-sky-200/40 hover:-translate-y-0.5',
          badgeBg: 'bg-[#E0F2FE] text-[#075985] border-[#BAE6FD]',
          accentText: 'text-[#0284C7]',
          tagBorder: 'border-[#BAE6FD]'
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
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#24211D] tracking-tight max-w-3xl mx-auto leading-snug">
          Here are the AI Gems I built to transform the way medical students study
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#685E4F] max-w-2xl mx-auto">
          Hover over each tool for instant access to its dedicated Gemini AI Gem.
        </p>
      </div>

      {/* Tools Stacked Vertically Under Each Other */}
      <div className="space-y-4">
        {GEM_TOOLS.map((tool, index) => {
          const styleConfig = getHoverClasses(tool.hoverColor);

          return (
            <div
              key={tool.id}
              className={`group relative rounded-2xl bg-[#FBF8F2] border border-[#E3D9C9] p-5 sm:p-6 transition-all duration-200 ease-out shadow-2xs ${styleConfig.containerHover}`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left side info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {/* Number index & Category Badge */}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#ECE2D2] text-[#4A3E2F] border border-[#DACBB5]">
                      Gem #{index + 1}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${styleConfig.badgeBg}`}>
                      {tool.category}
                    </span>
                  </div>

                  {/* Tool Name as requested */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-1.5">
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#24211D] tracking-tight group-hover:text-black transition-colors">
                      {tool.name}
                    </h3>
                    {tool.arabicName && tool.arabicName !== tool.name && (
                      <span className="font-cairo text-sm text-[#706453] font-medium" dir="rtl">
                        ({tool.arabicName})
                      </span>
                    )}
                  </div>

                  {/* Role in English */}
                  <div className="text-sm font-semibold text-[#3F3629] mb-1 leading-snug">
                    <span className="text-[#847867] font-medium text-xs block sm:inline sm:mr-1">Role:</span>
                    {tool.role}
                  </div>

                  {/* Role in Arabic context for medical students */}
                  <div className="font-cairo text-xs text-[#706453] mb-3" dir="rtl">
                    {tool.arabicRole}
                  </div>

                  {/* Key Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {tool.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-1.5 text-xs text-[#5D5345]">
                        <Zap className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${styleConfig.accentText}`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side Action Buttons */}
                <div className="flex sm:flex-col items-center sm:items-stretch gap-2 shrink-0 pt-2 md:pt-0">
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2D2A26] hover:bg-[#1A1816] text-[#FAF7F2] text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-98"
                  >
                    <span>Open in Gemini</span>
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
                        <span className="text-emerald-700 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#7A6E5D]" />
                        <span>Copy Link</span>
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

      {/* Brief Summary Card directly following tools as explicitly requested */}
      <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#F5ECE0] to-[#EFE5D5] border border-[#DACBB5] shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-[#E6D8C2]/40 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[#E7DAC6] border border-[#DACBB5] flex items-center justify-center text-[#594C39] shrink-0 mt-0.5">
            <Brain className="w-5 h-5 text-[#8C6D3F]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C6D3F] uppercase tracking-wider mb-1">
              <Info className="w-3.5 h-3.5" />
              Cognitive Architecture Overview
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#24211D] mb-3">
              {TOOLS_SUMMARY.title}
            </h3>
            <p className="text-sm sm:text-base text-[#564C3D] leading-relaxed font-normal">
              {TOOLS_SUMMARY.description}
            </p>
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
