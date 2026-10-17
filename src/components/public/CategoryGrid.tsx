import React from 'react';
import {
  Stethoscope,
  Truck,
  Droplet,
  ShieldAlert,
  Zap,
  Bus,
  Scale,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { ServiceCategory, BusinessListing } from '../../types';

interface CategoryGridProps {
  categories: ServiceCategory[];
  businesses: BusinessListing[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onNavigate: (sectionId: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  businesses,
  selectedCategory,
  onSelectCategory,
  onNavigate,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope':
        return <Stethoscope className="w-6 h-6 text-emerald-600" />;
      case 'Truck':
        return <Truck className="w-6 h-6 text-red-600" />;
      case 'Droplet':
        return <Droplet className="w-6 h-6 text-rose-600" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6 text-indigo-600" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-amber-600" />;
      case 'Bus':
        return <Bus className="w-6 h-6 text-blue-600" />;
      case 'Scale':
        return <Scale className="w-6 h-6 text-purple-600" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-teal-600" />;
      default:
        return <Sparkles className="w-6 h-6 text-emerald-600" />;
    }
  };

  const getCount = (categoryId: string) => {
    return businesses.filter(
      (b) => b.categoryId === categoryId && b.status === 'published'
    ).length;
  };

  return (
    <section id="categories" className="py-14 sm:py-18 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>সেবা ক্যাটাগরি</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              প্রয়োজনীয় সকল সেবা এক নজরে
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              আপনার কাঙ্ক্ষিত সেবাটি নির্বাচন করুন এবং সরাসরি যোগাযোগ করুন
            </p>
          </div>

          <button
            onClick={() => {
              onSelectCategory('all');
              onNavigate('directory');
            }}
            className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold text-sm group cursor-pointer"
          >
            <span>সকল সেবা ও প্রতিষ্ঠান দেখুন</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {categories.map((cat) => {
            const count = getCount(cat.id);
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onNavigate('directory');
                }}
                className={`text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/70 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-transform group-hover:scale-110">
                      {getIcon(cat.iconName)}
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {count} টি সেবা
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-emerald-700 transition-colors">
                    {cat.nameBn}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                    {cat.descriptionBn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-emerald-700">
                  <span>তালিকাসমূহ দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
