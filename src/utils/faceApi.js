// Face++ API service
// Free tier: 1000 calls/month
// Docs: https://console.faceplusplus.com/documents/5679127

const API_KEY = import.meta.env.VITE_FACEPP_API_KEY;
const API_SECRET = import.meta.env.VITE_FACEPP_API_SECRET;
const BASE_URL = "https://api-us.faceplusplus.com/facepp/v3";

// ─── TEST CONNECTION ───────────────────────────────────────
// Call this once to verify API keys are working
export const testConnection = async () => {
  const form = new FormData();
  form.append("api_key", API_KEY);
  form.append("api_secret", API_SECRET);
  // Use a tiny 1x1 pixel image to test auth
  const res = await fetch(`${BASE_URL}/detect`, { method: "POST", body: form });
  const data = await res.json();
  // If keys are wrong we get AUTHENTICATION_ERROR
  if (data.error_message === "AUTHENTICATION_ERROR") throw new Error("Invalid Face++ API keys");
  // Any other response (even no face found) means keys are valid
  return true;
};

// ─── FACESET ──────────────────────────────────────────────
// Each event gets its own FaceSet identified by outer_id = eventId

export const createFaceSet = async (eventId) => {
  const form = new FormData();
  form.append("api_key", API_KEY);
  form.append("api_secret", API_SECRET);
  form.append("outer_id", eventId);
  form.append("display_name", eventId);
  const res = await fetch(`${BASE_URL}/faceset/create`, { method: "POST", body: form });
  const data = await res.json();
  if (data.error_message) throw new Error(data.error_message);
  return data.faceset_token;
};

// ─── DETECT ───────────────────────────────────────────────
// Detect faces from a Firebase Storage URL, returns array of face_tokens

export const detectFaces = async (imageUrl) => {
  const form = new FormData();
  form.append("api_key", API_KEY);
  form.append("api_secret", API_SECRET);
  form.append("image_url", imageUrl);
  form.append("return_attributes", "none");
  const res = await fetch(`${BASE_URL}/detect`, { method: "POST", body: form });
  const data = await res.json();
  if (data.error_message) throw new Error(data.error_message);
  return (data.faces || []).map((f) => f.face_token);
};

// Detect faces from a File object (for selfie upload)

export const detectFacesFromFile = async (file) => {
  const form = new FormData();
  form.append("api_key", API_KEY);
  form.append("api_secret", API_SECRET);
  form.append("image_file", file);
  form.append("return_attributes", "none");
  const res = await fetch(`${BASE_URL}/detect`, { method: "POST", body: form });
  const data = await res.json();
  if (data.error_message) throw new Error(data.error_message);
  return (data.faces || []).map((f) => f.face_token);
};

// ─── ADD TO FACESET ───────────────────────────────────────

export const addFacesToSet = async (eventId, faceTokens) => {
  if (!faceTokens.length) return;
  const form = new FormData();
  form.append("api_key", API_KEY);
  form.append("api_secret", API_SECRET);
  form.append("outer_id", eventId);
  form.append("face_tokens", faceTokens.join(","));
  const res = await fetch(`${BASE_URL}/faceset/addface`, { method: "POST", body: form });
  const data = await res.json();
  if (data.error_message) throw new Error(data.error_message);
  return data;
};

// ─── SEARCH ───────────────────────────────────────────────
// Upload selfie file → detect face → search against event FaceSet
// Returns matched face tokens above confidence threshold

export const searchFace = async (eventId, selfieFile, threshold = 75) => {
  // Step 1: detect face in selfie
  const selfieTokens = await detectFacesFromFile(selfieFile);
  if (!selfieTokens.length) throw new Error("No face detected in selfie. Please use a clear front-facing photo.");

  // Step 2: search against event FaceSet
  const form = new FormData();
  form.append("api_key", API_KEY);
  form.append("api_secret", API_SECRET);
  form.append("outer_id", eventId);
  form.append("face_token", selfieTokens[0]);
  form.append("return_result_count", 100);
  const res = await fetch(`${BASE_URL}/search`, { method: "POST", body: form });
  const data = await res.json();
  if (data.error_message) throw new Error(data.error_message);

  // Filter by confidence threshold
  return (data.results || [])
    .filter((r) => r.confidence >= threshold)
    .map((r) => ({ faceToken: r.face_token, confidence: r.confidence }));
};
