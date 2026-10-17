import React, { useEffect } from 'react';
import { ExternalLink, X, Info } from 'lucide-react';
import { Advertisement, AdPlacement } from '../../types';
import { dataRepository } from '../../lib/data-service';

interface AdBannerProps {
  placement: AdPlacement;
  ads: Advertisement[];
  onOpenListingModal?: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  placement,
  ads,
  onOpenListingModal,
}) => {
  const [closed, setClosed] = React.useState(false);

  // Filter active ads for this placement
  const availableAds = ads.filter(
    (a) => a.isActive && a.placement === placement
  );

  // Pick top display order
  const activeAd = availableAds.sort((a, b) => a.displayOrder - b.displayOrder)[0];

  useEffect(() => {
    if (activeAd) {
      dataRepository.recordAdImpression(activeAd.id);
    }
  }, [activeAd?.id]);

  if (closed) return null;

  // If no ad exists for sticky bottom or top, display clean CTA or render nothing for between_posts
  if (!activeAd) {
    if (placement === 'bottom_sticky') {
      return (
        <div className="fixed bottom-0 inset-x-0 z-30 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white py-2.5 px-4 shadow-2xl border-t border-emerald-600/40">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              <span className="font-bold">ঝালকাঠি অনলাইন সেবায় বিজ্ঞাপন দিন:</span>
              <span className="text-emerald-200 hidden sm:inline">
                আপনার ব্যবসা বা সেবাকে সবার সামনে তুলে ধরুন
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenListingModal}
                className="bg-lime-400 hover:bg-lime-300 text-emerald-950 font-extrabold px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer"
              >
                বিজ্ঞাপন বুকিং
              </button>
              <button
                onClick={() => setClosed(true)}
                className="text-emerald-400 hover:text-white p-1 rounded cursor-pointer"
                aria-label="বিজ্ঞাপন বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  const handleClick = () => {
    dataRepository.recordAdClick(activeAd.id);
  };

  // Sticky Bottom Banner
  if (placement === 'bottom_sticky') {
    return (
      <div className="fixed bottom-0 inset-x-0 z-30 bg-slate-900 text-white shadow-2xl border-t border-slate-700 animate-in slide-in-from-bottom-2 duration-300">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <a
            href={activeAd.targetUrl}
            target="_blank"
            rel="noreferrer"
            onClick={handleClick}
            className="flex items-center gap-3 flex-1 overflow-hidden group cursor-pointer"
          >
            <span className="bg-amber-500 text-black text-[9px] font-black uppercase px-1.5 py-0.5 rounded shrink-0">
              বিজ্ঞাপন
            </span>
            {activeAd.bannerUrl && (
              <img
                src={activeAd.bannerUrl}
                alt={activeAd.titleBn}
                className="h-8 w-14 object-cover rounded shrink-0"
              />
            )}
            <span className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
              {activeAd.titleBn}
            </span>
          </a>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={activeAd.targetUrl}
              target="_blank"
              rel="noreferrer"
              onClick={handleClick}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
            >
              <span>বিস্তারিত</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setClosed(true)}
              className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
              aria-label="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // In-page Ad Banner (home_top, between_posts, footer)
  return (
    <div className="max-w-7xl mx-auto px-4 my-6">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 group hover:border-emerald-300 transition-all shadow-sm">
        <a
          href={activeAd.targetUrl}
          target="_blank"
          rel="noreferrer"
          onClick={handleClick}
          className="block relative cursor-pointer"
        >
          {activeAd.bannerUrl ? (
            <div className="relative h-28 sm:h-36 w-full overflow-hidden bg-slate-900">
              <img
                src={activeAd.bannerUrl}
                alt={activeAd.titleBn}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-6 sm:p-8">
                <div className="max-w-xl text-white">
                  <span className="bg-amber-400 text-emerald-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full mb-1.5 inline-block">
                    বিজ্ঞাপনদাতা: {activeAd.clientName}
                  </span>
                  <h4 className="text-base sm:text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                    {activeAd.titleBn}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold mt-2">
                    <span>ওয়েবসাইটে যান</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full mb-1 inline-block">
                  বিজ্ঞাপন
                </span>
                <h4 className="font-extrabold text-base sm:text-lg">{activeAd.titleBn}</h4>
              </div>
              <span className="bg-white text-emerald-900 font-bold text-xs px-4 py-2 rounded-xl shrink-0">
                ক্লিক করুন
              </span>
            </div>
          )}
        </a>
      </div>
    </div>
  );
};
