/* 
src/hooks/useItems.js
1) It provides functions to fetch, add, update, delete, and log usage of items.
2) It's the middle ground between the UI components and the Firestore service layer.
3) It's a custom React hook that manages the state and side effects related to items.
*/

import { useState, useEffect } from 'react';
import {
  getItems,
  addItem as addItemToDB,
  incrementItemUsage,
  deleteItem as deleteItemFromDB,
  updateItem as updateItemInDB
} from '../services/firestoreService';

export const useItems = (user) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    const fetchItems = async () => {
      setLoading(true);
      const data = await getItems(user.uid);
      setItems(data);
      setLoading(false);
    };

    fetchItems();
  }, [user]);

  const getLocalDateString = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const addItem = async (itemData) => {
    if (!user) return;

    const newItem = await addItemToDB(user.uid, itemData);
    setItems(prev => [...prev, newItem]);
  };

  const logUsage = async (itemId) => {
    if (!user) return;

    const localDate = getLocalDateString();

    await incrementItemUsage(user.uid, itemId, localDate);

    setItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              uses: item.uses + 1,
              lastUsedLocalDate: localDate,
              // lastUsedAt intentionally omitted or left unchanged locally
            }
          : item
      )
    );
  };

  const deleteItem = async (itemId) => {
    if (!user) return;

    await deleteItemFromDB(user.uid, itemId);
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateItem = async (itemId, updatedData) => {
    if (!user) return;

    await updateItemInDB(user.uid, itemId, updatedData);

    setItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, ...updatedData }
          : item
      )
    );
  }

  return {
    items,
    loading,
    addItem,
    logUsage,
    deleteItem,
    updateItem
  };
};
