/**
 * Live Location Service - Real-time location tracking
 * 
 * Firestore Structure:
 * LiveLocations/{vehicleId}  (document ID is vehicleId, not auto-generated)
 *   - lat: number
 *   - lng: number
 *   - speed: number
 *   - updatedAt: timestamp
 */

import { db, COLLECTIONS, getTimestamp, docToObject, handleFirestoreError } from './firebase.js'

/**
 * Update live location for a vehicle
 * @param {string} vehicleId - Document ID (vehicleId) in LiveLocations collection
 * @param {Object} locationData - Location data object
 * @param {number} locationData.lat - Latitude
 * @param {number} locationData.lng - Longitude
 * @param {number} locationData.speed - Speed (optional)
 * @returns {Promise<void>}
 */
export const updateLiveLocation = async (vehicleId, locationData) => {
  try {
    if (!vehicleId) {
      throw new Error('Vehicle ID is required')
    }

    if (locationData.lat === undefined || locationData.lng === undefined) {
      throw new Error('Latitude and longitude are required')
    }

    const locationDoc = {
      lat: Number(locationData.lat),
      lng: Number(locationData.lng),
      speed: locationData.speed !== undefined ? Number(locationData.speed) : 0,
      updatedAt: getTimestamp()
    }

    const locationRef = db.collection(COLLECTIONS.LIVE_LOCATIONS).doc(vehicleId)
    await locationRef.set(locationDoc, { merge: true })
  } catch (error) {
    handleFirestoreError(error, 'updateLiveLocation')
    throw error
  }
}

/**
 * Listen to real-time location updates for a vehicle
 * 
 * This function sets up a Firestore listener that will call the callback
 * whenever the location document changes.
 * 
 * @param {string} vehicleId - Document ID (vehicleId) in LiveLocations collection
 * @param {Function} callback - Callback function that receives location data
 *   Callback signature: (locationData) => void
 *   locationData format: { id: vehicleId, lat: number, lng: number, speed: number, updatedAt: Timestamp } | null
 * @returns {Function} Unsubscribe function to stop listening
 * 
 * @example
 * const unsubscribe = listenToLiveLocation('vehicle123', (location) => {
 *   if (location) {
 *     console.log('Location updated:', location.lat, location.lng)
 *   }
 * })
 * 
 * // Later, to stop listening:
 * unsubscribe()
 */
export const listenToLiveLocation = (vehicleId, callback) => {
  try {
    if (!vehicleId) {
      throw new Error('Vehicle ID is required')
    }

    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function')
    }

    const locationRef = db.collection(COLLECTIONS.LIVE_LOCATIONS).doc(vehicleId)

    // Set up real-time listener using Firestore Admin SDK
    const unsubscribe = locationRef.onSnapshot(
      (docSnapshot) => {
        const locationData = docToObject(docSnapshot)
        callback(locationData)
      },
      (error) => {
        console.error(`Error listening to location for vehicle ${vehicleId}:`, error)
        // Call callback with null to indicate error/no data
        callback(null)
      }
    )

    return unsubscribe
  } catch (error) {
    handleFirestoreError(error, 'listenToLiveLocation')
    throw error
  }
}
