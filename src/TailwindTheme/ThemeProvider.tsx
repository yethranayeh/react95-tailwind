import React, { createContext, useContext, useEffect } from 'react';
import { ThemeName } from './tokens';

const ThemeContext = createContext<{
  theme: ThemeName;
  setTheme: (name: ThemeName) => void;
}>({
  theme: 'original',
  setTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({
  children,
  theme = 'original'
}: {
  children: React.ReactNode;
  theme?: ThemeName;
}) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = (name: ThemeName) => {
    document.documentElement.setAttribute('data-theme', name);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
