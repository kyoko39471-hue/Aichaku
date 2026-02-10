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
  serverTimestamp,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';


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

export const incrementItemUsage = async (uid, itemId, localDate) => {
  const ref = doc(db, 'users', uid, 'items', itemId);

  await updateDoc(ref, {
    uses: increment(1),
    lastUsedAt: serverTimestamp(),
    lastUsedLocalDate: localDate, // 'YYYY-MM-DD'
  });
};

export const deleteItem = async (uid, itemId) => {
  const ref = doc(db, 'users', uid, 'items', itemId);
  await deleteDoc(ref);
};

export const updateItem = async (uid, itemId, updates) => {
  const ref = doc(db, 'users', uid, 'items', itemId);

  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

// ---------- newly add by Sijin: Journal ----------

export const getJournalEventsForDay = async (uid, localDate) => {
    const dayRef = doc(db, 'users', uid, 'journalDays', localDate);
    const eventsRef = collection(dayRef, 'events');
    const q = query(eventsRef, orderBy('createdAt', 'asc'));
    const snap = await getDocs(q);

    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
};

export const logItemUsageWithJournal = async (uid, itemSnapshot, localDate) => {
  const itemRef = doc(db, 'users', uid, 'items', itemSnapshot.id);
  const dayRef = doc(db, 'users', uid, 'journalDays', localDate);
  const eventRef = doc(collection(dayRef, 'events'));
  const batch = writeBatch(db);

  // 1) 创建或更新当天容器（只写日期/更新时间）
  batch.set(
    dayRef,
    {
      date: localDate,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );

  // 2) 增加物品 uses
  batch.update(itemRef, {
    uses: increment(1),
    lastUsedAt: serverTimestamp(),
    lastUsedLocalDate: localDate
  });

  // 3) 写入事件快照
  const eventPayload = {
    createdAt: serverTimestamp(),
    itemId: itemSnapshot.id,
    category: itemSnapshot.category,
    itemName: itemSnapshot.name,
    brand: itemSnapshot.brand,
  };

  batch.set(eventRef, eventPayload);

  await batch.commit();

  return {
    id: eventRef.id,
    ...eventPayload
  };
};
