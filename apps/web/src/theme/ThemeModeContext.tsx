'use client';

import * as React from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedThemeMode = 'light' | 'dark';

interface ThemeModeContextValue {
  mode: ThemeMode;
  resolvedMode: ResolvedThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const STORAGE_KEY = 'flood-control-theme-mode';

const ThemeModeContext = React.createContext<ThemeModeContextValue>({
  mode: 'system',
  resolvedMode: 'light',
  setMode: () => {},
  toggleMode: () => {},
});

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<ThemeMode>('system');
  const [systemDark, setSystemDark] = React.useState<boolean>(false);
  const [mounted, setMounted] = React.useState<boolean>(false);

  // Initialize from localStorage and media query
  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
        setModeState(saved);
      }
    } catch {
      // ignore localStorage errors
    }

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDark(mql.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemDark(e.matches);
    };

    if (mql.addEventListener) {
      mql.addEventListener('change', handleChange);
    } else {
      mql.addListener(handleChange);
    }

    setMounted(true);

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handleChange);
      } else {
        mql.removeListener(handleChange);
      }
    };
  }, []);

  const resolvedMode: ResolvedThemeMode = React.useMemo(() => {
    if (!mounted) {
      // During SSR or before mount, check document attribute if set by anti-FOUC script
      if (typeof document !== 'undefined') {
        const docTheme = document.documentElement.dataset.theme as ResolvedThemeMode | undefined;
        if (docTheme === 'dark' || docTheme === 'light') {
          return docTheme;
        }
      }
      return 'light';
    }
    if (mode === 'system') {
      return systemDark ? 'dark' : 'light';
    }
    return mode;
  }, [mode, systemDark, mounted]);

  // Sync DOM dataset, class, and theme-color meta tag
  React.useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.dataset.theme = resolvedMode;
    root.style.colorScheme = resolvedMode;

    if (resolvedMode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Update meta theme-color for mobile address bar
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute(
      'content',
      resolvedMode === 'dark' ? '#0B132B' : '#0B2545'
    );
  }, [resolvedMode, mounted]);

  const setMode = React.useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      window.localStorage.setItem(STORAGE_KEY, newMode);
    } catch {
      // ignore
    }
  }, []);

  const toggleMode = React.useCallback(() => {
    // Cycles: system -> light -> dark -> system (or if currently dark -> light, light -> dark)
    setModeState((current) => {
      let next: ThemeMode;
      if (current === 'light') next = 'dark';
      else if (current === 'dark') next = 'light';
      else {
        // From system, toggle to opposite of current resolved
        next = resolvedMode === 'dark' ? 'light' : 'dark';
      }
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, [resolvedMode]);

  const value = React.useMemo(
    () => ({
      mode,
      resolvedMode,
      setMode,
      toggleMode,
    }),
    [mode, resolvedMode, setMode, toggleMode]
  );

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = React.useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
}
