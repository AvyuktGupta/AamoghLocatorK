import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  getSchools,
  addSchool as addSchoolToFirebase,
  updateSchool as updateSchoolInFirebase,
  deleteSchool as deleteSchoolFromFirebase,
  subscribeToSchools,
  getVehiclesWithSchoolNames,
  addVehicle as addVehicleToFirebase,
  updateVehicle as updateVehicleInFirebase,
  deleteVehicle as deleteVehicleFromFirebase,
  subscribeToVehicles,
  getStudentsWithDetails,
  addStudent as addStudentToFirebase,
  updateStudent as updateStudentInFirebase,
  deleteStudent as deleteStudentFromFirebase,
  subscribeToStudents
} from '../services/firebaseService'

const AppContext = createContext()

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [schools, setSchools] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [parents, setParents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load initial data and set up real-time listeners
  useEffect(() => {
    let unsubscribeSchools = null
    let unsubscribeVehicles = null
    let unsubscribeStudents = null

    const initializeData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load initial data
        const [schoolsData, vehiclesData, studentsData] = await Promise.all([
          getSchools(),
          getVehiclesWithSchoolNames(),
          getStudentsWithDetails()
        ])

        setSchools(schoolsData)
        setVehicles(vehiclesData)
        setParents(studentsData)

        // Set up real-time listeners
        unsubscribeSchools = subscribeToSchools((updatedSchools) => {
          setSchools(updatedSchools)
        })

        unsubscribeVehicles = subscribeToVehicles((updatedVehicles) => {
          setVehicles(updatedVehicles)
        })

        unsubscribeStudents = subscribeToStudents((updatedStudents) => {
          setParents(updatedStudents)
        })

        setLoading(false)
      } catch (err) {
        console.error('Error initializing data:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    initializeData()

    // Cleanup listeners on unmount
    return () => {
      if (unsubscribeSchools) unsubscribeSchools()
      if (unsubscribeVehicles) unsubscribeVehicles()
      if (unsubscribeStudents) unsubscribeStudents()
    }
  }, [])

  // School operations
  const handleAddSchool = async (name, address) => {
    try {
      await addSchoolToFirebase(name, address)
      // Real-time listener will update the state
    } catch (err) {
      console.error('Error adding school:', err)
      throw err
    }
  }

  const handleUpdateSchool = async (schoolId, updatedData) => {
    try {
      await updateSchoolInFirebase(schoolId, updatedData)
      // Real-time listener will update the state
    } catch (err) {
      console.error('Error updating school:', err)
      throw err
    }
  }

  const handleDeleteSchool = async (schoolId) => {
    try {
      await deleteSchoolFromFirebase(schoolId)
      // Real-time listener will update the state
    } catch (err) {
      console.error('Error deleting school:', err)
      throw err
    }
  }

  // Vehicle operations
  const handleAddVehicle = async (vehicleData) => {
    try {
      await addVehicleToFirebase(vehicleData)
      // Real-time listener will update the state
    } catch (err) {
      console.error('Error adding vehicle:', err)
      throw err
    }
  }

  const handleUpdateVehicle = async (vehicleId, updatedData) => {
    try {
      await updateVehicleInFirebase(vehicleId, updatedData)
      // Real-time listener will update the state
    } catch (err) {
      console.error('Error updating vehicle:', err)
      throw err
    }
  }

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await deleteVehicleFromFirebase(vehicleId)
      // Real-time listener will update the state
    } catch (err) {
      console.error('Error deleting vehicle:', err)
      throw err
    }
  }

  // Parent/Student operations
  const handleAddParent = async (parentData) => {
    try {
      await addStudentToFirebase(parentData)
      // Real-time listener will update the state
    } catch (err) {
      console.error('Error adding parent:', err)
      throw err
    }
  }

  const handleUpdateParent = async (parentId, updatedData) => {
    try {
      await updateStudentInFirebase(parentId, updatedData)
      // Real-time listener will update the state
    } catch (err) {
      console.error('Error updating parent:', err)
      throw err
    }
  }

  const handleDeleteParent = async (parentId) => {
    try {
      await deleteStudentFromFirebase(parentId)
      // Real-time listener will update the state
    } catch (err) {
      console.error('Error deleting parent:', err)
      throw err
    }
  }

  // Get vehicles by school name
  const getVehiclesBySchool = (schoolName) => {
    return vehicles
      .filter(v => v.schoolName === schoolName)
      .map(v => v.vehicleNumber)
  }

  return (
    <AppContext.Provider
      value={{
        schools,
        vehicles,
        parents,
        loading,
        error,
        // School operations
        addSchool: handleAddSchool,
        updateSchool: handleUpdateSchool,
        deleteSchool: handleDeleteSchool,
        // Vehicle operations
        addVehicle: handleAddVehicle,
        updateVehicle: handleUpdateVehicle,
        deleteVehicle: handleDeleteVehicle,
        // Parent operations
        addParent: handleAddParent,
        updateParent: handleUpdateParent,
        deleteParent: handleDeleteParent,
        // Helper functions
        getVehiclesBySchool
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

