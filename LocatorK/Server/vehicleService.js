/**
 * Vehicle Service - CRUD operations for Vehicles collection
 * 
 * Firestore Structure:
 * Vehicles/{vehicleId}
 *   - vehicleNumber: string
 *   - schoolId: string
 *   - ownerName: string
 *   - driverId: string
 *   - driverMobile: string
 *   - createdAt: timestamp
 */

import { db, COLLECTIONS, getTimestamp, docToObject, handleFirestoreError } from './firebase.js'

/**
 * Add a new vehicle to Firestore
 * @param {Object} vehicleData - Vehicle data object
 * @param {string} vehicleData.vehicleNumber - Vehicle registration number
 * @param {string} vehicleData.schoolId - ID of the school
 * @param {string} vehicleData.ownerName - Owner's name
 * @param {string} vehicleData.driverId - ID of the driver (optional)
 * @param {string} vehicleData.driverMobile - Driver's mobile number
 * @returns {Promise<string>} Document ID of the created vehicle
 */
export const addVehicle = async (vehicleData) => {
  try {
    if (!vehicleData.vehicleNumber || !vehicleData.schoolId) {
      throw new Error('Vehicle number and school ID are required')
    }

    const vehicleDoc = {
      vehicleNumber: vehicleData.vehicleNumber.trim(),
      schoolId: vehicleData.schoolId,
      ownerName: vehicleData.ownerName?.trim() || '',
      driverId: vehicleData.driverId || '',
      driverMobile: vehicleData.driverMobile?.trim() || '',
      createdAt: getTimestamp()
    }

    const docRef = await db.collection(COLLECTIONS.VEHICLES).add(vehicleDoc)
    return docRef.id
  } catch (error) {
    handleFirestoreError(error, 'addVehicle')
    throw error
  }
}

/**
 * Get all vehicles from Firestore
 * @returns {Promise<Array>} Array of vehicle objects with id field
 */
export const getVehicles = async () => {
  try {
    const vehiclesRef = db.collection(COLLECTIONS.VEHICLES)
    const querySnapshot = await vehiclesRef.orderBy('createdAt', 'desc').get()
    
    return querySnapshot.docs.map(doc => docToObject(doc))
  } catch (error) {
    handleFirestoreError(error, 'getVehicles')
    throw error
  }
}

/**
 * Update an existing vehicle in Firestore
 * @param {string} vehicleId - Document ID of the vehicle
 * @param {Object} updatedData - Object containing fields to update
 * @returns {Promise<void>}
 */
export const updateVehicle = async (vehicleId, updatedData) => {
  try {
    if (!vehicleId) {
      throw new Error('Vehicle ID is required')
    }

    if (!updatedData || Object.keys(updatedData).length === 0) {
      throw new Error('Updated data is required')
    }

    // Prepare update object - only include valid fields
    const updateFields = {}
    const allowedFields = ['vehicleNumber', 'schoolId', 'ownerName', 'driverId', 'driverMobile']
    
    allowedFields.forEach(field => {
      if (updatedData[field] !== undefined) {
        if (typeof updatedData[field] === 'string') {
          updateFields[field] = updatedData[field].trim()
        } else {
          updateFields[field] = updatedData[field]
        }
      }
    })

    if (Object.keys(updateFields).length === 0) {
      throw new Error('No valid fields to update')
    }

    const vehicleRef = db.collection(COLLECTIONS.VEHICLES).doc(vehicleId)
    await vehicleRef.update(updateFields)
  } catch (error) {
    handleFirestoreError(error, 'updateVehicle')
    throw error
  }
}
