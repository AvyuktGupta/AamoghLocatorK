import React from 'react'
import './PageStyles.css'
import './LiveTracking.css'

const LiveTracking = () => {
  return (
    <div className="page-container tracking-page">
      <h1>Live Tracking</h1>
      
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '50px auto'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🚧</div>
        <h2 style={{ color: '#e74c3c', marginBottom: '15px' }}>Live Tracking Temporarily Disabled</h2>
        <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.6' }}>
          The live tracking feature is currently disabled due to technical issues.
          <br />
          <br />
          Please check back later or contact support if you need assistance.
        </p>
      </div>
    </div>
  )
}

export default LiveTracking
