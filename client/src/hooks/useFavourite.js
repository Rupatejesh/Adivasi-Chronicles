import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { favouritesApi } from '../services/api.js';

export function useFavourites(itemType) {
  const { isAuthenticated } = useAuth();
  const [savedIds, setSavedIds] = useState([]);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setSavedIds([]);
      return;
    }
    try {
      const data = await favouritesApi.list(itemType ? { itemType } : undefined);
      setSavedIds((data.favourites || []).map((fav) => String(fav.itemId)));
    } catch {
      setSavedIds([]);
    }
  }, [isAuthenticated, itemType]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = useCallback(async (type, itemId) => {
    const res = await favouritesApi.toggle(type, itemId);
    setSavedIds((prev) => {
      const key = String(itemId);
      if (res.saved) return prev.includes(key) ? prev : [...prev, key];
      return prev.filter((id) => id !== key);
    });
    return res.saved;
  }, []);

  const isSaved = useCallback((itemId) => savedIds.includes(String(itemId)), [savedIds]);

  return { savedIds, isSaved, toggle, refresh };
}
