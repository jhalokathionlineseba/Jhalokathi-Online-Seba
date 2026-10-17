import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  Eye,
  MousePointerClick,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { Advertisement, AdPlacement } from '../types';
import { dataRepository } from '../lib/data-service';
import { validateTitle, validateUrl } from '../utils/validation';

interface AdminAdManagerProps {
  ads: Advertisement[];
  userEmail: string;
}

export const AdminAdManager: React.FC<AdminAdManagerProps> = ({ ads, userEmail }) => {
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [titleBn, setTitleBn] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [placement, setPlacement] = useState<AdPlacement>('home_top');
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [deviceTarget, setDeviceTarget] = useState<'all' | 'mobile' | 'desktop'>('all');
  const [formError, setFormError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingAd(null);
    setTitleBn('');
    setClientName('');
    setClientPhone('');
    setBannerUrl('');
    setTargetUrl('');
    setPlacement('home_top');
    setIsActive(true);
    setStartDate('2026-01-01');
    setEndDate('2026-12-31');
    setDisplayOrder(1);
    setDeviceTarget('all');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (ad: Advertisement) => {
    setEditingAd(ad);
    setTitleBn(ad.titleBn);
    setClientName(ad.clientName);
    setClientPhone(ad.clientPhone || '');
    setBannerUrl(ad.bannerUrl);
    setTargetUrl(ad.targetUrl);
    setPlacement(ad.placement);
    setIsActive(ad.isActive);
    setStartDate(ad.startDate || '2026-01-01');
    setEndDate(ad.endDate || '2026-12-31');
    setDisplayOrder(ad.displayOrder);
    setDeviceTarget(ad.deviceTarget);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const titleVal = validateTitle(titleBn, 3, 100);
    if (!titleVal.isValid) {
      setFormError('বিজ্ঞাপনের শিরোনাম সঠিকভাবে লিখুন।');
      return;
    }

    const urlVal = validateUrl(targetUrl);
    if (!urlVal.isValid) {
      setFormError(urlVal.error || 'সঠিক গন্তব্য লিংক প্রদান করুন।');
      return;
    }

    const item: Advertisement = {
      id: editingAd?.id || `ad-${Date.now()}`,
      titleBn: titleBn.trim(),
      clientName: clientName.trim() || 'সাধারণ বিজ্ঞাপন',
      clientPhone: clientPhone.trim() || undefined,
      bannerUrl: bannerUrl.trim(),
      targetUrl: targetUrl.trim() || '#',
      placement,
      isActive,
      startDate,
      endDate,
      displayOrder: Number(displayOrder) || 1,
      deviceTarget,
      impressions: editingAd?.impressions || 0,
      clicks: editingAd?.clicks || 0,
      createdAt: editingAd?.createdAt || new Date().toISOString(),
    };

    await dataRepository.saveAdvertisement(item, userEmail);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await dataRepository.deleteAdvertisement(id, userEmail);
    setDeleteConfirmId(null);
  };

  const getPlacementLabel = (p: AdPlacement) => {
    switch (p) {
      case 'home_top':
        return 'হোমপেজ টপ ব্যানার';
      case 'between_posts':
        return 'পোস্টের মাঝখানে';
      case 'sidebar':
        return 'সাইডবার';
      case 'footer':
        return 'ফুটার সংলগ্ন';
      case 'bottom_sticky':
        return 'নিচে ফ্লোটিং বার (Sticky)';
      default:
        return p;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            বিজ্ঞাপন ও ব্যানার ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            হোমপেজ, পোস্টের মাঝে ও নিচের ফ্লোটিং ব্যানার নিয়ন্ত্রণ করুন
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন বিজ্ঞাপন তৈরি</span>
        </button>
      </div>

      {/* Ads List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {ad.bannerUrl ? (
                <div className="relative h-32 bg-slate-100 overflow-hidden">
                  <img
                    src={ad.bannerUrl}
                    alt={ad.titleBn}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {getPlacementLabel(ad.placement)}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    {ad.isActive ? (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> সক্রিয়
                      </span>
                    ) : (
                      <span className="bg-slate-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> নিষ্ক্রিয়
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-950 text-white flex items-center justify-between">
                  <span className="text-xs font-bold">{getPlacementLabel(ad.placement)}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ad.isActive ? 'bg-emerald-600' : 'bg-slate-600'
                    }`}
                  >
                    {ad.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </span>
                </div>
              )}

              <div className="p-5">
                <h3 className="font-extrabold text-slate-900 text-base">{ad.titleBn}</h3>
                <div className="text-xs text-slate-500 mt-1">
                  বিজ্ঞাপনদাতা: <span className="font-bold text-slate-700">{ad.clientName}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Eye className="w-4 h-4 text-emerald-600" />
                    <span>ইমপ্রেশন: {ad.impressions}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MousePointerClick className="w-4 h-4 text-blue-600" />
                    <span>ক্লিক: {ad.clicks}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">অর্ডার: #{ad.displayOrder}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(ad)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-white transition-colors cursor-pointer"
                  title="সম্পাদনা করুন"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(ad.id)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-red-700 hover:bg-white transition-colors cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {ads.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
          কোনো বিজ্ঞাপন সক্রিয় নেই। নতুন বিজ্ঞাপন যোগ করুন।
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">বিজ্ঞাপনটি মুছে ফেলতে চান?</h3>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-md cursor-pointer"
              >
                মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingAd ? 'বিজ্ঞাপন সম্পাদনা করুন' : 'নতুন বিজ্ঞাপন প্রকাশ'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
              {formError && (
                <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বিজ্ঞাপনের শিরোনাম *
                </label>
                <input
                  type="text"
                  required
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  placeholder="যেমন: ঝালকাঠি ডিজিটাল ডায়াগনস্টিক সেন্টারে বিশেষ ছাড়"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বিজ্ঞাপনদাতা প্রতিষ্ঠান</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="প্রতিষ্ঠানের নাম"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বিজ্ঞাপনদাতার ফোন</label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="01712-345678"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">প্লেসমেন্ট (অবস্থান) *</label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value as AdPlacement)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 cursor-pointer font-bold"
                >
                  <option value="home_top">হোমপেজ টপ ব্যানার (Home Top)</option>
                  <option value="between_posts">পোস্টের মাঝে (Between Sections)</option>
                  <option value="sidebar">সাইডবার ব্যানার</option>
                  <option value="footer">ফুটার সংলগ্ন ব্যানার</option>
                  <option value="bottom_sticky">নিচে ফ্লোটিং বার (Bottom Sticky)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ব্যানার ছবির লিংক (Image URL)</label>
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">গন্তব্য লিংক (Target URL)</label>
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://... বা #contact"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">প্রদর্শন ক্রম (Order)</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10))}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ডিভাইস টার্গেট</label>
                  <select
                    value={deviceTarget}
                    onChange={(e) => setDeviceTarget(e.target.value as any)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer"
                  >
                    <option value="all">সকল ডিভাইস</option>
                    <option value="mobile">শুধুমাত্র মোবাইল</option>
                    <option value="desktop">শুধুমাত্র ডেস্কটপ</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-800">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>বিজ্ঞাপনটি সরাসরি সক্রিয় (Active) রাখুন</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer"
                >
                  বিজ্ঞাপন সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
