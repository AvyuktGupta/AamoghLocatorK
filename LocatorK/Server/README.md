# LocatorK Backend Services

Backend services for LocatorK location tracking system using Firebase Admin SDK.

## Setup

1. Install dependencies:
```bash
cd LocatorK/Server
npm install
```

2. Configure Firebase Admin SDK credentials:

**Option 1: Service Account File (Recommended)**
- Download service account JSON from Firebase Console
- Set environment variable:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json"
```

**Option 2: Environment Variables**
```bash
export FIREBASE_PROJECT_ID="your-project-id"
export FIREBASE_CLIENT_EMAIL="your-service-account-email"
export FIREBASE_PRIVATE_KEY="your-private-key"
```

**Option 3: Default Credentials (Local Development)**
- Use `gcloud auth application-default login` for local development

## Services

### schoolService.js
- `addSchool(name, address)` - Create a new school
- `getSchools()` - Get all schools
- `updateSchool(schoolId, data)` - Update school details

### vehicleService.js
- `addVehicle(data)` - Create a new vehicle
- `getVehicles()` - Get all vehicles
- `updateVehicle(vehicleId, data)` - Update vehicle details

### driverService.js
- `addDriver(data)` - Create a new driver
- `getDrivers()` - Get all drivers
- `updateDriver(driverId, data)` - Update driver details

### studentService.js
- `addStudent(data)` - Create a new student
- `getStudents()` - Get all students
- `updateStudent(studentId, data)` - Update student details

### liveLocationService.js
- `updateLiveLocation(vehicleId, locationData)` - Update vehicle location
- `listenToLiveLocation(vehicleId, callback)` - Listen to real-time location updates

## Usage Example

```javascript
import { addSchool, getSchools } from './schoolService.js'
import { updateLiveLocation } from './liveLocationService.js'

// Add a school
const schoolId = await addSchool('ABC School', '123 Main St')

// Get all schools
const schools = await getSchools()

// Update vehicle location
await updateLiveLocation('vehicle123', {
  lat: 28.6139,
  lng: 77.2090,
  speed: 45
})
```

