// src/firebase/config.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, initializeFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8v4eIC6mtQWh8cn_l3R2Tg7uCXjwsfik",
  authDomain: "h2-flow.firebaseapp.com",
  projectId: "h2-flow",
  storageBucket: "h2-flow.firebasestorage.app",
  messagingSenderId: "822614712443",
  appId: "1:822614712443:web:5dd741ea0afec19a09c2de",
  measurementId: "G-E61BHHQ29Y"
};

// Initialize Firebase App (prevent multiple initialization)
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Auth with proper React Native support
let auth;
try {
  if (Platform.OS === 'web') {
    auth = getAuth(app);
  } else {
    // For React Native, always use initializeAuth with persistence
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
} catch (error) {
  // If auth is already initialized, get the existing instance
  auth = getAuth(app);
}

// Initialize Firestore with React Native optimizations
let db;
try {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true, // Better for React Native
  });
} catch (error) {
  // If already initialized, get existing instance
  db = getFirestore(app);
}

// Debug logging
console.log('🔥 Firebase initialized:', {
  platform: Platform.OS,
  authInitialized: !!auth,
  firestoreInitialized: !!db,
  appName: app.name
});

export { auth, db };
export default app;
