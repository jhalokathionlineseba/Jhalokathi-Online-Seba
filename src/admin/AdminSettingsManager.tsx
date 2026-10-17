import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Palette, Globe, PhoneCall, Info } from 'lucide-react';
import { SiteSettings } from '../types';
import { dataRepository } from '../lib/data-service';

interface AdminSettingsManagerProps {
  settings: SiteSettings;
  userEmail: string;
}

export const AdminSettingsManager: React.FC<AdminSettingsManagerProps> = ({
  settings,
  userEmail,
}) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await dataRepository.saveSettings(formData, userEmail);
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-slate-200">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          সাইট কাস্টমাইজেশন ও সেটিংস
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          ওয়েবসাইটের নাম, হিরো ব্যানার শিরোনাম, টিকার ঘোষণা ও যোগাযোগ তথ্য পরিবর্তন করুন
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">
              সাইট সেটিংস সফলভাবে হালনাগাদ হয়েছে এবং হোমপেজে পরিবর্তন কার্যকর হয়েছে!
            </span>
          </div>
        )}

        {/* Brand and Tagline */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-700" />
            <span>ওয়েবসাইটের ব্র্যান্ডিং ও পরিচিতি</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                সাইটের নাম (বাংলায়)
              </label>
              <input
                type="text"
                value={formData.siteNameBn}
                onChange={(e) => setFormData({ ...formData, siteNameBn: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                সাইটের নাম (ইংরেজিতে)
              </label>
              <input
                type="text"
                value={formData.siteNameEn}
                onChange={(e) => setFormData({ ...formData, siteNameEn: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ট্যাগলাইন</label>
            <input
              type="text"
              value={formData.taglineBn}
              onChange={(e) => setFormData({ ...formData, taglineBn: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Hero Section Banner Content */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-700" />
            <span>হোমপেজ হিরো সেকশন কন্টেন্ট</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              হিরো সেকশন প্রধান শিরোনাম
            </label>
            <input
              type="text"
              value={formData.heroHeadingBn}
              onChange={(e) => setFormData({ ...formData, heroHeadingBn: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              হিরো সেকশন সাব-টাইটেল / বিবরণ
            </label>
            <textarea
              rows={2}
              value={formData.heroDescriptionBn}
              onChange={(e) => setFormData({ ...formData, heroDescriptionBn: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              টপ নোটিশ বার (স্ক্রোলিং ঘোষণা)
            </label>
            <input
              type="text"
              value={formData.announcementTickerBn}
              onChange={(e) => setFormData({ ...formData, announcementTickerBn: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Contact and Emergency */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-emerald-700" />
            <span>অফিসিয়াল যোগাযোগ ও হেল্পলাইন</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">যোগাযোগ ফোন নম্বর</label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">অফিসিয়াল ইমেইল</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">জরুরি হটলাইন নম্বর</label>
              <input
                type="text"
                value={formData.emergencyHotline}
                onChange={(e) => setFormData({ ...formData, emergencyHotline: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">অফিসিয়াল ঠিকানা</label>
            <input
              type="text"
              value={formData.addressBn}
              onChange={(e) => setFormData({ ...formData, addressBn: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5"
            />
          </div>
        </div>

        {/* Social Links & Footer Text */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ফেসবুক পেজ লিংক</label>
              <input
                type="url"
                value={formData.facebookUrl || ''}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ইউটিউব চ্যানেল</label>
              <input
                type="url"
                value={formData.youtubeUrl || ''}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">হোয়াটসঅ্যাপ সাপোর্ট</label>
              <input
                type="text"
                value={formData.whatsappSupport || ''}
                onChange={(e) => setFormData({ ...formData, whatsappSupport: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ফুটার কপিরাইট ও পরিচিতি লেখা</label>
            <textarea
              rows={2}
              value={formData.footerTextBn}
              onChange={(e) => setFormData({ ...formData, footerTextBn: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-lg shadow-emerald-800/30 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'সেটিংস সংরক্ষণ করুন'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
