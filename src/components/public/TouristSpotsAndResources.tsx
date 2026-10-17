import React from 'react';
import { Compass, ExternalLink, MapPin, Landmark, Sparkles, Globe } from 'lucide-react';

export const TouristSpotsAndResources: React.FC = () => {
  const touristSpots = [
    {
      titleBn: 'গাবখান সেতু (Gabkhan Bridge)',
      subtitleBn: 'বাংলার সুয়েজ খালের ওপর নির্মিত দেশের অন্যতম দৃষ্টিনন্দন সেতু',
      descriptionBn: 'ঝালকাঠি সদর ও রাজাপুরের সংযোগস্থলে গাবখান চ্যানেলের উপর অবস্থিত এই সেতুটি সন্ধ্যার সময় নয়নাভিরাম দৃশ্যের অবতারণা করে।',
      image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&q=80',
      upazilaBn: 'ঝালকাঠি সদর',
    },
    {
      titleBn: 'ভিমরুলী ভাসমান পেয়ারা হাট',
      subtitleBn: 'এশিয়ার বৃহত্তম ঐতিহ্যবাহী ভাসমান বাজার',
      descriptionBn: 'শত শত ডিঙি নৌকায় সরাসরি চাষিরা পেয়ারা ও আমড়া বিক্রি করেন। জুলাই-সেপ্টেম্বর মৌসুমে দেশ-বিদেশের পর্যটকদের মিলনমেলা ঘটে।',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      upazilaBn: 'কীর্তিপাশা, ঝালকাঠি',
    },
    {
      titleBn: 'ঐতিহাসিক কীর্তিপাশা জমিদার বাড়ি',
      subtitleBn: 'প্রায় তিনশত বছরের প্রাচীন প্রত্নতাত্ত্বিক নিদর্শন',
      descriptionBn: 'রাজা রাম সেনগুপ্ত প্রতিষ্ঠিত প্রাচীন প্রাসাদ ও মন্দিরসমূহ ইতিহাসপ্রেমীদের কাছে অত্যন্ত আকর্ষণীয়।',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      upazilaBn: 'ঝালকাঠি সদর',
    },
    {
      titleBn: 'কবি জীবনানন্দ দাশের ধানসিঁড়ি নদী',
      subtitleBn: '“আবার আসিব ফিরে ধানসিঁড়ির তীরে এই বাংলায়...”',
      descriptionBn: 'রূপসী বাংলার কবি জীবনানন্দ দাশের অমর কবিতার নদী ধানসিঁড়ি রাজাপুরের বুক চিরে বয়ে গেছে সুগন্ধায়।',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      upazilaBn: 'রাজাপুর',
    },
  ];

  const govLinks = [
    { title: 'জন্ম ও মৃত্যু নিবন্ধন', url: 'https://bdris.gov.bd', desc: 'অনলাইনে নতুন জন্ম নিবন্ধন ও সংশোধন' },
    { title: 'জাতীয় পরিচয়পত্র (NID) সেবা', url: 'https://services.nidw.gov.bd', desc: 'এনআইডি ডাউনলোড ও ভোটার তথ্য' },
    { title: 'ই-নামজারি ও ভূমি সেবা', url: 'https://mutation.land.gov.bd', desc: 'জমির খতিয়ান, পর্চা ও নামজারি' },
    { title: 'অনলাইন ই-পাসপোর্ট আবেদন', url: 'https://epassport.gov.bd', desc: 'ডিজিটাল পাসপোর্ট আবেদন ও স্থিতি' },
    { title: 'ঝালকাঠি জেলা বাতায়ন', url: 'https://jhalakathi.gov.bd', desc: 'সরকারি দাপ্তরিক নোটিশ ও সেবা' },
    { title: 'পল্লী বিদ্যুৎ বিল পরিশোধ', url: 'https://reb.gov.bd', desc: 'অনলাইন বিদ্যুৎ বিল ও নতুন সংযোগ' },
  ];

  return (
    <section id="tourism" className="py-14 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heritage Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span>ঝালকাঠির গর্ব ও ঐতিহ্য</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            দর্শনীয় স্থান ও পর্যটন তথ্য
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            নদীমাতৃক ঝালকাঠির ঐতিহ্যবাহী পর্যটন কেন্দ্র এবং ভ্রমণের সেরা নির্দেশনা
          </p>
        </div>

        {/* Tourist Spots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {touristSpots.map((spot, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={spot.image}
                  alt={spot.titleBn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-3 text-white text-xs font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-lime-400" />
                  <span>{spot.upazilaBn}</span>
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                  {spot.titleBn}
                </h3>
                <p className="text-xs font-semibold text-emerald-800 mt-1">
                  {spot.subtitleBn}
                </p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {spot.descriptionBn}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Government and Citizen E-Services Box */}
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-emerald-700/60 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-lime-300 bg-emerald-700/80 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                <Globe className="w-3.5 h-3.5" />
                <span>নাগরিক ই-সেবা পোর্টাল</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-black">
                সরকারি প্রয়োজনীয় লিংক ও নাগরিক সেবা
              </h3>
              <p className="text-emerald-200 text-sm mt-1">
                এক ক্লিকে সরাসরি সরকারি সেবা পোর্টালে প্রবেশ করে আবেদন করুন
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {govLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-4 transition-all duration-200 group flex items-start justify-between"
              >
                <div>
                  <h4 className="font-bold text-white text-base group-hover:text-lime-300 transition-colors">
                    {link.title}
                  </h4>
                  <p className="text-xs text-emerald-200 mt-1">{link.desc}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-300 group-hover:text-white transition-colors shrink-0 mt-0.5 ml-2" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
