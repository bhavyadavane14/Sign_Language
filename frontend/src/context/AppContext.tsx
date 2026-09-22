import React, { createContext, useState } from 'react';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  confidenceThreshold: number;
  setConfidenceThreshold: (val: number) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.75);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <AppContext.Provider value={{ theme, toggleTheme, confidenceThreshold, setConfidenceThreshold }}>
      {children}
    </AppContext.Provider>
  );
};
