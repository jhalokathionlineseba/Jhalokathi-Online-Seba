import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePhone, validateTitle, validateUrl, generateSlug } from './validation.ts';

test('validatePhone checks Bangladeshi phone numbers and hotlines', () => {
  assert.equal(validatePhone('01712345678').isValid, true);
  assert.equal(validatePhone('৯৯৯').isValid, true);
  assert.equal(validatePhone('333').isValid, true);
  assert.equal(validatePhone('12').isValid, false);
  assert.equal(validatePhone('').isValid, false);
});

test('validateTitle checks min and max lengths', () => {
  assert.equal(validateTitle('সংবাদ').isValid, true);
  assert.equal(validateTitle('ক').isValid, false);
  assert.equal(validateTitle('').isValid, false);
});

test('validateUrl validates web links and internal anchors', () => {
  assert.equal(validateUrl('https://jhalakathi.gov.bd').isValid, true);
  assert.equal(validateUrl('#contact').isValid, true);
  assert.equal(validateUrl('not-a-valid-url').isValid, false);
  assert.equal(validateUrl('').isValid, true); // optional
});

test('generateSlug converts Bengali and English to clean URL slugs', () => {
  const slug = generateSlug('ঝালকাঠি ডিসি অফিস নিয়োগ ২০২৬');
  assert.match(slug, /^[a-z0-9\u0980-\u09FF-]+$/);
  assert.equal(generateSlug('Jhalakathi Seba Portal 2026'), 'jhalakathi-seba-portal-2026');
});
