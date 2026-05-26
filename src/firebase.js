import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// ─── EVENTS ───────────────────────────────────────────────

export const createEvent = async (data) => {
  const ref = await addDoc(collection(db, "events"), {
    ...data,
    photoCount: 0,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const getEvents = async () => {
  const snapshot = await getDocs(collection(db, "events"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getEvent = async (eventId) => {
  const snap = await getDoc(doc(db, "events", eventId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

export const updateEvent = (eventId, data) =>
  updateDoc(doc(db, "events", eventId), data);

export const deleteEvent = (eventId) =>
  deleteDoc(doc(db, "events", eventId));

// ─── PHOTOS ───────────────────────────────────────────────

// Save photo metadata + face tokens to Firestore
// imageDataUrl: base64 data URL of the image (stored in Firestore until Storage is added)
export const savePhoto = (eventId, data) =>
  addDoc(collection(db, "events", eventId, "photos"), {
    ...data,
    uploadedAt: serverTimestamp(),
  });

export const getPhotos = async (eventId) => {
  const snapshot = await getDocs(collection(db, "events", eventId, "photos"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deletePhoto = (eventId, photoId) =>
  deleteDoc(doc(db, "events", eventId, "photos", photoId));


// ─── FACESET MANAGEMENT ───────────────────────────────────

/**
 * Save faceset token for an event
 */
export const saveFacesetToken = async (eventId, facesetToken) => {
  await updateEvent(eventId, { facesetToken });
};

/**
 * Get faceset token for an event
 */
export const getFacesetToken = async (eventId) => {
  const event = await getEvent(eventId);
  return event?.facesetToken || null;
};

/**
 * Map face tokens to photo IDs
 * Stores which face tokens belong to which photos
 */
export const saveFaceTokenMapping = async (eventId, photoId, faceTokens) => {
  const mappingRef = doc(db, "events", eventId, "faceTokenMappings", photoId);
  await updateDoc(mappingRef, { faceTokens });
};

/**
 * Get photos that contain matching face tokens
 */
export const getPhotosByFaceTokens = async (eventId, matchingFaceTokens) => {
  const photos = await getPhotos(eventId);
  
  // Filter photos that have any of the matching face tokens
  const matchedPhotos = photos.filter(photo => {
    if (!photo.faceTokens || photo.faceTokens.length === 0) return false;
    return photo.faceTokens.some(token => 
      matchingFaceTokens.some(match => match.face_token === token)
    );
  });
  
  return matchedPhotos;
};
