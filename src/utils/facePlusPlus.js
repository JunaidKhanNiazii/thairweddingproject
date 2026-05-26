// Face++ API Integration (Direct from React)

const API_KEY = import.meta.env.VITE_FACEPP_API_KEY;
const API_SECRET = import.meta.env.VITE_FACEPP_API_SECRET;
const BASE_URL = 'https://api-us.faceplusplus.com/facepp/v3';

/**
 * Convert File to base64 string
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Remove data URL prefix (data:image/jpeg;base64,)
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Detect faces in an image
 * @param {File} imageFile - Image file
 * @returns {Promise<Array>} Array of face tokens
 */
export const detectFaces = async (imageFile) => {
  try {
    const base64Image = await fileToBase64(imageFile);
    
    const formData = new FormData();
    formData.append('api_key', API_KEY);
    formData.append('api_secret', API_SECRET);
    formData.append('image_base64', base64Image);
    
    const response = await fetch(`${BASE_URL}/detect`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.error_message) {
      throw new Error(data.error_message);
    }
    
    return data.faces.map(face => face.face_token);
  } catch (error) {
    console.error('Face detection error:', error);
    throw error;
  }
};

/**
 * Create a faceset for an event
 * @param {string} eventId - Event ID
 * @returns {Promise<string>} Faceset token
 */
export const createFaceset = async (eventId) => {
  try {
    const formData = new FormData();
    formData.append('api_key', API_KEY);
    formData.append('api_secret', API_SECRET);
    formData.append('outer_id', `event_${eventId}`);
    formData.append('display_name', `Event ${eventId}`);
    
    const response = await fetch(`${BASE_URL}/faceset/create`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.error_message) {
      throw new Error(data.error_message);
    }
    
    return data.faceset_token;
  } catch (error) {
    console.error('Faceset creation error:', error);
    throw error;
  }
};

/**
 * Add faces to a faceset
 * @param {string} facesetToken - Faceset token
 * @param {Array<string>} faceTokens - Array of face tokens
 * @returns {Promise<Object>} Result
 */
export const addFacesToFaceset = async (facesetToken, faceTokens) => {
  try {
    const formData = new FormData();
    formData.append('api_key', API_KEY);
    formData.append('api_secret', API_SECRET);
    formData.append('faceset_token', facesetToken);
    formData.append('face_tokens', faceTokens.join(','));
    
    const response = await fetch(`${BASE_URL}/faceset/addface`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.error_message) {
      throw new Error(data.error_message);
    }
    
    return data;
  } catch (error) {
    console.error('Add faces error:', error);
    throw error;
  }
};

/**
 * Search for matching faces in a faceset
 * @param {File} selfieFile - Selfie image file
 * @param {string} facesetToken - Faceset token to search in
 * @param {number} threshold - Confidence threshold (0-100), default 75
 * @returns {Promise<Array>} Array of matching face tokens with confidence
 */
export const searchFaces = async (selfieFile, facesetToken, threshold = 75) => {
  try {
    const base64Image = await fileToBase64(selfieFile);
    
    // Use Vercel serverless function to avoid CORS
    const response = await fetch('/api/searchFaces', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        selfieBase64: base64Image,
        facesetToken: facesetToken
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data.matches || [];
  } catch (error) {
    console.error('Face search error:', error);
    throw error;
  }
};

/**
 * Get faceset details
 * @param {string} eventId - Event ID
 * @returns {Promise<Object>} Faceset details
 */
export const getFaceset = async (eventId) => {
  try {
    const formData = new FormData();
    formData.append('api_key', API_KEY);
    formData.append('api_secret', API_SECRET);
    formData.append('outer_id', `event_${eventId}`);
    
    const response = await fetch(`${BASE_URL}/faceset/getdetail`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.error_message) {
      // Faceset doesn't exist
      if (data.error_message.includes('INVALID_OUTER_ID')) {
        return null;
      }
      throw new Error(data.error_message);
    }
    
    return data;
  } catch (error) {
    console.error('Get faceset error:', error);
    throw error;
  }
};
