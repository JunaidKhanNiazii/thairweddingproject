// Verify model file sizes
const fs = require('fs');
const path = require('path');

const MODELS_DIR = path.join(__dirname, 'public', 'models');

const expectedSizes = {
  'ssd_mobilenetv1_model-shard1': 4194304,
  'face_landmark_68_model-shard1': 356840,
  'face_recognition_model-shard1': 4194304,
  'face_recognition_model-shard2': 2249728
};

console.log('🔍 Verifying model files...\n');

let allCorrect = true;

for (const [filename, expectedSize] of Object.entries(expectedSizes)) {
  const filepath = path.join(MODELS_DIR, filename);
  
  if (!fs.existsSync(filepath)) {
    console.log(`❌ ${filename}: FILE NOT FOUND`);
    allCorrect = false;
    continue;
  }
  
  const stats = fs.statSync(filepath);
  const actualSize = stats.size;
  
  if (actualSize === expectedSize) {
    console.log(`✅ ${filename}: ${actualSize} bytes (correct)`);
  } else {
    console.log(`❌ ${filename}: ${actualSize} bytes (expected ${expectedSize})`);
    allCorrect = false;
  }
}

if (allCorrect) {
  console.log('\n✅ All model files are correct!');
} else {
  console.log('\n❌ Some files are incorrect. Re-download them.');
}
