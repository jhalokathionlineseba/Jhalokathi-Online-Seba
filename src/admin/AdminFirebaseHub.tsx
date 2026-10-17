import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  UploadCloud,
  FileCode,
  ShieldAlert,
  Info,
  ExternalLink,
} from 'lucide-react';
import {
  isFirebaseLive,
  testFirestoreConnection,
  getStoredFirebaseConfig,
  FirebaseClientConfig,
} from '../lib/firebase';
import { dataRepository } from '../lib/data-service';

export const AdminFirebaseHub: React.FC = () => {
  const [connStatus, setConnStatus] = useState<{ connected: boolean; message: string }>({
    connected: isFirebaseLive(),
    message: isFirebaseLive()
      ? 'ফায়ারবেস সফলভাবে সংযুক্ত।'
      : 'স্থানীয় মোড সক্রিয় (Unconfigured)। আপনি নিচে কনফিগারেশন যুক্ত করতে পারেন।',
  });
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Custom Firebase configuration inputs
  const [configForm, setConfigForm] = useState<FirebaseClientConfig>(() => {
    const existing = getStoredFirebaseConfig();
    return (
      existing || {
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: '',
        firestoreDatabaseId: '(default)',
      }
    );
  });
  const [configSaved, setConfigSaved] = useState(false);

  const handleTestConnection = async () => {
    setTesting(true);
    const res = await testFirestoreConnection();
    setConnStatus(res);
    setTesting(false);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('jos_custom_firebase_config', JSON.stringify(configForm));
      setConfigSaved(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSyncToLive = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await dataRepository.syncAllToFirestore();
      setSyncResult(`সফলভাবে ${res.count}টি ডাটা রেকর্ড ফায়ারবেস ক্লাউড ফায়ারস্টোরে আপলোড হয়েছে!`);
    } catch (err) {
      setSyncResult(err instanceof Error ? err.message : 'ডাটা সিঙ্ক ব্যর্থ হয়েছে।');
    } finally {
      setSyncing(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Default Deny
    match /{document=**} {
      allow read, write: if false;
    }

    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn() && (
        request.auth.token.email == 'jhalokathionlineseba.jos@gmail.com' ||
        exists(/databases/$(database)/documents/admins/$(request.auth.uid))
      );
    }

    // Public Published Businesses
    match /businesses/{businessId} {
      allow read: if resource.data.status == 'published' || isAdmin();
      allow write: if isAdmin();
    }

    // Public Published Posts
    match /posts/{postId} {
      allow read: if resource.data.status == 'published' || isAdmin();
      allow write: if isAdmin();
    }

    // Emergency Contacts
    match /emergency_contacts/{contactId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Advertisements
    match /advertisements/{adId} {
      allow read: if resource.data.isActive == true || isAdmin();
      allow write: if isAdmin();
    }

    // Site Settings
    match /settings/{settingId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Citizen Listing Requests
    match /service_requests/{reqId} {
      allow create: if request.resource.data.applicantName is string &&
                       request.resource.data.phone is string;
      allow read, update, delete: if isAdmin();
    }

    // Admin Logs
    match /activity_logs/{logId} {
      allow read, write: if isAdmin();
    }
  }
}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          রিয়েল-টাইম ফায়ারবেস ক্লাউড ও ডাটাবেস হাব
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          ক্লাউড ফায়ারস্টোর, অথেনটিকেশন, স্টোরেজ রুলস ও ডাটা সিঙ্ক্রোনাইজেশন কেন্দ্র
        </p>
      </div>

      {/* Connection Monitor Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                connStatus.connected ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900">বর্তমান ক্লাউড অবস্থা:</h3>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    connStatus.connected
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {connStatus.connected ? 'সরাসরি সংযুক্ত (Live Connected)' : 'আন-কনফিগার্ড / স্থানীয় মোড'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{connStatus.message}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'পরীক্ষা চলছে...' : 'সংযোগ পরীক্ষা করুন'}</span>
            </button>

            {connStatus.connected && (
              <button
                onClick={handleSyncToLive}
                disabled={syncing}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{syncing ? 'সিঙ্ক হচ্ছে...' : 'সকল ডাটা ক্লাউডে পুশ করুন'}</span>
              </button>
            )}
          </div>
        </div>

        {syncResult && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
            {syncResult}
          </div>
        )}
      </div>

      {/* Manual Config Form */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="font-extrabold text-base text-slate-900">
            ফায়ারবেস ক্লায়েন্ট সেটিংস (কাস্টম প্রজেক্ট সংযোগ)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            আপনার নিজস্ব ফায়ারবেস কনসোল (<a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold">console.firebase.google.com</a>) থেকে পাওয়া ওয়েব অ্যাপ কনফিগারেশন এখানে পেস্ট করুন।
          </p>
        </div>

        {configSaved && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
            কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে! রিলোড করা হচ্ছে...
          </div>
        )}

        <form onSubmit={handleSaveConfig} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">API Key *</label>
              <input
                type="text"
                required
                value={configForm.apiKey || ''}
                onChange={(e) => setConfigForm({ ...configForm, apiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Project ID *</label>
              <input
                type="text"
                required
                value={configForm.projectId || ''}
                onChange={(e) => setConfigForm({ ...configForm, projectId: e.target.value })}
                placeholder="jhalakathi-online-seba"
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Auth Domain</label>
              <input
                type="text"
                value={configForm.authDomain || ''}
                onChange={(e) => setConfigForm({ ...configForm, authDomain: e.target.value })}
                placeholder="...firebaseapp.com"
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Storage Bucket</label>
              <input
                type="text"
                value={configForm.storageBucket || ''}
                onChange={(e) => setConfigForm({ ...configForm, storageBucket: e.target.value })}
                placeholder="...appspot.com"
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">App ID</label>
              <input
                type="text"
                value={configForm.appId || ''}
                onChange={(e) => setConfigForm({ ...configForm, appId: e.target.value })}
                placeholder="1:123456789:web:..."
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer"
            >
              কনফিগারেশন সংরক্ষণ ও কানেক্ট করুন
            </button>
          </div>
        </form>
      </div>

      {/* Security Rules & Deployment Guide */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-700" />
            <h3 className="font-extrabold text-base text-slate-900">
              ফায়ারস্টোর সিকিউরিটি রুলস (firestore.rules)
            </h3>
          </div>
          <button
            onClick={() => copyToClipboard(sampleRules, 'rules')}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
          >
            {copiedKey === 'rules' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'rules' ? 'কপি হয়েছে' : 'রুলস কপি করুন'}</span>
          </button>
        </div>

        <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-72 border border-slate-800">
          <pre>{sampleRules}</pre>
        </div>

        {/* Step-by-step Setup instructions in Bengali */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
          <h4 className="font-extrabold text-slate-900 text-sm">ডিপ্লয়মেন্ট ও সিকিউরিটি নির্দেশিকা:</h4>
          <ol className="list-decimal list-inside space-y-1 text-slate-600 leading-relaxed">
            <li>ফায়ারবেস কনসোলে <code className="bg-slate-200 px-1 rounded">Firestore Database</code> তৈরি করুন (Test/Production মোডে)।</li>
            <li>Authentication মেনু থেকে <strong>Google Sign-in</strong> অথবা <strong>Email/Password</strong> সক্রিয় করুন।</li>
            <li>উপরে প্রদর্শিত সিকিউরিটি রুলস কপি করে Firestore Rules ট্যাবে পেস্ট করে <strong>Publish</strong> করুন।</li>
            <li>আপনার প্রজেক্টের রিয়েলটাইম ক্লাউড ব্যাকআপ চালু হবে।</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
