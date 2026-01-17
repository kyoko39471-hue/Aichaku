// src/hooks/useItems.js
import { useState, useEffect } from 'react';
import {
  getItems,
  addItem as addItemToDB,
  incrementItemUsage,
  deleteItem as deleteItemFromDB
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

  const addItem = async (itemData) => {
    if (!user) return;

    const newItem = await addItemToDB(user.uid, itemData);
    setItems(prev => [...prev, newItem]);
  };

  const logUsage = async (itemId) => {
    if (!user) return;

    await incrementItemUsage(user.uid, itemId);

    setItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, uses: item.uses + 1 }
          : item
      )
    );
  };

  const deleteItem = async (itemId) => {
    if (!user) return;

    await deleteItemFromDB(user.uid, itemId);
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  return {
    items,
    loading,
    addItem,
    logUsage,
    deleteItem
  };
};
