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
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_BUSINESSES,
  INITIAL_POSTS,
  INITIAL_EMERGENCY_CONTACTS,
  INITIAL_ADVERTISEMENTS,
  INITIAL_SETTINGS,
} from '../data/initialData';
import { db, isFirebaseLive, handleFirestoreError, OperationType } from './firebase';
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';

// Storage keys for local fallback
const STORAGE_KEYS = {
  BUSINESSES: 'jos_businesses_data',
  POSTS: 'jos_posts_data',
  EMERGENCY: 'jos_emergency_data',
  ADS: 'jos_ads_data',
  SETTINGS: 'jos_settings_data',
  CATEGORIES: 'jos_categories_data',
  REQUESTS: 'jos_requests_data',
  LOGS: 'jos_logs_data',
  AUTH: 'jos_admin_auth',
};

// In-memory cache & event listeners for real-time reactivity
type ListenerCallback<T> = (data: T) => void;

class DataRepository {
  private businesses: BusinessListing[] = [];
  private posts: PostItem[] = [];
  private emergencyContacts: EmergencyContact[] = [];
  private ads: Advertisement[] = [];
  private settings: SiteSettings = INITIAL_SETTINGS;
  private categories: ServiceCategory[] = INITIAL_CATEGORIES;
  private serviceRequests: ServiceRequest[] = [];
  private logs: ActivityLogItem[] = [];

  private businessSubscribers: Set<ListenerCallback<BusinessListing[]>> = new Set();
  private postSubscribers: Set<ListenerCallback<PostItem[]>> = new Set();
  private emergencySubscribers: Set<ListenerCallback<EmergencyContact[]>> = new Set();
  private adSubscribers: Set<ListenerCallback<Advertisement[]>> = new Set();
  private settingsSubscribers: Set<ListenerCallback<SiteSettings>> = new Set();
  private categorySubscribers: Set<ListenerCallback<ServiceCategory[]>> = new Set();
  private requestSubscribers: Set<ListenerCallback<ServiceRequest[]>> = new Set();
  private logSubscribers: Set<ListenerCallback<ActivityLogItem[]>> = new Set();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    try {
      const storedBiz = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
      this.businesses = storedBiz ? JSON.parse(storedBiz) : INITIAL_BUSINESSES;

      const storedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
      this.posts = storedPosts ? JSON.parse(storedPosts) : INITIAL_POSTS;

      const storedEmg = localStorage.getItem(STORAGE_KEYS.EMERGENCY);
      this.emergencyContacts = storedEmg ? JSON.parse(storedEmg) : INITIAL_EMERGENCY_CONTACTS;

      const storedAds = localStorage.getItem(STORAGE_KEYS.ADS);
      this.ads = storedAds ? JSON.parse(storedAds) : INITIAL_ADVERTISEMENTS;

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      this.settings = storedSettings ? JSON.parse(storedSettings) : INITIAL_SETTINGS;

      const storedCats = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      this.categories = storedCats ? JSON.parse(storedCats) : INITIAL_CATEGORIES;

      const storedReqs = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      this.serviceRequests = storedReqs ? JSON.parse(storedReqs) : [];

      const storedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
      this.logs = storedLogs ? JSON.parse(storedLogs) : [
        {
          id: 'log-1',
          action: 'System Boot',
          target: 'JOS Portal',
          userEmail: 'system@jhalakathi.jos',
          timestamp: new Date().toISOString(),
          details: 'ঝালকাঠি অনলাইন সেবা সিস্টেম সফলভাবে প্রস্তুত হয়েছে।',
        },
      ];
    } catch (err) {
      console.warn('Error loading local state, resetting to seed data:', err);
      this.businesses = INITIAL_BUSINESSES;
      this.posts = INITIAL_POSTS;
      this.emergencyContacts = INITIAL_EMERGENCY_CONTACTS;
      this.ads = INITIAL_ADVERTISEMENTS;
      this.settings = INITIAL_SETTINGS;
      this.categories = INITIAL_CATEGORIES;
    }
  }

  // --- Subscriptions ---
  public subscribeBusinesses(cb: ListenerCallback<BusinessListing[]>): () => void {
    cb([...this.businesses]);
    this.businessSubscribers.add(cb);

    if (isFirebaseLive() && db) {
      try {
        const unsub = onSnapshot(collection(db, 'businesses'), (snapshot) => {
          const list: BusinessListing[] = [];
          snapshot.forEach((d) => list.push(d.data() as BusinessListing));
          if (list.length > 0) {
            this.businesses = list;
            this.persistLocal(STORAGE_KEYS.BUSINESSES, list);
            this.notifyBusinessSubscribers();
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.GET, 'businesses');
        });
        return () => {
          this.businessSubscribers.delete(cb);
          unsub();
        };
      } catch (e) {
        console.warn('Firestore subscription fallback:', e);
      }
    }

    return () => this.businessSubscribers.delete(cb);
  }

  public subscribePosts(cb: ListenerCallback<PostItem[]>): () => void {
    cb([...this.posts]);
    this.postSubscribers.add(cb);

    if (isFirebaseLive() && db) {
      try {
        const unsub = onSnapshot(collection(db, 'posts'), (snapshot) => {
          const list: PostItem[] = [];
          snapshot.forEach((d) => list.push(d.data() as PostItem));
          if (list.length > 0) {
            this.posts = list;
            this.persistLocal(STORAGE_KEYS.POSTS, list);
            this.notifyPostSubscribers();
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.GET, 'posts');
        });
        return () => {
          this.postSubscribers.delete(cb);
          unsub();
        };
      } catch (e) {
        console.warn('Firestore subscription fallback:', e);
      }
    }

    return () => this.postSubscribers.delete(cb);
  }

  public subscribeEmergencyContacts(cb: ListenerCallback<EmergencyContact[]>): () => void {
    cb([...this.emergencyContacts]);
    this.emergencySubscribers.add(cb);

    if (isFirebaseLive() && db) {
      try {
        const unsub = onSnapshot(collection(db, 'emergency_contacts'), (snapshot) => {
          const list: EmergencyContact[] = [];
          snapshot.forEach((d) => list.push(d.data() as EmergencyContact));
          if (list.length > 0) {
            this.emergencyContacts = list;
            this.persistLocal(STORAGE_KEYS.EMERGENCY, list);
            this.notifyEmergencySubscribers();
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.GET, 'emergency_contacts');
        });
        return () => {
          this.emergencySubscribers.delete(cb);
          unsub();
        };
      } catch (e) {
        console.warn('Firestore subscription fallback:', e);
      }
    }

    return () => this.emergencySubscribers.delete(cb);
  }

  public subscribeAds(cb: ListenerCallback<Advertisement[]>): () => void {
    cb([...this.ads]);
    this.adSubscribers.add(cb);

    if (isFirebaseLive() && db) {
      try {
        const unsub = onSnapshot(collection(db, 'advertisements'), (snapshot) => {
          const list: Advertisement[] = [];
          snapshot.forEach((d) => list.push(d.data() as Advertisement));
          if (list.length > 0) {
            this.ads = list;
            this.persistLocal(STORAGE_KEYS.ADS, list);
            this.notifyAdSubscribers();
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.GET, 'advertisements');
        });
        return () => {
          this.adSubscribers.delete(cb);
          unsub();
        };
      } catch (e) {
        console.warn('Firestore subscription fallback:', e);
      }
    }

    return () => this.adSubscribers.delete(cb);
  }

  public subscribeSettings(cb: ListenerCallback<SiteSettings>): () => void {
    cb({ ...this.settings });
    this.settingsSubscribers.add(cb);
    return () => this.settingsSubscribers.delete(cb);
  }

  public subscribeCategories(cb: ListenerCallback<ServiceCategory[]>): () => void {
    cb([...this.categories]);
    this.categorySubscribers.add(cb);
    return () => this.categorySubscribers.delete(cb);
  }

  public subscribeRequests(cb: ListenerCallback<ServiceRequest[]>): () => void {
    cb([...this.serviceRequests]);
    this.requestSubscribers.add(cb);
    return () => this.requestSubscribers.delete(cb);
  }

  public subscribeLogs(cb: ListenerCallback<ActivityLogItem[]>): () => void {
    cb([...this.logs]);
    this.logSubscribers.add(cb);
    return () => this.logSubscribers.delete(cb);
  }

  // --- CRUD Operations ---
  public async saveBusiness(business: BusinessListing, userEmail = 'admin@jos.gov.bd'): Promise<void> {
    const index = this.businesses.findIndex((b) => b.id === business.id);
    const updated = {
      ...business,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      this.businesses[index] = updated;
      this.logAction('ব্যবসা তথ্য হালনাগাদ', business.nameBn, userEmail);
    } else {
      this.businesses.unshift(updated);
      this.logAction('নতুন ব্যবসা যুক্ত', business.nameBn, userEmail);
    }

    this.persistLocal(STORAGE_KEYS.BUSINESSES, this.businesses);
    this.notifyBusinessSubscribers();

    if (isFirebaseLive() && db) {
      try {
        await setDoc(doc(db, 'businesses', business.id), {
          ...updated,
          serverTimestamp: serverTimestamp(),
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `businesses/${business.id}`);
      }
    }
  }

  public async deleteBusiness(id: string, userEmail = 'admin@jos.gov.bd'): Promise<void> {
    const target = this.businesses.find((b) => b.id === id);
    this.businesses = this.businesses.filter((b) => b.id !== id);
    if (target) {
      this.logAction('ব্যবসা মুছে ফেলা হয়েছে', target.nameBn, userEmail);
    }
    this.persistLocal(STORAGE_KEYS.BUSINESSES, this.businesses);
    this.notifyBusinessSubscribers();

    if (isFirebaseLive() && db) {
      try {
        await deleteDoc(doc(db, 'businesses', id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `businesses/${id}`);
      }
    }
  }

  public async savePost(post: PostItem, userEmail = 'admin@jos.gov.bd'): Promise<void> {
    const index = this.posts.findIndex((p) => p.id === post.id);
    const updated = {
      ...post,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      this.posts[index] = updated;
      this.logAction('পোস্ট/সংবাদ হালনাগাদ', post.titleBn, userEmail);
    } else {
      this.posts.unshift(updated);
      this.logAction('নতুন পোস্ট/সংবাদ প্রকাশিত', post.titleBn, userEmail);
    }

    this.persistLocal(STORAGE_KEYS.POSTS, this.posts);
    this.notifyPostSubscribers();

    if (isFirebaseLive() && db) {
      try {
        await setDoc(doc(db, 'posts', post.id), {
          ...updated,
          serverTimestamp: serverTimestamp(),
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `posts/${post.id}`);
      }
    }
  }

  public async deletePost(id: string, userEmail = 'admin@jos.gov.bd'): Promise<void> {
    const target = this.posts.find((p) => p.id === id);
    this.posts = this.posts.filter((p) => p.id !== id);
    if (target) {
      this.logAction('পোস্ট মুছে ফেলা হয়েছে', target.titleBn, userEmail);
    }
    this.persistLocal(STORAGE_KEYS.POSTS, this.posts);
    this.notifyPostSubscribers();

    if (isFirebaseLive() && db) {
      try {
        await deleteDoc(doc(db, 'posts', id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `posts/${id}`);
      }
    }
  }

  public async saveEmergencyContact(contact: EmergencyContact, userEmail = 'admin@jos.gov.bd'): Promise<void> {
    const index = this.emergencyContacts.findIndex((c) => c.id === contact.id);
    if (index >= 0) {
      this.emergencyContacts[index] = contact;
      this.logAction('জরুরি নম্বর হালনাগাদ', contact.nameBn, userEmail);
    } else {
      this.emergencyContacts.push(contact);
      this.logAction('নতুন জরুরি নম্বর যুক্ত', contact.nameBn, userEmail);
    }

    this.emergencyContacts.sort((a, b) => a.priority - b.priority);
    this.persistLocal(STORAGE_KEYS.EMERGENCY, this.emergencyContacts);
    this.notifyEmergencySubscribers();

    if (isFirebaseLive() && db) {
      try {
        await setDoc(doc(db, 'emergency_contacts', contact.id), contact);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `emergency_contacts/${contact.id}`);
      }
    }
  }

  public async deleteEmergencyContact(id: string, userEmail = 'admin@jos.gov.bd'): Promise<void> {
    const target = this.emergencyContacts.find((c) => c.id === id);
    this.emergencyContacts = this.emergencyContacts.filter((c) => c.id !== id);
    if (target) {
      this.logAction('জরুরি নম্বর মুছে ফেলা হয়েছে', target.nameBn, userEmail);
    }
    this.persistLocal(STORAGE_KEYS.EMERGENCY, this.emergencyContacts);
    this.notifyEmergencySubscribers();

    if (isFirebaseLive() && db) {
      try {
        await deleteDoc(doc(db, 'emergency_contacts', id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `emergency_contacts/${id}`);
      }
    }
  }

  public async saveAdvertisement(ad: Advertisement, userEmail = 'admin@jos.gov.bd'): Promise<void> {
    const index = this.ads.findIndex((a) => a.id === ad.id);
    if (index >= 0) {
      this.ads[index] = ad;
      this.logAction('বিজ্ঞাপন হালনাগাদ', ad.titleBn, userEmail);
    } else {
      this.ads.unshift(ad);
      this.logAction('নতুন বিজ্ঞাপন যুক্ত', ad.titleBn, userEmail);
    }

    this.persistLocal(STORAGE_KEYS.ADS, this.ads);
    this.notifyAdSubscribers();

    if (isFirebaseLive() && db) {
      try {
        await setDoc(doc(db, 'advertisements', ad.id), ad);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `advertisements/${ad.id}`);
      }
    }
  }

  public async deleteAdvertisement(id: string, userEmail = 'admin@jos.gov.bd'): Promise<void> {
    const target = this.ads.find((a) => a.id === id);
    this.ads = this.ads.filter((a) => a.id !== id);
    if (target) {
      this.logAction('বিজ্ঞাপন মুছে ফেলা হয়েছে', target.titleBn, userEmail);
    }
    this.persistLocal(STORAGE_KEYS.ADS, this.ads);
    this.notifyAdSubscribers();

    if (isFirebaseLive() && db) {
      try {
        await deleteDoc(doc(db, 'advertisements', id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `advertisements/${id}`);
      }
    }
  }

  public recordAdClick(adId: string) {
    const ad = this.ads.find((a) => a.id === adId);
    if (ad) {
      ad.clicks = (ad.clicks || 0) + 1;
      this.persistLocal(STORAGE_KEYS.ADS, this.ads);
      this.notifyAdSubscribers();
    }
  }

  public recordAdImpression(adId: string) {
    const ad = this.ads.find((a) => a.id === adId);
    if (ad) {
      ad.impressions = (ad.impressions || 0) + 1;
      this.persistLocal(STORAGE_KEYS.ADS, this.ads);
      this.notifyAdSubscribers();
    }
  }

  public async saveSettings(newSettings: SiteSettings, userEmail = 'admin@jos.gov.bd'): Promise<void> {
    this.settings = newSettings;
    this.persistLocal(STORAGE_KEYS.SETTINGS, this.settings);
    this.notifySettingsSubscribers();
    this.logAction('সাইটের সেটিংস পরিবর্তন', 'সাধারণ সেটিংস', userEmail);

    if (isFirebaseLive() && db) {
      try {
        await setDoc(doc(db, 'settings', 'site_config'), newSettings);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, 'settings/site_config');
      }
    }
  }

  public async submitServiceRequest(request: Omit<ServiceRequest, 'id' | 'submittedAt' | 'status'>): Promise<void> {
    const newReq: ServiceRequest = {
      ...request,
      id: `req-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    this.serviceRequests.unshift(newReq);
    this.persistLocal(STORAGE_KEYS.REQUESTS, this.serviceRequests);
    this.notifyRequestSubscribers();
    this.logAction('নতুন সেবা তালিকাভুক্তির আবেদন', `${request.businessNameBn} (${request.applicantName})`, 'Citizen User');
  }

  public async updateServiceRequestStatus(id: string, status: 'approved' | 'rejected', userEmail = 'admin@jos.gov.bd'): Promise<void> {
    const req = this.serviceRequests.find((r) => r.id === id);
    if (req) {
      req.status = status;
      this.persistLocal(STORAGE_KEYS.REQUESTS, this.serviceRequests);
      this.notifyRequestSubscribers();
      this.logAction('আবেদন স্ট্যাটাস পরিবর্তন', `${req.businessNameBn} - ${status}`, userEmail);

      // If approved, automatically convert to published business listing
      if (status === 'approved') {
        const newBiz: BusinessListing = {
          id: `biz-${Date.now()}`,
          nameBn: req.businessNameBn,
          categoryId: req.category,
          upazila: req.upazila,
          addressBn: req.addressBn,
          phone: req.phone,
          descriptionBn: req.detailsBn,
          verified: true,
          isFeatured: false,
          status: 'published',
          views: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await this.saveBusiness(newBiz, userEmail);
      }
    }
  }

  private logAction(action: string, target: string, userEmail: string) {
    const item: ActivityLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      target,
      userEmail,
      timestamp: new Date().toISOString(),
    };
    this.logs.unshift(item);
    if (this.logs.length > 50) this.logs = this.logs.slice(0, 50);
    this.persistLocal(STORAGE_KEYS.LOGS, this.logs);
    this.notifyLogSubscribers();
  }

  // Helper notification triggers
  private notifyBusinessSubscribers() {
    this.businessSubscribers.forEach((cb) => cb([...this.businesses]));
  }
  private notifyPostSubscribers() {
    this.postSubscribers.forEach((cb) => cb([...this.posts]));
  }
  private notifyEmergencySubscribers() {
    this.emergencySubscribers.forEach((cb) => cb([...this.emergencyContacts]));
  }
  private notifyAdSubscribers() {
    this.adSubscribers.forEach((cb) => cb([...this.ads]));
  }
  private notifySettingsSubscribers() {
    this.settingsSubscribers.forEach((cb) => cb({ ...this.settings }));
  }
  private notifyCategorySubscribers() {
    this.categorySubscribers.forEach((cb) => cb([...this.categories]));
  }
  private notifyRequestSubscribers() {
    this.requestSubscribers.forEach((cb) => cb([...this.serviceRequests]));
  }
  private notifyLogSubscribers() {
    this.logSubscribers.forEach((cb) => cb([...this.logs]));
  }

  private persistLocal(key: string, data: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // LocalStorage full or quota limit
    }
  }

  // Method to push all local seed data to real Firestore when user connects
  public async syncAllToFirestore(): Promise<{ success: boolean; count: number }> {
    if (!isFirebaseLive() || !db) {
      throw new Error('Firebase Firestore সংযুক্ত নেই। প্রথমে কনফিগারেশন যোগ করুন।');
    }
    let count = 0;
    for (const b of this.businesses) {
      await setDoc(doc(db, 'businesses', b.id), b);
      count++;
    }
    for (const p of this.posts) {
      await setDoc(doc(db, 'posts', p.id), p);
      count++;
    }
    for (const e of this.emergencyContacts) {
      await setDoc(doc(db, 'emergency_contacts', e.id), e);
      count++;
    }
    for (const a of this.ads) {
      await setDoc(doc(db, 'advertisements', a.id), a);
      count++;
    }
    await setDoc(doc(db, 'settings', 'site_config'), this.settings);
    count++;
    return { success: true, count };
  }
}

export const dataRepository = new DataRepository();
