import React, { useState } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import {
  PhoneCall,
  Search,
  ShieldCheck,
  Menu,
  X,
  PlusCircle,
  HelpCircle,
  CloudSun,
  Calendar,
  Lock,
} from 'lucide-react';
import { SiteSettings } from '../../types';

interface HeaderProps {
  settings: SiteSettings;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenAdmin: () => void;
  onOpenListingModal: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onNavigate,
  activeSection,
  onOpenAdmin,
  onOpenListingModal,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'hero', label: 'হোম' },
    { id: 'categories', label: 'সেবাসমূহ' },
    { id: 'emergency', label: 'জরুরি সেবা' },
    { id: 'directory', label: 'ব্যবসা ডিরেক্টরি' },
    { id: 'news', label: 'সংবাদ ও বিজ্ঞপ্তি' },
    { id: 'tourism', label: 'দর্শনীয় স্থান' },
    { id: 'contact', label: 'যোগাযোগ' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-100 transition-all">
      {/* Top Notification & Utility Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>শনিবার, ১৭ অক্টোবর ২০২৬</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-200">
              <CloudSun className="w-3.5 h-3.5 text-amber-300" />
              <span>ঝালকাঠি: ২৮° সে. (স্বস্তিকর)</span>
            </div>
            <div className="hidden lg:flex items-center gap-1 text-emerald-300">
              <span className="bg-emerald-700/80 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded text-white tracking-wider">
                ঘোষণা
              </span>
              <span className="truncate max-w-md">{settings.announcementTickerBn}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${settings.emergencyHotline}`}
              className="flex items-center gap-1.5 font-bold text-amber-300 hover:text-amber-200 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
              <span>জরুরি হটলাইন: {settings.emergencyHotline}</span>
            </a>
            <span className="text-emerald-700">|</span>
            <button
              onClick={onOpenListingModal}
              className="flex items-center gap-1 hover:text-emerald-200 transition-colors font-medium cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>সেবা যুক্ত করুন</span>
            </button>
            <span className="text-emerald-700">|</span>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-600 px-2 py-0.5 rounded text-white font-medium transition-colors cursor-pointer"
              title="এডমিন লগইন"
            >
              <Lock className="w-3 h-3 text-emerald-200" />
              <span>এডমিন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <button
          onClick={() => handleNavClick('hero')}
          className="text-left cursor-pointer focus:outline-none"
        >
          <BrandLogo size="md" />
        </button>

        {/* Live Search Bar (Desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md relative mx-2">
          <input
            type="text"
            placeholder="ডাক্তার, হাসপাতাল, অ্যাম্বুলেন্স বা ব্যবসা খুঁজুন..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 pl-9 pr-4 py-2 rounded-full border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm transition-all outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 text-xs bg-slate-200 hover:bg-slate-300 rounded-full w-4 h-4 flex items-center justify-center text-slate-600"
            >
              ×
            </button>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 font-medium text-sm text-slate-700">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSection === link.id
                  ? 'bg-emerald-50 text-emerald-700 font-bold'
                  : 'hover:bg-slate-100 hover:text-emerald-700'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA Button and Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenListingModal}
            className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-sm shadow-emerald-500/20 transition-all cursor-pointer hover:shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>তালিকাভুক্ত করুন</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 xl:hidden cursor-pointer"
            aria-label="মেনু খুলুন"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-2.5">
        <div className="relative">
          <input
            type="text"
            placeholder="সেবা, ডাক্তার, অ্যাম্বুলেন্স খুঁজুন..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-100 text-slate-800 placeholder-slate-400 pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1 text-slate-700 font-medium text-base">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2 rounded-lg transition-colors ${
                  activeSection === link.id
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenListingModal();
                }}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-2 rounded-lg text-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>আপনার ব্যবসা/সেবা যুক্ত করুন</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-lg text-sm transition-colors"
              >
                <Lock className="w-4 h-4 text-slate-600" />
                <span>এডমিন ড্যাশবোর্ড প্রবেশ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
