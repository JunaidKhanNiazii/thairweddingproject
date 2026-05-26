// Face++ API — all calls go through Vercel serverless proxy to avoid CORS
// Proxy endpoints: /api/face-detect, /api/face-search, /api/face-addtoset, /api/face-createset

const post = (endpoint, body) =>
  fetch(`/api/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((r) => r.json());

// Convert File to base64 string
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// ─── CREATE FACESET ───────────────────────────────────────
export const createFaceSet = async (eventId) => {
  const data = await post("face-createset", { eventId });
  if (data.error) throw new Error(data.error);
  return data.faceset_token;
};

// ─── DETECT from URL ─────────────────────────────────────
// Used when photo is uploaded to Storage — send URL to proxy, server fetches it
export const detectFaces = async (imageUrl) => {
  const data = await post("face-detect", { imageUrl });
  if (data.error_message) throw new Error(data.error_message);
  return (data.faces || []).map((f) => f.face_token);
};

// ─── DETECT from File ────────────────────────────────────
// Used for selfie upload
export const detectFacesFromFile = async (file) => {
  const base64 = await fileToBase64(file);
  const data = await post("face-detect", { imageBase64: base64 });
  if (data.error_message) throw new Error(data.error_message);
  return (data.faces || []).map((f) => f.face_token);
};

// ─── ADD TO FACESET ───────────────────────────────────────
export const addFacesToSet = async (eventId, faceTokens) => {
  if (!faceTokens.length) return;
  const data = await post("face-addtoset", { eventId, faceTokens });
  if (data.error) throw new Error(data.error);
  return data;
};

// ─── SEARCH ───────────────────────────────────────────────
export const searchFace = async (eventId, selfieFile, allPhotos = [], threshold = 75) => {
  // Step 1: detect face in selfie
  const selfieTokens = await detectFacesFromFile(selfieFile);
  if (!selfieTokens.length) throw new Error("No face detected in selfie. Please use a clear front-facing photo.");

  // Step 2: collect all known face tokens from existing photos
  const allFaceTokens = [...new Set(allPhotos.flatMap((p) => p.faceTokens || []))];

  // Step 3: search against event FaceSet (auto-creates if missing)
  const data = await post("face-search", { faceToken: selfieTokens[0], eventId, threshold, allFaceTokens });
  if (data.error) throw new Error(data.error);
  return data.results || [];
};
