# Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. Install Dependencies
```bash
npm install
```

### 2. Test Build Locally
```bash
npm run build
npm run preview
```

### 3. Verify Environment Variables
Make sure `.env` file has all required variables (don't commit this file!)

---

## 🚀 Deploy to Vercel

### Option 1: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

### Option 2: Deploy via GitHub
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel will auto-detect Vite configuration

---

## ⚙️ Vercel Configuration

### Build Settings
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_FIREBASE_API_KEY=AIzaSyBHQdTrTRqRuV9J4L_fxOLnRqgLUFa6CaI
VITE_FIREBASE_AUTH_DOMAIN=anmol-lamhe-tahir.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=anmol-lamhe-tahir
VITE_FIREBASE_STORAGE_BUCKET=anmol-lamhe-tahir.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=639469443335
VITE_FIREBASE_APP_ID=1:639469443335:web:be9112f90a38b306a74da2
VITE_FIREBASE_MEASUREMENT_ID=G-FK1T9C0G0W
VITE_ADMIN_EMAIL=clienttesting92@gmail.com
VITE_APP_URL=https://your-project-name.vercel.app
```

**Important:** Update `VITE_APP_URL` with your actual Vercel URL after first deployment!

---

## 🔍 How It Works on Vercel

### Client-Side Processing
- ✅ Face detection runs in user's browser (not on Vercel servers)
- ✅ Face-api.js models loaded from CDN
- ✅ No server-side processing needed
- ✅ Works exactly like localhost

### What Vercel Hosts
- Static HTML, CSS, JS files
- React SPA with client-side routing
- All processing happens in browser

### Performance
- Face detection speed depends on user's device
- Desktop: Fast (1-3 seconds per photo)
- Mobile: Slower (3-10 seconds per photo)
- Uses CPU backend (no GPU required)

---

## ⚠️ Known Limitations

### 1. Firestore Document Size
- Each photo stored as base64 in Firestore
- Firestore limit: 1MB per document
- **Recommendation:** Keep photos under 500KB each

### 2. Browser Memory
- Face detection uses browser memory
- Large images (>2MB) are auto-resized to 800px
- Multiple photos processed sequentially

### 3. Mobile Performance
- Face detection slower on mobile devices
- Consider showing loading indicator
- Already implemented: CPU backend for compatibility

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment Variables Not Working
- Make sure variables start with `VITE_`
- Redeploy after adding variables
- Check Vercel deployment logs

### Face Detection Not Working
- Check browser console for errors
- Verify CDN models are loading
- Test on different browsers

### Images Not Loading
- Check Firebase Storage rules
- Verify Firestore permissions
- Check browser network tab

---

## 📊 Post-Deployment Testing

1. **Admin Flow:**
   - Login as admin
   - Create event
   - Upload photos with faces
   - Verify face detection works

2. **Client Flow:**
   - Access event via share link
   - Upload selfie
   - Verify face matching works
   - Test download features

3. **Performance:**
   - Test on mobile device
   - Test with multiple photos
   - Check loading times

---

## 🔄 Updates & Redeployment

### Automatic Deployment
If connected to GitHub, Vercel auto-deploys on push to main branch

### Manual Deployment
```bash
vercel --prod
```

### Rollback
Go to Vercel Dashboard → Deployments → Select previous deployment → Promote to Production

---

## 📝 Notes

- Face-api.js works 100% in browser (no backend needed)
- All face processing is client-side
- Vercel only serves static files
- No serverless functions needed for face detection
- Firebase handles all data storage

---

## ✅ Ready to Deploy!

Your app is ready for Vercel deployment. Everything will work the same as localhost because all face processing happens in the browser.
