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

### Option 1: With Authentication (Most Secure)

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
    
    // live_locations collection
    match /live_locations/{locationId} {
      allow read: if true; // Anyone can read locations
      allow write: if request.auth != null; // Only authenticated users can write
    }
    
    // parents collection
    match /parents/{parentId} {
      allow read: if true; // Anyone can read parents
      allow write: if request.auth != null; // Only authenticated users can write
    }
    
    // users collection
    match /users/{userId} {
      allow read: if request.auth != null; // Only authenticated users can read
      allow write: if request.auth != null && request.auth.uid == userId; // Users can only write their own data
    }
  }
}
```

### Option 2: Without Authentication (For Development - Use if you're getting permission errors)

If you're getting "insufficient permissions" errors and haven't set up authentication yet, use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Schools collection
    match /Schools/{schoolId} {
      allow read, write: if true; // Allow all access for development
    }
    
    // Vehicles collection
    match /Vehicles/{vehicleId} {
      allow read, write: if true; // Allow all access for development
    }
    
    // Students collection
    match /Students/{studentId} {
      allow read, write: if true; // Allow all access for development
    }
    
    // live_locations collection
    match /live_locations/{locationId} {
      allow read, write: if true; // Allow all access for development
    }
    
    // parents collection
    match /parents/{parentId} {
      allow read, write: if true; // Allow all access for development
    }
    
    // users collection
    match /users/{userId} {
      allow read, write: if true; // Allow all access for development
    }
  }
}
```

⚠️ **WARNING**: Option 2 allows anyone to read and write to your database. Only use for development!

## How to Apply Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Paste the rules above
6. Click **Publish**

## Current Issue: "Insufficient Permissions" Error

If you're getting "Missing or insufficient permissions" error when trying to edit schools, vehicles, or students, it means:
- Your Firestore rules require authentication (`request.auth != null`) but your app doesn't have authentication set up yet
- You need to use either:
  1. **Development rules** (first section) - allows all access without authentication
  2. **Option 2** in Production section - allows all access without authentication
  3. **Set up Firebase Authentication** and use Option 1 in Production section

**Quick Fix**: Copy and paste **Option 2** from the Production section into your Firebase Console > Firestore Database > Rules tab, then click Publish. This will allow you to edit data without authentication.

For production, you should implement Firebase Authentication and use Option 1.

