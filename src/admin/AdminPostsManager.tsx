import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Tag,
  CheckCircle,
  AlertTriangle,
  Clock,
  Archive,
} from 'lucide-react';
import { PostItem, PostCategory } from '../types';
import { dataRepository } from '../lib/data-service';
import { generateSlug, validateTitle } from '../utils/validation';

interface AdminPostsManagerProps {
  posts: PostItem[];
  userEmail: string;
}

export const AdminPostsManager: React.FC<AdminPostsManagerProps> = ({ posts, userEmail }) => {
  const [editingPost, setEditingPost] = useState<PostItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form fields
  const [titleBn, setTitleBn] = useState('');
  const [category, setCategory] = useState<PostCategory>('news');
  const [excerptBn, setExcerptBn] = useState('');
  const [contentBn, setContentBn] = useState('');
  const [image, setImage] = useState('');
  const [authorBn, setAuthorBn] = useState('জেলা প্রশাসন, ঝালকাঠি');
  const [status, setStatus] = useState<'published' | 'draft' | 'scheduled' | 'archived'>('published');
  const [scheduledDate, setScheduledDate] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingPost(null);
    setTitleBn('');
    setCategory('news');
    setExcerptBn('');
    setContentBn('');
    setImage('');
    setAuthorBn('এডমিন ডেক্স');
    setStatus('published');
    setScheduledDate('');
    setIsFeatured(false);
    setIsBreaking(false);
    setTagsInput('সংবাদ, ঝালকাঠি');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (post: PostItem) => {
    setEditingPost(post);
    setTitleBn(post.titleBn);
    setCategory(post.category);
    setExcerptBn(post.excerptBn);
    setContentBn(post.contentBn);
    setImage(post.image || '');
    setAuthorBn(post.authorBn);
    setStatus(post.status);
    setScheduledDate(post.scheduledDate || '');
    setIsFeatured(post.isFeatured);
    setIsBreaking(post.isBreaking || false);
    setTagsInput(post.tags.join(', '));
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const titleVal = validateTitle(titleBn, 5, 200);
    if (!titleVal.isValid) {
      setFormError(titleVal.error || 'সঠিক শিরোনাম লিখুন।');
      return;
    }

    if (!excerptBn.trim()) {
      setFormError('সংক্ষিপ্ত বিবরণ (সারসংক্ষেপ) প্রদান করুন।');
      return;
    }

    if (!contentBn.trim()) {
      setFormError('পোস্টের মূল বক্তব্য/বিস্তারিত অংশ লিখুন।');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const postObj: PostItem = {
      id: editingPost?.id || `post-${Date.now()}`,
      titleBn: titleBn.trim(),
      slug: generateSlug(titleBn),
      category,
      excerptBn: excerptBn.trim(),
      contentBn: contentBn.trim(),
      image: image.trim() || undefined,
      authorBn: authorBn.trim() || 'ঝালকাঠি এডমিন',
      status,
      scheduledDate: status === 'scheduled' ? scheduledDate : undefined,
      isFeatured,
      isBreaking,
      tags: tags.length ? tags : ['ঝালকাঠি'],
      views: editingPost?.views || 0,
      createdAt: editingPost?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await dataRepository.savePost(postObj, userEmail);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await dataRepository.deletePost(id, userEmail);
    setDeleteConfirmId(null);
  };

  const filteredPosts = posts.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.titleBn.toLowerCase().includes(q) || p.contentBn.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            পোস্ট, নোটিশ ও নিয়োগ বিজ্ঞপ্তি
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            মোট {posts.length}টি পোস্ট তালিকাভুক্ত রয়েছে
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন পোস্ট লিখুন</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="w-full sm:flex-1 relative">
          <input
            type="text"
            placeholder="পোস্টের শিরোনাম অনুসন্ধান..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-xs pl-8 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['all', 'published', 'draft', 'scheduled', 'archived'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all'
                ? 'সকল'
                : st === 'published'
                ? 'প্রকাশিত'
                : st === 'draft'
                ? 'খসড়া'
                : st === 'scheduled'
                ? 'সিডিউল'
                : 'আর্কাইভ'}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">শিরোনাম</th>
                <th className="py-3 px-4">বিভাগ</th>
                <th className="py-3 px-4">স্ট্যাটাস</th>
                <th className="py-3 px-4">তারিখ</th>
                <th className="py-3 px-4">ভিউ</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">
                    <div className="flex items-center gap-2">
                      {post.isBreaking && (
                        <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded shrink-0">
                          জরুরি
                        </span>
                      )}
                      <span className="truncate">{post.titleBn}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        post.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : post.status === 'draft'
                          ? 'bg-amber-100 text-amber-800'
                          : post.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleDateString('bn-BD')}
                  </td>
                  <td className="py-3.5 px-4 font-mono">{post.views}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(post)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="সম্পাদনা করুন"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(post.id)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-xs">
            কোনো পোস্ট পাওয়া যায়নি
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">পোস্টটি মুছে ফেলতে চান?</h3>
            <p className="text-xs text-slate-500">
              এই ক্রিয়াটি অপরিবর্তনীয় এবং ডাটাবেস থেকে স্থায়ীভাবে ডিলিট হবে।
            </p>
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

      {/* Create / Edit Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingPost ? 'পোস্ট সম্পাদনা করুন' : 'নতুন পোস্ট/নোটিশ প্রকাশ'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/70 hover:text-white cursor-pointer"
              >
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
                  শিরোনাম (বাংলায়) *
                </label>
                <input
                  type="text"
                  required
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  placeholder="যেমন: ঝালকাঠি জেলা প্রশাসকের নিয়োগ বিজ্ঞপ্তি..."
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বিভাগ *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PostCategory)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="news">সংবাদ (News)</option>
                    <option value="notice">নোটিশ (Notice)</option>
                    <option value="job">চাকরি (Job Circular)</option>
                    <option value="tourism">ভ্রমণ ও দর্শনীয় স্থান</option>
                    <option value="health_tip">স্বাস্থ্য তথ্য</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">স্ট্যাটাস *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 cursor-pointer font-bold"
                  >
                    <option value="published">প্রকাশিত (Published Live)</option>
                    <option value="draft">খসড়া (Draft / Private)</option>
                    <option value="scheduled">সিডিউল (Scheduled)</option>
                    <option value="archived">আর্কাইভ (Archived)</option>
                  </select>
                </div>
              </div>

              {status === 'scheduled' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ভবিষ্যত প্রকাশের তারিখ ও সময় *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ছবি বা ব্যানারের লিংক (URL)
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  সারসংক্ষেপ (Excerpt) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={excerptBn}
                  onChange={(e) => setExcerptBn(e.target.value)}
                  placeholder="পোস্টের ১-২ লাইনের মূল সারসংক্ষেপ যা হোমপেজ কার্ডে দৃশ্যমান হবে..."
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মূল বিস্তারিত বক্তব্য (Content) *
                </label>
                <textarea
                  rows={6}
                  required
                  value={contentBn}
                  onChange={(e) => setContentBn(e.target.value)}
                  placeholder="সম্পূর্ণ বিবরণ বা সার্কুলার লিখুন..."
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">লেখক / সূত্র</label>
                  <input
                    type="text"
                    value={authorBn}
                    onChange={(e) => setAuthorBn(e.target.value)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ট্যাগসমূহ (কমা দিয়ে পৃথক)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="নিয়োগ, ডিসি অফিস, ঝালকাঠি"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>ফিচার্ড পোস্ট হিসেবে রাখুন</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-red-700">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                  />
                  <span>জরুরি / ব্রেকিং ঘোষণা</span>
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
                  সংরক্ষণ ও প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
