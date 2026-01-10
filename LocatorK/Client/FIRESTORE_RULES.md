# Firestore Security Rules

## For Development/Testing (Open Access)

Copy and paste these rules into Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all read and write access for development
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **WARNING**: These rules allow anyone to read and write to your database. Only use for development!

## For Production (Recommended)

For production, you should implement proper authentication. Here's a more secure rule set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Schools collection
    match /Schools/{schoolId} {
      allow read: if true; // Anyone can read schools
      allow write: if request.auth != null; // Only authenticated users can write
    }
    
    // Vehicles collection
    match /Vehicles/{vehicleId} {
      allow read: if true; // Anyone can read vehicles
      allow write: if request.auth != null; // Only authenticated users can write
    }
    
    // Students collection
    match /Students/{studentId} {
      allow read: if true; // Anyone can read students
      allow write: if request.auth != null; // Only authenticated users can write
    }
    
    // LiveLocations collection
    match /LiveLocations/{vehicleId} {
      allow read: if true; // Anyone can read locations
      allow write: if request.auth != null; // Only authenticated users can write
    }
  }
}
```

## How to Apply Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Paste the rules above
6. Click **Publish**

## Current Issue

If you're getting "Missing or insufficient permissions" error, it means:
- Your Firestore rules are too restrictive (default rules deny all access)
- You need to update the rules using one of the options above

For quick development, use the first set of rules (open access).

