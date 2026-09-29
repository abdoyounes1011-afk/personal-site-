import React, { useState } from 'react';
import { Youtube, ExternalLink, Play, Copy, Check, Sparkles } from 'lucide-react';

interface VideoItem {
  id: string;
  boxNumber: string;
  title: string;
  category: string;
  categoryEn: string;
  description: string;
  url: string;
  youtubeId: string;
}

const YOUTUBE_VIDEOS: VideoItem[] = [
  {
    id: 'video-1',
    boxNumber: 'فيديو #1',
    title: 'ازاي نذاكر باستمرار حتي لو مش متحمس',
    category: 'الاستمرارية والإنتاجية',
    categoryEn: 'Study Consistency',
    description: 'خطوات عملية وتفسير نفسي لبناء عادة مذاكرة يومية مستمرة ومستقرة، دون الاعتماد فقط على موجات الحماس المؤقتة.',
    url: 'https://youtu.be/O9-cpxduwXU?si=JKnwrjtu_RrCHqWA',
    youtubeId: 'O9-cpxduwXU'
  },
  {
    id: 'video-2',
    boxNumber: 'فيديو #2',
    title: 'استخدم ٤ برومتس عشان تحويل طريقة مذاكرتك بال Ai',
    category: 'الذكاء الاصطناعي والمذاكرة',
    categoryEn: 'AI Prompt Engineering',
    description: 'أربعة برومتس وأوامر احترافية تحول الذكاء الاصطناعي من مجرد أداة شات إلى معلم شخصي يبسط أصعب المفاهيم الطبية.',
    url: 'https://youtu.be/s5lGJBNBNIk?si=OqBZ1a_zDRmfkT-g',
    youtubeId: 's5lGJBNBNIk'
  },
  {
    id: 'video-3',
    boxNumber: 'فيديو #3',
    title: 'ليه صعب تبدأ ؟ | ٣ اسباب',
    category: 'علم النفس والتسويف',
    categoryEn: 'Overcoming Procrastination',
    description: 'تحليل دقيق لأهم 3 أسباب تجعل بداية جلسة المذاكرة شاقة وثقيلة، مع استراتيجيات علمية للبدء الفوري بدون مقاومة داخلية.',
    url: 'https://youtu.be/WhUmd-7gssY?si=-rguOJHeJ_eD7g3I',
    youtubeId: 'WhUmd-7gssY'
  }
];

export const VideosSection: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (video: VideoItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(video.url);
    setCopiedId(video.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="videos" className="py-14 px-4 sm:px-6 max-w-5xl mx-auto border-t border-[#E8DFD1]">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCE8E6] border border-[#F5C2BE] text-xs font-bold text-[#B91C1C] uppercase tracking-wider mb-3">
          <Youtube className="w-4 h-4 text-[#DC2626]" />
          <span>قناتي على يوتيوب • YouTube Guides</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#24211D] tracking-tight max-w-2xl mx-auto leading-snug">
          فيديوهات عملية لتطوير طريقة مذاكرتك بالذكاء الاصطناعي
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#6B5F4E] max-w-xl mx-auto font-cairo" dir="rtl">
          اختار اللي يناسبك ويارب يكون نافع ليك
        </p>
      </div>

      {/* 3 Video Boxes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {YOUTUBE_VIDEOS.map((video) => (
          <div
            key={video.id}
            className="flex flex-col justify-between rounded-3xl bg-[#FBF8F2] border border-[#E3D9C9] overflow-hidden shadow-2xs hover:shadow-md hover:border-[#DAC5A7] transition-all duration-200 group"
          >
            {/* Video Thumbnail Preview */}
            <div className="relative aspect-video w-full bg-[#1F1C18] overflow-hidden">
              <img
                src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                alt={video.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              
              {/* Play Badge */}
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Watch ${video.title} on YouTube`}
                className="absolute inset-0 flex items-center justify-center group/play"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover/play:scale-110 group-hover/play:bg-red-600 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </a>

              {/* Box Tag in Thumbnail */}
              <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold font-mono">
                {video.boxNumber}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                {/* Category Badge */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C6D3F] px-2.5 py-0.5 rounded-full bg-[#EFE6D6] border border-[#DFCBB0]">
                    <Sparkles className="w-3 h-3" />
                    {video.category}
                  </span>
                  <span className="text-[11px] text-[#8A7D6B] font-mono">
                    {video.categoryEn}
                  </span>
                </div>

                {/* Video Title in Arabic */}
                <h3 className="font-cairo text-base sm:text-lg font-bold text-[#24211D] leading-snug mb-2 group-hover:text-[#B91C1C] transition-colors" dir="rtl">
                  {video.title}
                </h3>

                {/* Description */}
                <p className="font-cairo text-xs text-[#6A5D4D] leading-relaxed mb-4" dir="rtl">
                  {video.description}
                </p>
              </div>

              {/* Action Buttons with YouTube Link */}
              <div className="pt-3 border-t border-[#EAE1D3] flex flex-col gap-2">
                {/* Primary Button as requested */}
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2D2A26] hover:bg-[#151311] text-[#FAF7F2] text-xs font-bold transition-all shadow-xs group-hover:bg-[#B91C1C]"
                >
                  <Youtube className="w-4 h-4 text-red-400 group-hover:text-white" />
                  <span>مشاهدة الفيديو على يوتيوب</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                {/* Copy Link Button */}
                <button
                  type="button"
                  onClick={(e) => handleCopy(video, e)}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EFE7D8] hover:bg-[#E4DAC7] text-[#554734] border border-[#DACBB5] text-[11px] font-medium transition-colors cursor-pointer"
                >
                  {copiedId === video.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">تم نسخ الرابط!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#7A6E5D]" />
                      <span>نسخ رابط الفيديو</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
