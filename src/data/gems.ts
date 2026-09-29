import { GemTool } from '../types';

export const GEM_TOOLS: GemTool[] = [
  {
    id: 'ask-dad',
    name: 'ask dad',
    arabicTitle: '1. أداة الشرح — ask dad',
    arabicName: 'أداة الشرح — ask dad',
    role: 'Deep Conceptual Comprehension & Lecture Breakdown',
    arabicRole: 'مخصصة لشرح وتفكيك المحاضرة لأربعة أجزاء تفاعلية مع تشبيهات لتثبيت المعلومة',
    url: 'https://gemini.google.com/gem/1OnZOsudcO33Fr724r_4VU9M0TchkDg_M?usp=sharing',
    hoverColor: 'yellow',
    category: 'Comprehension',
    badge: 'Tool #1 • Understanding',
    features: [
      'شرح المحاضرة بشكل واضح ومبسط',
      'توقع وتوليد أسئلة تفكيرية لكل جزء',
      'استخراج الـ High-Yield Notes المهمة',
      'صياغة Analog وتشبيهات لربط وتثبيت الفهم'
    ],
    arabicOverview: 'الأداة دي مخصصة لشرح المحاضرة. كل اللي عليك إنك تبعتلها المحاضرة، وهي بتقسمهالك لأربع أجزاء، وكل جزء بيكون فيه:',
    arabicBreakdown: [
      'شرح المحاضرة بشكل واضح.',
      'الأسئلة المتوقعة اللي ممكن تيجي في دماغك وإنت بتذاكر.',
      'أهم الـHigh-Yield Notes اللي محتاج تاخد بالك منها.',
      'وفي آخر الإجابة بيكون فيه Analog يساعدك تربط المعلومة بحاجة شبهها، عشان المعلومة تثبت وتفتكرها بشكل أسهل.'
    ],
    whenToUse: [
      'لما تكون المحاضرة محتاجة فهم وشرح.',
      'لما تحس إن جزء معين في المحاضرة مش واضح.',
      'لما تكون عايز تفهم المعلومة بدل ما تحفظها وخلاص.'
    ]
  },
  {
    id: 'highyield-notes',
    name: 'highyield notes',
    arabicTitle: '2. High-Yield Notes',
    arabicName: 'High-Yield Notes (نوتس امتحانات)',
    role: 'Distilling Raw Lectures into Exam-Critical Notes',
    arabicRole: 'تحويل المحاضرة لنقاط High-Yield وأهم ما تركز عليه امتحانات الكلية',
    url: 'https://gemini.google.com/gem/1iUpgFsCGIm_6_G4VFOIqoGID8vFIVRht?usp=sharing',
    hoverColor: 'orange',
    category: 'Notes',
    badge: 'Tool #2 • Exam Prep',
    features: [
      'استخراج خلاصة المحاضرة (الزبدة)',
      'تركيز مباشر على أسئلة الامتحانات والفاينال',
      'صياغة نوتس مكثفة وسريعة للمراجعة'
    ],
    arabicOverview: 'الأداة دي بتحول المحاضرة لنقاط High-Yield، يعني أهم الحاجات اللي محتاج تركز عليها في الامتحان.\n\nكل اللي عليك إنك تبعتلها المحاضرة، وهي تطلعلك الـNotes المهمة، خصوصًا الحاجات اللي بتكون مهمة في امتحانات الكلية الطبية.',
    whenToUse: [
      'لما تكون خلصت شرح المحاضرة وعايز تركز على المهم.',
      'قبل الامتحان للمراجعة السريعة.',
      'لما تكون المحاضرة طويلة وعايز تطلع منها الزبدة.'
    ]
  },
  {
    id: 'notes-to-visuals',
    name: 'تحويل النوتس لصوره رسومات وهايلايتس',
    arabicTitle: '3. تحويل المعلومات لـHighlights ورسومات',
    arabicName: 'تحويل المعلومات لـHighlights ورسومات',
    role: 'Visual Knowledge Representation & Diagrammatic Highlights',
    arabicRole: 'تحويل المعلومات لشكل بصري ورسومات ومخططات لتثبيت الحفظ',
    url: 'https://gemini.google.com/gem/1H2Hj4g6edpzKe8zCMw9MidoqcJ77GvxK?usp=sharing',
    hoverColor: 'baby-blue',
    category: 'Visuals',
    badge: 'Tool #3 • Visual Learning',
    features: [
      'مخططات ورسومات بصرية واضحة',
      'تلوين وهايلايت ذكي للنقاط المتشابهة',
      'تسهيل حفظ وتذكر الأجزاء المعقدة'
    ],
    arabicOverview: 'الأداة دي بتساعدك تحول المعلومات الموجودة في المحاضرة لشكل بصري يساعدك تفتكرها.\n\nبتبعتلها المعلومات، وهي بترد عليك بـHighlights ورسومات وأشكال تساعدك تربط المعلومات ببعض وتفتكرها بشكل أسهل.',
    whenToUse: [
      'لما تكون المعلومة محتاجة Visualization.',
      'لما يكون عندك جزء صعب في الحفظ.',
      'لما تكون عايز تحول المعلومة لشكل يثبت في دماغك.'
    ]
  },
  {
    id: 'video-to-script',
    name: 'تحويل الفديو الي سكريبت',
    arabicTitle: '4. تحويل الفيديو لـScript',
    arabicName: 'تحويل الفيديو لـScript',
    role: 'Automated Video Transcription & Clean Text Extraction',
    arabicRole: 'تحويل أي فيديو شرح لتفريغ نصي مكتوب قابل للبحث والمراجعة',
    url: 'https://gemini.google.com/gem/1wH4ylFYcF25v8LPtZd4ul7eREydYVBdt?usp=sharing',
    hoverColor: 'yellow',
    category: 'Video',
    badge: 'Tool #4 • Transcription',
    features: [
      'تفريغ فوري من رابط الفيديو مباشرة',
      'دعم الفيديوهات الطويلة ومتابعة التكملة',
      'تسهيل الرجوع لأي جزء دون فتح الفيديو'
    ],
    arabicOverview: 'الأداة دي بتساعدك تحول أي فيديو لـScript.\n\nكل اللي عليك إنك تبعتلها لينك الفيديو، وهي تبدأ تحول الفيديو لتفريغ مكتوب. ولو الفيديو طويل، تقدر تقولها تكمل من الجزء اللي بعده، وتفضل مكملة معاك لحد ما تخلص الفيديو كله.',
    whenToUse: [
      'لما يكون عندك فيديو شرح طويل وعايز تحتفظ بالمحتوى مكتوب.',
      'لو عايز ترجع لجزء معين من الفيديو من غير ما تفتحه كله.',
      'لو عايز تستخدم محتوى الفيديو بعد كده في المذاكرة.'
    ]
  },
  {
    id: 'video-to-qa',
    name: 'تحويل الفديو الي سؤال وجواب',
    arabicTitle: '5. تحويل الفيديو لـQ&A',
    arabicName: 'تحويل الفيديو لـQ&A',
    role: 'Converting Video Lectures into Interactive Active Recall Q&A',
    arabicRole: 'تحويل الفيديو لبنك أسئلة وأجوبة لاختبار الفهم والاستدعاء النشط',
    url: 'https://gemini.google.com/gem/1PtUjhR_rr-ryLyHL94tMhIh4kzU4bgX9?usp=sharing',
    hoverColor: 'orange',
    category: 'Video',
    badge: 'Tool #5 • Active Recall',
    features: [
      'تحويل محتوى الفيديو لبنك أسئلة وأجوبة',
      'اختبار الاستدعاء النشط بعد مشاهدة الشرح',
      'معرفة أهمية محتوى الفيديو بسرعة'
    ],
    arabicOverview: 'برضه بتبعتلها لينك الفيديو، لكن بدل ما تطلعهولك Script، بتحولهولك لأسئلة وأجوبة تقدر تستخدمها في المراجعة.\n\nمثلًا لو شوفت فيديو وعجبك شرحه وعايز تراجعه بعد كده، بدل ما ترجع تتفرج على الفيديو كله، تحوله لـQ&A وتبدأ تختبر نفسك في المعلومات اللي اتقالت.\n\nوكمان لو الفيديو طويل وإنت مش عارف هو أصلًا فيه إيه، ممكن تحول محتواه لأسئلة وتشوف الأسئلة الأول عشان تعرف هل المحتوى ده مهم بالنسبالك ولا لأ.',
    whenToUse: [
      'لمراجعة فيديو إنت شوفته قبل كده.',
      'لاختبار نفسك بعد ما تتفرج على الشرح.',
      'لما يكون الفيديو طويل وعايز تعرف محتواه بسرعة.',
      'لتحويل شرح الفيديو لمادة تقدر تراجع منها.'
    ]
  },
  {
    id: 'zaytouna-disease',
    name: 'الزتونه بتاعت اي مرض',
    arabicTitle: '6. أداة تقييم المرض',
    arabicName: 'أداة تقييم المرض (الزتونة)',
    role: 'Comprehensive Disease Evaluation & Clinical Snapshot',
    arabicRole: 'تقييم شامل لأي مرض وتلخيصه سريرياً بدون حشو أو تفاصيل غير مهمة',
    url: 'https://gemini.google.com/gem/1Yh5H74BXeU_A3tKOQR3L4LJKsXOe1OlI?usp=sharing',
    hoverColor: 'baby-blue',
    category: 'Clinical',
    badge: 'Tool #6 • Clinical Core',
    features: [
      'الأعراض والعلامات المميزة للمرض',
      'فحوصات التشخيص الأولية والذهبية',
      'خطة العلاج والملاحظات الكلينيكال للامتحان'
    ],
    arabicOverview: 'لو إنت بتذاكر مرض معين، كل اللي عليك إنك تبعتلها اسم المرض، وهي تقيملك المرض وتلخصهولك من كل الجوانب المهمة:',
    arabicBreakdown: [
      'الأعراض والعلامات المميزة للمرض.',
      'أهم التحاليل والفحوصات المطلوبة للتشخيص (Investigation of choice).',
      'طريقة التعامل والعلاج خطوة بخطوة (Management & First line).',
      'أهم الـHigh-Yield Notes والـClinical Pearls اللي بتتكرر في الامتحانات.'
    ],
    whenToUse: [
      'لما تكون بتذاكر مرض معين وعايز تفهمه من منظور كلينيكال عملي.',
      'قبل الامتحان عشان تراجع الأمراض وتثبت النقط المهمة لكل مرض.',
      'لما تكون عايز تختصر الرغي وتركز على الزتونة بتاعة المرض.'
    ]
  },
  {
    id: 'lecture-numbers',
    name: 'تجميع ارقام المحاضره',
    arabicTitle: '7. تجميع أرقام المحاضرة',
    arabicName: 'تجميع أرقام المحاضرة',
    role: 'Aggregating All Critical Numbers, Dosages, Statistics & Ranges',
    arabicRole: 'حصر وفهرسة كل الأرقام والنسب والجرعات والمعدلات في مكان واحد',
    url: 'https://gemini.google.com/gem/1uNCG7wFldOOM-yjMWFRvGE5A8en1-2J7?usp=sharing',
    hoverColor: 'yellow',
    category: 'Data',
    badge: 'Tool #7 • Data & Numbers',
    features: [
      'فهرسة جميع الأرقام والنسب في جدول منظم',
      'توضيح دلالة كل رقم وجرعة والـ Normal ranges',
      'مراجعة سريعة مضمونة لأسئلة الـ MCQs الرقمية'
    ],
    arabicOverview: 'الأداة دي بتجمعلك كل الأرقام والنسب والإحصائيات والجرعات اللي موجودة في المحاضرة في مكان واحد.\n\nكل اللي عليك إنك تبعتلها المحاضرة، وهي تفرزلك كل الأرقام وتوضحلك كل رقم بيعبر عن إيه وتجمعهالك بشكل منظم.',
    whenToUse: [
      'لما تكون المحاضرة مليانة أرقام ونسب وخايف تتلخبط بينهم.',
      'للمراجعة السريعة قبل الامتحان على الأرقام والنسب اللي بتيجي في أسئلة الـMCQ.',
      'لما تكون عايز تثبت الأرقام والجرعات وماتضيعش فيها وقت طويل في التدوير وسط السلايدات.'
    ]
  }
];

export const TOOLS_SUMMARY = {
  title: 'Why These AI Tools Help Medical Education',
  description: `Medical school throws a ton of information at you really fast. Students end up spending most of their time on things like copying lectures or searching through big slide sets just to pull out numbers.

Making flashcards by hand and rewriting sections from textbooks takes up a huge chunk of study hours too. These Gemini tools seem to cut down on that kind of busy work so the focus can shift toward clinical thinking and actually practicing recall.

I think it mixes the AI side with some basic ideas about memory and learning. It feels like it changes passive reading into something that sticks a bit better but not everyone starts using it the same way.`
};

export const TOOLS_FINAL_NOTE = {
  title: 'نصيحة أخيرة',
  text: `ابدأ جرب الأدوات دي، وطبق الحاجات اللي فيها بشكل منتظم، والأهم إنها تعمل فرق حقيقي في مذاكرتك وحياتك.\n\nربنا يوفقك`
};
