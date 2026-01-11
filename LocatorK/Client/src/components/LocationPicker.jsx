import React, { useState, useEffect, useCallback, useRef } from 'react'
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api'
import { useGoogleMaps } from '../context/GoogleMapsContext'
import './LocationPicker.css'

const mapContainerStyle = {
  width: '100%',
  height: '100%'
}

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090
}

const LocationPicker = ({ 
  initialLat = null, 
  initialLng = null, 
  onLocationChange,
  label = 'Select Location',
  height = '400px'
}) => {
  const [position, setPosition] = useState(defaultCenter)
  const [markerPosition, setMarkerPosition] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [address, setAddress] = useState('')
  const [mapCenter, setMapCenter] = useState(null)
  const [showInfoWindow, setShowInfoWindow] = useState(false)
  const [map, setMap] = useState(null)
  const geocoderRef = useRef(null)
  const autocompleteRef = useRef(null)
  const searchInputRef = useRef(null)

  // Get Google Maps API status from context
  const { isLoaded, loadError } = useGoogleMaps()

  // Hide Google Maps error popup
  useEffect(() => {
    const hideErrorPopup = () => {
      // Hide error dialogs
      const errorDialogs = document.querySelectorAll('div[role="dialog"], div[style*="position: fixed"]')
      errorDialogs.forEach(dialog => {
        const text = dialog.textContent || dialog.innerText || ''
        if (text.includes("can't load Google Maps") || text.includes("This page can't load")) {
          dialog.style.display = 'none'
          dialog.style.visibility = 'hidden'
          dialog.style.opacity = '0'
          dialog.style.pointerEvents = 'none'
        }
      })
      
      // Hide iframes that might contain error messages
      const iframes = document.querySelectorAll('iframe[src*="accounts.google.com"], iframe[src*="consent.google.com"]')
      iframes.forEach(iframe => {
        iframe.style.display = 'none'
      })
    }

    // Run immediately and then periodically
    hideErrorPopup()
    const interval = setInterval(hideErrorPopup, 500)
    
    // Also use MutationObserver to catch dynamically added popups
    const observer = new MutationObserver(hideErrorPopup)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      clearInterval(interval)
      observer.disconnect()
    }
  }, [])

  // Initialize geocoder when API is loaded
  useEffect(() => {
    if (isLoaded && window.google && window.google.maps) {
      geocoderRef.current = new window.google.maps.Geocoder()
    }
  }, [isLoaded])

  // Initialize with provided coordinates or default
  useEffect(() => {
    if (initialLat && initialLng) {
      const lat = parseFloat(initialLat)
      const lng = parseFloat(initialLng)
      if (!isNaN(lat) && !isNaN(lng)) {
        const newPosition = { lat, lng }
        setPosition(newPosition)
        setMarkerPosition(newPosition)
        setMapCenter(newPosition)
        if (isLoaded) {
          reverseGeocode(lat, lng)
        }
      }
    }
  }, [initialLat, initialLng, isLoaded])

  // Initialize Autocomplete when API is loaded
  useEffect(() => {
    if (isLoaded && searchInputRef.current && window.google && window.google.maps) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        searchInputRef.current,
        { types: ['geocode'] }
      )

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace()
        if (place.geometry) {
          const lat = place.geometry.location.lat()
          const lng = place.geometry.location.lng()
          const newPosition = { lat, lng }
          
          setPosition(newPosition)
          setMarkerPosition(newPosition)
          setMapCenter(newPosition)
          setAddress(place.formatted_address || place.name)
          onLocationChange(lat, lng)
          
          if (map) {
            map.setCenter(newPosition)
            map.setZoom(15)
          }
        }
      })
    }

    return () => {
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [isLoaded, map, onLocationChange])

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const newPosition = { lat: latitude, lng: longitude }
          setPosition(newPosition)
          setMarkerPosition(newPosition)
          setMapCenter(newPosition)
          onLocationChange(latitude, longitude)
          if (isLoaded) {
            reverseGeocode(latitude, longitude)
          }
          
          if (map) {
            map.setCenter(newPosition)
            map.setZoom(15)
          }
        },
        (error) => {
          alert('Unable to get your location. Please select manually on the map.')
          console.error('Geolocation error:', error)
        }
      )
    } else {
      alert('Geolocation is not supported by your browser.')
    }
  }

  // Reverse geocoding: Convert coordinates to address
  const reverseGeocode = async (lat, lng) => {
    if (!geocoderRef.current || !isLoaded) return
    
    try {
      geocoderRef.current.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === 'OK' && results[0]) {
            setAddress(results[0].formatted_address)
          } else {
            console.error('Reverse geocoding failed:', status)
          }
        }
      )
    } catch (error) {
      console.error('Reverse geocoding error:', error)
    }
  }

  // Geocoding: Convert address to coordinates
  const searchLocation = async () => {
    if (!searchQuery.trim() || !geocoderRef.current || !isLoaded) return

    setIsSearching(true)
    try {
      geocoderRef.current.geocode(
        { address: searchQuery },
        (results, status) => {
          setIsSearching(false)
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location
            const lat = location.lat()
            const lng = location.lng()
            const newPosition = { lat, lng }
            
            setPosition(newPosition)
            setMarkerPosition(newPosition)
            setMapCenter(newPosition)
            setAddress(results[0].formatted_address)
            onLocationChange(lat, lng)
            
            if (map) {
              map.setCenter(newPosition)
              map.setZoom(15)
            }
          } else {
            alert('Location not found. Please try a different search term.')
          }
        }
      )
    } catch (error) {
      setIsSearching(false)
      console.error('Geocoding error:', error)
      alert('Error searching location. Please try again.')
    }
  }

  // Handle map click
  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat()
    const lng = event.latLng.lng()
    const newPosition = { lat, lng }
    
    setMarkerPosition(newPosition)
    setPosition(newPosition)
    onLocationChange(lat, lng)
    if (isLoaded) {
      reverseGeocode(lat, lng)
    }
    setShowInfoWindow(true)
  }, [onLocationChange, isLoaded])

  // Handle Enter key in search
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      searchLocation()
    }
  }

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance)
    if (mapCenter) {
      mapInstance.setCenter(mapCenter)
      mapInstance.setZoom(15)
    }
  }, [mapCenter])

  const onMapUnmount = useCallback(() => {
    setMap(null)
  }, [])

  if (loadError) {
    return (
      <div className="location-picker-container">
        <div style={{ padding: '20px', color: 'red', border: '2px solid red', borderRadius: '8px', backgroundColor: '#ffe6e6', maxWidth: '600px', margin: '0 auto' }}>
          <strong style={{ fontSize: '18px', display: 'block', marginBottom: '15px' }}>⚠️ Google Maps API Error</strong>
          <p style={{ marginBottom: '10px' }}>The map cannot load. This is usually caused by:</p>
          <ol style={{ textAlign: 'left', marginTop: '10px', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>API Key Restrictions:</strong> Your API key may not allow localhost. 
              <br />Go to Google Cloud Console → APIs & Services → Credentials → Your API Key
              <br />Under "Application restrictions", add:
              <code style={{ display: 'block', background: '#fff', padding: '5px', marginTop: '5px', borderRadius: '3px' }}>
                localhost:*<br />
                127.0.0.1:*
              </code>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Billing Not Enabled:</strong> Google Maps requires billing (even for free tier)
              <br />Go to Google Cloud Console → Billing and link a payment method
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>APIs Not Enabled:</strong> Enable these APIs in Google Cloud Console:
              <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                <li>Maps JavaScript API</li>
                <li>Geocoding API</li>
                <li>Places API</li>
              </ul>
            </li>
          </ol>
          <div style={{ marginTop: '15px', padding: '10px', background: '#fff', borderRadius: '4px', fontSize: '12px' }}>
            <strong>Quick Fix for Localhost:</strong>
            <ol style={{ marginTop: '5px', paddingLeft: '20px' }}>
              <li>Open <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">Google Cloud Console Credentials</a></li>
              <li>Click on your API key</li>
              <li>Under "Application restrictions" → Select "HTTP referrers"</li>
              <li>Add: <code>localhost:*</code> and <code>127.0.0.1:*</code></li>
              <li>Click "Save" and wait 1-2 minutes</li>
              <li>Refresh this page</li>
            </ol>
          </div>
          {loadError.message && (
            <p style={{ marginTop: '15px', fontSize: '12px', fontFamily: 'monospace' }}>
              Error details: {loadError.message}
            </p>
          )}
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="location-picker-container">
        <div style={{ padding: '20px' }}>
          Loading map...
        </div>
      </div>
    )
  }

  return (
    <div className="location-picker-container">
      <label className="location-picker-label">{label}</label>
      
      <div className="location-picker-controls">
        <div className="search-container">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search address or place..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className="location-search-input"
          />
          <button 
            onClick={searchLocation} 
            disabled={isSearching || !isLoaded}
            className="location-search-btn"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        <button 
          onClick={getCurrentLocation}
          className="location-current-btn"
        >
          📍 Use My Location
        </button>
      </div>

      {address && (
        <div className="location-address">
          <strong>Address:</strong> {address}
        </div>
      )}

      {markerPosition && (
        <div className="location-coordinates">
          <strong>Coordinates:</strong> {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
        </div>
      )}

      <div className="location-map-container" style={{ height }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter || position}
          zoom={mapCenter ? 15 : 13}
          onClick={handleMapClick}
          onLoad={onMapLoad}
          onUnmount={onMapUnmount}
          options={{
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: true,
          }}
        >
          {markerPosition && (
            <Marker
              position={markerPosition}
              onClick={() => setShowInfoWindow(true)}
            >
              {showInfoWindow && (
                <InfoWindow
                  onCloseClick={() => setShowInfoWindow(false)}
                >
                  <div>
                    <strong>Selected Location</strong><br />
                    {address || 'No address available'}<br />
                    Lat: {markerPosition.lat.toFixed(6)}, Lng: {markerPosition.lng.toFixed(6)}
                  </div>
                </InfoWindow>
              )}
            </Marker>
          )}
        </GoogleMap>
      </div>
      
      <div className="location-instructions">
        💡 Click on the map to select a location, or search for an address
      </div>
    </div>
  )
}

export default LocationPicker
