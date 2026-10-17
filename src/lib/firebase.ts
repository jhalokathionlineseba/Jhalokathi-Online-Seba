import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  doc,
  getDocFromServer,
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

export interface FirebaseClientConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  firestoreDatabaseId?: string;
}

// Retrieve config from Vite environment variables or localStorage (set by admin)
export function getStoredFirebaseConfig(): FirebaseClientConfig | null {
  try {
    const custom = localStorage.getItem('jos_custom_firebase_config');
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed.projectId && parsed.apiKey) {
        return parsed;
      }
    }
  } catch {
    // ignore json error
  }

  // Check Vite environment variables
  const envConfig: FirebaseClientConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || '(default)',
  };

  if (envConfig.projectId && envConfig.apiKey && envConfig.apiKey !== 'MY_FIREBASE_API_KEY') {
    return envConfig;
  }

  return null;
}

let appInstance: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;

const initialConfig = getStoredFirebaseConfig();

if (initialConfig && initialConfig.apiKey && initialConfig.projectId) {
  try {
    appInstance = !getApps().length ? initializeApp(initialConfig) : getApp();
    dbInstance = getFirestore(appInstance, initialConfig.firestoreDatabaseId || '(default)');
    authInstance = getAuth(appInstance);
  } catch (err) {
    console.warn('Firebase initialization notice:', err);
  }
}

export const app = appInstance;
export const db = dbInstance;
export const auth = authInstance;

export function isFirebaseLive(): boolean {
  return dbInstance !== null && authInstance !== null;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentAuth = authInstance;
  const currentUser = currentAuth?.currentUser;

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email,
      })) || [],
    },
    operationType,
    path,
  };

  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test live Firestore server connectivity per skill
export async function testFirestoreConnection(): Promise<{ connected: boolean; message: string }> {
  if (!dbInstance) {
    return {
      connected: false,
      message: 'Firebase কনফিগারেশন আন-কনফিগার্ড (Unconfigured)। স্থানীয় ডেমো মোডে চলছে।',
    };
  }

  try {
    await getDocFromServer(doc(dbInstance, 'test', 'connection'));
    return { connected: true, message: 'ফায়ারবেস ক্লাউড ফায়ারস্টোর সফলভাবে সংযুক্ত।' };
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      return { connected: false, message: 'ক্লায়েন্ট অফলাইন। নেটওয়ার্ক বা ফায়ারবেস কনফিগারেশন যাচাই করুন।' };
    }
    // Permissions error or missing doc still means server is reachable
    return { connected: true, message: 'ফায়ারবেস সার্ভার সাড়া দিয়েছে।' };
  }
}
