# Firebase Setup Guide - Direct API Integration

This project uses **Face++ API directly from React** (no Cloud Functions needed). All face matching happens client-side.

## ✅ What's Already Done

1. **Firebase Configuration** - Already set up in `.env` and `src/firebase.js`
2. **Face++ API Integration** - Direct API calls from React in `src/utils/facePlusPlus.js`
3. **Admin Photo Upload** - Detects faces and stores them in Face++ facesets
4. **Client Face Matching** - Searches for matching faces when selfie is uploaded
5. **Results Display** - Shows matched photos with download functionality

## 🔧 Required Setup

### 1. Enable Firebase Services

Go to [Firebase Console](https://console.firebase.google.com/project/anmol-lamhe-tahir)

#### Enable Firestore Database
1. Go to **Firestore Database** in left sidebar
2. Click **Create Database**
3. Choose **Production mode**
4. Select region closest to your users
5. Click **Enable**

#### Enable Authentication
1. Go to **Authentication** in left sidebar
2. Click **Get Started**
3. Enable **Email/Password** sign-in method
4. Add your admin email: `clienttesting92@gmail.com`

### 2. Deploy Firestore Security Rules

The project includes `firestore.rules` file. To deploy:

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy rules only
firebase deploy --only firestore:rules
```

Or manually copy rules from `firestore.rules` to Firebase Console:
1. Go to **Firestore Database** → **Rules** tab
2. Copy content from `firestore.rules`
3. Click **Publish**

## 📁 How It Works

### Admin Upload Flow
```
1. Admin uploads photo → EventDetail.jsx
2. Photo converted to base64 → stored in Firestore
3. Face++ API detects faces → returns face tokens
4. Faceset created/updated for event
5. Face tokens added to faceset
6. Photo saved with face tokens in Firestore
```

### Client Search Flow
```
1. Client uploads selfie → UploadSelfie.jsx
2. Face++ API searches faceset for matches
3. Returns matching face tokens with confidence scores
4. Filter photos containing matching face tokens
5. Display matched photos → Results.jsx
```

## 🔑 API Keys

All API keys are already configured in `.env`:
- Firebase credentials ✅
- Face++ API key & secret ✅

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables from `.env` file
4. Deploy

### Environment Variables for Vercel

Copy these from `.env`:
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
VITE_ADMIN_EMAIL
VITE_FACEPP_API_KEY
VITE_FACEPP_API_SECRET
VITE_APP_URL
```

## 🧪 Testing

### Test Admin Flow
1. Go to `/admin/login`
2. Login with: `clienttesting92@gmail.com`
3. Create an event
4. Upload photos (faces will be detected automatically)
5. Copy shareable link

### Test Client Flow
1. Open shareable link
2. Click "FIND MY PHOTOS"
3. Upload a selfie
4. View matched photos

## 📊 Face++ API Limits

**Free Tier:**
- 1,000 API calls/day
- 1,000 API calls/month

**Upgrade if needed:**
- Visit [Face++ Console](https://console.faceplusplus.com/)

## 🔒 Security Notes

⚠️ **API Keys in Frontend**: Face++ API keys are exposed in the frontend. This is acceptable for MVP but consider:
- Setting up API key restrictions in Face++ console
- Monitoring API usage
- Upgrading to Cloud Functions for production (if needed)

## 🐛 Troubleshooting

### "No photos found"
- Check if photos were uploaded with faces detected
- Check browser console for API errors
- Verify Face++ API keys are correct

### "Event not found"
- Verify Firestore is enabled
- Check if event was created successfully
- Check browser console for errors

### Face detection fails
- Check Face++ API quota
- Verify image format (JPG/PNG)
- Check image size (max 2MB recommended)
- Ensure face is clearly visible in photo

## 📝 Next Steps

1. ✅ Enable Firestore Database
2. ✅ Enable Authentication
3. ✅ Deploy Firestore rules
4. ✅ Test admin upload
5. ✅ Test client search
6. ✅ Deploy to Vercel

## 🎉 You're Done!

No Cloud Functions deployment needed. Everything runs directly from React!
