import { normalizePhoneNumber } from './filter.ts';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validatePhone(phone: string): ValidationResult {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: 'ফোন নম্বর প্রদান আবশ্যক।' };
  }
  const clean = normalizePhoneNumber(phone);
  // Bangladeshi phone numbers are typically 11 digits (e.g., 017xxxxxxxx) or 3 digits for hotlines (e.g. 999, 333)
  if (clean.length < 3 || clean.length > 14) {
    return { isValid: false, error: 'সঠিক ফোন নম্বর প্রদান করুন (যেমন: 01712345678 বা 999)' };
  }
  return { isValid: true };
}

export function validateTitle(title: string, minLength = 3, maxLength = 160): ValidationResult {
  if (!title || title.trim().length < minLength) {
    return { isValid: false, error: `শিরোনাম কমপক্ষে ${minLength} অক্ষরের হতে হবে।` };
  }
  if (title.trim().length > maxLength) {
    return { isValid: false, error: `শিরোনাম সর্বোচ্চ ${maxLength} অক্ষরের মধ্যে রাখুন।` };
  }
  return { isValid: true };
}

export function validateUrl(url: string): ValidationResult {
  if (!url || !url.trim()) return { isValid: true }; // optional
  const trimmed = url.trim();
  if (trimmed.startsWith('#')) return { isValid: true };
  try {
    new URL(trimmed);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'সঠিক লিংক বা URL প্রদান করুন (যেমন: https://...)' };
  }
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u0980-\u09FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}
