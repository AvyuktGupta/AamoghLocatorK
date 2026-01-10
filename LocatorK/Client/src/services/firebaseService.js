/**
 * Firebase Service - Client-side Firestore operations
 * 
 * This service provides CRUD operations for the frontend
 * connecting directly to Firebase Firestore.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'
import { db, COLLECTIONS } from '../config/firebase'

// ==================== Schools ====================

/**
 * Get all schools
 * @returns {Promise<Array>} Array of school objects with id
 */
export const getSchools = async () => {
  try {
    const schoolsRef = collection(db, COLLECTIONS.SCHOOLS)
    const q = query(schoolsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting schools:', error)
    throw error
  }
}

/**
 * Add a new school
 * @param {string} name - School name
 * @param {string} address - School address
 * @returns {Promise<string>} Document ID
 */
export const addSchool = async (name, address) => {
  try {
    const schoolsRef = collection(db, COLLECTIONS.SCHOOLS)
    const docRef = await addDoc(schoolsRef, {
      name: name.trim(),
      address: address.trim() || 'Address not provided',
      createdAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding school:', error)
    throw error
  }
}

/**
 * Update a school
 * @param {string} schoolId - Document ID
 * @param {Object} updatedData - Fields to update
 * @returns {Promise<void>}
 */
export const updateSchool = async (schoolId, updatedData) => {
  try {
    const schoolRef = doc(db, COLLECTIONS.SCHOOLS, schoolId)
    const updateFields = {}
    if (updatedData.name !== undefined) updateFields.name = updatedData.name.trim()
    if (updatedData.address !== undefined) updateFields.address = updatedData.address.trim()
    
    await updateDoc(schoolRef, updateFields)
  } catch (error) {
    console.error('Error updating school:', error)
    throw error
  }
}

/**
 * Delete a school
 * @param {string} schoolId - Document ID
 * @returns {Promise<void>}
 */
export const deleteSchool = async (schoolId) => {
  try {
    const schoolRef = doc(db, COLLECTIONS.SCHOOLS, schoolId)
    await deleteDoc(schoolRef)
  } catch (error) {
    console.error('Error deleting school:', error)
    throw error
  }
}

/**
 * Listen to schools changes in real-time
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const subscribeToSchools = (callback) => {
  const schoolsRef = collection(db, COLLECTIONS.SCHOOLS)
  const q = query(schoolsRef, orderBy('createdAt', 'desc'))
  
  return onSnapshot(q, (querySnapshot) => {
    const schools = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(schools)
  }, (error) => {
    console.error('Error listening to schools:', error)
    callback([])
  })
}

// ==================== Vehicles ====================

/**
 * Get all vehicles
 * @returns {Promise<Array>} Array of vehicle objects with id
 */
export const getVehicles = async () => {
  try {
    const vehiclesRef = collection(db, COLLECTIONS.VEHICLES)
    const q = query(vehiclesRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting vehicles:', error)
    throw error
  }
}

/**
 * Get school by ID (helper function)
 * @param {string} schoolId - School document ID
 * @returns {Promise<Object|null>} School object or null
 */
const getSchoolById = async (schoolId) => {
  try {
    if (!schoolId) return null
    const schoolRef = doc(db, COLLECTIONS.SCHOOLS, schoolId)
    const schoolSnap = await getDoc(schoolRef)
    if (schoolSnap.exists()) {
      return { id: schoolSnap.id, ...schoolSnap.data() }
    }
    return null
  } catch (error) {
    console.error('Error getting school:', error)
    return null
  }
}

/**
 * Get vehicles with school names populated
 * @returns {Promise<Array>} Array of vehicle objects with schoolName
 */
export const getVehiclesWithSchoolNames = async () => {
  try {
    const vehicles = await getVehicles()
    const vehiclesWithSchools = await Promise.all(
      vehicles.map(async (vehicle) => {
        const school = vehicle.schoolId ? await getSchoolById(vehicle.schoolId) : null
        return {
          ...vehicle,
          schoolName: school?.name || '',
          // Map driverId to driverName if needed (for now using driverMobile)
          driverName: vehicle.driverName || '',
          driverMobile: vehicle.driverMobile || ''
        }
      })
    )
    return vehiclesWithSchools
  } catch (error) {
    console.error('Error getting vehicles with school names:', error)
    throw error
  }
}

/**
 * Get school ID by name (helper function)
 * @param {string} schoolName - School name
 * @returns {Promise<string|null>} School ID or null
 */
const getSchoolIdByName = async (schoolName) => {
  try {
    const schools = await getSchools()
    const school = schools.find(s => s.name === schoolName)
    return school?.id || null
  } catch (error) {
    console.error('Error getting school ID:', error)
    return null
  }
}

/**
 * Add a new vehicle
 * @param {Object} vehicleData - Vehicle data
 * @returns {Promise<string>} Document ID
 */
export const addVehicle = async (vehicleData) => {
  try {
    const schoolId = await getSchoolIdByName(vehicleData.schoolName)
    if (!schoolId) {
      throw new Error('School not found')
    }

    const vehiclesRef = collection(db, COLLECTIONS.VEHICLES)
    const docRef = await addDoc(vehiclesRef, {
      vehicleNumber: vehicleData.vehicleNumber.trim(),
      schoolId: schoolId,
      ownerName: vehicleData.ownerName?.trim() || '',
      driverName: vehicleData.driverName?.trim() || '',
      driverMobile: vehicleData.driverMobile?.trim() || '',
      driverId: vehicleData.driverId || '',
      createdAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding vehicle:', error)
    throw error
  }
}

/**
 * Update a vehicle
 * @param {string} vehicleId - Document ID
 * @param {Object} updatedData - Fields to update
 * @returns {Promise<void>}
 */
export const updateVehicle = async (vehicleId, updatedData) => {
  try {
    const vehicleRef = doc(db, COLLECTIONS.VEHICLES, vehicleId)
    const updateFields = {}
    
    // Handle schoolName -> schoolId conversion
    if (updatedData.schoolName !== undefined) {
      const schoolId = await getSchoolIdByName(updatedData.schoolName)
      if (schoolId) {
        updateFields.schoolId = schoolId
      }
    }
    
    // Handle other fields
    const allowedFields = ['vehicleNumber', 'ownerName', 'driverName', 'driverMobile', 'driverId']
    allowedFields.forEach(field => {
      if (updatedData[field] !== undefined) {
        updateFields[field] = typeof updatedData[field] === 'string' 
          ? updatedData[field].trim() 
          : updatedData[field]
      }
    })
    
    await updateDoc(vehicleRef, updateFields)
  } catch (error) {
    console.error('Error updating vehicle:', error)
    throw error
  }
}

/**
 * Delete a vehicle
 * @param {string} vehicleId - Document ID
 * @returns {Promise<void>}
 */
export const deleteVehicle = async (vehicleId) => {
  try {
    const vehicleRef = doc(db, COLLECTIONS.VEHICLES, vehicleId)
    await deleteDoc(vehicleRef)
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    throw error
  }
}

/**
 * Listen to vehicles changes in real-time
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const subscribeToVehicles = (callback) => {
  const vehiclesRef = collection(db, COLLECTIONS.VEHICLES)
  const q = query(vehiclesRef, orderBy('createdAt', 'desc'))
  
  return onSnapshot(q, async (querySnapshot) => {
    const vehicles = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // Populate school names
    const vehiclesWithSchools = await Promise.all(
      vehicles.map(async (vehicle) => {
        const school = vehicle.schoolId ? await getSchoolById(vehicle.schoolId) : null
        return {
          ...vehicle,
          schoolName: school?.name || '',
          driverName: vehicle.driverName || '',
          driverMobile: vehicle.driverMobile || ''
        }
      })
    )
    
    callback(vehiclesWithSchools)
  }, (error) => {
    console.error('Error listening to vehicles:', error)
    callback([])
  })
}

// ==================== Students/Parents ====================

/**
 * Get all students
 * @returns {Promise<Array>} Array of student objects with id
 */
export const getStudents = async () => {
  try {
    const studentsRef = collection(db, COLLECTIONS.STUDENTS)
    const q = query(studentsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting students:', error)
    throw error
  }
}

/**
 * Get students with school and vehicle names populated
 * @returns {Promise<Array>} Array of student objects with school and vehicle names
 */
export const getStudentsWithDetails = async () => {
  try {
    const students = await getStudents()
    const schools = await getSchools()
    const vehicles = await getVehicles()
    
    return students.map(student => {
      const school = schools.find(s => s.id === student.schoolId)
      const vehicle = vehicles.find(v => v.id === student.vehicleId)
      
      return {
        ...student,
        school: school?.name || '',
        vehicleNumber: vehicle?.vehicleNumber || '',
        mobileNumber: student.parentMobile1 || '',
        parentName: student.parentName || ''
      }
    })
  } catch (error) {
    console.error('Error getting students with details:', error)
    throw error
  }
}

/**
 * Get vehicle ID by number (helper function)
 * @param {string} vehicleNumber - Vehicle number
 * @returns {Promise<string|null>} Vehicle ID or null
 */
const getVehicleIdByNumber = async (vehicleNumber) => {
  try {
    const vehicles = await getVehicles()
    const vehicle = vehicles.find(v => v.vehicleNumber === vehicleNumber)
    return vehicle?.id || null
  } catch (error) {
    console.error('Error getting vehicle ID:', error)
    return null
  }
}

/**
 * Add a new student/parent
 * @param {Object} studentData - Student data
 * @returns {Promise<string>} Document ID
 */
export const addStudent = async (studentData) => {
  try {
    const schoolId = await getSchoolIdByName(studentData.school)
    const vehicleId = await getVehicleIdByNumber(studentData.vehicleNumber)
    
    const studentsRef = collection(db, COLLECTIONS.STUDENTS)
    const docRef = await addDoc(studentsRef, {
      name: studentData.name.trim(),
      parentName: studentData.parentName?.trim() || '',
      parentMobile1: studentData.mobileNumber.trim(),
      parentMobile2: '',
      schoolId: schoolId || '',
      vehicleId: vehicleId || '',
      createdAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding student:', error)
    throw error
  }
}

/**
 * Update a student
 * @param {string} studentId - Document ID
 * @param {Object} updatedData - Fields to update
 * @returns {Promise<void>}
 */
export const updateStudent = async (studentId, updatedData) => {
  try {
    const studentRef = doc(db, COLLECTIONS.STUDENTS, studentId)
    const updateFields = {}
    
    // Handle school name -> schoolId conversion
    if (updatedData.school !== undefined) {
      const schoolId = await getSchoolIdByName(updatedData.school)
      if (schoolId) {
        updateFields.schoolId = schoolId
      }
    }
    
    // Handle vehicle number -> vehicleId conversion
    if (updatedData.vehicleNumber !== undefined) {
      const vehicleId = await getVehicleIdByNumber(updatedData.vehicleNumber)
      if (vehicleId) {
        updateFields.vehicleId = vehicleId
      }
    }
    
    // Handle other fields
    if (updatedData.name !== undefined) {
      updateFields.name = updatedData.name.trim()
    }
    if (updatedData.parentName !== undefined) {
      updateFields.parentName = updatedData.parentName.trim()
    }
    if (updatedData.mobileNumber !== undefined) {
      updateFields.parentMobile1 = updatedData.mobileNumber.trim()
    }
    
    await updateDoc(studentRef, updateFields)
  } catch (error) {
    console.error('Error updating student:', error)
    throw error
  }
}

/**
 * Delete a student
 * @param {string} studentId - Document ID
 * @returns {Promise<void>}
 */
export const deleteStudent = async (studentId) => {
  try {
    const studentRef = doc(db, COLLECTIONS.STUDENTS, studentId)
    await deleteDoc(studentRef)
  } catch (error) {
    console.error('Error deleting student:', error)
    throw error
  }
}

/**
 * Listen to students changes in real-time
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const subscribeToStudents = (callback) => {
  const studentsRef = collection(db, COLLECTIONS.STUDENTS)
  const q = query(studentsRef, orderBy('createdAt', 'desc'))
  
  return onSnapshot(q, async (querySnapshot) => {
    const students = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // Populate school and vehicle names
    const schools = await getSchools()
    const vehicles = await getVehicles()
    
    const studentsWithDetails = students.map(student => {
      const school = schools.find(s => s.id === student.schoolId)
      const vehicle = vehicles.find(v => v.id === student.vehicleId)
      
      return {
        ...student,
        school: school?.name || '',
        vehicleNumber: vehicle?.vehicleNumber || '',
        mobileNumber: student.parentMobile1 || '',
        parentName: student.parentName || ''
      }
    })
    
    callback(studentsWithDetails)
  }, (error) => {
    console.error('Error listening to students:', error)
    callback([])
  })
}

// ==================== Live Locations ====================

/**
 * Listen to live location updates for a vehicle
 * @param {string} vehicleId - Vehicle document ID
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const subscribeToLiveLocation = (vehicleId, callback) => {
  if (!vehicleId) {
    console.error('Vehicle ID is required')
    return () => {}
  }

  const locationRef = doc(db, COLLECTIONS.LIVE_LOCATIONS, vehicleId)
  
  return onSnapshot(locationRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      callback({
        id: docSnapshot.id,
        ...docSnapshot.data()
      })
    } else {
      callback(null)
    }
  }, (error) => {
    console.error('Error listening to live location:', error)
    callback(null)
  })
}

/**
 * Get current live location for a vehicle
 * @param {string} vehicleId - Vehicle document ID
 * @returns {Promise<Object|null>} Location data or null
 */
export const getLiveLocation = async (vehicleId) => {
  try {
    if (!vehicleId) return null
    
    const locationRef = doc(db, COLLECTIONS.LIVE_LOCATIONS, vehicleId)
    const locationSnap = await getDoc(locationRef)
    
    if (locationSnap.exists()) {
      return {
        id: locationSnap.id,
        ...locationSnap.data()
      }
    }
    return null
  } catch (error) {
    console.error('Error getting live location:', error)
    return null
  }
}

