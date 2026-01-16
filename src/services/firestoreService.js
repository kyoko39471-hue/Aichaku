import { db } from '../firebase';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  increment,
  serverTimestamp
} from 'firebase/firestore';

// ---------- Categories ----------

//fetching or initializing user-specific category data
export const getOrCreateCategories = async (uid) => {
  const ref = doc(db, 'users', uid, 'metadata', 'categories');
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data();
  }

  const defaultCategories = {
    brands: {
      Closet: [],
      Beauty: [],
      Appliances: []
    },
    subcategories: {
      Closet: [],
      Beauty: [],
      Appliances: []
    }
  };

  await setDoc(ref, defaultCategories);
  return defaultCategories;
};

export const updateCategories = async (uid, categoriesData) => {
  const ref = doc(db, 'users', uid, 'metadata', 'categories');
  await setDoc(ref, categoriesData, { merge: true });
};

// ---------- Items ----------

export const getItems = async (uid) => {
  const ref = collection(db, 'users', uid, 'items');
  const snap = await getDocs(ref);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const addItem = async (uid, itemData) => {
  const ref = collection(db, 'users', uid, 'items');

  const payload = {
    ...itemData,
    uses: itemData.uses ?? 0,
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(ref, payload);

  return {
    id: docRef.id,
    ...payload
  };
};

export const incrementItemUsage = async (uid, itemId) => {
  const ref = doc(db, 'users', uid, 'items', itemId);
  await updateDoc(ref, { uses: increment(1) });
};

export const deleteItem = async (uid, itemId) => {
  const ref = doc(db, 'users', uid, 'items', itemId);
  await deleteDoc(ref);
};
