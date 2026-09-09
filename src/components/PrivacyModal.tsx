import React, { useState } from 'react';
import { X, Shield, FileText, AlertTriangle, Check, ExternalLink } from 'lucide-react';

interface PrivacyModalProps {
  initialTab?: 'privacy' | 'terms' | 'disclaimer';
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ initialTab = 'privacy', onClose }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'disclaimer'>(initialTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-3xl bg-[#FAF6EE] border border-[#DACBB5] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#E8DFD1] bg-[#F4EFE6] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#8C6D3F]" />
            <h2 className="text-lg font-bold text-[#24211D]">
              Legal & Google AdSense Compliance Center
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#E8DDD0] hover:bg-[#DBCABA] text-[#332B20] transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#E8DFD1] bg-[#EFE8DC] px-4 sm:px-6 gap-2 text-xs font-semibold overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'border-[#2D2A26] text-[#2D2A26]'
                : 'border-transparent text-[#766A59] hover:text-[#2D2A26]'
            }`}
          >
            Privacy Policy (AdSense Compliant)
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'terms'
                ? 'border-[#2D2A26] text-[#2D2A26]'
                : 'border-transparent text-[#766A59] hover:text-[#2D2A26]'
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'disclaimer'
                ? 'border-[#2D2A26] text-[#2D2A26]'
                : 'border-transparent text-[#766A59] hover:text-[#2D2A26]'
            }`}
          >
            Medical & AI Disclaimer
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto text-xs sm:text-sm text-[#4A4031] space-y-4 leading-relaxed">
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#24211D] mb-1">
                  Privacy Policy for Abdelrhman Ai
                </h3>
                <p className="text-[#6F6352] text-xs">Last Updated: September 2026</p>
              </div>

              <p>
                At <strong>Abdelrhman Ai</strong> (Welcome to your smarter way to study), accessible via our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by our platform and how we use it, drafted in strict compliance with <strong>Google AdSense</strong> publisher guidelines and global data privacy standards.
              </p>

              <div className="p-4 rounded-xl bg-[#F0E6D6] border border-[#DFCBB0] space-y-2">
                <h4 className="font-bold text-[#2D2417] flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#8C6D3F]" />
                  Google AdSense & DoubleClick DART Cookies
                </h4>
                <p className="text-xs text-[#524636]">
                  Google is one of our third-party vendors. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet.
                </p>
                <p className="text-xs text-[#524636]">
                  Visitors may choose to decline the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy at the following URL:{' '}
                  <a
                    href="https://policies.google.com/technologies/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-[#8C6D3F] font-semibold"
                  >
                    https://policies.google.com/technologies/ads
                  </a>
                </p>
              </div>

              <h4 className="font-bold text-[#24211D]">Our Advertising Partners</h4>
              <p>
                Some of the advertisers on our site may use cookies and web beacons. Our primary advertising partner is <strong>Google AdSense</strong>. Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Abdelrhman Ai. They automatically receive your IP address when this occurs.
              </p>

              <h4 className="font-bold text-[#24211D]">Log Files</h4>
              <p>
                Abdelrhman Ai follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
              </p>

              <h4 className="font-bold text-[#24211D]">CCPA Privacy Rights & GDPR Data Protection Rights</h4>
              <p>
                We respect your rights under CCPA and GDPR. We do not sell your personal information. Every user is entitled to the right to access, rectification, erasure, and restriction of processing. If you make a request, we have one month to respond to you.
              </p>

              <h4 className="font-bold text-[#24211D]">Contact Regarding Privacy</h4>
              <p>
                For questions or demands regarding this privacy statement, please contact us via Telegram: <a href="https://t.me/lifedocter" className="underline font-medium">@lifedocter</a> or WhatsApp: <a href="https://wa.me/201225211153" className="underline font-medium">01225211153</a>.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#24211D] mb-1">
                  Terms of Service & Usage Conditions
                </h3>
                <p className="text-[#6F6352] text-xs">Effective Date: 2026</p>
              </div>

              <p>
                By accessing this website and utilizing the shared Google Gemini AI Gems, you agree to comply with and be bound by the following terms and conditions of use.
              </p>

              <h4 className="font-bold text-[#24211D]">1. Intellectual Property & AI Gems Access</h4>
              <p>
                The prompt engineering structures, workflow syntheses, and custom instructions powering our shared Gemini Gems are educational open resources crafted to aid medical learning. You are welcome to adapt them for personal academic study.
              </p>

              <h4 className="font-bold text-[#24211D]">2. Third-Party Platform Affiliation</h4>
              <p>
                Google Gemini is a registered trademark of Google LLC. This portfolio is an independent educational creation by a medical student and prompt engineer. Links pointing to Google Gemini (`gemini.google.com`) are subject to Google's Terms of Service and AI Principles.
              </p>

              <h4 className="font-bold text-[#24211D]">3. External Course & Mentorship</h4>
              <p>
                Registrations made via our educational portal (`abd-elrhman.nzmly.com`) provide access to proprietary training curriculums, live sessions, and support communities according to the terms listed on the course registration page.
              </p>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span className="font-semibold text-xs">
                  Important Educational Notice for Medical Students and Healthcare Professionals
                </span>
              </div>

              <h3 className="text-base font-bold text-[#24211D]">
                Medical & AI Accuracy Disclaimer
              </h3>

              <p>
                The materials, AI prompt gems, and study methodologies provided on <strong>Abdelrhman Ai</strong> are intended solely for <strong>educational study assistance, exam revision, and conceptual structuring</strong>.
              </p>

              <h4 className="font-bold text-[#24211D]">Not Clinical or Diagnostic Advice</h4>
              <p>
                Under no circumstances should the outputs of any Generative AI model or Gemini Gem be utilized for direct patient diagnosis, clinical triage, surgical planning, or real-time pharmacological prescription. AI models may occasionally generate plausible-sounding but erroneous outputs (hallucinations). Always cross-reference all clinical guidelines with authoritative textbooks (e.g., Robbins, Harrison's, First Aid) and official hospital protocols.
              </p>

              <h4 className="font-bold text-[#24211D]">Student Responsibility</h4>
              <p>
                Students remain solely responsible for verifying critical dosages, laboratory cutoff numbers, and patient safety criteria using official medical faculty curricula and licensed medical references.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E8DFD1] bg-[#F4EFE6] flex items-center justify-between shrink-0 text-xs text-[#786D5D]">
          <span>Abdelrhman Ai • Compliance & Privacy</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#2D2A26] text-[#FAF7F2] font-semibold hover:bg-black transition-colors"
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
};
