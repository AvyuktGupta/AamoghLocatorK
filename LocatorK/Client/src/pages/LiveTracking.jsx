import React, { useState } from 'react'
import './PageStyles.css'
import './LiveTracking.css'

const LiveTracking = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState({
    schoolName: 'Greenwood High School',
    vehicleNumber: 'DL-01-AB-1234',
    driverName: 'Rajesh Kumar',
    driverMobile: '9876543210',
    status: 'Running',
    eta: '15 minutes'
  })

  const vehicles = [
    {
      schoolName: 'Greenwood High School',
      vehicleNumber: 'DL-01-AB-1234',
      driverName: 'Rajesh Kumar',
      driverMobile: '9876543210',
      status: 'Running',
      eta: '15 minutes'
    },
    {
      schoolName: 'Sunshine Elementary',
      vehicleNumber: 'DL-02-CD-5678',
      driverName: 'Amit Singh',
      driverMobile: '9876543211',
      status: 'Stopped',
      eta: '25 minutes'
    }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    const found = vehicles.find(v =>
      v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (found) {
      setSelectedVehicle(found)
    }
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

