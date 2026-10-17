import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  Star,
  MapPin,
  Phone,
  AlertTriangle,
} from 'lucide-react';
import { BusinessListing, ServiceCategory, Upazila, UPAZILAS } from '../types';
import { dataRepository } from '../lib/data-service';
import { validatePhone, validateTitle } from '../utils/validation';

interface AdminDirectoryManagerProps {
  businesses: BusinessListing[];
  categories: ServiceCategory[];
  userEmail: string;
}

export const AdminDirectoryManager: React.FC<AdminDirectoryManagerProps> = ({
  businesses,
  categories,
  userEmail,
}) => {
  const [editingBiz, setEditingBiz] = useState<BusinessListing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [upazilaFilter, setUpazilaFilter] = useState<Upazila>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [nameBn, setNameBn] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'health');
  const [subCategoryBn, setSubCategoryBn] = useState('');
  const [upazila, setUpazila] = useState<Upazila>('sadar');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [addressBn, setAddressBn] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [servicesInput, setServicesInput] = useState('');
  const [image, setImage] = useState('');
  const [openingHoursBn, setOpeningHoursBn] = useState('সকাল ৯:০০ - রাত ৯:০০');
  const [verified, setVerified] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [formError, setFormError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingBiz(null);
    setNameBn('');
    setCategoryId(categories[0]?.id || 'health');
    setSubCategoryBn('');
    setUpazila('sadar');
    setPhone('');
    setAltPhone('');
    setWhatsapp('');
    setAddressBn('ঝালকাঠি সদর');
    setDescriptionBn('');
    setServicesInput('');
    setImage('');
    setOpeningHoursBn('সকাল ৯:০০ - রাত ৯:০০');
    setVerified(true);
    setIsFeatured(false);
    setStatus('published');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (b: BusinessListing) => {
    setEditingBiz(b);
    setNameBn(b.nameBn);
    setCategoryId(b.categoryId);
    setSubCategoryBn(b.subCategoryBn || '');
    setUpazila(b.upazila);
    setPhone(b.phone);
    setAltPhone(b.altPhone || '');
    setWhatsapp(b.whatsapp || '');
    setAddressBn(b.addressBn);
    setDescriptionBn(b.descriptionBn);
    setServicesInput((b.servicesBn || []).join(', '));
    setImage(b.image || '');
    setOpeningHoursBn(b.openingHoursBn || '');
    setVerified(b.verified);
    setIsFeatured(b.isFeatured);
    setStatus(b.status);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const nameVal = validateTitle(nameBn, 3, 100);
    if (!nameVal.isValid) {
      setFormError(nameVal.error || 'সঠিক নাম লিখুন।');
      return;
    }

    const phoneVal = validatePhone(phone);
    if (!phoneVal.isValid) {
      setFormError(phoneVal.error || 'সঠিক ফোন নম্বর প্রদান করুন।');
      return;
    }

    if (!addressBn.trim()) {
      setFormError('সঠিক ঠিকানা প্রদান আবশ্যক।');
      return;
    }

    const services = servicesInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const item: BusinessListing = {
      id: editingBiz?.id || `biz-${Date.now()}`,
      nameBn: nameBn.trim(),
      categoryId,
      subCategoryBn: subCategoryBn.trim() || undefined,
      upazila,
      phone: phone.trim(),
      altPhone: altPhone.trim() || undefined,
      whatsapp: whatsapp.trim() || undefined,
      addressBn: addressBn.trim(),
      descriptionBn: descriptionBn.trim() || 'ঝালকাঠি জেলার নির্ভরযোগ্য স্থানীয় প্রতিষ্ঠান।',
      servicesBn: services.length ? services : undefined,
      image: image.trim() || undefined,
      openingHoursBn: openingHoursBn.trim() || undefined,
      verified,
      isFeatured,
      status,
      views: editingBiz?.views || 0,
      rating: editingBiz?.rating || 4.8,
      createdAt: editingBiz?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await dataRepository.saveBusiness(item, userEmail);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await dataRepository.deleteBusiness(id, userEmail);
    setDeleteConfirmId(null);
  };

  const filtered = businesses.filter((b) => {
    if (upazilaFilter !== 'all' && b.upazila !== upazilaFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return b.nameBn.toLowerCase().includes(q) || b.phone.includes(q) || b.addressBn.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            ব্যবসা ও প্রতিষ্ঠান ডিরেক্টরি
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            মোট {businesses.length}টি প্রতিষ্ঠান তালিকাভুক্ত রয়েছে
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন প্রতিষ্ঠান যুক্ত করুন</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="w-full sm:flex-1 relative">
          <input
            type="text"
            placeholder="প্রতিষ্ঠানের নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-xs pl-8 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {UPAZILAS.map((u) => (
            <button
              key={u.id}
              onClick={() => setUpazilaFilter(u.id)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                upazilaFilter === u.id
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {u.nameBn}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">প্রতিষ্ঠানের নাম</th>
                <th className="py-3 px-4">উপজেলা</th>
                <th className="py-3 px-4">ফোন নম্বর</th>
                <th className="py-3 px-4">যাচাইকৃত</th>
                <th className="py-3 px-4">স্ট্যাটাস</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      {item.isFeatured && <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />}
                      <span>{item.nameBn}</span>
                    </div>
                    {item.subCategoryBn && (
                      <span className="text-[10px] text-slate-400 font-normal block">
                        {item.subCategoryBn}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {UPAZILAS.find((u) => u.id === item.upazila)?.nameBn || item.upazila}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">{item.phone}</td>
                  <td className="py-3 px-4">
                    {item.verified ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> হ্যাঁ
                      </span>
                    ) : (
                      <span className="text-slate-400">না</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        item.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="সম্পাদনা করুন"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
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

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-xs">কোনো প্রতিষ্ঠান পাওয়া যায়নি</div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">প্রতিষ্ঠানটি মুছে ফেলতে চান?</h3>
            <p className="text-xs text-slate-500">এই অ্যাকশনটি স্থায়ী এবং ডিরেক্টরি থেকে মুছে যাবে।</p>
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingBiz ? 'প্রতিষ্ঠান সম্পাদনা করুন' : 'নতুন প্রতিষ্ঠান তালিকাভুক্তি'}
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
                  প্রতিষ্ঠানের নাম (বাংলায়) *
                </label>
                <input
                  type="text"
                  required
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="যেমন: ঝালকাঠি ফার্মেসি..."
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameBn}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">উপজেলা *</label>
                  <select
                    value={upazila}
                    onChange={(e) => setUpazila(e.target.value as Upazila)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {UPAZILAS.filter((u) => u.id !== 'all').map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nameBn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ফোন নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01712-345678"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">হোয়াটসঅ্যাপ (ঐচ্ছিক)</label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="01712345678"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ঠিকানা *</label>
                <input
                  type="text"
                  required
                  value={addressBn}
                  onChange={(e) => setAddressBn(e.target.value)}
                  placeholder="যেমন: কলেজ মোড়, সদর রোড, ঝালকাঠি"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বিবরণ</label>
                <textarea
                  rows={2}
                  value={descriptionBn}
                  onChange={(e) => setDescriptionBn(e.target.value)}
                  placeholder="প্রতিষ্ঠানের পরিচিতি ও বিশেষ সুযোগ-সুবিধা..."
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">প্রদেয় সেবাসমূহ (কমা দিয়ে পৃথক)</label>
                <input
                  type="text"
                  value={servicesInput}
                  onChange={(e) => setServicesInput(e.target.value)}
                  placeholder="জরুরি ডেলিভারি, রক্ত পরীক্ষা, হোম সার্ভিস"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">খোলার সময়সূচি</label>
                  <input
                    type="text"
                    value={openingHoursBn}
                    onChange={(e) => setOpeningHoursBn(e.target.value)}
                    placeholder="২৪ ঘণ্টা / সকাল ৯:০০ - রাত ৯:০০"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ছবির URL</label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={verified}
                    onChange={(e) => setVerified(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>যাচাইকৃত প্রতিষ্ঠান (Verified Badge)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-700">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span>হোমপেজ ফিচার্ড</span>
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
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
