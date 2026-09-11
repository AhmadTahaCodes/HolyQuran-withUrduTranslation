import { useState, useEffect, useCallback } from 'react';
import { db } from '../db/database';
import quranMeta from '../data/quran_meta.json';
import type { Language } from '../utils/i18n';

export type ViewMode = 'single' | 'dual' | 'continuous';
export type ActiveView = 'home' | 'reader' | 'bookmarks';

const LOCAL_STORAGE_KEY = 'quran_pwa_active_state';
const OFFSET_STORAGE_KEY = 'quran_pwa_page_offset';
const LANG_STORAGE_KEY = 'quran_pwa_language';
export const TOTAL_PAGES = quranMeta.total_pages || 729;

interface SavedState {
  activePage: number;
  viewMode: ViewMode;
  scrollPosition: number;
  activeView?: ActiveView;
  isDrawerOpen?: boolean;
}

export function useReaderState() {
  // Read initial view and page from URL hash if present
  const getInitialRoute = (): { view: ActiveView; page: number } => {
    const hash = window.location.hash.toLowerCase();
    if (hash.startsWith('#reader')) {
      const pageMatch = hash.match(/page=(\d+)/) || hash.match(/\/(\d+)/);
      const p = pageMatch ? parseInt(pageMatch[1], 10) : 1;
      return { view: 'reader', page: Math.max(1, Math.min(TOTAL_PAGES, p)) };
    }
    if (hash.startsWith('#bookmarks')) {
      return { view: 'bookmarks', page: 1 };
    }
    return { view: 'home', page: 1 };
  };

  const initialRoute = getInitialRoute();

  const [activePage, setActivePage] = useState<number>(() => {
    if (initialRoute.view === 'reader' && initialRoute.page) {
      return initialRoute.page;
    }
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed: SavedState = JSON.parse(saved);
        if (parsed.activePage >= 1 && parsed.activePage <= TOTAL_PAGES) {
          return parsed.activePage;
        }
      }
    } catch (e) {
      console.warn("Failed to parse local reading state:", e);
    }
    return 2;
  });

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed: SavedState = JSON.parse(saved);
        if (['single', 'dual', 'continuous'].includes(parsed.viewMode)) {
          return parsed.viewMode;
        }
      }
    } catch {
      // ignore
    }
    return 'continuous';
  });

  const [activeView, setActiveViewState] = useState<ActiveView>(() => {
    if (['home', 'reader', 'bookmarks'].includes(initialRoute.view)) {
      return initialRoute.view;
    }
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed: SavedState = JSON.parse(saved);
        if (['home', 'reader', 'bookmarks'].includes(parsed.activeView as any)) {
          return parsed.activeView as ActiveView;
        }
      }
    } catch {
      // ignore
    }
    return 'home';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'en' || saved === 'ur') return saved;
    } catch {
      // ignore
    }
    return 'en';
  });

  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {
      console.warn("Failed to save language:", e);
    }
  };

  // Sync state to URL hash with History API (Prevents App Closure on Mobile Back Button)
  const setActiveView = useCallback((newView: ActiveView, pageNum?: number) => {
    const targetPage = pageNum || activePage;
    let newHash = '#home';
    if (newView === 'reader') {
      newHash = `#reader?page=${targetPage}`;
    } else if (newView === 'bookmarks') {
      newHash = '#bookmarks';
    }

    if (window.location.hash !== newHash) {
      window.history.pushState({ view: newView, page: targetPage }, '', newHash);
    }

    setActiveViewState(newView);
    if (pageNum) {
      setActivePage(Math.max(1, Math.min(TOTAL_PAGES, pageNum)));
    }
  }, [activePage]);

  // Listen to Browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      // If a modal or drawer is open, close it first without navigating view
      if (isDrawerOpen) {
        setIsDrawerOpen(false);
        return;
      }

      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#reader')) {
        const pageMatch = hash.match(/page=(\d+)/) || hash.match(/\/(\d+)/);
        if (pageMatch) {
          const p = parseInt(pageMatch[1], 10);
          setActivePage(Math.max(1, Math.min(TOTAL_PAGES, p)));
        }
        setActiveViewState('reader');
      } else if (hash.startsWith('#bookmarks')) {
        setActiveViewState('bookmarks');
      } else {
        setActiveViewState('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isDrawerOpen]);

  // Update hash when activePage changes in reader view
  useEffect(() => {
    if (activeView === 'reader') {
      const currentHash = `#reader?page=${activePage}`;
      if (window.location.hash !== currentHash) {
        window.history.replaceState({ view: 'reader', page: activePage }, '', currentHash);
      }
    }
  }, [activePage, activeView]);

  // Save page calibration offset
  const updatePageOffset = (offset: number) => {
    setPageOffset(offset);
    try {
      localStorage.setItem(OFFSET_STORAGE_KEY, offset.toString());
    } catch (e) {
      console.warn("Failed to save offset:", e);
    }
  };

  // Auto-save full state to localStorage & IndexedDB with debounce
  useEffect(() => {
    const handler = setTimeout(async () => {
      const stateToSave: SavedState = {
        activePage,
        viewMode,
        scrollPosition,
        activeView,
        isDrawerOpen
      };
      
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
        await db.readingState.put({
          id: 'active',
          lastActivePage: activePage,
          scrollPosition,
          viewMode,
          updatedAt: Date.now()
        });
      } catch (err) {
        console.error("Failed to persist reading state:", err);
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [activePage, viewMode, scrollPosition, activeView, isDrawerOpen]);

  const goToPage = useCallback((page: number, applyOffset = false) => {
    const target = applyOffset ? page + pageOffset : page;
    const clamped = Math.max(1, Math.min(TOTAL_PAGES, target));
    setActivePage(clamped);
  }, [pageOffset]);

  const nextPage = useCallback(() => {
    setActivePage(prev => {
      const delta = viewMode === 'dual' ? 2 : 1;
      return Math.min(TOTAL_PAGES, prev + delta);
    });
  }, [viewMode]);

  const prevPage = useCallback(() => {
    setActivePage(prev => {
      const delta = viewMode === 'dual' ? 2 : 1;
      return Math.max(1, prev - delta);
    });
  }, [viewMode]);

  return {
    activePage,
    goToPage,
    nextPage,
    prevPage,
    viewMode,
    setViewMode,
    activeView,
    setActiveView,
    isDrawerOpen,
    setIsDrawerOpen,
    pageOffset,
    updatePageOffset,
    scrollPosition,
    setScrollPosition,
    language,
    setLanguage,
    isZenMode,
    setIsZenMode
  };
}
