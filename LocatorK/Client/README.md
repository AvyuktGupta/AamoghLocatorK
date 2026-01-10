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

3. Set up Firebase configuration:
   - Create a `.env` file in the `Client` directory
   - Add your Firebase configuration values:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
   - Get these values from Firebase Console > Project Settings > General > Your apps > Web app

4. Configure Firestore Security Rules:
   - Go to Firebase Console > Firestore Database > Rules
   - Set up appropriate security rules for your collections (Schools, Vehicles, Students, LiveLocations)
   - For development, you can use:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
   - For production, implement proper role-based access control

5. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in terminal)

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

## Firebase Integration

This application connects directly to Firebase Firestore for data storage and real-time updates.

### Firebase Collections:

1. **Schools** - Stores school information
   - Fields: `name`, `address`, `createdAt`

2. **Vehicles** - Stores vehicle and driver information
   - Fields: `vehicleNumber`, `schoolId`, `ownerName`, `driverName`, `driverMobile`, `driverId`, `createdAt`

3. **Students** - Stores student/parent assignments
   - Fields: `name`, `parentMobile1`, `parentMobile2`, `vehicleId`, `schoolId`, `createdAt`

4. **LiveLocations** - Stores real-time vehicle locations
   - Fields: `lat`, `lng`, `speed`, `updatedAt`
   - Document ID is the vehicle ID

### Real-time Features:

- All data (schools, vehicles, students) syncs in real-time across all connected clients
- Live location tracking uses Firestore real-time listeners
- Changes are automatically reflected in the UI without page refresh

### Firebase Service Layer:

The Firebase integration is handled through:
- `src/config/firebase.js` - Firebase initialization
- `src/services/firebaseService.js` - All CRUD operations and real-time subscriptions
- `src/context/AppContext.jsx` - Context provider that manages Firebase data

### Data Structure Mapping:

The frontend uses friendly names (e.g., `schoolName`) while Firebase stores IDs. The service layer automatically handles:
- Converting school names to school IDs when saving
- Populating school names from IDs when loading
- Similar mapping for vehicles and students

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.


