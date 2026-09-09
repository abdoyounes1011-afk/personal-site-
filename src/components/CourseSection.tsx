import React from 'react';
import { ArrowDown, ExternalLink, Star, Sparkles, CheckCircle2, GraduationCap, Heart, Quote } from 'lucide-react';
import { COURSE_FEEDBACK } from '../data/feedback';

export const CourseSection: React.FC = () => {
  return (
    <section id="course" className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Course Headline Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EFE7D8] border border-[#DACBB5] text-xs font-bold text-[#574A37] uppercase tracking-wider mb-4">
          <GraduationCap className="w-3.5 h-3.5 text-[#8C6D3F]" />
          Comprehensive Flagship Course
        </div>

        {/* The Exact Phrasing Requested by User */}
        <h2
          dir="rtl"
          className="font-cairo text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#24211D] leading-tight tracking-tight mb-6"
        >
          حوّل الـAI من مجرد أداة بتستخدمها… لنظام كامل يطوّر طريقة مذاكرتك
        </h2>

        <p className="text-sm sm:text-base text-[#615647] max-w-2xl mx-auto mb-6">
          A hands-on medical masterclass designed to engineer your study workflow, build customized recall engines, and master clinical prompt engineering from day one.
        </p>

        {/* Downward Arrow explicitly requested: "واعمل سهم تحت يشاور للينك تحته" */}
        <div className="flex flex-col items-center justify-center my-4">
          <span className="text-xs font-bold text-[#8C6D3F] mb-2 tracking-wide uppercase">
            Click Below to Access the Full System
          </span>
          <div className="w-12 h-12 rounded-full bg-[#EFE7D8] border border-[#DACBB5] flex items-center justify-center text-[#594C38] shadow-xs animate-bounce">
            <ArrowDown className="w-6 h-6 text-[#8C6D3F]" />
          </div>
        </div>
      </div>

      {/* Main Course Link Card */}
      <div className="max-w-2xl mx-auto mb-16">
        <a
          href="https://abd-elrhman.nzmly.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="group block relative rounded-3xl bg-gradient-to-b from-[#FAF5EC] to-[#F1E8DA] border-2 border-[#D8C9B3] hover:border-[#8C6D3F] p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E6D9C5] border border-[#DACBB5] flex items-center justify-center text-[#554734] group-hover:bg-[#DAC7AC] transition-colors">
                <Sparkles className="w-6 h-6 text-[#8C6D3F]" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D3F] block">
                  Official Training Program
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-[#24211D] tracking-tight group-hover:text-black transition-colors">
                  Medical AI Masterclass & Study Operating System
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2D2A26] group-hover:bg-black text-[#FAF7F2] font-semibold text-xs transition-colors shrink-0 shadow-xs">
              <span>Enroll / Visit Course</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#5C5242] leading-relaxed mb-4">
            Directly access the full curriculum, ready-made prompt libraries, automation templates, and systematic step-by-step guidance tailored for medical students.
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-[#E3D6C1] text-xs font-medium text-[#7D705E]">
            <span className="font-mono text-[#4A3F30] font-semibold">https://abd-elrhman.nzmly.com/</span>
            <span className="text-[#8C6D3F] font-bold group-hover:underline">Open Link →</span>
          </div>
        </a>
      </div>

      {/* Course Feedback Section explicitly under the course as requested:
          "خلي ال feedback تحت الكورس" */}
      <div className="pt-6 border-t border-[#E8DFD1]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE7D8] border border-[#DACBB5] text-xs font-bold text-[#554734] uppercase tracking-wider mb-2">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Student Reviews & Feedback
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#24211D]">
            ماذا يقول الطلاب عن كورس الذكاء الاصطناعي في الطب؟
          </h3>
          <p className="text-xs sm:text-sm text-[#6F6454] mt-1">
            آراء وتجارب حقيقية من زملاء كليات الطب الذين غيروا أسلوب مذاكرتهم
          </p>
        </div>

        {/* Feedback Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COURSE_FEEDBACK.map((item) => (
            <div
              key={item.id}
              className="relative rounded-2xl bg-[#FBF8F2] border border-[#E3D9C9] p-5 shadow-2xs hover:border-[#DAC7AE] transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <Quote className="w-4 h-4 text-[#C9B9A2]" />
              </div>

              {/* Exact text provided by user */}
              <p
                dir="rtl"
                className="font-cairo text-sm sm:text-base font-semibold text-[#2F2920] leading-relaxed mb-4 text-right"
              >
                "{item.text}"
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-[#EFE6D7] text-xs">
                <span className="font-medium text-[#756958]">{item.author}</span>
                <span className="text-[11px] text-[#938675]">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
