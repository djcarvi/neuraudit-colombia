import { createContext } from 'react';

export interface InitialLoadContextType {
  pageloading: boolean;
  setpageloading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Initialload = createContext<InitialLoadContextType | null>(null);
