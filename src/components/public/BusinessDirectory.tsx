import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle2,
  Clock,
  Star,
  ExternalLink,
  PlusCircle,
  Filter,
} from 'lucide-react';
import { BusinessListing, ServiceCategory, Upazila, UPAZILAS } from '../../types';
import { filterBusinesses } from '../../utils/filter';

interface BusinessDirectoryProps {
  businesses: BusinessListing[];
  categories: ServiceCategory[];
  selectedCategory: string;
  onCategoryChange: (catId: string) => void;
  selectedUpazila: Upazila;
  onUpazilaChange: (u: Upazila) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenListingModal: () => void;
}

export const BusinessDirectory: React.FC<BusinessDirectoryProps> = ({
  businesses,
  categories,
  selectedCategory,
  onCategoryChange,
  selectedUpazila,
  onUpazilaChange,
  searchQuery,
  onSearchChange,
  onOpenListingModal,
}) => {
  const [activeModalBusiness, setActiveModalBusiness] = useState<BusinessListing | null>(null);

  const filtered = filterBusinesses(
    businesses,
    searchQuery,
    selectedCategory,
    selectedUpazila,
    false // public only
  );

  const getUpazilaName = (u: Upazila) => {
    return UPAZILAS.find((item) => item.id === u)?.nameBn || u;
  };

  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.nameBn || 'অন্যান্য সেবা';
  };

  return (
    <section id="directory" className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>স্থানীয় প্রতিষ্ঠান ও সেবা তালিকা</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              ঝালকাঠি ব্যবসায়িক ও পেশাজীবী ডিরেক্টরি
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              যাচাইকৃত স্থানীয় দোকান, হাসপাতাল, আইনজীবী, বাস কাউন্টার ও পেশাদার প্রতিষ্ঠান
            </p>
          </div>

          <button
            onClick={onOpenListingModal}
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>আপনার প্রতিষ্ঠান যুক্ত করুন</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-8 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Live Search */}
            <div className="w-full sm:flex-1 relative">
              <input
                type="text"
                placeholder="নাম, ফোন নম্বর বা সেবা লিখে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-white text-sm pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>

            {/* Category Select */}
            <div className="w-full sm:w-60">
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full bg-white text-sm font-medium text-slate-700 py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                aria-label="ক্যাটাগরি নির্বাচন করুন"
              >
                <option value="all">সকল ক্যাটাগরি</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameBn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Upazila Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
            <span className="text-xs font-bold text-slate-500 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>উপজেলা:</span>
            </span>
            {UPAZILAS.map((u) => (
              <button
                key={u.id}
                onClick={() => onUpazilaChange(u.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedUpazila === u.id
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {u.nameBn}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image & Featured Badge */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={
                      item.image ||
                      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={item.nameBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-emerald-800/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-600/30">
                      {getCategoryName(item.categoryId)}
                    </span>
                    {item.isFeatured && (
                      <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>ফিচার্ড</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 left-3 text-white text-xs flex items-center gap-1 font-medium drop-shadow">
                    <MapPin className="w-3.5 h-3.5 text-lime-400" />
                    <span>{getUpazilaName(item.upazila)}</span>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold text-slate-900 text-lg leading-snug group-hover:text-emerald-700 transition-colors">
                      {item.nameBn}
                    </h3>
                    {item.verified && (
                      <CheckCircle2
                        className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"
                        title="যাচাইকৃত প্রতিষ্ঠান"
                      />
                    )}
                  </div>

                  {item.subCategoryBn && (
                    <span className="inline-block text-xs font-semibold text-emerald-800 mt-0.5">
                      {item.subCategoryBn}
                    </span>
                  )}

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {item.descriptionBn}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.addressBn}</span>
                  </div>

                  {item.openingHoursBn && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.openingHoursBn}</span>
                    </div>
                  )}

                  {/* Services tags */}
                  {item.servicesBn && item.servicesBn.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.servicesBn.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded"
                        >
                          {s}
                        </span>
                      ))}
                      {item.servicesBn.length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{item.servicesBn.length - 3}টি
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveModalBusiness(item)}
                    className="text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    বিস্তারিত দেখুন
                  </button>

                  <div className="flex items-center gap-2">
                    {item.whatsapp && (
                      <a
                        href={`https://wa.me/${item.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-2 rounded-xl transition-colors cursor-pointer"
                        title="WhatsApp বার্তা পাঠান"
                        aria-label="WhatsApp বার্তা পাঠান"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                    <a
                      href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>কল করুন</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 mt-6">
            <Search className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-slate-800 font-bold text-base">কোনো প্রতিষ্ঠান পাওয়া যায়নি</h3>
            <p className="text-slate-500 text-xs mt-1">
              ভিন্ন কীওয়ার্ড বা উপজেলা পরিবর্তন করে অনুসন্ধান করুন।
            </p>
          </div>
        )}
      </div>

      {/* Business Details Modal */}
      {activeModalBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
            <div className="relative h-48 bg-slate-200 shrink-0">
              <img
                src={
                  activeModalBusiness.image ||
                  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
                }
                alt={activeModalBusiness.nameBn}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveModalBusiness(null)}
                className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {getCategoryName(activeModalBusiness.categoryId)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {getUpazilaName(activeModalBusiness.upazila)}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  {activeModalBusiness.nameBn}
                </h3>
                {activeModalBusiness.subCategoryBn && (
                  <p className="text-xs text-emerald-800 font-bold">
                    {activeModalBusiness.subCategoryBn}
                  </p>
                )}
              </div>

              <div className="space-y-2 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{activeModalBusiness.addressBn}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-mono font-bold text-slate-800">
                    {activeModalBusiness.phone}
                  </span>
                </div>
                {activeModalBusiness.openingHoursBn && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{activeModalBusiness.openingHoursBn}</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  বিবরণ
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {activeModalBusiness.descriptionBn}
                </p>
              </div>

              {activeModalBusiness.servicesBn && activeModalBusiness.servicesBn.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    প্রদেয় সেবাসমূহ
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModalBusiness.servicesBn.map((svc, i) => (
                      <span
                        key={i}
                        className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded-lg border border-emerald-200"
                      >
                        ✓ {svc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => setActiveModalBusiness(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                বন্ধ করুন
              </button>
              <a
                href={`tel:${activeModalBusiness.phone.replace(/[^0-9]/g, '')}`}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>সরাসরি কল দিন</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
