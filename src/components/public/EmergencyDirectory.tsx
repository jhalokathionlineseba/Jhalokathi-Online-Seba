import React, { useState } from 'react';
import {
  PhoneCall,
  ShieldAlert,
  Hospital,
  Flame,
  Truck,
  Building2,
  Copy,
  Check,
  Search,
  AlertCircle,
} from 'lucide-react';
import { EmergencyContact, Upazila, UPAZILAS } from '../../types';
import { filterEmergencyContacts } from '../../utils/filter';

interface EmergencyDirectoryProps {
  contacts: EmergencyContact[];
}

export const EmergencyDirectory: React.FC<EmergencyDirectoryProps> = ({ contacts }) => {
  const [selectedUpazila, setSelectedUpazila] = useState<Upazila>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = filterEmergencyContacts(contacts, query, selectedUpazila, selectedDept);

  const handleCopy = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDeptBadge = (dept: string) => {
    switch (dept) {
      case 'police':
        return { label: 'পুলিশ', icon: ShieldAlert, color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'fire_service':
        return { label: 'ফায়ার সার্ভিস', icon: Flame, color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'hospital':
        return { label: 'হাসপাতাল', icon: Hospital, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'ambulance':
        return { label: 'অ্যাম্বুলেন্স', icon: Truck, color: 'bg-red-100 text-red-800 border-red-200' };
      case 'helpline':
        return { label: 'জরুরি হেল্পলাইন', icon: AlertCircle, color: 'bg-rose-100 text-rose-800 border-rose-200' };
      default:
        return { label: 'প্রশাসন', icon: Building2, color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  return (
    <section id="emergency" className="py-14 sm:py-18 bg-gradient-to-b from-slate-50 to-emerald-50/40 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>জরুরি যোগাযোগ ডিরেক্টরি</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            ঝালকাঠি জেলা জরুরি সেবা নম্বরসমূহ
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            যেকোনো দুর্ঘটনায়, চিকিৎসা সেবা ও প্রশাসনিক সহায়তায় সার্বক্ষণিক সরাসরি ফোন করুন
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search */}
            <div className="w-full md:w-1/2 relative">
              <input
                type="text"
                placeholder="নাম বা বিভাগের মাধ্যমে খুঁজুন..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-50 text-sm pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>

            {/* Upazila Tabs */}
            <div className="w-full md:w-1/2 flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {UPAZILAS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => setSelectedUpazila(u.id)}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                    selectedUpazila === u.id
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {u.nameBn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const badge = getDeptBadge(item.department);
            const DeptIcon = badge.icon;
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all hover:border-emerald-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${badge.color}`}
                    >
                      <DeptIcon className="w-3.5 h-3.5" />
                      <span>{badge.label}</span>
                    </span>

                    {item.isNationalHotline && (
                      <span className="text-[10px] font-extrabold uppercase bg-amber-500 text-white px-2 py-0.5 rounded-full">
                        টোল ফ্রি
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                    {item.nameBn}
                  </h3>
                  <p className="text-xs font-medium text-emerald-800 mt-1">
                    {item.designationBn}
                  </p>
                  <p className="text-xs text-slate-500 mt-1.5">{item.addressBn}</p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-slate-900 text-base sm:text-lg">
                      {item.phone}
                    </span>
                    <button
                      onClick={() => handleCopy(item.phone, item.id)}
                      className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title="নম্বর কপি করুন"
                      aria-label="নম্বর কপি করুন"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <a
                    href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-transform active:scale-95 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>কল করুন</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600 font-bold">কোনো জরুরি সেবা নম্বর পাওয়া যায়নি</p>
            <p className="text-slate-400 text-xs mt-1">অন্য উপজেলা বা ভিন্ন শব্দ লিখে খুঁজুন</p>
          </div>
        )}
      </div>
    </section>
  );
};
