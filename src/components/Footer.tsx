import React from 'react';
import { MessageCircle, Send, Instagram, Shield, FileText, AlertCircle, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: (tab: 'privacy' | 'terms' | 'disclaimer') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy }) => {
  return (
    <footer className="bg-[#EFE8DC] border-t border-[#DFD3C2] text-[#4A4032] pt-14 pb-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Contact Information Section - Explicitly Requested */}
        <div className="bg-[#FAF6EE] rounded-3xl border border-[#DACBB5] p-6 sm:p-8 mb-12 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D3F] block mb-1">
              Direct Contact & Socials
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#24211D]">
              تواصل معي مباشرة لأي استفسار أو اقتراح
            </h3>
            <p className="text-xs sm:text-sm text-[#6C5F4E] mt-1">
              Feel free to reach out for personalized medical prompt templates, questions, or collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl mx-auto">
            {/* WhatsApp */}
            <a
              href="https://wa.me/201225211153"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl bg-[#F4EDE1] hover:bg-[#EAE0D0] border border-[#DDD0BC] transition-all hover:-translate-y-0.5 group shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-600/20 flex items-center justify-center text-emerald-700 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs text-[#7A6E5C] font-semibold uppercase">WhatsApp</div>
                <div className="text-sm font-bold text-[#24211D] font-mono truncate">01225211153</div>
              </div>
            </a>

            {/* Telegram */}
            <a
              href="https://t.me/lifedocter"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl bg-[#F4EDE1] hover:bg-[#EAE0D0] border border-[#DDD0BC] transition-all hover:-translate-y-0.5 group shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-600/10 border border-sky-600/20 flex items-center justify-center text-sky-700 shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <Send className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs text-[#7A6E5C] font-semibold uppercase">Telegram</div>
                <div className="text-sm font-bold text-[#24211D] truncate">@lifedocter</div>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/abdofawzii?igsi=dThiYnpmcWV3a3ht&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl bg-[#F4EDE1] hover:bg-[#EAE0D0] border border-[#DDD0BC] transition-all hover:-translate-y-0.5 group shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-600/10 border border-rose-600/20 flex items-center justify-center text-rose-700 shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs text-[#7A6E5C] font-semibold uppercase">Instagram</div>
                <div className="text-sm font-bold text-[#24211D] truncate">@abdofawzii</div>
              </div>
            </a>
          </div>
        </div>

        {/* Footer Meta & AdSense Compliance Details */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-[#DFD3C2] text-xs">
          <div>
            <div className="flex items-center gap-2 font-bold text-[#24211D] text-sm mb-1">
              <Sparkles className="w-4 h-4 text-[#8C6D3F]" />
              Abdelrhman Ai
            </div>
            <p className="text-[#736653]">
              Exploring how AI transforms the way medical students learn, work, and create.
            </p>
          </div>

          {/* Legal Navigation Links for Google AdSense compliance */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#5A4E3D]">
            <button
              onClick={() => onOpenPrivacy('privacy')}
              className="hover:text-black hover:underline cursor-pointer flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5 text-[#8C6D3F]" />
              Privacy Policy
            </button>
            <span className="text-[#C4B49E]">•</span>
            <button
              onClick={() => onOpenPrivacy('terms')}
              className="hover:text-black hover:underline cursor-pointer flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-[#8C6D3F]" />
              Terms of Service
            </button>
            <span className="text-[#C4B49E]">•</span>
            <button
              onClick={() => onOpenPrivacy('disclaimer')}
              className="hover:text-black hover:underline cursor-pointer flex items-center gap-1"
            >
              <AlertCircle className="w-3.5 h-3.5 text-[#8C6D3F]" />
              Medical Disclaimer
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-[11px] text-[#8C7E6A] pt-4 border-t border-[#E5DAC9]">
          © {new Date().getFullYear()} Abdelrhman Ai. Built for ambitious medical students around the world.
        </div>
      </div>
    </footer>
  );
};
