import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const WhySection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="why" className="py-10 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="rounded-3xl bg-[#FBF8F2] border border-[#E3D9C9] p-6 sm:p-8 md:p-10 shadow-2xs transition-all">
        {/* Section Heading */}
        <div className="flex items-center gap-2.5 mb-6 text-[#8C6D3F]">
          <div className="w-8 h-8 rounded-xl bg-[#EFE6D6] border border-[#DFCBB0] flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-[#8C6D3F]" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#24211D] tracking-tight">
            why does this website exist?
          </h2>
        </div>

        {/* Story Content in Arabic */}
        <div className="font-cairo text-[#473E31] leading-relaxed text-sm sm:text-base" dir="rtl">
          {/* Visible Intro (First 3 core lines) */}
          <div className="space-y-2.5 font-medium">
            <p className="text-base sm:text-lg font-bold text-[#24211D]">
              الموضوع بدأ من ثانويه عامه ، طريقة المذاكره التقليديه خلتني أعاني كتير ، بعمل مجهود وحاسس ان المجهود ده محتاج يتوظف بشكل اذكي ، ودايما كنت بقول لنفسي أكيد في حاجه اذكي من اللي بنعمله ده.
            </p>
            <p className="text-[#3A3226] text-sm sm:text-base leading-relaxed">
              عشان كده لما ربنا وفقني ودخلت كلية طب ، كنت مشغول بفكرة ازاي اذاكر بذكاء ، ازاي استغل وقتي ومجهودي صح ، بدأت أدور علي اليوتيوب واشوف فديوهات بالانجلش ، بدأت اعرف عن spaced repetition و active recall , كنت من عشاق notion ، الفكره بقا ان مشوفتش حد بيتكلم عن التقنيات دي في الوطن العربي كله.
            </p>
            <p className="text-[#3A3226] text-sm sm:text-base">
              وبصراحه بدأت ونا عامل لنفسي معايير عاليه مش عايز انزل عنها.
            </p>
          </div>

          {/* Expandable Rest of the Story */}
          {isExpanded ? (
            <div className="mt-4 space-y-3.5 pt-4 border-t border-[#EAE1D3] text-[#4A4032] text-xs sm:text-sm leading-relaxed animate-fadeIn">
              <div className="bg-[#FAF4EB] p-3.5 sm:p-4 rounded-xl border border-[#E3D7C5] space-y-1.5">
                <p className="text-[#2D261C]">
                  أنا أصلًا ما كنتش الشخص اللي بيطلع من الأوائل، لكن لما ربنا وفقني ودخلت كلية الطب، قلت لنفسي:
                </p>
                <p className="font-bold text-[#24211D] text-sm sm:text-base">
                  “أنا وصلت لهنا، فلازم أحافظ على المستوى ده… ومينفعش أقل.”
                </p>
              </div>

              <p className="text-amber-900 font-semibold">
                المشكلة إن المعايير العالية دي كان ليها تمن.
              </p>

              <p>
                وقت كتير، مجهود أكتر، وضغط مستمر إني أكون أحسن وأحسن.
              </p>

              <p>
                ومع الوقت، اكتشفت إني عملت أخطاء كتير جدًا.
                <br />
                أخطاء في المذاكرة، في الإنتاجية، في تنظيم الوقت، وفي الاستمرارية.
              </p>

              <div className="p-3.5 rounded-xl bg-[#F5ECE0] border border-[#DACBB5] text-xs sm:text-sm leading-relaxed">
                بس الحمد لله كنت بحب القراءه وربنا وفقني ان اقرأ الكتب اللي فعلا أنا محتاجها وسبحان الله الكتب دي تكون علاج للقصور اللي عندي ، وده فرق معايا جدا.
              </div>

              <p className="font-semibold text-[#24211D]">
                الحمدلله حصل تطور كبير في طريقة مذاكرتي بس كنت لسه شايف في اذكي من كده ، في طرق تخليني اطلع بإنتاجية اكبر من كده.
              </p>

              <div className="border-r-2 border-[#8C6D3F] pr-3.5 my-2">
                <p className="font-bold text-[#24211D] text-sm sm:text-base">
                  وفي الفترة دي، بدأ الـAI يظهر بقوة.
                </p>
                <p className="text-[#3A3226] mt-1">
                  في البداية، ما كنتش مهتم بيه أوي , بس مع الوقت والتطور اللي حصل نظرتي لل Ai اختلفت تمام وهنا السيناريو اختلف تمام , وقررت ابدا رحله اتعلم فيها اكتر عن ال Ai.
                </p>
              </div>

              {/* Continuation with AI Learning Journey */}
              <div className="pt-1.5 space-y-2">
                <p className="text-sm sm:text-base font-bold text-[#24211D]">
                  أنا بدأت رحلتي مع الـAI وأنا عندي اعتقاد مؤمن به جدًا:
                </p>
                <p className="text-[#3A3226]">
                  إن الـAI مش مجرد أداة أسألها سؤال، آخد إجابة، وأمشي.
                  <br />
                  الـAI ممكن أطلع منه بأقصى استفادة ممكنة لو عرفت أستخدمه صح.
                </p>
                <p className="font-semibold text-[#2D261C]">
                  والاعتقاد ده خلاني أبدأ أتعلم بجد.
                </p>
              </div>

              <p>
                أخدت كورسات، ودفعت فلوس في Udemy وغيره، وجربت أدوات وتقنيات كتير، وقضيت وقت ومجهود في إني أفهم:
                <br />
                <span className="font-bold text-[#24211D]">
                  إزاي أخلي الـAI يخدمني فعلًا، مش مجرد أستخدمه بشكل سطحي؟
                </span>
              </p>

              <p className="text-amber-900 font-semibold">
                لكن وأنا بتعلم، اكتشفت مشكلة كبيره:
              </p>

              <p className="bg-[#F5ECE0] p-3.5 rounded-xl border border-[#DACBB5] text-xs sm:text-sm leading-relaxed">
                علي الرغم ان الكورسات كانت مفيده جدا , ولكن معظم اللي كنت بتعلمه كان بيتكلم عن استخدام الـAI بشكل عام، مش عن المذاكرة تحديدًا، ومش عن طبيعة طالب الطب والكم الهائل من المحاضرات والمعلومات والـAnki والـActive Recall والامتحانات.
              </p>

              <p className="font-semibold text-[#24211D]">
                فكان لازم أعمل حاجة بنفسي.
              </p>

              <p className="text-[#3D3427]">
                أتعلم ، أجرّب ، أغلط ، أعدّل ، أطبّق ، وأشوف إيه اللي فعلًا يستاهل.
              </p>

              <p className="text-[11px] sm:text-xs text-[#7D705E] italic">
                الرحلة دي أخدت مني فلوس، وقت، ومجهود.
              </p>

              <p className="font-medium text-[#2E281F]">
                لكن الحمد لله، ربنا وفقني إني أوصل لطريقة أقدر أشوف ثمرتها فعلًا في مذاكرتي وشغلي.
              </p>

              <div className="py-1">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#EFE6D6] text-[11px] font-bold text-[#8C6D3F] border border-[#DFCBB0]">
                  ومن هنا بدأت فكرة الكورس
                </span>
              </div>

              <div className="space-y-1.5 border-r-2 border-[#8C6D3F] pr-3.5 my-2">
                <p className="font-semibold text-[#24211D]">
                  أنا مش عايزك تبدأ من الصفر زي ما أنا بدأت.
                </p>
                <p>
                  مش عايزك تدفع نفس الفلوس اللي أنا دفعتها، ولا تضيع نفس الوقت في تجربة عشرات الطرق عشان تكتشف في الآخر إيه اللي ينفع وإيه اللي ما ينفعش.
                </p>
                <p className="font-bold text-[#8C6D3F]">
                  أنا عايز أختصر عليك الرحلة.
                </p>
              </div>

              <p>
                أجمعلك اللي اتعلمته، واللي جرّبته، واللي أثبت فعاليته بالنسبة لي، وأحوّله لنظام تقدر تبدأ تستخدمه في مذاكرتك.
              </p>

              <p className="font-semibold text-[#24211D]">
                لأن هدفي في النهاية مش إنك تعرف تكتب Prompt حلو.
              </p>

              <p className="text-sm sm:text-base font-bold text-[#24211D]">
                هدفي إن طريقة مذاكرتك نفسها تتطور.
              </p>

              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-[#4C4132] pr-2">
                <li>تطور في شكل ان الـAI يوفرلك وقت ومجهود كنت بتضيعه في حاجات روتينية.</li>
                <li>كمان يساعدك تذاكر بجودة أعلى.</li>
              </ul>

              <div className="bg-[#FAF4EB] p-3.5 rounded-xl border border-[#E3D7C5] text-xs sm:text-sm leading-relaxed">
                بالمناسبه كنت بتكلم مع حد معانا في كلية الطب وبنسأل بعض في المحاضره ، لما لقاني بيتكلم في ازاي وليه ، سألني هو انت بتسمع لمين ؟! ، لأنه كان سمع المحاضره علي اليوتيوب وحس انه مكنش فاهم المحاضره بالشكل الكافي
              </div>

              <p className="font-semibold text-red-900/90">
                وقتي علي الأرض محدود ، يفيد بايه ال Ai بعد ما وقتي يخلص ، خساره كبيره ان احتفظ باللي اتعلمته لنفسي.
              </p>

              <p>
                وده هو السبب اللي بخليني أشارك المحتوى على السوشيال ميديا، وأبني الكورسات، وأحاول أحوّل اللي اتعلمته لشيء يختصر على طالب الطب الطريق.
              </p>

              <div className="mt-3.5 pt-3 border-t border-[#EAE1D3] text-sm sm:text-base font-extrabold text-[#24211D]">
                <p>أنا أخذت وقتي عشان أتعلم الطريق…</p>
                <p className="text-[#8C6D3F]">وهدفي إنك ما تضطرش تاخد نفس الوقت عشان تمشيه.</p>
              </div>
            </div>
          ) : null}

          {/* Toggle Button: Read More / Read Less */}
          <div className="mt-5 pt-3 flex items-center justify-start">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2D2A26] hover:bg-[#1A1816] text-[#FAF7F2] text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs active:scale-98"
            >
              <span>{isExpanded ? 'عرض أقل (Read less)' : 'اقرأ المزيد (Read more)'}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-[#E6C994]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#E6C994]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
