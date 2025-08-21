import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence for React Native
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

// Initialize Firestore
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // For better React Native support
});

export { auth, db };
export default app;
