import React from 'react';
import { HelpCircle, Quote } from 'lucide-react';

export const WhySection: React.FC = () => {
  return (
    <section id="why" className="py-8 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="rounded-3xl bg-[#FBF8F2] border border-[#E3D9C9] p-6 sm:p-8 md:p-10 shadow-2xs transition-all">
        {/* Section Heading */}
        <div className="flex items-center gap-2.5 mb-5 text-[#8C6D3F]">
          <div className="w-8 h-8 rounded-xl bg-[#EFE6D6] border border-[#DFCBB0] flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4 text-[#8C6D3F]" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#24211D] tracking-tight">
            why does this website exist?
          </h2>
        </div>

        {/* Content in Arabic */}
        <div className="font-cairo text-[#3D3528] space-y-4" dir="rtl">
          {/* Highlighted Quote / Core Reflection */}
          <div className="relative bg-[#F5ECE0] border-r-4 border-[#8C6D3F] p-4 sm:p-5 rounded-2xl border border-[#E5D7C3]/60 shadow-xs">
            <Quote className="w-5 h-5 text-[#8C6D3F]/40 mb-2 rotate-180" />
            <p className="text-sm sm:text-base font-semibold text-[#24211D] leading-relaxed">
              وقتي محدود علي الأرض، خسارة كبيرة إن أحتفظ باللي اتعلمته لنفسي، وقتي لو خلص اللي اكتسبته يغني عني إيه؟
            </p>
          </div>

          {/* Value and Purpose Statement */}
          <div className="bg-[#FAF4EB] border border-[#E8DDCD] p-4 sm:p-5 rounded-2xl">
            <p className="text-xs sm:text-sm font-normal text-[#473E31] leading-relaxed sm:leading-loose">
              الحقيقة إن في طلاب زيي محتاجين الكلام ده وإن شاء الله يفرق معاهم زي ما فرق معايا، الأدوات إن شاء الله تفضل مفتوحة طول الوقت من غير أي تكلفة، لو عايز تتعلم اللي اتعلمته فالكورسات اللي بقدمها هدفها تساعدك توفر وقت ومجهود وتزود من جودة مذاكرتك، وكل ده بوقت وفلوس أقل بكتير من اللي بذلتهم.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
