# Google Maps API Setup Guide

If you're seeing the error "This page can't load Google Maps correctly", follow these steps:

## Step 1: Enable Required APIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services > Library**
4. Enable the following APIs:
   - **Maps JavaScript API** (Required)
   - **Geocoding API** (Required for address search)
   - **Places API** (Required for autocomplete)

## Step 2: Set Up Billing

1. Go to **Billing** in Google Cloud Console
2. Link a billing account to your project
   - Google Maps requires billing even for free tier usage
   - You get $200 free credit per month

## Step 3: Configure API Key Restrictions

1. Go to **APIs & Services > Credentials**
2. Click on your API key: `AIzaSyAXmFtgk-h73pLIEsqiP9nAXA4XqlD-w7c`
3. Under **Application restrictions**, choose one of these options:

### Option A: For Development (localhost)
   - Select **HTTP referrers (web sites)**
   - Add these referrers:
     ```
     localhost:*
     127.0.0.1:*
     http://localhost:*
     http://127.0.0.1:*
     https://localhost:*
     https://127.0.0.1:*
     ```

### Option B: For Production
   - Select **HTTP referrers (web sites)**
   - Add your domain:
     ```
     yourdomain.com/*
     *.yourdomain.com/*
     ```

4. Under **API restrictions**:
   - Select **Restrict key**
   - Choose these APIs:
     - Maps JavaScript API
     - Geocoding API
     - Places API

## Step 4: Verify API Key

1. Make sure the API key in the code matches your Google Cloud Console
2. Current API key: `AIzaSyAXmFtgk-h73pLIEsqiP9nAXA4XqlD-w7c`

## Common Issues

### "This page can't load Google Maps correctly"
- **Cause**: API key restrictions don't include your domain/localhost
- **Fix**: Add your domain to HTTP referrer restrictions (see Step 3)

### "BillingNotEnabledMapError"
- **Cause**: Billing is not enabled
- **Fix**: Enable billing in Google Cloud Console (see Step 2)

### "ApiNotActivatedMapError"
- **Cause**: Required APIs are not enabled
- **Fix**: Enable Maps JavaScript API, Geocoding API, and Places API (see Step 1)

### Map loads but shows error dialog
- **Cause**: API key restrictions or billing issue
- **Fix**: Check Steps 2 and 3

## Testing

After making changes:
1. Wait 1-2 minutes for changes to propagate
2. Clear your browser cache
3. Refresh the page
4. Check browser console (F12) for specific error messages

## Need Help?

Check the browser console (F12) for specific error messages that will help identify the exact issue.

