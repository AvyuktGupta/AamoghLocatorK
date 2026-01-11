import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { GoogleMapsProvider } from './context/GoogleMapsContext'
import Sidebar from './components/Sidebar'
import SchoolManagement from './pages/SchoolManagement'
import VehicleManagement from './pages/VehicleManagement'
import ParentManagement from './pages/ParentManagement'
import LiveTracking from './pages/LiveTracking'
import './App.css'

function App() {
  return (
    <GoogleMapsProvider>
      <AppProvider>
        <Router>
          <div className="app-container">
            <Sidebar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/school" replace />} />
                <Route path="/school" element={<SchoolManagement />} />
                <Route path="/vehicle" element={<VehicleManagement />} />
                <Route path="/parents" element={<ParentManagement />} />
                <Route path="/tracking" element={<LiveTracking />} />
              </Routes>
            </div>
          </div>
        </Router>
      </AppProvider>
    </GoogleMapsProvider>
  )
}

export default App

