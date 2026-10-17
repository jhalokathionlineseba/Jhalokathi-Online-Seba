import React from 'react';
import { BrandLogo } from '../common/BrandLogo';
import {
  PhoneCall,
  Mail,
  MapPin,
  Facebook,
  Youtube,
  Send,
  Lock,
  Download,
  ShieldCheck,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { SiteSettings, Upazila, UPAZILAS } from '../../types';

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (sectionId: string) => void;
  onSelectUpazila: (u: Upazila) => void;
  onOpenAdmin: () => void;
  onDownloadSource: () => void;
  onOpenListingModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onSelectUpazila,
  onOpenAdmin,
  onDownloadSource,
  onOpenListingModal,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" whiteText />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {settings.footerTextBn}
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{settings.addressBn}</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href={`tel:${settings.contactPhone}`} className="hover:text-emerald-400">
                  {settings.contactPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-emerald-400">
                  {settings.contactEmail}
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="ফেসবুক পেজ"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="ইউটিউব চ্যানেল"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {settings.whatsappSupport && (
                <a
                  href={`https://wa.me/${settings.whatsappSupport.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-emerald-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="হোয়াটসঅ্যাপ সাপোর্ট"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              গুরুত্বপূর্ণ বিভাগ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('categories')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-600" />
                  <span>সেবা ক্যাটাগরি</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('emergency')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-600" />
                  <span>জরুরি হটলাইন</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('directory')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-600" />
                  <span>ব্যবসা প্রতিষ্ঠান</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('news')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-600" />
                  <span>সংবাদ ও নোটিশ</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tourism')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-600" />
                  <span>দর্শনীয় স্থান</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Upazilas of Jhalakathi */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              উপজেলাসমূহ
            </h4>
            <ul className="space-y-2 text-xs">
              {UPAZILAS.filter((u) => u.id !== 'all').map((u) => (
                <li key={u.id}>
                  <button
                    onClick={() => {
                      onSelectUpazila(u.id);
                      onNavigate('directory');
                    }}
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-emerald-600" />
                    <span>{u.nameBn}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin & Deliverable Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              সিস্টেম ও প্রজেক্ট
            </h4>
            <div className="space-y-2">
              <button
                onClick={onOpenListingModal}
                className="w-full bg-emerald-800/60 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl border border-emerald-700/60 transition-colors text-left flex items-center gap-2 cursor-pointer"
              >
                <span>➕ সেবা তালিকাভুক্ত করুন</span>
              </button>

              <button
                onClick={onDownloadSource}
                className="w-full bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 font-bold text-xs py-2 px-3 rounded-xl border border-slate-700 transition-colors text-left flex items-center gap-2 cursor-pointer"
                title="সম্পূর্ণ সোর্স কোড ডাউনলোড করুন"
              >
                <Download className="w-4 h-4 shrink-0 text-amber-400" />
                <span>সোর্স কোড প্যাকেজ (.ZIP)</span>
              </button>

              <button
                onClick={onOpenAdmin}
                className="w-full bg-slate-900 hover:bg-emerald-950 text-slate-300 hover:text-white font-bold text-xs py-2 px-3 rounded-xl border border-slate-800 transition-colors text-left flex items-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4 shrink-0 text-slate-400" />
                <span>অ্যাডমিনিস্ট্রেটর পোর্টাল</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <span>© ২০২৬ ঝালকাঠি অনলাইন সেবা (JOS). সর্বস্বত্ব সংরক্ষিত।</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              গোপনীয়তা ও শর্তাবলী
            </button>
            <span>•</span>
            <button
              onClick={onOpenAdmin}
              className="text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
            >
              এডমিন ড্যাশবোর্ড
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
