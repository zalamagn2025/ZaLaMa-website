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
  apiKey: "AIzaSyBSnHZeHH0DMRxe8_ldsS9Mh1gwNp0fa-k",
  authDomain: "zalamagn-1f057.firebaseapp.com",
  projectId: "zalamagn-1f057",
  storageBucket: "zalamagn-1f057.firebasestorage.app",
  messagingSenderId: "753763623478",
  appId: "1:753763623478:web:a11f093c649593b2d02e97"
};
// Initialiser Firebase seulement s'il n'est pas déjà initialisé
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Exportation des services Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 