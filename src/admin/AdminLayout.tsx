import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Building2,
  ShieldAlert,
  Megaphone,
  Inbox,
  Settings,
  Database,
  Download,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
  ShieldCheck,
} from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';
import { AdminUser } from '../types';
import { authService } from '../lib/auth-service';
import { isFirebaseLive } from '../lib/firebase';
import { generateSourceZip, triggerDownload } from '../utils/zipExporter';

export type AdminTab =
  | 'dashboard'
  | 'posts'
  | 'directory'
  | 'emergency'
  | 'ads'
  | 'requests'
  | 'settings'
  | 'firebase';

interface AdminLayoutProps {
  user: AdminUser;
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onExitToPublic: () => void;
  children: React.ReactNode;
  pendingRequestsCount: number;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  activeTab,
  onTabChange,
  onExitToPublic,
  children,
  pendingRequestsCount,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'ওভারভিউ ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'posts', label: 'পোস্ট ও নোটিশ', icon: FileText },
    { id: 'directory', label: 'ব্যবসা ও সেবা ডিরেক্টরি', icon: Building2 },
    { id: 'emergency', label: 'জরুরি সেবা নম্বর', icon: ShieldAlert },
    { id: 'ads', label: 'বিজ্ঞাপন ব্যবস্থাপনা', icon: Megaphone },
    {
      id: 'requests',
      label: 'তালিকাভুক্তি আবেদন',
      icon: Inbox,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
    },
    { id: 'settings', label: 'সাইট কাস্টমাইজেশন', icon: Settings },
    { id: 'firebase', label: 'ফায়ারবেস ও ক্লাউড স্থিতি', icon: Database },
  ];

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const blob = await generateSourceZip();
      triggerDownload(blob, 'JOS-Jhalakathi-Online-Seba-Source-v1.0.0.zip');
    } catch (err) {
      console.error('ZIP generation failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    onExitToPublic();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased">
      {/* Top Admin Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <BrandLogo size="sm" whiteText />
          <span className="hidden sm:inline-block text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded-full">
            অ্যাডমিন পোর্টাল v1.0
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Cloud Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">
            <span
              className={`w-2 h-2 rounded-full ${
                isFirebaseLive() ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className={isFirebaseLive() ? 'text-emerald-300' : 'text-amber-300'}>
              {isFirebaseLive() ? 'Firebase লাইভ' : 'স্থানীয় মোড (ডেমো)'}
            </span>
          </div>

          <button
            onClick={onExitToPublic}
            className="flex items-center gap-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">মূল ওয়েবসাইট দেখুন</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs font-semibold bg-red-950/80 hover:bg-red-900 text-red-300 hover:text-white px-2.5 py-1.5 rounded-xl border border-red-800/60 transition-colors cursor-pointer"
            title="লগআউট"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">লগআউট</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar Desktop */}
        <aside
          className={`w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 fixed inset-y-0 left-0 top-[53px] z-20 transition-transform duration-200 lg:static ${
            mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Menu Items */}
          <div className="p-3 space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
              মেইন মেনু
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id as AdminTab);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-emerald-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* User profile & Source code export */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                {user.displayName.charAt(0)}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {user.displayName}
                </span>
                <span className="text-[10px] text-slate-500 truncate font-mono">
                  {user.email}
                </span>
              </div>
            </div>

            <button
              onClick={handleDownloadZip}
              disabled={downloading}
              className="w-full bg-slate-900 hover:bg-emerald-950 text-amber-300 hover:text-amber-200 text-xs font-bold py-2 px-3 rounded-xl border border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>{downloading ? 'প্যাকেজ হচ্ছে...' : 'সোর্স কোড ZIP ডাউনলোড'}</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-10 lg:hidden"
          />
        )}

        {/* Admin Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
