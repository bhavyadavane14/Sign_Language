import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User as FirebaseUser
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc } from "firebase/firestore";

// Firebase Configuration for SignX Web Project
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA_lHVGr_3_nVaQMkWQ2zPBepxLRZ6-bdU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "signx-web.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "signx-web",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "signx-web.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "533878460479",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:533878460479:web:c34cc0eb31b72016cc688a",
};

// Initialize Firebase App instance safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Auth provider prompts
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type FirebaseUser
};

export const isFirebaseConfigured = () => {
  return true; // Live keys are configured for signx-web
};

// User Profile Database Helpers (Cloud Firestore) - Non-blocking with timeout
export async function saveUserProfile(
  user: { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null }, 
  extraData?: Record<string, any>
) {
  try {
    const userRef = doc(db, "users", user.uid);
    // Timeout Firestore sync after 1200ms so it NEVER blocks user authentication flow
    const syncPromise = setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      name: user.displayName || user.email?.split("@")[0] || "SignX User",
      photoURL: user.photoURL,
      lastLogin: new Date().toISOString(),
      ...extraData,
    }, { merge: true });

    await Promise.race([
      syncPromise,
      new Promise((resolve) => setTimeout(resolve, 1200))
    ]);
  } catch (error) {
    console.warn("Firestore user sync notice:", error);
  }
}

export async function saveTranslationToFirestore(userId: string, data: { sign: string; translation: string; confidence: number }) {
  try {
    const historyCol = collection(db, "users", userId, "translations");
    const syncPromise = addDoc(historyCol, {
      ...data,
      timestamp: new Date().toISOString(),
    });
    await Promise.race([
      syncPromise,
      new Promise((resolve) => setTimeout(resolve, 1200))
    ]);
  } catch (error) {
    console.warn("Firestore translation sync notice:", error);
  }
}
