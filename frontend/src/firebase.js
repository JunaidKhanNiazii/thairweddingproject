import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

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

// CREATE - add a document to a collection
export const addDocument = (collectionName, data) =>
  addDoc(collection(db, collectionName), data);

// READ - get all documents from a collection
export const getDocuments = async (collectionName) => {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// UPDATE - update a document by id
export const updateDocument = (collectionName, id, data) =>
  updateDoc(doc(db, collectionName, id), data);

// DELETE - delete a document by id
export const deleteDocument = (collectionName, id) =>
  deleteDoc(doc(db, collectionName, id));
