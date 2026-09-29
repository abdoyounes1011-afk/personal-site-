import React from 'react';
import { Sparkles, ArrowDown, BookOpen, Video, Wrench, GraduationCap } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="pt-10 pb-14 px-4 sm:px-6 relative overflow-hidden">
      {/* Subtle warm decorative background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-[#F2EAE0]/80 via-[#F7F2EB]/50 to-transparent -z-10 blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto font-cairo text-right" dir="rtl">
        {/* Subtle Greeting Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE7D8] border border-[#DACBB5] text-[#5C4F3B] text-xs font-semibold tracking-wide shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Abdelrhman Fawzy • دليل ومساحة المذاكرة الذكية بالذكاء الاصطناعي</span>
          </div>
        </div>

        {/* Welcome Card Box */}
        <div className="rounded-3xl bg-[#FBF8F2] border border-[#E3D9C9] p-6 sm:p-9 md:p-10 shadow-2xs">
          {/* Main Title - Centered with Future Doctors and Welcome Icon */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#24211D] tracking-tight mb-6 leading-tight text-center flex flex-wrap items-center justify-center gap-3">
            <span>أهلاً بيكم</span>
            <span className="relative inline-block text-[#1E40AF] font-bold text-2xl sm:text-3xl md:text-4xl px-1">
              Future Doctors
              {/* Blue accent underline lines to highlight and emphasize */}
              <svg
                className="absolute -bottom-2.5 left-0 w-full h-3.5 overflow-visible pointer-events-none"
                viewBox="0 0 170 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 8C45 2.5 125 3 167 7"
                  stroke="#2563EB"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M14 12C55 7.5 120 8 156 11.5"
                  stroke="#38BDF8"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="text-3xl sm:text-4xl md:text-5xl inline-block animate-bounce">👋</span>
          </h1>

          {/* Intro Bio */}
          <p className="text-base sm:text-lg text-[#3E3529] leading-relaxed mb-6 font-medium">
            أخوكم عبد الرحمن، طالب طب، Prompt Engineer، بشارك معاكم اللي بتعلمه عن المذاكرة والـAI والحاجات اللي بتساعدنا نذاكر بشكل أحسن.
          </p>

          {/* Section: "هتلاقي هنا:" */}
          <div className="mb-6">
            <h2 className="text-base sm:text-lg font-bold text-[#24211D] mb-3.5">
              هتلاقي هنا:
            </h2>

            <div className="space-y-3 text-sm sm:text-base text-[#473E31]">
              {/* Item 1: Tools */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F5ECE0]/70 border border-[#EADECF] transition-all hover:bg-[#F5ECE0]">
                <span className="text-xl shrink-0 mt-0.5">🛠️</span>
                <div className="leading-relaxed">
                  <span className="font-bold text-[#24211D]">أدوات</span> تقدر تستخدمها في المذاكرة، من شرح المحاضرات وتحويلها لـHigh-Yield Notes، لحد تحويل الفيديوهات لـQ&A وScripts وحاجات تانية.
                </div>
              </div>

              {/* Item 2: Videos */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F5ECE0]/70 border border-[#EADECF] transition-all hover:bg-[#F5ECE0]">
                <span className="text-xl shrink-0 mt-0.5">🎥</span>
                <div className="leading-relaxed">
                  <span className="font-bold text-[#24211D]">فيديوهات</span> عن المذاكرة، الـAI، وتنظيم طريقة مذاكرتك.
                </div>
              </div>

              {/* Item 3: Articles */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F5ECE0]/70 border border-[#EADECF] transition-all hover:bg-[#F5ECE0]">
                <span className="text-xl shrink-0 mt-0.5">📚</span>
                <div className="leading-relaxed">
                  <span className="font-bold text-[#24211D]">مقالات</span> لو إنت من الناس اللي بتحب تقرأ وتفهم أكتر.
                </div>
              </div>

              {/* Item 4: Platform / Course */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F5ECE0]/70 border border-[#EADECF] transition-all hover:bg-[#F5ECE0]">
                <span className="text-xl shrink-0 mt-0.5">🤖</span>
                <div className="leading-relaxed">
                  <span className="font-bold text-[#24211D]">وكمان هتلاقي المنصة بتاعتنا</span>، لو حابب تتعلم أكتر عن الـAI وإزاي تستخدمه في المذاكرة، وتبني لنفسك نظام يخليك تستفيد منه بجد، مش مجرد تسأله سؤال وتاخد إجابة.
                </div>
              </div>
            </div>
          </div>

          {/* Hope and Wish */}
          <div className="pt-4 border-t border-[#E8DFCFC0] text-[#3E3529]">
            <p className="text-sm sm:text-base leading-relaxed font-normal mb-3">
              أتمنى بجد إن الموقع يكون مفيد ليك، وتستخدم الحاجات اللي فيه بشكل منتظم، والأهم إنها تعمل فرق حقيقي في مذاكرتك وحياتك.
            </p>
            <p className="text-base sm:text-lg font-bold text-[#8C6D3F]">
              ربنا يوفقك
            </p>
          </div>
        </div>

        {/* Quick Jump Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <a
            href="#gems"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2D2A26] hover:bg-[#1A1816] text-[#FAF7F2] font-semibold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.02] active:scale-98"
          >
            <Wrench className="w-4 h-4 text-[#E6C994]" />
            <span>تصفح أدوات الـ AI (الجيمز)</span>
          </a>

          <a
            href="#articles"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EFE6D6] hover:bg-[#E5DBC7] text-[#3D3325] font-semibold text-xs sm:text-sm border border-[#DACBB5] transition-all active:scale-98"
          >
            <BookOpen className="w-4 h-4 text-[#8C6D3F]" />
            <span>المقالات</span>
          </a>

          <a
            href="#videos"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EFE6D6] hover:bg-[#E5DBC7] text-[#3D3325] font-semibold text-xs sm:text-sm border border-[#DACBB5] transition-all active:scale-98"
          >
            <Video className="w-4 h-4 text-[#8C6D3F]" />
            <span>الفيديوهات</span>
          </a>

          <a
            href="#course"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EFE6D6] hover:bg-[#E5DBC7] text-[#3D3325] font-semibold text-xs sm:text-sm border border-[#DACBB5] transition-all active:scale-98"
          >
            <GraduationCap className="w-4 h-4 text-[#8C6D3F]" />
            <span>MEDstudy OS</span>
          </a>
        </div>
      </div>
    </section>
  );
};
