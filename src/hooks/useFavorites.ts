import { useState, useEffect } from 'react';

export const useFavorites = () => {
  // Load favorites from localStorage
  const loadFavorites = (): number[] => {
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  };

  const [favorites, setFavorites] = useState<number[]>(loadFavorites);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Check if a media ID is in favorites
  const isFavorite = (id: number): boolean => {
    if (!id) return false;
    return favorites.includes(id);
  };

  // Add a media ID to favorites
  const addToFavorites = (id: number): void => {
    if (!id) return;
    if (!isFavorite(id)) {
      setFavorites((prev) => [...prev, id]);
    }
  };

  // Remove a media ID from favorites
  const removeFromFavorites = (id: number): void => {
    if (!id) return;
    setFavorites((prev) => prev.filter((itemId) => itemId !== id));
  };

  // Toggle favorite status
  const toggleFavorite = (id: number): void => {
    if (isFavorite(id)) {
      removeFromFavorites(id);
    } else {
      addToFavorites(id);
    }
  };

  // Get all favorites
  const getAllFavorites = (): number[] => {
    return favorites;
  };

  return {
    favorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    getAllFavorites
  };
};

export default useFavorites;
