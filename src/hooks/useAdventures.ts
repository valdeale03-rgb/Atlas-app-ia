import { useState, useEffect } from 'react';
import type { Adventure } from '../types/adventure';
import { INITIAL_ADVENTURES } from '../types/adventure';

export function useAdventures() {
  const [adventures, setAdventures] = useState<Adventure[]>(() => {
    const saved = localStorage.getItem('atlas_adventures');
    return saved ? JSON.parse(saved) : INITIAL_ADVENTURES;
  });

  useEffect(() => {
    localStorage.setItem('atlas_adventures', JSON.stringify(adventures));
  }, [adventures]);

  const addAdventure = (adventure: Omit<Adventure, 'id'>) => {
    const newAdventure: Adventure = {
      ...adventure,
      id: adventure.title.toLowerCase().replace(/ /g, '-'),
      status: 'locked'
    };
    setAdventures(prev => [...prev, newAdventure]);
  };

  const completeAdventure = (id: string) => {
    setAdventures(prev => prev.map(adv => 
      adv.id === id ? { ...adv, status: 'completed' } : adv
    ));
  };

  return { adventures, addAdventure, completeAdventure };
}
