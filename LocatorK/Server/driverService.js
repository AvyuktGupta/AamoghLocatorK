/**
 * Driver Service - CRUD operations for Drivers collection
 * 
 * Firestore Structure:
 * Drivers/{driverId}
 *   - name: string
 *   - mobile: string
 *   - vehicleId: string
 *   - schoolId: string
 *   - createdAt: timestamp
 */

import { db, COLLECTIONS, getTimestamp, docToObject, handleFirestoreError } from './firebase.js'

/**
 * Add a new driver to Firestore
 * @param {Object} driverData - Driver data object
 * @param {string} driverData.name - Driver's name
 * @param {string} driverData.mobile - Driver's mobile number
 * @param {string} driverData.vehicleId - ID of the assigned vehicle (optional)
 * @param {string} driverData.schoolId - ID of the school (optional)
 * @returns {Promise<string>} Document ID of the created driver
 */
export const addDriver = async (driverData) => {
  try {
    if (!driverData.name || !driverData.mobile) {
      throw new Error('Driver name and mobile are required')
    }

    const driverDoc = {
      name: driverData.name.trim(),
      mobile: driverData.mobile.trim(),
      vehicleId: driverData.vehicleId || '',
      schoolId: driverData.schoolId || '',
      createdAt: getTimestamp()
    }

    const docRef = await db.collection(COLLECTIONS.DRIVERS).add(driverDoc)
    return docRef.id
  } catch (error) {
    handleFirestoreError(error, 'addDriver')
    throw error
  }
}

/**
 * Get all drivers from Firestore
 * @returns {Promise<Array>} Array of driver objects with id field
 */
export const getDrivers = async () => {
  try {
    const driversRef = db.collection(COLLECTIONS.DRIVERS)
    const querySnapshot = await driversRef.orderBy('createdAt', 'desc').get()
    
    return querySnapshot.docs.map(doc => docToObject(doc))
  } catch (error) {
    handleFirestoreError(error, 'getDrivers')
    throw error
  }
}

/**
 * Update an existing driver in Firestore
 * @param {string} driverId - Document ID of the driver
 * @param {Object} updatedData - Object containing fields to update
 * @returns {Promise<void>}
 */
export const updateDriver = async (driverId, updatedData) => {
  try {
    if (!driverId) {
      throw new Error('Driver ID is required')
    }

    if (!updatedData || Object.keys(updatedData).length === 0) {
      throw new Error('Updated data is required')
    }

    // Prepare update object - only include valid fields
    const updateFields = {}
    const allowedFields = ['name', 'mobile', 'vehicleId', 'schoolId']
    
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

    const driverRef = db.collection(COLLECTIONS.DRIVERS).doc(driverId)
    await driverRef.update(updateFields)
  } catch (error) {
    handleFirestoreError(error, 'updateDriver')
    throw error
  }
}
