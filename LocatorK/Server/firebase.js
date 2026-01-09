/**
 * Firebase Admin SDK Initialization
 * 
 * This module initializes Firebase Admin SDK and exports Firestore instance.
 * This file must NEVER be imported by client code.
 * 
 * Environment Variables Required:
 * - FIREBASE_PROJECT_ID
 * - GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON file)
 * 
 * OR use service account credentials directly:
 * - FIREBASE_CLIENT_EMAIL
 * - FIREBASE_PRIVATE_KEY
 * - FIREBASE_PROJECT_ID
 */

import admin from 'firebase-admin'

// Initialize Firebase Admin SDK
// Option 1: Use service account file (recommended for production)
// Set GOOGLE_APPLICATION_CREDENTIALS environment variable to path of service account JSON
if (!admin.apps.length) {
  try {
    // Try to initialize with service account file first
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault()
      })
    } 
    // Option 2: Use environment variables for credentials
    else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
      })
    }
    // Option 3: Initialize with default credentials (for local development with gcloud)
    else {
      admin.initializeApp()
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error)
    throw new Error('Failed to initialize Firebase Admin SDK')
  }
}

// Get Firestore instance
const db = admin.firestore()

/**
 * Collection names - centralized to avoid magic strings
 */
export const COLLECTIONS = {
  SCHOOLS: 'Schools',
  VEHICLES: 'Vehicles',
  DRIVERS: 'Drivers',
  STUDENTS: 'Students',
  LIVE_LOCATIONS: 'LiveLocations'
}

/**
 * Helper function to get current timestamp
 * @returns {FirebaseFirestore.Timestamp} Firestore timestamp
 */
export const getTimestamp = () => admin.firestore.Timestamp.now()

/**
 * Helper function to convert Firestore document to plain object with id
 * @param {FirebaseFirestore.DocumentSnapshot} doc - Firestore document snapshot
 * @returns {Object} Plain object with id field
 */
export const docToObject = (doc) => {
  if (!doc.exists) {
    return null
  }
  return {
    id: doc.id,
    ...doc.data()
  }
}

/**
 * Helper function to handle Firestore errors
 * @param {Error} error - Error object
 * @param {string} operation - Operation name for logging
 * @throws {Error} Re-throws error with context
 */
export const handleFirestoreError = (error, operation) => {
  console.error(`Firestore ${operation} error:`, error)
  throw new Error(`${operation} failed: ${error.message}`)
}

// Export Firestore instance
export { db }
export default db

