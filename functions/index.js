const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
const FormData = require("form-data");

admin.initializeApp();

const FACEPP_API_KEY = functions.config().facepp.api_key;
const FACEPP_API_SECRET = functions.config().facepp.api_secret;
const FACEPP_DETECT_URL = "https://api-us.faceplusplus.com/facepp/v3/detect";
const FACEPP_SEARCH_URL = "https://api-us.faceplusplus.com/facepp/v3/search";
const FACEPP_FACESET_CREATE = "https://api-us.faceplusplus.com/facepp/v3/faceset/create";
const FACEPP_FACESET_ADDFACE = "https://api-us.faceplusplus.com/facepp/v3/faceset/addface";

// ═══════════════════════════════════════════════════════════
// ADMIN: Detect faces when photo is uploaded
// ═══════════════════════════════════════════════════════════
exports.detectFacesOnUpload = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  
  // Only process event photos (not selfies)
  if (!filePath.startsWith("events/") || filePath.includes("/selfies/")) {
    return null;
  }

  // Extract eventId from path: events/{eventId}/photos/{photoId}
  const pathParts = filePath.split("/");
  if (pathParts.length < 4) return null;
  
  const eventId = pathParts[1];
  const photoId = pathParts[3].split(".")[0];

  console.log(`Processing photo: ${photoId} for event: ${eventId}`);

  try {
    // Get download URL
    const bucket = admin.storage().bucket(object.bucket);
    const file = bucket.file(filePath);
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    // Call Face++ Detect API
    const formData = new FormData();
    formData.append("api_key", FACEPP_API_KEY);
    formData.append("api_secret", FACEPP_API_SECRET);
    formData.append("image_url", url);
    formData.append("return_attributes", "none");

    const detectResponse = await fetch(FACEPP_DETECT_URL, {
      method: "POST",
      body: formData,
    });

    const detectData = await detectResponse.json();

    if (detectData.error_message) {
      console.error("Face++ Error:", detectData.error_message);
      return null;
    }

    const faces = detectData.faces || [];
    console.log(`Detected ${faces.length} faces in photo ${photoId}`);

    if (faces.length === 0) {
      // No faces detected, just save photo metadata
      await admin.firestore()
        .collection("events").doc(eventId)
        .collection("photos").doc(photoId)
        .set({
          url: filePath,
          faceCount: 0,
          uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      return null;
    }

    // Ensure faceset exists for this event
    await ensureFaceSet(eventId);

    // Add faces to faceset and save to Firestore
    const faceTokens = faces.map((f) => f.face_token);
    
    // Add faces to Face++ faceset
    await addFacesToFaceSet(eventId, faceTokens);

    // Save photo metadata with face tokens
    await admin.firestore()
      .collection("events").doc(eventId)
      .collection("photos").doc(photoId)
      .set({
        url: filePath,
        faceCount: faces.length,
        faceTokens: faceTokens,
        uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    // Save individual face documents for quick lookup
    const batch = admin.firestore().batch();
    faces.forEach((face, index) => {
      const faceRef = admin.firestore()
        .collection("events").doc(eventId)
        .collection("faces").doc(face.face_token);
      
      batch.set(faceRef, {
        photoId: photoId,
        faceToken: face.face_token,
        faceRectangle: face.face_rectangle,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();

    console.log(`Successfully processed ${faces.length} faces for photo ${photoId}`);
    return null;

  } catch (error) {
    console.error("Error processing photo:", error);
    return null;
  }
});

// ═══════════════════════════════════════════════════════════
// CLIENT: Search for matching faces
// ═══════════════════════════════════════════════════════════
exports.searchFaces = functions.https.onCall(async (data, context) => {
  const { eventId, selfieBase64 } = data;

  if (!eventId || !selfieBase64) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "eventId and selfieBase64 are required"
    );
  }

  try {
    console.log(`Searching faces for event: ${eventId}`);

    // Call Face++ Search API
    const formData = new FormData();
    formData.append("api_key", FACEPP_API_KEY);
    formData.append("api_secret", FACEPP_API_SECRET);
    formData.append("image_base64", selfieBase64.split(",")[1]); // Remove data:image/jpeg;base64, prefix
    formData.append("faceset_token", `event_${eventId}`);
    formData.append("return_result_count", "50");

    const searchResponse = await fetch(FACEPP_SEARCH_URL, {
      method: "POST",
      body: formData,
    });

    const searchData = await searchResponse.json();

    if (searchData.error_message) {
      console.error("Face++ Search Error:", searchData.error_message);
      throw new functions.https.HttpsError("internal", searchData.error_message);
    }

    const results = searchData.results || [];
    console.log(`Found ${results.length} potential matches`);

    // Filter by confidence threshold (75%)
    const CONFIDENCE_THRESHOLD = 75;
    const matches = results.filter((r) => r.confidence >= CONFIDENCE_THRESHOLD);

    if (matches.length === 0) {
      return { photos: [] };
    }

    // Get unique face tokens
    const matchedFaceTokens = matches.map((m) => m.face_token);

    // Lookup photos from Firestore
    const facesSnapshot = await admin.firestore()
      .collection("events").doc(eventId)
      .collection("faces")
      .where(admin.firestore.FieldPath.documentId(), "in", matchedFaceTokens.slice(0, 10)) // Firestore limit
      .get();

    const photoIds = new Set();
    facesSnapshot.forEach((doc) => {
      photoIds.add(doc.data().photoId);
    });

    // Get photo URLs
    const photosSnapshot = await admin.firestore()
      .collection("events").doc(eventId)
      .collection("photos")
      .where(admin.firestore.FieldPath.documentId(), "in", Array.from(photoIds))
      .get();

    const photos = [];
    for (const doc of photosSnapshot.docs) {
      const photoData = doc.data();
      const bucket = admin.storage().bucket();
      const file = bucket.file(photoData.url);
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      photos.push({
        id: doc.id,
        url: url,
        faceCount: photoData.faceCount,
      });
    }

    console.log(`Returning ${photos.length} matched photos`);
    return { photos };

  } catch (error) {
    console.error("Error searching faces:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// ═══════════════════════════════════════════════════════════
// HELPER: Ensure faceset exists for event
// ═══════════════════════════════════════════════════════════
async function ensureFaceSet(eventId) {
  const facesetToken = `event_${eventId}`;
  
  // Check if faceset already exists in Firestore
  const eventDoc = await admin.firestore()
    .collection("events").doc(eventId).get();
  
  if (eventDoc.exists && eventDoc.data().facesetToken) {
    return facesetToken;
  }

  // Create new faceset in Face++
  const formData = new FormData();
  formData.append("api_key", FACEPP_API_KEY);
  formData.append("api_secret", FACEPP_API_SECRET);
  formData.append("outer_id", facesetToken);
  formData.append("display_name", `Event ${eventId}`);

  const response = await fetch(FACEPP_FACESET_CREATE, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (data.error_message && !data.error_message.includes("FACESET_EXIST")) {
    console.error("Error creating faceset:", data.error_message);
    throw new Error(data.error_message);
  }

  // Save faceset token to event document
  await admin.firestore()
    .collection("events").doc(eventId)
    .update({
      facesetToken: facesetToken,
    });

  console.log(`Created faceset: ${facesetToken}`);
  return facesetToken;
}

// ═══════════════════════════════════════════════════════════
// HELPER: Add faces to faceset
// ═══════════════════════════════════════════════════════════
async function addFacesToFaceSet(eventId, faceTokens) {
  const facesetToken = `event_${eventId}`;

  const formData = new FormData();
  formData.append("api_key", FACEPP_API_KEY);
  formData.append("api_secret", FACEPP_API_SECRET);
  formData.append("outer_id", facesetToken);
  formData.append("face_tokens", faceTokens.join(","));

  const response = await fetch(FACEPP_FACESET_ADDFACE, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (data.error_message) {
    console.error("Error adding faces to faceset:", data.error_message);
    throw new Error(data.error_message);
  }

  console.log(`Added ${faceTokens.length} faces to faceset ${facesetToken}`);
  return data;
}
