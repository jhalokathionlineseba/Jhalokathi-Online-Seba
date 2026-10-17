export type Upazila = 'all' | 'sadar' | 'nalchity' | 'rajapur' | 'kathalia';

export interface UpazilaInfo {
  id: Upazila;
  nameEn: string;
  nameBn: string;
}

export const UPAZILAS: UpazilaInfo[] = [
  { id: 'all', nameEn: 'All Upazilas', nameBn: 'সকল উপজেলা' },
  { id: 'sadar', nameEn: 'Jhalakathi Sadar', nameBn: 'ঝালকাঠি সদর' },
  { id: 'nalchity', nameEn: 'Nalchity', nameBn: 'নলছিটি' },
  { id: 'rajapur', nameEn: 'Rajapur', nameBn: 'রাজাপুর' },
  { id: 'kathalia', nameEn: 'Kathalia', nameBn: 'কাঁঠালিয়া' },
];

export interface ServiceCategory {
  id: string;
  nameEn: string;
  nameBn: string;
  iconName: string;
  descriptionBn: string;
  badgeColor: string;
  displayOrder: number;
}

export interface BusinessListing {
  id: string;
  nameBn: string;
  nameEn?: string;
  categoryId: string;
  subCategoryBn?: string;
  upazila: Upazila;
  addressBn: string;
  phone: string;
  altPhone?: string;
  whatsapp?: string;
  email?: string;
  descriptionBn: string;
  servicesBn?: string[];
  image?: string;
  openingHoursBn?: string;
  verified: boolean;
  isFeatured: boolean;
  status: 'published' | 'draft' | 'archived';
  views: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export type PostCategory = 'news' | 'notice' | 'job' | 'tourism' | 'health_tip' | 'education';

export interface PostItem {
  id: string;
  titleBn: string;
  titleEn?: string;
  slug: string;
  category: PostCategory;
  excerptBn: string;
  contentBn: string;
  image?: string;
  authorBn: string;
  isFeatured: boolean;
  isBreaking?: boolean;
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  scheduledDate?: string;
  tags: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

export type EmergencyDepartment = 'police' | 'fire_service' | 'hospital' | 'ambulance' | 'admin' | 'helpline' | 'electricity';

export interface EmergencyContact {
  id: string;
  nameBn: string;
  designationBn: string;
  department: EmergencyDepartment;
  upazila: Upazila;
  phone: string;
  altPhone?: string;
  addressBn: string;
  isNationalHotline?: boolean;
  priority: number;
}

export type AdPlacement = 'home_top' | 'between_posts' | 'sidebar' | 'footer' | 'bottom_sticky';

export interface Advertisement {
  id: string;
  titleBn: string;
  clientName: string;
  clientPhone?: string;
  bannerUrl: string;
  targetUrl: string;
  placement: AdPlacement;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  displayOrder: number;
  deviceTarget: 'all' | 'mobile' | 'desktop';
  impressions: number;
  clicks: number;
  createdAt: string;
}

export interface SiteSettings {
  siteNameBn: string;
  siteNameEn: string;
  taglineBn: string;
  contactPhone: string;
  contactEmail: string;
  emergencyHotline: string;
  addressBn: string;
  heroHeadingBn: string;
  heroDescriptionBn: string;
  announcementTickerBn: string;
  footerTextBn: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  whatsappSupport?: string;
  themeColor: string;
  metaKeywords: string;
}

export interface ServiceRequest {
  id: string;
  applicantName: string;
  businessNameBn: string;
  category: string;
  upazila: Upazila;
  phone: string;
  addressBn: string;
  detailsBn: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface ActivityLogItem {
  id: string;
  action: string;
  target: string;
  userEmail: string;
  timestamp: string;
  details?: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'admin' | 'moderator';
}
