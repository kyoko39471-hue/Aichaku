import { useEffect, useState } from 'react';
import { getOrCreateCategories } from '../services/firestoreService';

export const useCategories = (user) => {
  const [categoriesData, setCategoriesData] = useState({
    brands: {},
    subcategories: {}
  });

  useEffect(() => {
    if (!user) {
      setCategoriesData({ brands: {}, subcategories: {} });
      return;
    }

    const load = async () => {
      const data = await getOrCreateCategories(user.uid);
      setCategoriesData(data);
    };

    load();
  }, [user]);

  return { categoriesData, setCategoriesData };
};
