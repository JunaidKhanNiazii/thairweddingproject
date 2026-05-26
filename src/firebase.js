import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

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

// ─── STORAGE ──────────────────────────────────────────────

// Upload file to Firebase Storage with progress callback
// Returns the public download URL
export const uploadFile = (storagePath, file, onProgress) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, storagePath);
    const task = uploadBytesResumable(storageRef, file);
    task.on(
      "state_changed",
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        if (onProgress) onProgress(pct);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
};

// Delete file from Storage
export const deleteFile = (storagePath) =>
  deleteObject(ref(storage, storagePath));
