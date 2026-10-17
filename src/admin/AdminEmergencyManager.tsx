import React, { useState } from 'react';
import { ShieldAlert, Plus, Edit2, Trash2, Phone, AlertTriangle } from 'lucide-react';
import { EmergencyContact, EmergencyDepartment, Upazila, UPAZILAS } from '../types';
import { dataRepository } from '../lib/data-service';
import { validatePhone, validateTitle } from '../utils/validation';

interface AdminEmergencyManagerProps {
  contacts: EmergencyContact[];
  userEmail: string;
}

export const AdminEmergencyManager: React.FC<AdminEmergencyManagerProps> = ({
  contacts,
  userEmail,
}) => {
  const [editingItem, setEditingItem] = useState<EmergencyContact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form
  const [nameBn, setNameBn] = useState('');
  const [designationBn, setDesignationBn] = useState('');
  const [department, setDepartment] = useState<EmergencyDepartment>('police');
  const [upazila, setUpazila] = useState<Upazila>('sadar');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [addressBn, setAddressBn] = useState('ঝালকাঠি সদর');
  const [isNationalHotline, setIsNationalHotline] = useState(false);
  const [priority, setPriority] = useState(10);
  const [formError, setFormError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingItem(null);
    setNameBn('');
    setDesignationBn('');
    setDepartment('police');
    setUpazila('sadar');
    setPhone('');
    setAltPhone('');
    setAddressBn('ঝালকাঠি');
    setIsNationalHotline(false);
    setPriority(10);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: EmergencyContact) => {
    setEditingItem(item);
    setNameBn(item.nameBn);
    setDesignationBn(item.designationBn);
    setDepartment(item.department);
    setUpazila(item.upazila);
    setPhone(item.phone);
    setAltPhone(item.altPhone || '');
    setAddressBn(item.addressBn);
    setIsNationalHotline(item.isNationalHotline || false);
    setPriority(item.priority);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const titleVal = validateTitle(nameBn, 2, 80);
    if (!titleVal.isValid) {
      setFormError('সেবার নাম সঠিকভাবে লিখুন।');
      return;
    }

    const phoneVal = validatePhone(phone);
    if (!phoneVal.isValid) {
      setFormError(phoneVal.error || 'সঠিক ফোন নম্বর প্রদান করুন।');
      return;
    }

    const item: EmergencyContact = {
      id: editingItem?.id || `emg-${Date.now()}`,
      nameBn: nameBn.trim(),
      designationBn: designationBn.trim(),
      department,
      upazila,
      phone: phone.trim(),
      altPhone: altPhone.trim() || undefined,
      addressBn: addressBn.trim(),
      isNationalHotline,
      priority: Number(priority) || 10,
    };

    await dataRepository.saveEmergencyContact(item, userEmail);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await dataRepository.deleteEmergencyContact(id, userEmail);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            জরুরি যোগাযোগ ও হটলাইন নম্বর
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            পুলিশ, হাসপাতাল, ফায়ার সার্ভিস ও অ্যাম্বুলেন্স জরুরি নম্বরসমূহ
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন জরুরি নম্বর যুক্ত করুন</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">সেবা / প্রতিষ্ঠানের নাম</th>
                <th className="py-3 px-4">পদবী / দায়িত্বপ্রাপ্ত</th>
                <th className="py-3 px-4">বিভাগ</th>
                <th className="py-3 px-4">উপজেলা</th>
                <th className="py-3 px-4">জরুরি নম্বর</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {contacts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      {c.isNationalHotline && (
                        <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                          টোল ফ্রি
                        </span>
                      )}
                      <span>{c.nameBn}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">{c.designationBn}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">
                      {c.department}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium">
                    {UPAZILAS.find((u) => u.id === c.upazila)?.nameBn || c.upazila}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                    {c.phone}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="সম্পাদনা করুন"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(c.id)}
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
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">জরুরি নম্বরটি মুছে ফেলতে চান?</h3>
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
                {editingItem ? 'জরুরি নম্বর সম্পাদন' : 'নতুন জরুরি নম্বর যোগ'}
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
                  সেবা বা প্রতিষ্ঠানের নাম *
                </label>
                <input
                  type="text"
                  required
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="যেমন: ঝালকাঠি থানা কন্ট্রোল রুম"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">পদবী / দায়িত্বপ্রাপ্ত</label>
                <input
                  type="text"
                  value={designationBn}
                  onChange={(e) => setDesignationBn(e.target.value)}
                  placeholder="যেমন: ডিউটি অফিসার"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বিভাগ *</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as EmergencyDepartment)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer"
                  >
                    <option value="police">পুলিশ (Police)</option>
                    <option value="fire_service">ফায়ার সার্ভিস (Fire)</option>
                    <option value="hospital">হাসপাতাল (Hospital)</option>
                    <option value="ambulance">অ্যাম্বুলেন্স (Ambulance)</option>
                    <option value="admin">প্রশাসন (Admin/UNO)</option>
                    <option value="electricity">বিদ্যুৎ সেবা</option>
                    <option value="helpline">জাতীয় হেল্পলাইন</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">উপজেলা *</label>
                  <select
                    value={upazila}
                    onChange={(e) => setUpazila(e.target.value as Upazila)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer"
                  >
                    {UPAZILAS.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nameBn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">জরুরি ফোন নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01712-345678 বা 999"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বিকল্প নম্বর (ঐচ্ছিক)</label>
                  <input
                    type="tel"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    placeholder="0498-62222"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ঠিকানা / অবস্থান</label>
                <input
                  type="text"
                  value={addressBn}
                  onChange={(e) => setAddressBn(e.target.value)}
                  placeholder="যেমন: থানা মোড়, ঝালকাঠি"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isNationalHotline}
                    onChange={(e) => setIsNationalHotline(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>জাতীয় টোল-ফ্রি সেবা</span>
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
