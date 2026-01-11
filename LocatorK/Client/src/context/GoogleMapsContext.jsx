import React, { createContext, useContext, useEffect, useState } from 'react'
import { useJsApiLoader } from '@react-google-maps/api'

const GoogleMapsContext = createContext(null)

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext)
  if (!context) {
    throw new Error('useGoogleMaps must be used within GoogleMapsProvider')
  }
  return context
}

export const GoogleMapsProvider = ({ children }) => {
  const [apiError, setApiError] = useState(null)

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyAXmFtgk-h73pLIEsqiP9nAXA4XqlD-w7c',
    libraries: ['places', 'geometry'],
    version: 'weekly'
  })

  // Check for Google Maps API errors
  useEffect(() => {
    const checkGoogleMapsError = () => {
      if (window.google && window.google.maps) {
        // Check if there's an error in the console or API
        const script = document.querySelector('script[src*="maps.googleapis.com"]')
        if (script) {
          script.onerror = () => {
            setApiError('Failed to load Google Maps script. Please check your API key and network connection.')
          }
        }
      }
    }

    // Check after a delay to see if Google Maps loaded
    const timer = setTimeout(() => {
      if (!isLoaded && !loadError) {
        // If not loaded after 5 seconds, there might be an issue
        checkGoogleMapsError()
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [isLoaded, loadError])

  const error = loadError || apiError

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError: error }}>
      {children}
    </GoogleMapsContext.Provider>
  )
}

