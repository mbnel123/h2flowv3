// src/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8v4eIC6mtQWh8cn_l3R2Tg7uCXjwsfik",
  authDomain: "h2-flow.firebaseapp.com",
  projectId: "h2-flow",
  storageBucket: "h2-flow.firebasestorage.app",
  messagingSenderId: "822614712443",
  appId: "1:822614712443:web:5dd741ea0afec19a09c2de",
  measurementId: "G-E61BHHQ29Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;