import type { BusinessListing, PostItem, EmergencyContact, Upazila } from '../types/index.ts';

/**
 * Normalizes Bengali and English digits and cleans phone numbers
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  const bnToEnMap: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
  };
  const normalized = phone
    .replace(/[০-৯]/g, (char) => bnToEnMap[char] || char)
    .replace(/[^0-9+]/g, '');
  return normalized;
}

/**
 * Filter published posts only for public view (drafts, scheduled for future are excluded)
 */
export function filterPublicPosts(posts: PostItem[], nowISO: string = new Date().toISOString()): PostItem[] {
  return posts.filter((post) => {
    if (post.status !== 'published') return false;
    if (post.scheduledDate && new Date(post.scheduledDate).getTime() > new Date(nowISO).getTime()) {
      return false;
    }
    return true;
  });
}

/**
 * Filter businesses by search text, category, and upazila
 */
export function filterBusinesses(
  businesses: BusinessListing[],
  query: string,
  categoryId: string = 'all',
  upazila: Upazila = 'all',
  includeUnpublished: boolean = false
): BusinessListing[] {
  const cleanQuery = query.trim().toLowerCase();

  return businesses.filter((item) => {
    if (!includeUnpublished && item.status !== 'published') return false;
    if (categoryId !== 'all' && item.categoryId !== categoryId) return false;
    if (upazila !== 'all' && item.upazila !== upazila) return false;

    if (cleanQuery) {
      const matchName = item.nameBn.toLowerCase().includes(cleanQuery) || (item.nameEn?.toLowerCase().includes(cleanQuery) ?? false);
      const matchAddress = item.addressBn.toLowerCase().includes(cleanQuery);
      const matchSub = item.subCategoryBn?.toLowerCase().includes(cleanQuery) ?? false;
      const matchPhone = item.phone.includes(cleanQuery) || normalizePhoneNumber(item.phone).includes(cleanQuery);
      const matchDesc = item.descriptionBn.toLowerCase().includes(cleanQuery);

      return matchName || matchAddress || matchSub || matchPhone || matchDesc;
    }

    return true;
  });
}

/**
 * Filter emergency contacts by search query and upazila
 */
export function filterEmergencyContacts(
  contacts: EmergencyContact[],
  query: string,
  upazila: Upazila = 'all',
  department: string = 'all'
): EmergencyContact[] {
  const cleanQuery = query.trim().toLowerCase();

  return contacts
    .filter((c) => {
      if (upazila !== 'all' && c.upazila !== 'all' && c.upazila !== upazila) return false;
      if (department !== 'all' && c.department !== department) return false;

      if (cleanQuery) {
        const matchName = c.nameBn.toLowerCase().includes(cleanQuery);
        const matchDesig = c.designationBn.toLowerCase().includes(cleanQuery);
        const matchAddress = c.addressBn.toLowerCase().includes(cleanQuery);
        const matchPhone = c.phone.includes(cleanQuery) || normalizePhoneNumber(c.phone).includes(cleanQuery);
        return matchName || matchDesig || matchAddress || matchPhone;
      }
      return true;
    })
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Format relative time in Bengali
 */
export function formatRelativeTimeBn(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return 'এইমাত্র';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${toBengaliDigits(diffMin)} মিনিট আগে`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${toBengaliDigits(diffHours)} ঘণ্টা আগে`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${toBengaliDigits(diffDays)} দিন আগে`;

    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Converts English digits to Bengali digits
 */
export function toBengaliDigits(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
}
