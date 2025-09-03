import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(storage.getTheme());

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    storage.setTheme(newTheme);
  };

  return { isDark, toggleTheme };
};