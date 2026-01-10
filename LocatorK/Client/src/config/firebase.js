/**
 * Firebase Client SDK Configuration
 * 
 * This file initializes Firebase for client-side use.
 * You need to provide your Firebase config object.
 * 
 * Get your config from Firebase Console:
 * Project Settings > General > Your apps > Web app
 */

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// TODO: Replace with your Firebase configuration
// Get this from Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

// Collection names - must match server-side
export const COLLECTIONS = {
  SCHOOLS: 'Schools',
  VEHICLES: 'Vehicles',
  DRIVERS: 'Drivers',
  STUDENTS: 'Students',
  LIVE_LOCATIONS: 'LiveLocations'
}

export default app

