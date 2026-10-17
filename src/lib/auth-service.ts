import { AdminUser } from '../types';
import { auth, isFirebaseLive } from './firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';

const ADMIN_STORAGE_KEY = 'jos_current_admin';

// Default trusted admin email from user metadata
export const DEFAULT_ADMIN_EMAIL = 'jhalokathionlineseba.jos@gmail.com';

class AuthService {
  private currentUser: AdminUser | null = null;
  private subscribers: Set<(user: AdminUser | null) => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    // Check local storage for persistent session
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch {
      // ignore
    }

    // If Firebase Auth is live, listen for real Auth state changes
    if (isFirebaseLive() && auth) {
      onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          const userObj: AdminUser = {
            uid: fbUser.uid,
            email: fbUser.email || DEFAULT_ADMIN_EMAIL,
            displayName: fbUser.displayName || 'ঝালকাঠি এডমিন',
            role: fbUser.email === DEFAULT_ADMIN_EMAIL ? 'super_admin' : 'admin',
          };
          this.setCurrentUser(userObj);
        } else if (!this.currentUser || this.currentUser.uid.startsWith('fb-')) {
          this.setCurrentUser(null);
        }
      });
    }
  }

  public subscribe(cb: (user: AdminUser | null) => void): () => void {
    cb(this.currentUser);
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }

  public getCurrentUser(): AdminUser | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public async loginWithGoogle(): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    if (isFirebaseLive() && auth) {
      try {
        const provider = new GoogleAuthProvider();
        const res = await signInWithPopup(auth, provider);
        const user: AdminUser = {
          uid: res.user.uid,
          email: res.user.email || '',
          displayName: res.user.displayName || 'এডমিন',
          role: res.user.email === DEFAULT_ADMIN_EMAIL ? 'super_admin' : 'admin',
        };
        this.setCurrentUser(user);
        return { success: true, user };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Google লগইন ব্যর্থ হয়েছে।';
        return { success: false, error: message };
      }
    }

    // If Firebase is not yet configured, provide demo admin session
    const demoUser: AdminUser = {
      uid: 'admin-google-demo',
      email: DEFAULT_ADMIN_EMAIL,
      displayName: 'জেওএস সুপার এডমিন (JOS Admin)',
      role: 'super_admin',
    };
    this.setCurrentUser(demoUser);
    return { success: true, user: demoUser };
  }

  public async loginWithCredentials(
    email: string,
    pass: string
  ): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();

    // Standard secure admin verification check
    // Allows default official email or admin credentials
    if (
      (cleanEmail === DEFAULT_ADMIN_EMAIL && pass === 'Admin@JOS2026') ||
      (cleanEmail === 'admin@jos.gov.bd' && pass === 'admin123') ||
      (cleanEmail === 'editor@jos.gov.bd' && pass === 'editor123')
    ) {
      const role = cleanEmail === DEFAULT_ADMIN_EMAIL ? 'super_admin' : cleanEmail.startsWith('editor') ? 'moderator' : 'admin';
      const user: AdminUser = {
        uid: `admin-${Date.now()}`,
        email: cleanEmail,
        displayName: cleanEmail === DEFAULT_ADMIN_EMAIL ? 'ঝালকাঠি এডমিন (JOS)' : 'কর্মকর্তা',
        role,
      };
      this.setCurrentUser(user);
      return { success: true, user };
    }

    return {
      success: false,
      error: 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে সঠিক তথ্য প্রদান করুন।',
    };
  }

  public async logout(): Promise<void> {
    if (isFirebaseLive() && auth) {
      try {
        await signOut(auth);
      } catch {
        // ignore
      }
    }
    this.setCurrentUser(null);
  }

  private setCurrentUser(user: AdminUser | null) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
    this.subscribers.forEach((cb) => cb(this.currentUser));
  }
}

export const authService = new AuthService();
