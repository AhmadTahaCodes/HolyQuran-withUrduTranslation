import { useState, useEffect } from 'react';

export type Theme = 'dark' | 'sepia' | 'light';

const THEME_KEY = 'quran_pwa_theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'sepia') return saved;
    } catch {
      // ignore
    }
    return 'dark'; // Default to dark for high contrast reading
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'sepia');
    root.classList.add(theme);
    
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.warn('Failed to save theme in localStorage:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'dark') return 'sepia';
      if (prev === 'sepia') return 'light';
      return 'dark';
    });
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark'
  };
}
