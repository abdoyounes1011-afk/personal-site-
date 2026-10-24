import React, { useState, useEffect } from 'react';
import { Shield, Check, ExternalLink } from 'lucide-react';

interface CookieBannerProps {
  onOpenPrivacy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPrivacy }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie_consent_accepted');
      if (!consent) {
        // Small delay so it animates in gracefully
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // fallback
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('cookie_consent_accepted', 'true');
    } catch (e) {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#DACBB5] shadow-2xl animate-slide-up" dir="rtl">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-cairo text-xs sm:text-sm">
        <div className="flex items-start sm:items-center gap-3 text-[#3D3528]">
          <div className="w-8 h-8 rounded-full bg-[#EFE7D8] border border-[#DACBB5] flex items-center justify-center text-[#8C6D3F] shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <p className="leading-relaxed">
            نحن نستخدم ملفات تعريف الارتباط (Cookies) بما في ذلك ملفات Google AdSense لتقديم إعلانات مخصصة وتحسين تجربة التعلم على الموقع. استمرارك بالتصفح يُعد موافقة على{' '}
            <button
              onClick={onOpenPrivacy}
              className="font-bold underline text-[#8C6D3F] hover:text-[#5A4523] cursor-pointer inline-flex items-center gap-0.5"
            >
              <span>سياسة الخصوصية</span>
            </button>
            .
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={onOpenPrivacy}
            className="px-3.5 py-1.5 rounded-xl border border-[#DACBB5] bg-[#F2ECE1] text-[#5A4D3A] hover:bg-[#EBE2D2] text-xs font-semibold transition-all cursor-pointer"
          >
            تفاصيل السياسة
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-1.5 rounded-xl bg-[#8C6D3F] hover:bg-[#73572E] text-[#FAF7F2] text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>موافق وفهمت</span>
          </button>
        </div>
      </div>
    </div>
  );
};
