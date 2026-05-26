// face-api.js Integration (FREE, runs in browser)
import * as faceapi from 'face-api.js';

let modelsLoaded = false;
let modelsLoading = false;

/**
 * Load face-api.js models (only once)
 */
export const loadModels = async () => {
  if (modelsLoaded) return;
  if (modelsLoading) {
    // Wait for models to finish loading
    while (modelsLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return;
  }
  
  modelsLoading = true;
  
  try {
    // Use CDN instead of local files to avoid caching issues
    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
    
    console.log('📦 Loading face-api.js models from CDN...');
    
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
    ]);
    
    // Force CPU backend to avoid WebGL context issues
    await faceapi.tf.setBackend('cpu');
    await faceapi.tf.ready();
    
    modelsLoaded = true;
    modelsLoading = false;
    console.log('✅ Face-api.js models loaded successfully (CPU backend)');
  } catch (error) {
    modelsLoading = false;
    console.error('❌ Error loading face-api.js models:', error);
    throw new Error('Failed to load face recognition models. Please check your internet connection.');
  }
};

/**
 * Detect faces and get descriptors from an image
 * @param {File|HTMLImageElement} image - Image file or element
 * @returns {Promise<Array>} Array of face descriptors
 */
export const detectFaces = async (image) => {
  await loadModels();
  
  try {
    let imgElement;
    
    if (image instanceof File) {
      // Convert File to Image element (with resizing)
      imgElement = await createImageElement(image, 800); // Resize to max 800px
    } else {
      imgElement = image;
    }
    
    console.log('🔍 Detecting faces in image...');
    
    // Use smaller input size for better performance
    const detections = await faceapi
      .detectAllFaces(imgElement, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
      .withFaceLandmarks()
      .withFaceDescriptors();
    
    console.log(`✅ Detected ${detections.length} face(s)`);
    
    return detections;
  } catch (error) {
    console.error('❌ Face detection error:', error);
    throw error;
  }
};

/**
 * Compare two face descriptors
 * @param {Float32Array} descriptor1 - First face descriptor
 * @param {Float32Array} descriptor2 - Second face descriptor
 * @returns {number} Distance (lower = more similar, < 0.6 = match)
 */
export const compareFaces = (descriptor1, descriptor2) => {
  return faceapi.euclideanDistance(descriptor1, descriptor2);
};

/**
 * Find matching faces in a collection
 * @param {File} selfieFile - User's selfie
 * @param {Array} photoDescriptors - Array of {photoId, descriptors: [...]}
 * @param {number} threshold - Match threshold (default 0.6, lower = stricter)
 * @returns {Promise<Array>} Array of matching photo IDs with confidence
 */
export const findMatches = async (selfieFile, photoDescriptors, threshold = 0.6) => {
  await loadModels();
  
  try {
    console.log('🔍 Detecting face in selfie...');
    
    // Detect face in selfie (with smaller size for performance)
    const selfieDetections = await detectFaces(selfieFile);
    
    if (!selfieDetections || selfieDetections.length === 0) {
      throw new Error('No face detected in selfie. Please use a clear photo showing your face.');
    }
    
    if (selfieDetections.length > 1) {
      console.warn('⚠️ Multiple faces detected in selfie, using the first one');
    }
    
    const selfieDescriptor = selfieDetections[0].descriptor;
    const matches = [];
    
    console.log(`🔎 Comparing with ${photoDescriptors.length} photos...`);
    
    // Compare selfie with all photo descriptors
    for (const photo of photoDescriptors) {
      console.log(`Checking photo ${photo.photoId} with ${photo.descriptors.length} face(s)`);
      
      for (const photoDescriptor of photo.descriptors) {
        const distance = compareFaces(selfieDescriptor, photoDescriptor);
        console.log(`  Distance: ${distance.toFixed(4)} (threshold: ${threshold})`);
        
        if (distance < threshold) {
          // Convert distance to confidence percentage (0.6 = 0%, 0 = 100%)
          const confidence = Math.max(0, Math.min(100, (1 - distance / 0.6) * 100));
          
          console.log(`  ✅ MATCH! Confidence: ${confidence.toFixed(2)}%`);
          
          matches.push({
            photoId: photo.photoId,
            distance: distance,
            confidence: confidence.toFixed(2)
          });
          break; // Found match in this photo, move to next
        }
      }
    }
    
    // Sort by confidence (highest first)
    matches.sort((a, b) => b.confidence - a.confidence);
    
    console.log(`✅ Found ${matches.length} matching photo(s)`);
    
    return matches;
  } catch (error) {
    console.error('❌ Face matching error:', error);
    throw error;
  }
};

/**
 * Helper: Create image element from File with resizing
 */
const createImageElement = (file, maxSize = 1024) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      // Resize if image is too large
      if (img.width > maxSize || img.height > maxSize) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Create new image from resized canvas
        const resizedImg = new Image();
        resizedImg.onload = () => resolve(resizedImg);
        resizedImg.onerror = () => reject(new Error('Failed to resize image'));
        resizedImg.src = canvas.toDataURL('image/jpeg', 0.9);
      } else {
        resolve(img);
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
};
