import React, { useEffect } from 'react';
import { 
  ArrowRight, 
  Shield, 
  FileText, 
  AlertTriangle, 
  Mail, 
  MessageCircle, 
  Send, 
  Instagram, 
  CheckCircle, 
  User, 
  ExternalLink,
  BookOpen,
  Home
} from 'lucide-react';

export type LegalTab = 'privacy' | 'terms' | 'disclaimer' | 'about' | 'contact';

interface LegalPageProps {
  initialTab?: LegalTab;
  onBack: () => void;
  onNavigateTab?: (tab: LegalTab) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ 
  initialTab = 'privacy', 
  onBack,
  onNavigateTab
}) => {
  const [activeTab, setActiveTab] = React.useState<LegalTab>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const titles: Record<LegalTab, string> = {
      privacy: 'سياسة الخصوصية (Privacy Policy) | د. عبدالرحمن يونس',
      terms: 'شروط الاستخدام (Terms of Service) | د. عبدالرحمن يونس',
      disclaimer: 'إخلاء المسؤولية الطبية (Medical Disclaimer) | د. عبدالرحمن يونس',
      about: 'من نحن (About Us) | د. عبدالرحمن يونس',
      contact: 'اتصل بنا (Contact Us) | د. عبدالرحمن يونس',
    };
    document.title = titles[activeTab] || 'المعلومات القانونية والسياسات | د. عبدالرحمن يونس';
  }, [activeTab]);

  const handleTabClick = (tab: LegalTab) => {
    setActiveTab(tab);
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else {
      window.history.pushState(null, '', `/${tab}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#24211D] font-sans antialiased" dir="rtl">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#DACBB5] px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#F2ECE1] hover:bg-[#8C6D3F] text-[#423728] hover:text-[#FAF7F2] border border-[#DACBB5] text-xs sm:text-sm font-bold transition-all cursor-pointer group shadow-2xs"
          >
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            <span>العودة للرئيسية</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#7A6F5E]">
            <a href="/" onClick={(e) => { e.preventDefault(); onBack(); }} className="hover:text-[#8C6D3F] flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </a>
            <span>/</span>
            <span className="font-semibold text-[#24211D]">مركز السياسات والامتثال لـ Google AdSense</span>
          </div>

          <div className="text-xs font-bold text-[#8C6D3F] flex items-center gap-1">
            <Shield className="w-4 h-4" />
            <span>AdSense Verified</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto py-8 sm:py-12 px-4 sm:px-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-[#DACBB5] scrollbar-thin">
          <button
            onClick={() => handleTabClick('privacy')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'privacy'
                ? 'bg-[#8C6D3F] text-[#FAF7F2] shadow-xs'
                : 'bg-[#F2ECE1] text-[#5A4D3A] hover:bg-[#EBE2D2] border border-[#DACBB5]'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>سياسة الخصوصية (Privacy Policy)</span>
          </button>

          <button
            onClick={() => handleTabClick('terms')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'terms'
                ? 'bg-[#8C6D3F] text-[#FAF7F2] shadow-xs'
                : 'bg-[#F2ECE1] text-[#5A4D3A] hover:bg-[#EBE2D2] border border-[#DACBB5]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>شروط الاستخدام (Terms of Service)</span>
          </button>

          <button
            onClick={() => handleTabClick('disclaimer')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'disclaimer'
                ? 'bg-[#8C6D3F] text-[#FAF7F2] shadow-xs'
                : 'bg-[#F2ECE1] text-[#5A4D3A] hover:bg-[#EBE2D2] border border-[#DACBB5]'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>إخلاء المسؤولية الطبية (Medical Disclaimer)</span>
          </button>

          <button
            onClick={() => handleTabClick('about')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'about'
                ? 'bg-[#8C6D3F] text-[#FAF7F2] shadow-xs'
                : 'bg-[#F2ECE1] text-[#5A4D3A] hover:bg-[#EBE2D2] border border-[#DACBB5]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>من نحن (About Us)</span>
          </button>

          <button
            onClick={() => handleTabClick('contact')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'contact'
                ? 'bg-[#8C6D3F] text-[#FAF7F2] shadow-xs'
                : 'bg-[#F2ECE1] text-[#5A4D3A] hover:bg-[#EBE2D2] border border-[#DACBB5]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>اتصل بنا (Contact Us)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-[#FAF7F2] border border-[#DACBB5] rounded-3xl p-6 sm:p-10 shadow-xs">
          {/* 1. Privacy Policy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 leading-relaxed font-cairo">
              <div className="border-b border-[#DACBB5] pb-4">
                <span className="text-xs font-bold text-[#8C6D3F] uppercase tracking-wider block mb-1">
                  Google AdSense Compliant Privacy Policy
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#24211D]">
                  سياسة الخصوصية لموقع د. عبدالرحمن يونس (Abdelrhman Ai)
                </h1>
                <p className="text-xs text-[#7A6F5E] mt-1">تاريخ آخر تحديث: أكتوبر 2026</p>
              </div>

              <p className="text-sm sm:text-base text-[#383127]">
                نحن في موقع <strong>د. عبدالرحمن يونس / Abdelrhman Ai</strong> نولي أهمية قصوى لخصوصية زوارنا الكرام. توضح هذه الوثيقة أنواع المعلومات الشخصية التي يتم استلامها وجمعها وكيفية استخدامها بما يتوافق بدقة مع <strong>شروط وسياسات برنامج Google AdSense الإعلاني</strong> والمعايير العالمية لحماية البيانات (GDPR & CCPA).
              </p>

              {/* Critical Google AdSense & DART Cookies Section */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#F5ECE0] border-2 border-[#DFCBB0] space-y-3">
                <h2 className="text-base sm:text-lg font-bold text-[#2D2417] flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#8C6D3F]" />
                  <span>إعلانات Google AdSense وملفات تعريف الارتباط DART</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#4A3E2D] leading-relaxed">
                  تُعد شركة <strong>Google</strong> أحد الموردين الخارجيين على موقعنا. تستخدم Google ملفات تعريف الارتباط (مثل ملف تعريف الارتباط DART) لعرض الإعلانات لزوار موقعنا استناداً إلى زياراتهم لهذا الموقع ومواقع أخرى على شبكة الإنترنت.
                </p>
                <p className="text-xs sm:text-sm text-[#4A3E2D] leading-relaxed">
                  يمكن للزوار والمستخدمين إلغاء الاشتراك في استخدام ملف تعريف الارتباط DART بزيارة سياسة الخصوصية الخاصة بإعلانات Google وشبكة المحتوى على الرابط التالي:{' '}
                  <a
                    href="https://policies.google.com/technologies/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-bold text-[#8C6D3F] hover:text-[#5A4523] inline-flex items-center gap-1"
                  >
                    <span>https://policies.google.com/technologies/ads</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#24211D]">شركاء الإعلانات وشبكات الطرف الثالث</h2>
                <p className="text-xs sm:text-sm text-[#383127]">
                  قد يستخدم بعض شركائنا الإعلانيين ملفات تعريف الارتباط وإشارات الويب على موقعنا. شريكنا الإعلاني الرئيسي هو <strong>Google AdSense</strong>. تستخدم خوادم الشبكات الإعلانية التابعة لجهات خارجية تقنيات مثل ملفات تعريف الارتباط وجافاسكريبت لقياس فعالية حملاتهم الإعلانية وتخصيص محتوى الإعلانات التي تراها.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#24211D]">ملفات السجل (Log Files)</h2>
                <p className="text-xs sm:text-sm text-[#383127]">
                  يتبع موقع د. عبدالرحمن يونس الإجراءات القياسية لاستخدام ملفات السجل. تسجل هذه الملفات الزوار عند زيارتهم للمواقع الإلكترونية، وتشمل المعلومات التي تجمعها: عناوين بروتوكول الإنترنت (IP)، نوع المتصفح، مزود خدمة الإنترنت (ISP)، طابع التاريخ والوقت، صفحات الإحالة/الخروج، وعدد النقرات. هذه المعلومات غير مرتبطة بأي معلومات تحدد الهوية الشخصية وتُستخدم فقط لتحليل الاتجاهات وإدارة الموقع.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#24211D]">حقوق الخصوصية (GDPR و CCPA)</h2>
                <p className="text-xs sm:text-sm text-[#383127]">
                  نحن نحترم حقوق المستخدمين بموجب اللائحة العامة لحماية البيانات (GDPR) وقانون خصوصية المستهلك في كاليفورنيا (CCPA). نؤكد أننا لا نبيع بياناتك الشخصية لأي طرف ثالث، وللمستخدم الحق في طلب الاطلاع على بياناته أو طلب حذفها.
                </p>
              </div>

              <div className="pt-4 border-t border-[#DACBB5] text-xs sm:text-sm text-[#5A4E3D]">
                <p className="font-bold mb-1">مسؤول الخصوصية والتواصل:</p>
                <p>
                  لأي استفسارات قانونية أو متعلقة بسياسة الخصوصية، يرجى مراسلتنا مباشرة عبر البريد الإلكتروني المعتمد:{' '}
                  <a href="mailto:abdoyounes1011@gmail.com" className="font-bold underline text-[#8C6D3F]">
                    abdoyounes1011@gmail.com
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* 2. Terms of Service Tab */}
          {activeTab === 'terms' && (
            <div className="space-y-6 leading-relaxed font-cairo">
              <div className="border-b border-[#DACBB5] pb-4">
                <span className="text-xs font-bold text-[#8C6D3F] uppercase tracking-wider block mb-1">
                  Terms of Service & User Agreement
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#24211D]">
                  شروط وأحكام استخدام الموقع
                </h1>
                <p className="text-xs text-[#7A6F5E] mt-1">سارية المفعول: 2026</p>
              </div>

              <p className="text-sm sm:text-base text-[#383127]">
                مرحباً بك في موقع <strong>د. عبدالرحمن يونس</strong>. بدخولك وتصفحك لهذا الموقع أو استخدامك لأدوات الذكاء الاصطناعي والمقالات التعليمية، فإنك تقر وتوافق على الالتزام بالشروط والأحكام التالية:
              </p>

              <div className="space-y-3">
                <h2 className="text-base sm:text-lg font-bold text-[#24211D]">1. طبيعة المحتوى الأكاديمي والتعليمي</h2>
                <p className="text-xs sm:text-sm text-[#4A3E2D]">
                  جميع المقالات، النظم التعليمية، وGemini AI Gems المتوفرة على الموقع هي موارد معرفية مصممة لمساعدة طلاب الكليات الطبية والأكاديمية في تحسين تقنيات المذاكرة والإنتاجية الدراسية. يُسمح باستخدام هذه المواد للاستخدام الشخصي الأكاديمي غير التجاري.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-base sm:text-lg font-bold text-[#24211D]">2. الملكية الفكرية والعلامات التجارية</h2>
                <p className="text-xs sm:text-sm text-[#4A3E2D]">
                  إن "Google Gemini" هي علامة تجارية مسجلة لشركة Google LLC. هذا الموقع هو منصة تعليمية مستقلة يديرها د. عبدالرحمن يونس، وأي روابط تشير إلى منصات Google أو منصة التدريب الخارجي تخضع لسياسات وشروط تلك المنصات.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-base sm:text-lg font-bold text-[#24211D]">3. حدود المسؤولية</h2>
                <p className="text-xs sm:text-sm text-[#4A3E2D]">
                  يبذل الموقع أقصى جهده لتقديم محتوى دقيق ومحدث، إلا أن الطالب والباحث يتحمل المسؤولية الكاملة عن مراجعة مخرجات الذكاء الاصطناعي والمراجع المقررة من قِبل كليته وأساتذته للامتحانات الرسمية.
                </p>
              </div>
            </div>
          )}

          {/* 3. Medical Disclaimer Tab (Crucial for YMYL & AdSense) */}
          {activeTab === 'disclaimer' && (
            <div className="space-y-6 leading-relaxed font-cairo">
              <div className="border-b border-[#DACBB5] pb-4">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                  Medical & Educational YMYL Disclaimer
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#24211D]">
                  إخلاء المسؤولية الطبية والأكاديمية
                </h1>
                <p className="text-xs text-[#7A6F5E] mt-1">تنبيه هام متوافق مع سياسات المحتوى الصحي في Google</p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                  <AlertTriangle className="w-5 h-5 text-amber-700" />
                  <span>تنبيه وإشعار صريح للزوار والمتصفحين</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">
                  هذا الموقع موجّه <strong>حصراً لطلاب الكليات الطبية والأكاديمية</strong> لأغراض تطوير مهارات المذاكرة، تنظيم الوقت، وتوظيف الذكاء الاصطناعي في الفهم الدراسي.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#24211D]">المحتوى ليس بديلاً عن الاستشارة الطبية</h2>
                <p className="text-xs sm:text-sm text-[#383127]">
                  لا يجوز تحت أي ظرف من الظروف استخدام المقالات، أو نتائج نماذج الذكاء الاصطناعي، أو التلخيصات المعروضة على هذا الموقع لتقديم تشخيص طبي مباشر، أو وضع خطة علاجية، أو وصف أدوية وجرعات لمرضى حقيقيين. يجب على المرضى دائماً استشارة طبيب مرخص ومؤهل في أي حالة صحية أو طارئة.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#24211D]">مسؤولية طلاب الطب في التحقق السريري</h2>
                <p className="text-xs sm:text-sm text-[#383127]">
                  تقنيات الذكاء الاصطناعي قد تعاني أحياناً مما يعرف بالهلوسة البرمجية (AI Hallucinations). على كل طالب طب الرجوع للكتب المرجعية المعتمدة (مثل هاريسون، روبنز، وفيرست إيد) وبروتوكولات المستشفيات الرسمية للتأكد من الجرعات والأرقام الحيوية.
                </p>
              </div>
            </div>
          )}

          {/* 4. About Us Tab (Demonstrating E-E-A-T) */}
          {activeTab === 'about' && (
            <div className="space-y-6 leading-relaxed font-cairo">
              <div className="border-b border-[#DACBB5] pb-4">
                <span className="text-xs font-bold text-[#8C6D3F] uppercase tracking-wider block mb-1">
                  About Abdelrhman Younes & The Platform
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#24211D]">
                  من نحن: منصة د. عبدالرحمن يونس للتعلم الذكي
                </h1>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-[#F5ECE0] border border-[#DFCBB0]">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#8C6D3F] shadow-sm shrink-0 bg-[#FAF7F2]">
                  <img src="/favicon.svg" alt="د. عبدالرحمن يونس" className="w-full h-full object-cover p-2" />
                </div>
                <div className="text-center sm:text-right">
                  <h2 className="text-xl font-bold text-[#24211D]">د. عبدالرحمن فوزي يونس</h2>
                  <p className="text-xs font-semibold text-[#8C6D3F] mb-2">
                    طالب بكلية الطب ومطور برومتس وأدوات الذكاء الاصطناعي للتعليم الطبي
                  </p>
                  <p className="text-xs sm:text-sm text-[#4A3E2D] leading-relaxed">
                    من خلال تجربتي الواقعية في كلية الطب، أطلقت هذه المنصة لمساعدة زملائي الطلاب على كسر حواجز الحفظ التقليدي المرهق، وتبني تقنيات المذاكرة الذكية مثل Active Recall و Spaced Repetition وتوظيف الذكاء الاصطناعي لرفع الإنتاجية بدون احتراق نفسي.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#DACBB5] text-center">
                  <div className="text-xl font-extrabold text-[#8C6D3F] mb-1">20 مقالاً</div>
                  <p className="text-xs text-[#5A4D3A]">تجارب وأساليب مذاكرة عملية شاملة ومجانية</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#DACBB5] text-center">
                  <div className="text-xl font-extrabold text-[#8C6D3F] mb-1">7 Gemini Gems</div>
                  <p className="text-xs text-[#5A4D3A]">أدوات ذكية متخصصة لتفكيك وتلخيص المحاضرات</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#DACBB5] text-center">
                  <div className="text-xl font-extrabold text-[#8C6D3F] mb-1">100% مجاني</div>
                  <p className="text-xs text-[#5A4D3A]">محتوى مفتوح لجميع طلاب الطب حول العالم</p>
                </div>
              </div>
            </div>
          )}

          {/* 5. Contact Us Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6 leading-relaxed font-cairo">
              <div className="border-b border-[#DACBB5] pb-4">
                <span className="text-xs font-bold text-[#8C6D3F] uppercase tracking-wider block mb-1">
                  Get in Touch & Official Contacts
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#24211D]">
                  اتصل بنا (Contact Information)
                </h1>
                <p className="text-xs text-[#7A6F5E] mt-1">نسعد بالإجابة على استفساراتكم والتعاون الأكاديمي والتقني</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Official Email */}
                <a
                  href="mailto:abdoyounes1011@gmail.com"
                  className="p-5 rounded-2xl bg-[#F5ECE0] border border-[#DFCBB0] hover:border-[#8C6D3F] transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#8C6D3F] text-white flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#8C6D3F] uppercase block">البريد الإلكتروني الرسمي</span>
                    <span className="text-sm font-bold text-[#24211D] group-hover:underline">abdoyounes1011@gmail.com</span>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/201225211153"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-[#F5ECE0] border border-[#DFCBB0] hover:border-[#8C6D3F] transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase block">واتساب (WhatsApp)</span>
                    <span className="text-sm font-bold text-[#24211D] font-mono group-hover:underline">01225211153</span>
                  </div>
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/lifedocter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-[#F5ECE0] border border-[#DFCBB0] hover:border-[#8C6D3F] transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
                    <Send className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-sky-800 uppercase block">تيليجرام (Telegram)</span>
                    <span className="text-sm font-bold text-[#24211D] group-hover:underline">@lifedocter</span>
                  </div>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/abdofawzii?igsi=dThiYnpmcWV3a3ht&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-[#F5ECE0] border border-[#DFCBB0] hover:border-[#8C6D3F] transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-rose-800 uppercase block">إنستغرام (Instagram)</span>
                    <span className="text-sm font-bold text-[#24211D] group-hover:underline">@abdofawzii</span>
                  </div>
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[#DACBB5] bg-[#F5ECE0]/60 text-center text-xs text-[#7A6F5E]">
        <p>© {new Date().getFullYear()} د. عبدالرحمن يونس • تم إعداد هذه السياسات وفق المعايير الإلزامية لـ Google AdSense</p>
      </footer>
    </div>
  );
};
