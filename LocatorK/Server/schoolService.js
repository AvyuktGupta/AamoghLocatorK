/**
 * School Service - CRUD operations for Schools collection
 * 
 * Firestore Structure:
 * Schools/{schoolId}
 *   - name: string
 *   - address: string
 *   - createdAt: timestamp
 */

import { db, COLLECTIONS, getTimestamp, docToObject, handleFirestoreError } from './firebase.js'

/**
 * Add a new school to Firestore
 * @param {string} name - School name
 * @param {string} address - School address
 * @returns {Promise<string>} Document ID of the created school
 */
export const addSchool = async (name, address) => {
  try {
    if (!name || !address) {
      throw new Error('Name and address are required')
    }

    const schoolData = {
      name: name.trim(),
      address: address.trim(),
      createdAt: getTimestamp()
    }

    const docRef = await db.collection(COLLECTIONS.SCHOOLS).add(schoolData)
    return docRef.id
  } catch (error) {
    handleFirestoreError(error, 'addSchool')
    throw error
  }
}

/**
 * Get all schools from Firestore
 * @returns {Promise<Array>} Array of school objects with id field
 */
export const getSchools = async () => {
  try {
    const schoolsRef = db.collection(COLLECTIONS.SCHOOLS)
    const querySnapshot = await schoolsRef.orderBy('createdAt', 'desc').get()
    
    return querySnapshot.docs.map(doc => docToObject(doc))
  } catch (error) {
    handleFirestoreError(error, 'getSchools')
    throw error
  }
}

/**
 * Update an existing school in Firestore
 * @param {string} schoolId - Document ID of the school
 * @param {Object} updatedData - Object containing fields to update (name, address)
 * @returns {Promise<void>}
 */
export const updateSchool = async (schoolId, updatedData) => {
  try {
    if (!schoolId) {
      throw new Error('School ID is required')
    }

    if (!updatedData || Object.keys(updatedData).length === 0) {
      throw new Error('Updated data is required')
    }

    // Prepare update object - only include valid fields
    const updateFields = {}
    if (updatedData.name !== undefined) {
      updateFields.name = updatedData.name.trim()
    }
    if (updatedData.address !== undefined) {
      updateFields.address = updatedData.address.trim()
    }

    if (Object.keys(updateFields).length === 0) {
      throw new Error('No valid fields to update')
    }

    const schoolRef = db.collection(COLLECTIONS.SCHOOLS).doc(schoolId)
    await schoolRef.update(updateFields)
  } catch (error) {
    handleFirestoreError(error, 'updateSchool')
    throw error
  }
}
