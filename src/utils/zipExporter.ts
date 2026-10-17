import JSZip from 'jszip';

export async function generateSourceZip(version = '1.0.0'): Promise<Blob> {
  const zip = new JSZip();

  // Root configuration files
  zip.file(
    'package.json',
    JSON.stringify(
      {
        name: 'jhalakathi-online-seba',
        private: true,
        version: version,
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview',
          test: 'node --test',
        },
        dependencies: {
          react: '^19.0.1',
          'react-dom': '^19.0.1',
          firebase: '^11.4.0',
          'lucide-react': '^0.546.0',
          jszip: '^3.10.1',
        },
        devDependencies: {
          '@types/node': '^22.14.0',
          '@types/react': '^19.3.0',
          '@types/react-dom': '^19.3.0',
          '@vitejs/plugin-react': '^6.1.1',
          tailwindcss: '^4.3.3',
          typescript: '^7.0.2',
          vite: '^8.3.0',
        },
      },
      null,
      2
    )
  );

  zip.file(
    '.env.example',
    `# ঝালকাঠি অনলাইন সেবা - পরিবেশ চলক কনফিগারেশন
VITE_FIREBASE_API_KEY="AIzaSyYourFirebaseApiKey"
VITE_FIREBASE_AUTH_DOMAIN="jhalakathi-online-seba.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="jhalakathi-online-seba"
VITE_FIREBASE_STORAGE_BUCKET="jhalakathi-online-seba.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef1234567890"
VITE_FIREBASE_DATABASE_ID="(default)"
`
  );

  zip.file(
    'firebase.json',
    JSON.stringify(
      {
        hosting: {
          public: 'dist',
          ignore: ['firebase.json', '**/.*', '**/node_modules/**'],
          rewrites: [
            {
              source: '**',
              destination: '/index.html',
            },
          ],
        },
        firestore: {
          rules: 'firestore.rules',
          indexes: 'firestore.indexes.json',
        },
        storage: {
          rules: 'storage.rules',
        },
      },
      null,
      2
    )
  );

  zip.file(
    'firestore.indexes.json',
    JSON.stringify(
      {
        indexes: [
          {
            collectionGroup: 'businesses',
            queryScope: 'COLLECTION',
            fields: [
              { fieldPath: 'status', order: 'ASCENDING' },
              { fieldPath: 'upazila', order: 'ASCENDING' },
              { fieldPath: 'createdAt', order: 'DESCENDING' },
            ],
          },
          {
            collectionGroup: 'posts',
            queryScope: 'COLLECTION',
            fields: [
              { fieldPath: 'status', order: 'ASCENDING' },
              { fieldPath: 'category', order: 'ASCENDING' },
              { fieldPath: 'createdAt', order: 'DESCENDING' },
            ],
          },
        ],
        fieldOverrides: [],
      },
      null,
      2
    )
  );

  zip.file(
    'firestore.rules',
    `rules_version = '2';
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
}
`
  );

  zip.file(
    'storage.rules',
    `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Public can read images, only admin can upload/delete
      allow read: if true;
      allow write: if request.auth != null && 
                     (request.auth.token.email == 'jhalokathionlineseba.jos@gmail.com');
    }
  }
}
`
  );

  zip.file(
    'README.md',
    `# ঝালকাঠি অনলাইন সেবা (Jhalakathi Online Seba)
## অফিসিয়াল ডিজিটাল সেবা ও তথ্য বাতায়ন

**ট্যাগলাইন:** “আপনার এলাকার সকল সেবা, এখন এক ঠিকানায়।”

### প্রজেক্ট ওভারভিউ
ঝালকাঠি জেলার ৪টি উপজেলার (ঝালকাঠি সদর, নলছিটি, রাজাপুর ও কাঁঠালিয়া) সকল জরুরি সেবা, ডাক্তার, হাসপাতাল, অ্যাম্বুলেন্স, রক্তদাতা, পুলিশ ও ফায়ার সার্ভিস, বাস কাউন্টার এবং স্থানীয় ব্যবসায়িক প্রতিষ্ঠানের সরাসরি নির্ভরযোগ্য যোগাযোগ প্ল্যাটফর্ম।

### ডিপ্লয়মেন্ট পদ্ধতি (Firebase Hosting)
1. \`npm install\`
2. \`.env.example\` ফাইলটিকে \`.env\` নামে কপি করুন এবং আপনার Firebase API credentials প্রদান করুন।
3. \`npm run build\`
4. \`firebase deploy\` (হরেক সেবা যেমন Hosting, Firestore Rules এবং Storage Rules স্বয়ংক্রিয়ভাবে আপলোড হবে)।

### স্থানীয়ভাবে চালানো (Development)
\`\`\`bash
npm install
npm run dev
\`\`\`

ব্রাউজারে \`http://localhost:3000\` ওপেন করুন।

### অ্যাডমিন ক্রেডেনশিয়াল
- **ইমেইল:** \`jhalokathionlineseba.jos@gmail.com\`
- **পাসওয়ার্ড:** \`Admin@JOS2026\`
`
  );

  zip.file(
    'CHANGELOG.md',
    `# Changelog - ঝালকাঠি অনলাইন সেবা (Jhalakathi Online Seba)

## [v${version}] - 2026-10-17
### Added
- Complete JOS Modern Responsive Web Application built with React 19, TypeScript, and Tailwind CSS.
- Real-time Firestore synchronization architecture with resilient offline/local fallback.
- Full 12-section public landing page with authentic Jhalakathi heritage visuals and Gabkhan bridge silhouette.
- Comprehensive 24/7 emergency directory with direct click-to-dial functionality.
- Searchable and upazila-filtered business & service directory with verification badges.
- Dedicated multi-placement advertisement management module (Hero top, between posts, sidebar, sticky bottom).
- Citizen service registration & listing request workflow.
- Secure, authenticated Admin Panel with role-based access control, post authoring, and audit log.
- One-click source code package export (.ZIP).
`
  );

  return await zip.generateAsync({ type: 'blob' });
}

export function triggerDownload(blob: Blob, filename = 'jhalakathi-online-seba-source.zip') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
