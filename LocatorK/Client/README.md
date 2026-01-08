# LocatorK - School Van Tracking System

A web application for tracking school vans, their drivers, and assigned students.

## Project Structure

```
Client/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Navigation sidebar component
│   │   └── Sidebar.css          # Sidebar styles
│   ├── pages/
│   │   ├── SchoolManagement.jsx # Page 1: School management
│   │   ├── VehicleManagement.jsx # Page 2: Vehicle management
│   │   ├── ParentManagement.jsx  # Page 3: Parent/Student assignment
│   │   ├── LiveTracking.jsx      # Page 4: Live tracking
│   │   ├── PageStyles.css        # Shared page styles
│   │   └── LiveTracking.css     # Tracking page specific styles
│   ├── App.jsx                   # Main app component with routing
│   ├── App.css                   # App-level styles
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── vite.config.js               # Vite configuration
└── README.md                     # This file
```

## Installation

1. Navigate to the Client directory:
```bash
cd LocatorK/Client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Features

### Page 1: School Management
- Add new schools
- View all schools in a table
- Modify school details (name, address)

### Page 2: Vehicle Management
- Add vehicles with driver information
- Link vehicles to schools
- View and modify vehicle details

### Page 3: Parent/Student Assignment
- Assign parents/students to vehicles
- Filter vehicles by selected school
- Manage parent-student-vehicle relationships

### Page 4: Live Tracking
- Search vehicles by number or school
- Display vehicle location on map (placeholder)
- Show vehicle status and ETA
- Display driver and vehicle information

## Backend Integration Points

To connect with your backend API, you'll need to modify the following:

### API Endpoints to Implement:

1. **School Management** (`/api/schools`)
   - `GET /api/schools` - Fetch all schools
   - `POST /api/schools` - Create new school
   - `PUT /api/schools/:id` - Update school
   - `DELETE /api/schools/:id` - Delete school (optional)

2. **Vehicle Management** (`/api/vehicles`)
   - `GET /api/vehicles` - Fetch all vehicles
   - `POST /api/vehicles` - Create new vehicle
   - `PUT /api/vehicles/:id` - Update vehicle
   - `GET /api/vehicles?schoolId=:id` - Get vehicles by school

3. **Parent/Student Management** (`/api/parents`)
   - `GET /api/parents` - Fetch all parents
   - `POST /api/parents` - Create new parent assignment
   - `PUT /api/parents/:id` - Update parent assignment
   - `GET /api/parents?vehicleId=:id` - Get parents by vehicle

4. **Live Tracking** (`/api/tracking`)
   - `GET /api/tracking/:vehicleId` - Get real-time location
   - `GET /api/tracking/search?query=:query` - Search vehicles
   - WebSocket connection for real-time updates (recommended)

### Where to Add API Calls:

1. **SchoolManagement.jsx**:
   - Replace `handleAdd()` with API POST call
   - Replace `handleModify()` with API PUT call
   - Add `useEffect` to fetch schools on mount

2. **VehicleManagement.jsx**:
   - Replace `handleAdd()` with API POST call
   - Replace `handleModify()` with API PUT call
   - Fetch schools list from API for dropdown
   - Fetch vehicles on mount

3. **ParentManagement.jsx**:
   - Replace `handleAdd()` with API POST call
   - Replace `handleModify()` with API PUT call
   - Fetch schools and vehicles from API
   - Implement vehicle filtering based on school

4. **LiveTracking.jsx**:
   - Integrate Google Maps API or similar mapping service
   - Add WebSocket connection for real-time location updates
   - Replace search functionality with API call
   - Fetch vehicle location data periodically or via WebSocket

### Example API Integration Pattern:

```javascript
// Example: Adding API call to SchoolManagement.jsx
useEffect(() => {
  fetch('/api/schools')
    .then(res => res.json())
    .then(data => setSchools(data))
    .catch(err => console.error('Error fetching schools:', err))
}, [])

const handleAdd = async () => {
  try {
    const response = await fetch('/api/schools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: schoolName })
    })
    const newSchool = await response.json()
    setSchools([...schools, newSchool])
    setSchoolName('')
  } catch (error) {
    console.error('Error adding school:', error)
  }
}
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

