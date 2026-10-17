import React, { useState } from 'react';
import {
  BellRing,
  Calendar,
  Eye,
  Share2,
  Tag,
  ArrowRight,
  Briefcase,
  FileText,
  Compass,
  HeartPulse,
  Sparkles,
} from 'lucide-react';
import { PostItem, PostCategory } from '../../types';
import { filterPublicPosts, formatRelativeTimeBn } from '../../utils/filter';

interface NewsAndNoticesProps {
  posts: PostItem[];
}

export const NewsAndNotices: React.FC<NewsAndNoticesProps> = ({ posts }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalPost, setActiveModalPost] = useState<PostItem | null>(null);
  const [copied, setCopied] = useState(false);

  const publicPosts = filterPublicPosts(posts);

  const filtered = publicPosts.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  const getCategoryBadge = (cat: PostCategory) => {
    switch (cat) {
      case 'job':
        return { label: 'চাকরি বিজ্ঞপ্তি', icon: Briefcase, color: 'bg-blue-100 text-blue-800' };
      case 'notice':
        return { label: 'জরুরি নোটিশ', icon: FileText, color: 'bg-amber-100 text-amber-800' };
      case 'tourism':
        return { label: 'দর্শনীয় স্থান', icon: Compass, color: 'bg-emerald-100 text-emerald-800' };
      case 'health_tip':
        return { label: 'স্বাস্থ্য বার্তা', icon: HeartPulse, color: 'bg-rose-100 text-rose-800' };
      default:
        return { label: 'সংবাদ', icon: BellRing, color: 'bg-purple-100 text-purple-800' };
    }
  };

  const handleShare = (post: PostItem) => {
    if (navigator.share) {
      navigator.share({
        title: post.titleBn,
        text: post.excerptBn,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="news" className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <BellRing className="w-3.5 h-3.5 text-emerald-700" />
              <span>জেলা তথ্য ও সংবাদ</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              সর্বশেষ সংবাদ, নোটিশ ও চাকরি
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              ঝালকাঠি জেলা প্রশাসন, নিয়োগ বিজ্ঞপ্তি ও স্থানীয় সাম্প্রতিক খবরাখবর
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'সকল' },
              { id: 'job', label: 'চাকরি' },
              { id: 'notice', label: 'নোটিশ' },
              { id: 'news', label: 'সংবাদ' },
              { id: 'tourism', label: 'ভ্রমণ' },
              { id: 'health_tip', label: 'স্বাস্থ্য' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === tab.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const badge = getCategoryBadge(item.category);
            const BadgeIcon = badge.icon;

            return (
              <article
                key={item.id}
                onClick={() => setActiveModalPost(item)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:border-emerald-300"
              >
                <div>
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={
                        item.image ||
                        'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={item.titleBn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${badge.color}`}
                      >
                        <BadgeIcon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>
                      {item.isBreaking && (
                        <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                          জরুরি
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatRelativeTimeBn(item.createdAt)}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{item.views} বার পঠিত</span>
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {item.titleBn}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {item.excerptBn}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-4">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span>সম্পূর্ণ পড়ুন</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600 font-bold text-sm">এই বিভাগে কোনো পোস্ট পাওয়া যায়নি</p>
          </div>
        )}
      </div>

      {/* Post Details Modal */}
      {activeModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
            <div className="relative h-60 bg-slate-200 shrink-0">
              <img
                src={
                  activeModalPost.image ||
                  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80'
                }
                alt={activeModalPost.titleBn}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveModalPost(null)}
                className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
                  {getCategoryBadge(activeModalPost.category).label}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatRelativeTimeBn(activeModalPost.createdAt)}</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {activeModalPost.titleBn}
              </h2>

              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line border-t border-slate-100 pt-3">
                {activeModalPost.contentBn}
              </div>

              {activeModalPost.tags && activeModalPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                  <Tag className="w-4 h-4 text-slate-400 mr-1 mt-0.5" />
                  {activeModalPost.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              <button
                onClick={() => handleShare(activeModalPost)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>{copied ? 'লিংক কপি হয়েছে!' : 'শেয়ার করুন'}</span>
              </button>

              <button
                onClick={() => setActiveModalPost(null)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
