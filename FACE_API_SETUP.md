# Face-API.js Setup Instructions

## 1. Install face-api.js

```bash
npm install face-api.js
```

## 2. Download Models

Download the required models and place them in `public/models/` folder:

1. Create folder: `public/models`

2. Download these files from https://github.com/justadudewhohacks/face-api.js/tree/master/weights

Required models:
- `ssd_mobilenetv1_model-weights_manifest.json`
- `ssd_mobilenetv1_model-shard1`
- `face_landmark_68_model-weights_manifest.json`
- `face_landmark_68_model-shard1`
- `face_recognition_model-weights_manifest.json`
- `face_recognition_model-shard1`
- `face_recognition_model-shard2`

OR use this command (if you have curl):

```bash
cd public
mkdir models
cd models

# SSD MobileNet V1
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-shard1

# Face Landmarks
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1

# Face Recognition
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard2
```

## 3. Benefits of face-api.js

✅ **FREE** - No API keys, no usage limits
✅ **Privacy** - Everything runs in the browser, no data sent to servers
✅ **Offline** - Works without internet after models are loaded
✅ **Multiple matches** - Finds ALL photos of a person, not just one
✅ **No CORS issues** - Runs client-side

## 4. How it works

1. **Admin uploads photos** → face-api.js detects faces → stores face descriptors in Firestore
2. **User uploads selfie** → face-api.js detects face → compares with all stored descriptors
3. **Returns all matching photos** with confidence scores

Face descriptors are 128-dimensional vectors that represent unique facial features.
