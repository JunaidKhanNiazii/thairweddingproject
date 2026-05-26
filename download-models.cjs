// Script to download face-api.js models
const https = require('https');
const fs = require('fs');
const path = require('path');

const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';
const OUTPUT_DIR = path.join(__dirname, 'public', 'models');

const models = [
  'ssd_mobilenetv1_model-weights_manifest.json',
  'ssd_mobilenetv1_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2'
];

// Create models directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${path.basename(dest)}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function downloadModels() {
  console.log('📦 Downloading face-api.js models...\n');
  
  for (const model of models) {
    const url = MODEL_URL + model;
    const dest = path.join(OUTPUT_DIR, model);
    
    try {
      await downloadFile(url, dest);
    } catch (err) {
      console.error(`❌ Failed to download ${model}:`, err.message);
      process.exit(1);
    }
  }
  
  console.log('\n✅ All models downloaded successfully!');
  console.log(`📁 Models saved to: ${OUTPUT_DIR}`);
}

downloadModels();
