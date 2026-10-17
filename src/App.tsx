import React, { useState, useEffect } from 'react';
import {
  BusinessListing,
  PostItem,
  EmergencyContact,
  Advertisement,
  SiteSettings,
  ServiceCategory,
  ServiceRequest,
  ActivityLogItem,
  AdminUser,
  Upazila,
} from './types';
import { dataRepository } from './lib/data-service';
import { authService } from './lib/auth-service';
import { Header } from './components/public/Header';
import { HeroBanner } from './components/public/HeroBanner';
import { CategoryGrid } from './components/public/CategoryGrid';
import { EmergencyDirectory } from './components/public/EmergencyDirectory';
import { BusinessDirectory } from './components/public/BusinessDirectory';
import { NewsAndNotices } from './components/public/NewsAndNotices';
import { TouristSpotsAndResources } from './components/public/TouristSpotsAndResources';
import { AdBanner } from './components/public/AdBanner';
import { ListingRequestModal } from './components/public/ListingRequestModal';
import { Footer } from './components/public/Footer';

// Admin imports
import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout, AdminTab } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminPostsManager } from './admin/AdminPostsManager';
import { AdminDirectoryManager } from './admin/AdminDirectoryManager';
import { AdminEmergencyManager } from './admin/AdminEmergencyManager';
import { AdminAdManager } from './admin/AdminAdManager';
import { AdminRequestsManager } from './admin/AdminRequestsManager';
import { AdminSettingsManager } from './admin/AdminSettingsManager';
import { AdminFirebaseHub } from './admin/AdminFirebaseHub';
import { generateSourceZip, triggerDownload } from './utils/zipExporter';

export default function App() {
  // Real-time State
  const [businesses, setBusinesses] = useState<BusinessListing[]>([]);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);

  // Navigation & UI state
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedUpazila, setSelectedUpazila] = useState<Upazila>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);

  // Admin routing & auth state
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.hash === '#admin' || window.location.pathname.startsWith('/admin');
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(authService.getCurrentUser());
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  // Subscriptions to DataRepository
  useEffect(() => {
    const unsubBiz = dataRepository.subscribeBusinesses(setBusinesses);
    const unsubPosts = dataRepository.subscribePosts(setPosts);
    const unsubEmg = dataRepository.subscribeEmergencyContacts(setEmergencyContacts);
    const unsubAds = dataRepository.subscribeAds(setAds);
    const unsubSettings = dataRepository.subscribeSettings(setSettings);
    const unsubCats = dataRepository.subscribeCategories(setCategories);
    const unsubReqs = dataRepository.subscribeRequests(setRequests);
    const unsubLogs = dataRepository.subscribeLogs(setLogs);

    const unsubAuth = authService.subscribe(setCurrentUser);

    return () => {
      unsubBiz();
      unsubPosts();
      unsubEmg();
      unsubAds();
      unsubSettings();
      unsubCats();
      unsubReqs();
      unsubLogs();
      unsubAuth();
    };
  }, []);

  // Listen to hash changes for #admin
  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === '#admin') {
        if (authService.isAuthenticated()) {
          setIsAdminView(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      } else {
        setIsAdminView(false);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsAdminView(false);
    window.location.hash = '';

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenAdmin = () => {
    if (authService.isAuthenticated()) {
      setIsAdminView(true);
      window.location.hash = 'admin';
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoginOpen(false);
    setIsAdminView(true);
    window.location.hash = 'admin';
  };

  const handleExitAdmin = () => {
    setIsAdminView(false);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadSourcePackage = async () => {
    try {
      const blob = await generateSourceZip();
      triggerDownload(blob, 'JOS-Jhalakathi-Online-Seba-Complete-Package.zip');
    } catch (e) {
      console.error(e);
    }
  };

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-bold text-sm text-emerald-300">ঝালকাঠি অনলাইন সেবা লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // --- ADMIN PORTAL VIEW ---
  if (isAdminView && currentUser) {
    return (
      <AdminLayout
        user={currentUser}
        activeTab={adminTab}
        onTabChange={setAdminTab}
        onExitToPublic={handleExitAdmin}
        pendingRequestsCount={requests.filter((r) => r.status === 'pending').length}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            businesses={businesses}
            posts={posts}
            emergencyContacts={emergencyContacts}
            ads={ads}
            requests={requests}
            logs={logs}
            onNavigateTab={setAdminTab}
          />
        )}
        {adminTab === 'posts' && (
          <AdminPostsManager posts={posts} userEmail={currentUser.email} />
        )}
        {adminTab === 'directory' && (
          <AdminDirectoryManager
            businesses={businesses}
            categories={categories}
            userEmail={currentUser.email}
          />
        )}
        {adminTab === 'emergency' && (
          <AdminEmergencyManager
            contacts={emergencyContacts}
            userEmail={currentUser.email}
          />
        )}
        {adminTab === 'ads' && (
          <AdminAdManager ads={ads} userEmail={currentUser.email} />
        )}
        {adminTab === 'requests' && (
          <AdminRequestsManager requests={requests} userEmail={currentUser.email} />
        )}
        {adminTab === 'settings' && (
          <AdminSettingsManager settings={settings} userEmail={currentUser.email} />
        )}
        {adminTab === 'firebase' && <AdminFirebaseHub />}
      </AdminLayout>
    );
  }

  // --- PUBLIC PREMIUM WEBSITE VIEW ---
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      {/* 1 & 2. Top Info Bar & Main Navigation */}
      <Header
        settings={settings}
        onNavigate={handleNavigate}
        activeSection={activeSection}
        onOpenAdmin={handleOpenAdmin}
        onOpenListingModal={() => setIsListingModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        {/* 3. Hero Section with Riverside Background */}
        <HeroBanner
          settings={settings}
          selectedUpazila={selectedUpazila}
          onUpazilaChange={setSelectedUpazila}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNavigate={handleNavigate}
          onOpenListingModal={() => setIsListingModalOpen(true)}
        />

        {/* 10. Top Ad Placement */}
        <AdBanner
          placement="home_top"
          ads={ads}
          onOpenListingModal={() => setIsListingModalOpen(true)}
        />

        {/* 4. Dynamic Service Categories */}
        <CategoryGrid
          categories={categories}
          businesses={businesses}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onNavigate={handleNavigate}
        />

        {/* 8. Emergency Directory (Police, Hospital, Fire, Helpline) */}
        <EmergencyDirectory contacts={emergencyContacts} />

        {/* 10. Interstitial Ad between sections */}
        <AdBanner
          placement="between_posts"
          ads={ads}
          onOpenListingModal={() => setIsListingModalOpen(true)}
        />

        {/* 5. Local Business & Professional Directory */}
        <BusinessDirectory
          businesses={businesses}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedUpazila={selectedUpazila}
          onUpazilaChange={setSelectedUpazila}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenListingModal={() => setIsListingModalOpen(true)}
        />

        {/* 6 & 7. Latest News, Job Circulars & Announcements */}
        <NewsAndNotices posts={posts} />

        {/* 9. Useful Links & Jhalakathi Tourism Spots */}
        <TouristSpotsAndResources />

        {/* 10. Footer Placement Ad */}
        <AdBanner
          placement="footer"
          ads={ads}
          onOpenListingModal={() => setIsListingModalOpen(true)}
        />
      </main>

      {/* 12. Footer with Upazila Links and Downloadable Package Trigger */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        onSelectUpazila={setSelectedUpazila}
        onOpenAdmin={handleOpenAdmin}
        onDownloadSource={handleDownloadSourcePackage}
        onOpenListingModal={() => setIsListingModalOpen(true)}
      />

      {/* 10. Dedicated Sticky Bottom Ad Banner */}
      <AdBanner
        placement="bottom_sticky"
        ads={ads}
        onOpenListingModal={() => setIsListingModalOpen(true)}
      />

      {/* Citizen Service Listing Request Modal */}
      <ListingRequestModal
        isOpen={isListingModalOpen}
        onClose={() => setIsListingModalOpen(false)}
        categories={categories}
      />

      {/* Admin Login Modal */}
      {isAdminLoginOpen && (
        <AdminLogin
          onSuccess={handleLoginSuccess}
          onCancel={() => setIsAdminLoginOpen(false)}
        />
      )}
    </div>
  );
}
