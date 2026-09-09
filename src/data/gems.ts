import { GemTool } from '../types';

export const GEM_TOOLS: GemTool[] = [
  {
    id: 'ask-dad',
    name: 'ask dad',
    arabicName: 'ask dad (تسكيمة وفهم المحاضرة)',
    role: 'Deep Conceptual Comprehension & Lecture Structuring / Mnemonics',
    arabicRole: 'ودي للفهم وتسكيمة المحاضره وتبسيط المفاهيم الصعبة',
    url: 'https://gemini.google.com/gem/1OnZOsudcO33Fr724r_4VU9M0TchkDg_M?usp=sharing',
    hoverColor: 'yellow',
    category: 'Comprehension',
    badge: 'Tool #1 • Understanding',
    features: [
      'Breaks down overwhelming pathophysiology into intuitive analogies',
      'Generates memorable medical mnemonics (تسكيمات) tailored for exam recall',
      'Transforms complex jargon into relatable conversational explanations'
    ]
  },
  {
    id: 'highyield-notes',
    name: 'highyield notes',
    arabicName: 'highyield notes (نوتس امتحانات)',
    role: 'Converting Raw Medical Lectures into High-Yield Exam Notes',
    arabicRole: 'تحويل المحاضره لنوتس امتحانات جاهزة للمراجعة السريعة',
    url: 'https://gemini.google.com/gem/1iUpgFsCGIm_6_G4VFOIqoGID8vFIVRht?usp=sharing',
    hoverColor: 'orange',
    category: 'Notes',
    badge: 'Tool #2 • Exam Prep',
    features: [
      'Filters out filler words and focuses strictly on high-yield exam criteria',
      'Highlights clinical pearls, red-flag symptoms, and gold-standard treatments',
      'Structures knowledge into concise, rapid-review bullet points'
    ]
  },
  {
    id: 'notes-to-visuals',
    name: 'تحويل النوتس لصوره رسومات وهايلايتس',
    arabicName: 'تحويل النوتس لصوره رسومات وهايلايتس',
    role: 'Transforming Written Notes into Visual Diagrams, Sketches & Highlights',
    arabicRole: 'تحويل النوتس لصوره رسومات وهايلايتس ومخططات بصرية سهلة الحفظ',
    url: 'https://gemini.google.com/gem/1H2Hj4g6edpzKe8zCMw9MidoqcJ77GvxK?usp=sharing',
    hoverColor: 'baby-blue',
    category: 'Visuals',
    badge: 'Tool #3 • Visual Learning',
    features: [
      'Generates structural flowcharts and visual pathway diagrams',
      'Converts dense text blocks into clean visual comparisons',
      'Employs color-coded mental anchoring for visual learners'
    ]
  },
  {
    id: 'video-to-script',
    name: 'تحويل الفديو الي سكريبت',
    arabicName: 'تحويل الفديو الي سكريبت',
    role: 'Converting Recorded Video Lectures into Clean Structured Scripts',
    arabicRole: 'تحويل الفديو الي سكريبت نصي منظم يسهل البحث فيه وتلخيصه',
    url: 'https://gemini.google.com/gem/1wH4ylFYcF25v8LPtZd4ul7eREydYVBdt?usp=sharing',
    hoverColor: 'yellow',
    category: 'Video',
    badge: 'Tool #4 • Transcription',
    features: [
      'Eliminates conversational pauses, stutters, and tangents from audio/video',
      'Organizes rambling speech into coherent academic paragraphs',
      'Enables rapid keyword searching through hours of audio recordings'
    ]
  },
  {
    id: 'video-to-qa',
    name: 'تحويل الفديو الي سؤال وجواب',
    arabicName: 'تحويل الفديو الي سؤال وجواب',
    role: 'Transforming Video Content into Interactive Q&A & Active Recall Decks',
    arabicRole: 'تحويل الفديو الي سؤال وجواب بنظام الاستدعاء النشط لامتحانات الفاينال',
    url: 'https://gemini.google.com/gem/1PtUjhR_rr-ryLyHL94tMhIh4kzU4bgX9?usp=sharing',
    hoverColor: 'orange',
    category: 'Video',
    badge: 'Tool #5 • Active Recall',
    features: [
      'Automatically crafts USMLE / college-style questions from lecture speech',
      'Enforces Active Recall methodology directly after watching videos',
      'Prepares students for actual exam questions without manual card creation'
    ]
  },
  {
    id: 'zaytouna-disease',
    name: 'الزتونه بتاعت اي مرض',
    arabicName: 'الزتونه بتاعت اي مرض',
    role: 'The Ultimate Clinical Essence ("El-Zaytouna") of Any Disease',
    arabicRole: 'الزتونه بتاعت اي مرض: أهم نقطة في التشخيص والأعراض والعلاج بدون رغي',
    url: 'https://gemini.google.com/gem/1Yh5H74BXeU_A3tKOQR3L4LJKsXOe1OlI?usp=sharing',
    hoverColor: 'baby-blue',
    category: 'Clinical',
    badge: 'Tool #6 • Clinical Core',
    features: [
      'Triad of symptoms, pathognomonic signs, and key clinical triggers',
      'Most accurate diagnostic test vs. initial best step in management',
      'Distills 15-page textbook chapters into a single actionable clinical snapshot'
    ]
  },
  {
    id: 'lecture-numbers',
    name: 'تجميع ارقام المحاضره',
    arabicName: 'تجميع ارقام المحاضره',
    role: 'Aggregating All Critical Numbers, Dosages, Statistics & Ranges',
    arabicRole: 'تجميع ارقام المحاضره: حصر كل النسب والجرعات والمعدلات الرقمية في جدول واحد',
    url: 'https://gemini.google.com/gem/1uNCG7wFldOOM-yjMWFRvGE5A8en1-2J7?usp=sharing',
    hoverColor: 'yellow',
    category: 'Data',
    badge: 'Tool #7 • Data & Numbers',
    features: [
      'Extracts diagnostic thresholds, lab reference values, and staging cutoffs',
      'Assembles numerical drug dosages into clear comparison tables',
      'Prevents careless exam point losses on memorization-heavy number questions'
    ]
  }
];

export const TOOLS_SUMMARY = {
  title: 'Why These AI Tools Transform Medical Education',
  description: 
    'Medical school is characterized by an immense volume of information delivered at relentless velocity. Traditionally, students spend up to 70% of their study time on mechanical, low-yield tasks: transcribing professor lectures, hunting for numerical values in 80-slide decks, manually building flashcards, and rewriting textbook paragraphs. These custom Gemini AI Gems automate the cognitive friction of study prep so you can focus 100% of your mental energy where it matters most: deep clinical reasoning, spaced repetition, and active retrieval practice. By bridging modern generative AI with evidence-based cognitive psychology, this toolkit converts hours of exhausting passive studying into rapid, high-retention mastery.'
};
