import React, { useState } from 'react';
import { Lock, Mail, Key, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { authService, DEFAULT_ADMIN_EMAIL } from '../lib/auth-service';
import { BrandLogo } from '../components/common/BrandLogo';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const [email, setEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [password, setPassword] = useState('Admin@JOS2026');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await authService.loginWithCredentials(email, password);
    setLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || 'লগইন ব্যর্থ হয়েছে। সঠিক তথ্য প্রদান করুন।');
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    const res = await authService.loginWithGoogle();
    setLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || 'Google লগইন সম্পন্ন করা যায়নি।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 text-center relative">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            ✕
          </button>
          <div className="flex justify-center mb-3">
            <BrandLogo size="md" whiteText />
          </div>
          <h3 className="text-xl font-black text-white">অ্যাডমিন নিয়ন্ত্রণ প্যানেল</h3>
          <p className="text-xs text-emerald-200 mt-1">
            শুধুমাত্র অনুমোদিত কর্মকর্তাদের জন্য সুরক্ষিত প্রবেশদ্বার
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                এডমিন ইমেইল ঠিকানা
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jos.gov.bd"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-500 font-mono"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                গোপন পাসওয়ার্ড
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}</span>
            </button>
          </form>

          {/* Google Sign In option */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-300 shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google অ্যাকাউন্ট দিয়ে লগইন</span>
            </button>
          </div>

          <div className="mt-4 p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 leading-relaxed">
            <span className="font-bold">সুপার এডমিন অ্যাক্সেস: </span>
            {DEFAULT_ADMIN_EMAIL} (পাসওয়ার্ড: <code className="bg-emerald-100 px-1 py-0.5 rounded">Admin@JOS2026</code>)
          </div>
        </div>
      </div>
    </div>
  );
};
