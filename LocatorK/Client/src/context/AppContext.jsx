import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  // Load data from localStorage on mount
  const loadFromStorage = (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  }

  const [schools, setSchools] = useState(() => 
    loadFromStorage('schools', [
      { id: 1, name: 'Greenwood High School', address: '123 Main Street, City' },
      { id: 2, name: 'Sunshine Elementary', address: '456 Oak Avenue, City' }
    ])
  )

  const [vehicles, setVehicles] = useState(() =>
    loadFromStorage('vehicles', [
      {
        id: 1,
        vehicleNumber: 'DL-01-AB-1234',
        owner: 'John Doe',
        schoolName: 'Greenwood High School',
        driverName: 'Rajesh Kumar',
        driverMobile: '9876543210'
      },
      {
        id: 2,
        vehicleNumber: 'DL-02-CD-5678',
        owner: 'Jane Smith',
        schoolName: 'Sunshine Elementary',
        driverName: 'Amit Singh',
        driverMobile: '9876543211'
      }
    ])
  )

  const [parents, setParents] = useState(() =>
    loadFromStorage('parents', [
      {
        id: 1,
        name: 'Ramesh Kumar',
        mobileNumber: '9876543210',
        school: 'Greenwood High School',
        vehicleNumber: 'DL-01-AB-1234'
      },
      {
        id: 2,
        name: 'Priya Sharma',
        mobileNumber: '9876543211',
        school: 'Sunshine Elementary',
        vehicleNumber: 'DL-02-CD-5678'
      }
    ])
  )

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('schools', JSON.stringify(schools))
  }, [schools])

  useEffect(() => {
    localStorage.setItem('vehicles', JSON.stringify(vehicles))
  }, [vehicles])

  useEffect(() => {
    localStorage.setItem('parents', JSON.stringify(parents))
  }, [parents])

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
        setSchools,
        vehicles,
        setVehicles,
        parents,
        setParents,
        getVehiclesBySchool
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

