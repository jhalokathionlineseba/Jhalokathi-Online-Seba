import React from 'react';
import { Search, MapPin, PhoneCall, ShieldAlert, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { SiteSettings, Upazila, UPAZILAS } from '../../types';

interface HeroBannerProps {
  settings: SiteSettings;
  selectedUpazila: Upazila;
  onUpazilaChange: (upazila: Upazila) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigate: (sectionId: string) => void;
  onOpenListingModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  settings,
  selectedUpazila,
  onUpazilaChange,
  searchQuery,
  onSearchChange,
  onNavigate,
  onOpenListingModal,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-950 text-white py-14 sm:py-20 lg:py-24">
      {/* Scenic Jhalakathi Riverside Background Artwork with soft overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <svg
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover preserve-3d"
        >
          {/* River water gradient waves */}
          <path
            d="M0 450 Q360 380 720 460 T1440 440 L1440 600 L0 600 Z"
            fill="#065f46"
            opacity="0.8"
          />
          <path
            d="M0 500 Q360 460 720 520 T1440 490 L1440 600 L0 600 Z"
            fill="#047857"
            opacity="0.5"
          />
          {/* Gabkhan 5th Friendship Bridge arch silhouette */}
          <path
            d="M200 480 Q500 240 800 480"
            stroke="#fbbf24"
            strokeWidth="3"
            strokeDasharray="6 6"
            opacity="0.4"
          />
          <path
            d="M500 240 L500 480 M400 280 L400 480 M600 280 L600 480"
            stroke="#fbbf24"
            strokeWidth="1.5"
            opacity="0.25"
          />
          {/* Country Boat Silhouette on river */}
          <path
            d="M920 470 Q960 485 1000 470 L990 480 Q960 492 930 480 Z"
            fill="#fef08a"
            opacity="0.6"
          />
          <path d="M960 470 L960 440 L980 455 Z" fill="#ffffff" opacity="0.7" />
          {/* Coconut palms / Riverbank foliage silhouettes */}
          <circle cx="1250" cy="420" r="40" fill="#064e3b" opacity="0.6" />
          <circle cx="1320" cy="400" r="50" fill="#047857" opacity="0.5" />
          <circle cx="120" cy="430" r="45" fill="#064e3b" opacity="0.6" />
        </svg>
      </div>

      {/* Atmospheric lighting glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-lime-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* District Heritage Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-800/80 hover:bg-emerald-800 border border-emerald-600/40 px-3.5 py-1.5 rounded-full text-emerald-200 text-xs sm:text-sm font-medium mb-6 shadow-sm backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
          <span>কীর্তিপাশা • সুগন্ধা নদী • ভাসমান পেয়ারা হাট • গাবখান ব্রিজ</span>
        </div>

        {/* Hero Title & Subtitle */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight mb-4 drop-shadow-sm text-balance">
          {settings.heroHeadingBn}
        </h1>

        <p className="text-base sm:text-xl text-emerald-100 max-w-3xl mx-auto font-normal leading-relaxed mb-8">
          {settings.heroDescriptionBn}
        </p>

        {/* Interactive Search Card */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-2.5 sm:p-3 shadow-2xl shadow-emerald-950/40 border border-emerald-100/30 text-slate-800">
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            {/* Upazila Selector */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 sm:w-56 shrink-0">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <select
                value={selectedUpazila}
                onChange={(e) => onUpazilaChange(e.target.value as Upazila)}
                className="bg-transparent text-sm font-semibold text-slate-700 focus:outline-none w-full cursor-pointer"
                aria-label="উপজেলা নির্বাচন করুন"
              >
                {UPAZILAS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nameBn}
                  </option>
                ))}
              </select>
            </div>

            {/* Keyword Input */}
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="কী সেবা খুঁজছেন? (যেমন: সদর হাসপাতাল, অ্যাম্বুলেন্স, পুলিশ)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Search CTA */}
            <button
              onClick={() => onNavigate('directory')}
              className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-emerald-800/30 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>অনুসন্ধান</span>
            </button>
          </div>

          {/* Quick Filter Tag Pills */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-2.5 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">দ্রুত খুঁজুন:</span>
            {[
              { label: 'জরুরি অ্যাম্বুলেন্স', query: 'অ্যাম্বুলেন্স' },
              { label: 'সদর হাসপাতাল', query: 'সদর হাসপাতাল' },
              { label: 'থানা ও পুলিশ', query: 'পুলিশ' },
              { label: 'ফায়ার সার্ভিস', query: 'ফায়ার সার্ভিস' },
              { label: 'রক্তদাতা', query: 'রক্ত' },
              { label: 'বাস কাউন্টার', query: 'বাস' },
            ].map((chip) => (
              <button
                key={chip.label}
                onClick={() => {
                  onSearchChange(chip.query);
                  onNavigate('directory');
                }}
                className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trust Badges / Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12 text-center text-emerald-100">
          <div className="bg-emerald-900/60 border border-emerald-700/40 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-lime-300">১০০+</div>
            <div className="text-xs text-emerald-200 mt-0.5">যাচাইকৃত সেবা প্রতিষ্ঠান</div>
          </div>
          <div className="bg-emerald-900/60 border border-emerald-700/40 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-lime-300">৪টি</div>
            <div className="text-xs text-emerald-200 mt-0.5">উপজেলা সম্পূর্ণ কভারেজ</div>
          </div>
          <div className="bg-emerald-900/60 border border-emerald-700/40 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-lime-300">২৪/৭</div>
            <div className="text-xs text-emerald-200 mt-0.5">জরুরি নম্বর সরাসরি ডায়াল</div>
          </div>
          <div className="bg-emerald-900/60 border border-emerald-700/40 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-lime-300">১০০%</div>
            <div className="text-xs text-emerald-200 mt-0.5">নাগরিকদের জন্য বিনামূল্যে</div>
          </div>
        </div>
      </div>
    </section>
  );
};
