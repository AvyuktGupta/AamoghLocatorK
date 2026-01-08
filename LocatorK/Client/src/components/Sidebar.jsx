import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    { path: '/school', label: 'School' },
    { path: '/vehicle', label: 'Vehicle' },
    { path: '/parents', label: 'Parents' },
    { path: '/tracking', label: 'Tracking' }
  ]

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>LocatorK</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar

