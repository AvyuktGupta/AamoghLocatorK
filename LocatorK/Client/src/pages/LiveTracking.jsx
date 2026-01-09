import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import './PageStyles.css'
import './LiveTracking.css'

const LiveTracking = () => {
  const { vehicles } = useAppContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState(null)

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

  const handleSearch = (e) => {
    e.preventDefault()
    const found = vehicles.find(v =>
      v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (found) {
      setSelectedVehicle({
        ...found,
        status: found.status || 'Running',
        eta: found.eta || '15 minutes'
      })
    }
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
              <p className="map-marker">📍 Vehicle Location</p>
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
