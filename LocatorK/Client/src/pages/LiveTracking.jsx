import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { subscribeToLiveLocation, getLiveLocation } from '../services/firebaseService'
import './PageStyles.css'
import './LiveTracking.css'

const LiveTracking = () => {
  const { vehicles, loading } = useAppContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [liveLocation, setLiveLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)

  // Initialize with first vehicle if available
  useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicle) {
      const firstVehicle = vehicles[0]
      setSelectedVehicle({
        ...firstVehicle,
        status: 'Running',
        eta: '15 minutes'
      })
    }
  }, [vehicles])

  // Subscribe to live location updates when vehicle is selected
  useEffect(() => {
    if (!selectedVehicle?.id) return

    let unsubscribe = null

    const setupLocationListener = async () => {
      try {
        setLocationError(null)
        
        // Get initial location
        const initialLocation = await getLiveLocation(selectedVehicle.id)
        if (initialLocation) {
          setLiveLocation(initialLocation)
        }

        // Subscribe to real-time updates
        unsubscribe = subscribeToLiveLocation(selectedVehicle.id, (location) => {
          if (location) {
            setLiveLocation(location)
            setLocationError(null)
          } else {
            setLocationError('No location data available for this vehicle')
          }
        })
      } catch (error) {
        console.error('Error setting up location listener:', error)
        setLocationError('Error loading location data')
      }
    }

    setupLocationListener()

    // Cleanup listener on unmount or vehicle change
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
      setLiveLocation(null)
      setLocationError(null)
    }
  }, [selectedVehicle?.id])

  const handleSearch = (e) => {
    e.preventDefault()
    const found = vehicles.find(v =>
      v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (found) {
      setSelectedVehicle({
        ...found,
        status: 'Running',
        eta: '15 minutes'
      })
      setSearchQuery('')
    } else {
      alert('Vehicle not found')
    }
  }

  if (loading) {
    return (
      <div className="page-container tracking-page">
        <h1>Live Tracking</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (!selectedVehicle) {
    return (
      <div className="page-container tracking-page">
        <h1>Live Tracking</h1>
        <p>No vehicles available for tracking.</p>
      </div>
    )
  }

  return (
    <div className="page-container tracking-page">
      <h1>Live Tracking</h1>
      
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by vehicle number or school name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      <div className="tracking-container">
        <div className="map-section">
          <div className="map-container">
            <div className="map-placeholder">
              <p>Google Maps Integration</p>
              {liveLocation ? (
                <>
                  <p className="map-marker">📍 Vehicle Location</p>
                  <p>Latitude: {liveLocation.lat?.toFixed(6)}</p>
                  <p>Longitude: {liveLocation.lng?.toFixed(6)}</p>
                  {liveLocation.speed !== undefined && (
                    <p>Speed: {liveLocation.speed} km/h</p>
                  )}
                  {liveLocation.updatedAt && (
                    <p>Last Updated: {new Date(liveLocation.updatedAt.toDate?.() || liveLocation.updatedAt).toLocaleString()}</p>
                  )}
                </>
              ) : locationError ? (
                <p style={{ color: 'red' }}>{locationError}</p>
              ) : (
                <p>Loading location data...</p>
              )}
              <p className="eta-display">ETA: {selectedVehicle.eta}</p>
            </div>
          </div>
        </div>

        <div className="info-panel">
          <h2>Vehicle Information</h2>
          <div className="info-item">
            <label>School Name:</label>
            <span>{selectedVehicle.schoolName}</span>
          </div>
          <div className="info-item">
            <label>Vehicle Number:</label>
            <span>{selectedVehicle.vehicleNumber}</span>
          </div>
          <div className="info-item">
            <label>Driver Name:</label>
            <span>{selectedVehicle.driverName}</span>
          </div>
          <div className="info-item">
            <label>Driver Mobile Number:</label>
            <span>{selectedVehicle.driverMobile}</span>
          </div>
          <div className="info-item">
            <label>Current Status:</label>
            <span className={`status-badge ${selectedVehicle.status.toLowerCase()}`}>
              {selectedVehicle.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveTracking
