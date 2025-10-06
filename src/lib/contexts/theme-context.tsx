'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const storedTheme = (localStorage.getItem('theme') as Theme) || 'dark';
      setTheme(storedTheme);

      const updateResolvedTheme = (currentTheme: Theme) => {
        if (currentTheme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
            .matches
            ? 'dark'
            : 'light';
          setResolvedTheme(systemTheme);
        } else {
          setResolvedTheme(currentTheme);
        }
      };

      updateResolvedTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const root = document.documentElement;

    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);

    localStorage.setItem('theme', theme);
  }, [theme, resolvedTheme, mounted]);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      setResolvedTheme(systemTheme);
    } else {
      setResolvedTheme(theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(current => (current === 'dark' ? 'light' : 'dark'));
  };

  const value = {
    theme,
    resolvedTheme,
    setTheme: (newTheme: Theme) => {
      if (!mounted) return;
      setTheme(newTheme);
    },
    toggleTheme,
    mounted,
  };

  return (
    <ThemeContext.Provider value={value}>
      <div suppressHydrationWarning>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    if (typeof window === 'undefined') {
      return {
        theme: 'dark' as Theme,
        resolvedTheme: 'dark' as const,
        setTheme: () => {},
        toggleTheme: () => {},
        mounted: false,
      };
    }
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
}
