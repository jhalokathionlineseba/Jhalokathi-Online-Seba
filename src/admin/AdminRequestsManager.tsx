import React from 'react';
import { Inbox, CheckCircle2, XCircle, Phone, MapPin, Calendar, Clock } from 'lucide-react';
import { ServiceRequest, UPAZILAS } from '../types';
import { dataRepository } from '../lib/data-service';
import { formatRelativeTimeBn } from '../utils/filter';

interface AdminRequestsManagerProps {
  requests: ServiceRequest[];
  userEmail: string;
}

export const AdminRequestsManager: React.FC<AdminRequestsManagerProps> = ({
  requests,
  userEmail,
}) => {
  const handleApprove = async (id: string) => {
    await dataRepository.updateServiceRequestStatus(id, 'approved', userEmail);
  };

  const handleReject = async (id: string) => {
    await dataRepository.updateServiceRequestStatus(id, 'rejected', userEmail);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            নাগরিক সেবা তালিকাভুক্তি আবেদন
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            স্থানীয় ব্যবসায়ী ও নাগরিকদের জমা দেওয়া সেবা পর্যালোচনার পর এক ক্লিকে অনুমোদন দিন
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-900">
                  {req.businessNameBn}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    req.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : req.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {req.status === 'pending' ? 'অপেক্ষমান' : req.status === 'approved' ? 'অনুমোদিত' : 'প্রত্যাখ্যাত'}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div>
                  আবেদনকারী: <span className="font-bold text-slate-800">{req.applicantName}</span> •{' '}
                  <span className="text-slate-500">
                    উপজেলা: {UPAZILAS.find((u) => u.id === req.upazila)?.nameBn || req.upazila}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                  <span className="flex items-center gap-1 font-mono text-slate-800 font-bold">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    {req.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {req.addressBn}
                  </span>
                </div>
                {req.detailsBn && (
                  <p className="text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-xl">
                    {req.detailsBn}
                  </p>
                )}
                <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1">
                  <Clock className="w-3 h-3" />
                  <span>জমা হয়েছে: {formatRelativeTimeBn(req.submittedAt)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {req.status === 'pending' ? (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleReject(req.id)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                >
                  প্রত্যাখ্যান
                </button>
                <button
                  onClick={() => handleApprove(req.id)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>অনুমোদন ও প্রকাশ করুন</span>
                </button>
              </div>
            ) : (
              <div className="text-xs font-bold text-slate-400 shrink-0">
                {req.status === 'approved' ? '✓ ডিরেক্টরিতে প্রকাশিত' : '✕ বাতিল করা হয়েছে'}
              </div>
            )}
          </div>
        ))}

        {requests.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
            <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p>বর্তমানে কোনো নতুন আবেদন অপেক্ষমাণ নেই।</p>
          </div>
        )}
      </div>
    </div>
  );
};
