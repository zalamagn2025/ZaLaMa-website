// Import des fonctions nécessaires de Firebase
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
//import { getAnalytics } from "firebase/analytics";

// Configuration Firebase
/* const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};
 */
const firebaseConfig = {
  apiKey: "AIzaSyC7ti7IaRRfdMjW9i_Bd6f5N4GR0JHaCzY",
  authDomain: "authentication-app-8eccd.firebaseapp.com",
  projectId: "authentication-app-8eccd",
  storageBucket: "authentication-app-8eccd.firebasestorage.app",
  messagingSenderId: "1012814558943",
  appId: "1:1012814558943:web:04a37e53e6852ccf471b6a",
  measurementId: "G-R2MS2CS7TF"
};

// Initialiser Firebase seulement s'il n'est pas déjà initialisé
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Exportation des services Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 