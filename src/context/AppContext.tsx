import { createContext, useContext } from 'react';
import type { User } from 'firebase/auth';
import type { Couple } from '../hooks/useCouple';
import type { Adventure } from '../types/adventure';

interface AppContextType {
  user: User;
  couple: Couple;
  adventures: Adventure[];
  addAdventure: (data: Omit<Adventure, 'id' | 'status'>) => Promise<void>;
  completeAdventure: (id: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AppContext = createContext<AppContextType | null>(null);

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
