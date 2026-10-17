import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizePhoneNumber,
  filterPublicPosts,
  filterBusinesses,
  toBengaliDigits,
} from './filter.ts';
import type { BusinessListing, PostItem } from '../types/index.ts';

test('normalizePhoneNumber converts Bengali numerals to standard digits', () => {
  assert.equal(normalizePhoneNumber('০১৭১২-৩৪৫৬৭৮'), '01712345678');
  assert.equal(normalizePhoneNumber('৯৯৯'), '999');
  assert.equal(normalizePhoneNumber('+880 1712-345678'), '+8801712345678');
});

test('toBengaliDigits converts English digits to Bengali digits', () => {
  assert.equal(toBengaliDigits('01712'), '০১৭১২');
  assert.equal(toBengaliDigits(2026), '২০২৬');
});

test('filterPublicPosts excludes drafts and future scheduled posts', () => {
  const posts: PostItem[] = [
    {
      id: '1',
      titleBn: 'প্রকাশিত সংবাদ',
      slug: 'post-1',
      category: 'news',
      excerptBn: 'সারাংশ',
      contentBn: 'বিস্তারিত বিবরণ',
      authorBn: 'এডমিন',
      isFeatured: true,
      status: 'published',
      tags: ['সংবাদ'],
      views: 10,
      createdAt: '2026-03-01T00:00:00Z',
      updatedAt: '2026-03-01T00:00:00Z',
    },
    {
      id: '2',
      titleBn: 'খসড়া সংবাদ',
      slug: 'post-2',
      category: 'notice',
      excerptBn: 'ড্রাফট',
      contentBn: 'খসড়া বিবরণ',
      authorBn: 'এডমিন',
      isFeatured: false,
      status: 'draft',
      tags: ['নোটিশ'],
      views: 0,
      createdAt: '2026-03-01T00:00:00Z',
      updatedAt: '2026-03-01T00:00:00Z',
    },
    {
      id: '3',
      titleBn: 'ভবিষ্যতের সিডিউল করা পোস্ট',
      slug: 'post-3',
      category: 'job',
      excerptBn: 'সিডিউল',
      contentBn: 'বিস্তারিত',
      authorBn: 'এডমিন',
      isFeatured: false,
      status: 'published',
      scheduledDate: '2026-12-01T00:00:00Z',
      tags: ['চাকরি'],
      views: 0,
      createdAt: '2026-03-01T00:00:00Z',
      updatedAt: '2026-03-01T00:00:00Z',
    },
  ];

  const now = '2026-03-15T00:00:00Z';
  const publicPosts = filterPublicPosts(posts, now);

  assert.equal(publicPosts.length, 1);
  assert.equal(publicPosts[0].id, '1');
});

test('filterBusinesses filters by upazila and search query accurately', () => {
  const sampleBiz: BusinessListing[] = [
    {
      id: 'b1',
      nameBn: 'ঝালকাঠি সদর হাসপাতাল',
      nameEn: 'Sadar Hospital',
      categoryId: 'health',
      upazila: 'sadar',
      addressBn: 'হাসপাতাল রোড',
      phone: '01712-345678',
      descriptionBn: 'জরুরি স্বাস্থ্যসেবা',
      verified: true,
      isFeatured: true,
      status: 'published',
      views: 100,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
    {
      id: 'b2',
      nameBn: 'নলছিটি ক্লিনিক',
      categoryId: 'health',
      upazila: 'nalchity',
      addressBn: 'নলছিটি বাজার',
      phone: '01715-334455',
      descriptionBn: 'প্রাথমিক চিকিৎসা',
      verified: false,
      isFeatured: false,
      status: 'published',
      views: 50,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
  ];

  const nalchityOnly = filterBusinesses(sampleBiz, '', 'all', 'nalchity');
  assert.equal(nalchityOnly.length, 1);
  assert.equal(nalchityOnly[0].id, 'b2');

  const searchHospital = filterBusinesses(sampleBiz, 'হাসপাতাল');
  assert.equal(searchHospital.length, 1);
  assert.equal(searchHospital[0].id, 'b1');
});
