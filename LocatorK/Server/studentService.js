/**
 * Student Service - CRUD operations for Students collection
 * 
 * Firestore Structure:
 * Students/{studentId}
 *   - name: string
 *   - parentMobile1: string
 *   - parentMobile2: string
 *   - vehicleId: string
 *   - schoolId: string
 *   - createdAt: timestamp
 */

import { db, COLLECTIONS, getTimestamp, docToObject, handleFirestoreError } from './firebase.js'

/**
 * Add a new student to Firestore
 * @param {Object} studentData - Student data object
 * @param {string} studentData.name - Student's name
 * @param {string} studentData.parentMobile1 - Primary parent's mobile number
 * @param {string} studentData.parentMobile2 - Secondary parent's mobile number (optional)
 * @param {string} studentData.vehicleId - ID of the assigned vehicle (optional)
 * @param {string} studentData.schoolId - ID of the school (optional)
 * @returns {Promise<string>} Document ID of the created student
 */
export const addStudent = async (studentData) => {
  try {
    if (!studentData.name || !studentData.parentMobile1) {
      throw new Error('Student name and primary parent mobile are required')
    }

    const studentDoc = {
      name: studentData.name.trim(),
      parentMobile1: studentData.parentMobile1.trim(),
      parentMobile2: studentData.parentMobile2?.trim() || '',
      vehicleId: studentData.vehicleId || '',
      schoolId: studentData.schoolId || '',
      createdAt: getTimestamp()
    }

    const docRef = await db.collection(COLLECTIONS.STUDENTS).add(studentDoc)
    return docRef.id
  } catch (error) {
    handleFirestoreError(error, 'addStudent')
    throw error
  }
}

/**
 * Get all students from Firestore
 * @returns {Promise<Array>} Array of student objects with id field
 */
export const getStudents = async () => {
  try {
    const studentsRef = db.collection(COLLECTIONS.STUDENTS)
    const querySnapshot = await studentsRef.orderBy('createdAt', 'desc').get()
    
    return querySnapshot.docs.map(doc => docToObject(doc))
  } catch (error) {
    handleFirestoreError(error, 'getStudents')
    throw error
  }
}

/**
 * Update an existing student in Firestore
 * @param {string} studentId - Document ID of the student
 * @param {Object} updatedData - Object containing fields to update
 * @returns {Promise<void>}
 */
export const updateStudent = async (studentId, updatedData) => {
  try {
    if (!studentId) {
      throw new Error('Student ID is required')
    }

    if (!updatedData || Object.keys(updatedData).length === 0) {
      throw new Error('Updated data is required')
    }

    // Prepare update object - only include valid fields
    const updateFields = {}
    const allowedFields = ['name', 'parentMobile1', 'parentMobile2', 'vehicleId', 'schoolId']
    
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

    const studentRef = db.collection(COLLECTIONS.STUDENTS).doc(studentId)
    await studentRef.update(updateFields)
  } catch (error) {
    handleFirestoreError(error, 'updateStudent')
    throw error
  }
}
