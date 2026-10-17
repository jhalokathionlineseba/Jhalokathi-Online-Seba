import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Building2, Phone, MapPin } from 'lucide-react';
import { ServiceCategory, Upazila, UPAZILAS } from '../../types';
import { dataRepository } from '../../lib/data-service';
import { validatePhone, validateTitle } from '../../utils/validation';

interface ListingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ServiceCategory[];
}

export const ListingRequestModal: React.FC<ListingRequestModalProps> = ({
  isOpen,
  onClose,
  categories,
}) => {
  const [applicantName, setApplicantName] = useState('');
  const [businessNameBn, setBusinessNameBn] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || 'health');
  const [upazila, setUpazila] = useState<Upazila>('sadar');
  const [phone, setPhone] = useState('');
  const [addressBn, setAddressBn] = useState('');
  const [detailsBn, setDetailsBn] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const nameVal = validateTitle(applicantName, 2, 50);
    if (!nameVal.isValid) {
      setError('আপনার নাম সঠিকভাবে পূরণ করুন।');
      return;
    }

    const bizVal = validateTitle(businessNameBn, 3, 100);
    if (!bizVal.isValid) {
      setError(bizVal.error || 'প্রতিষ্ঠানের নাম সঠিকভাবে পূরণ করুন।');
      return;
    }

    const phoneVal = validatePhone(phone);
    if (!phoneVal.isValid) {
      setError(phoneVal.error || 'সঠিক ফোন নম্বর প্রদান করুন।');
      return;
    }

    if (!addressBn.trim()) {
      setError('প্রতিষ্ঠানের সঠিক ঠিকানা লিখুন।');
      return;
    }

    setSubmitting(true);
    try {
      await dataRepository.submitServiceRequest({
        applicantName: applicantName.trim(),
        businessNameBn: businessNameBn.trim(),
        category,
        upazila,
        phone: phone.trim(),
        addressBn: addressBn.trim(),
        detailsBn: detailsBn.trim() || 'নাগরিক সেবা অন্তর্ভুক্তি আবেদন।',
      });
      setSuccess(true);
    } catch {
      setError('আবেদন জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-lime-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">সেবা বা ব্যবসা তালিকাভুক্তি আবেদন</h3>
              <p className="text-xs text-emerald-200">বিনামূল্যে আপনার প্রতিষ্ঠানকে যুক্ত করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-extrabold text-slate-900">
                আপনার আবেদন সফলভাবে গৃহীত হয়েছে!
              </h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                ঝালকাঠি অনলাইন সেবা অ্যাডমিন টিম আপনার তথ্য যাচাই করে দ্রুত পোর্টাল ও মোবাইল ডিরেক্টরিতে প্রকাশ করবে।
              </p>
              <button
                onClick={onClose}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl cursor-pointer"
              >
                ঠিক আছে
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  আপনার নাম (আবেদনকারী) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  প্রতিষ্ঠান বা সেবার নাম (বাংলায়) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মা ফার্মেসি ও ক্লিনিক / সততা পরিবহন"
                  value={businessNameBn}
                  onChange={(e) => setBusinessNameBn(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ক্যাটাগরি *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    উপজেলা *
                  </label>
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মোবাইল নম্বর *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="01712-345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  সঠিক ঠিকানা *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="যেমন: কলেজ মোড়, সদর রোড, ঝালকাঠি"
                    value={addressBn}
                    onChange={(e) => setAddressBn(e.target.value)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  প্রদেয় সেবার সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  placeholder="আপনার বিশেষ কোনো সেবা বা সময়সূচি থাকলে লিখুন..."
                  value={detailsBn}
                  onChange={(e) => setDetailsBn(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'পাঠানো হচ্ছে...' : 'আবেদন জমা দিন'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
