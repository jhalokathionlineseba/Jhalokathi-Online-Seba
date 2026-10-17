# Security Specification & Adversarial Test Matrix (TDD)
## ঝালকাঠি অনলাইন সেবা (Jhalakathi Online Seba)

### 1. Data Invariants
1. **Zero-Trust Identity**: Ordinary users and public visitors can NEVER set `isAdmin: true` or update protected collections (`emergency_contacts`, `advertisements`, `settings`).
2. **Draft & Scheduled Isolation**: Non-admin public visitors can ONLY read records where `status == 'published'`. Drafts and future scheduled notices must return `PERMISSION_DENIED`.
3. **Citizen Request Sandbox**: Unauthenticated or normal citizen users can only `create` a service request with `status: 'pending'`. They CANNOT approve their own request (`status: 'approved'`).
4. **ID Sanitization**: Document IDs must conform to alphanumeric characters and dashes (`^[a-zA-Z0-9_\-]+$`) with a maximum length of 128 bytes to prevent ID poisoning.
5. **No Blind Blanket Reads**: Read rules on private resources are strictly scoped; public safety numbers have explicit read rules while business records require `status == 'published'`.

---

### 2. The "Dirty Dozen" Malicious Payloads & Test Assertions

| # | Attack Vector | Target Path | Attempted Payload | Expected Result | Reason |
|---|---|---|---|---|---|
| 1 | Ghost Field Injection (Privilege Escalation) | `/businesses/b1` | `{ "nameBn": "দোকান", "role": "admin", "verified": true }` | `PERMISSION_DENIED` | Unauthorized user cannot write to `/businesses` |
| 2 | Self-Approval Spoofing | `/service_requests/req-1` | `{ "businessNameBn": "আমার দোকান", "status": "approved" }` | `PERMISSION_DENIED` | `create` rule mandates `incoming().status == 'pending'` |
| 3 | Large String Denial-of-Wallet (Resource Exhaustion) | `/service_requests/req-2` | `{ "applicantName": "A".repeat(500000), ... }` | `PERMISSION_DENIED` | `applicantName.size() <= 80` boundary check fails |
| 4 | Malformed Document ID Poisoning | `/businesses/..%2F..%2Fetc` | `{ ... }` | `PERMISSION_DENIED` | `isValidId(businessId)` regex rejects malicious paths |
| 5 | Unauthorized Public Read of Draft Notice | `/posts/post-draft` | Read `resource.data.status == 'draft'` as guest | `PERMISSION_DENIED` | Public rule only permits `status == 'published'` |
| 6 | Direct Deletion of Emergency Contacts | `/emergency_contacts/emg-1` | `DELETE` request from unauthenticated user | `PERMISSION_DENIED` | Only authenticated admin can delete emergency numbers |
| 7 | Ad Impression / Click Spoofing to Modify Target | `/advertisements/ad-1` | `{ "targetUrl": "https://malicious-phishing.com" }` | `PERMISSION_DENIED` | Non-admin write to `/advertisements` is blocked |
| 8 | Setting Tampering (Title Hijack) | `/settings/site_config` | `{ "siteNameBn": "হ্যাকড" }` | `PERMISSION_DENIED` | Write to `/settings` restricted exclusively to `isAdmin()` |
| 9 | Unverified Email Admin Spoofing | `/posts/new-post` | Auth token with `email_verified: false` matching admin | `PERMISSION_DENIED` | Rules mandate verified authentication and admin check |
| 10 | Unbounded Array Injection | `/businesses/b1` | `{ "servicesBn": ["a", ... 10,000 items] }` | `PERMISSION_DENIED` | Schema checks enforce bounded sizes and validation |
| 11 | Direct Manipulation of Admin Roster | `/admins/attackerUid` | `{ "role": "super_admin" }` | `PERMISSION_DENIED` | `/admins/{adminId}` writes are hard-blocked (`allow write: if false`) |
| 12 | Terminal State Overwrite on Inactive Ad | `/advertisements/ad-9` | Unprivileged patch to toggle `isActive: true` | `PERMISSION_DENIED` | Only authorized admin can mutate `isActive` |
