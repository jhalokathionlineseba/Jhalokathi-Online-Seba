import React from 'react';
import {
  FileText,
  Building2,
  ShieldAlert,
  Megaphone,
  Inbox,
  Activity,
  PlusCircle,
  Database,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  BusinessListing,
  PostItem,
  EmergencyContact,
  Advertisement,
  ServiceRequest,
  ActivityLogItem,
} from '../types';
import { isFirebaseLive } from '../lib/firebase';
import { AdminTab } from './AdminLayout';
import { formatRelativeTimeBn } from '../utils/filter';

interface AdminDashboardProps {
  businesses: BusinessListing[];
  posts: PostItem[];
  emergencyContacts: EmergencyContact[];
  ads: Advertisement[];
  requests: ServiceRequest[];
  logs: ActivityLogItem[];
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  businesses,
  posts,
  emergencyContacts,
  ads,
  requests,
  logs,
  onNavigateTab,
}) => {
  const publishedBiz = businesses.filter((b) => b.status === 'published').length;
  const publishedPosts = posts.filter((p) => p.status === 'published').length;
  const activeAds = ads.filter((a) => a.isActive).length;
  const pendingReqs = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-emerald-700/80 text-lime-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
            ঝালকাঠি অনলাইন সেবা অ্যাডমিন প্যানেল
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            স্বাগতম, অ্যাডমিনিস্ট্রেটর
          </h2>
          <p className="text-emerald-100 text-sm mt-1 leading-relaxed">
            এখান থেকে পোর্টালের সকল সেবা, ব্যবসা প্রতিষ্ঠান, নোটিশ ও জরুরি নম্বর সরাসরি নিয়ন্ত্রণ করুন।
          </p>

          <div className="flex flex-wrap gap-2.5 mt-5">
            <button
              onClick={() => onNavigateTab('posts')}
              className="bg-lime-400 hover:bg-lime-300 text-emerald-950 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>নতুন পোস্ট তৈরি</span>
            </button>
            <button
              onClick={() => onNavigateTab('directory')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2 rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              <span>ব্যবসা যুক্ত করুন</span>
            </button>
            <button
              onClick={() => onNavigateTab('firebase')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2 rounded-xl border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-emerald-300" />
              <span>ফায়ারবেস স্ট্যাটাস</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cloud Connectivity Status Alert */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isFirebaseLive()
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-2.5 text-xs">
          <span
            className={`w-3 h-3 rounded-full shrink-0 ${
              isFirebaseLive() ? 'bg-emerald-600 animate-ping' : 'bg-amber-500'
            }`}
          />
          <div>
            <span className="font-bold">ডাটাবেস সংযোগ স্থিতি: </span>
            <span>
              {isFirebaseLive()
                ? 'ক্লাউড ফায়ারস্টোর লাইভ সিঙ্ক সক্রিয় রয়েছে।'
                : 'স্থানীয় ব্রাউজার মোডে চলছে (Unconfigured)। ক্লাউডে স্থানান্তর করতে Firebase সেটআপ করুন।'}
            </span>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('firebase')}
          className="text-xs font-bold underline shrink-0 hover:opacity-80 cursor-pointer"
        >
          {isFirebaseLive() ? 'রুলস ও ব্যাকআপ দেখুন' : 'Firebase সংযুক্ত করুন →'}
        </button>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div
          onClick={() => onNavigateTab('directory')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">তালিকাভুক্ত ব্যবসা</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {publishedBiz}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 group-hover:text-emerald-700">
            <span>ম্যানেজ করুন</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('posts')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">প্রকাশিত পোস্ট ও নোটিশ</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {publishedPosts}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 group-hover:text-blue-700">
            <span>ম্যানেজ করুন</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('emergency')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">জরুরি সেবা নম্বর</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {emergencyContacts.length}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 group-hover:text-red-700">
            <span>ম্যানেজ করুন</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('requests')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">নাগরিক আবেদন</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {pendingReqs}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 group-hover:text-amber-700">
            <span>আবেদন যাচাই</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Activity Log and System Feed */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-700" />
            <h3 className="font-extrabold text-slate-900 text-lg">সাম্প্রতিক অডিট ও অ্যাক্টিভিটি লগ</h3>
          </div>
          <span className="text-xs text-slate-500">সর্বশেষ ৫০টি কার্যকলাপ সংরক্ষিত</span>
        </div>

        <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
          {logs.map((log) => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-800">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] mr-2">
                    {log.action}
                  </span>
                  <span>{log.target}</span>
                </div>
                {log.details && <p className="text-slate-500">{log.details}</p>}
                <div className="text-[11px] text-slate-400">কর্তৃক: {log.userEmail}</div>
              </div>

              <div className="text-slate-400 whitespace-nowrap text-[11px] flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3" />
                <span>{formatRelativeTimeBn(log.timestamp)}</span>
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <p className="text-center py-6 text-slate-400 text-xs">কোনো অ্যাক্টিভিটি রেকর্ড নেই</p>
          )}
        </div>
      </div>
    </div>
  );
};
