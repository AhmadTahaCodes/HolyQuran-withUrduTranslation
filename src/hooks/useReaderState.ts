import { useState, useEffect, useCallback } from 'react';
import { db } from '../db/database';
import quranMeta from '../data/quran_meta.json';

export type ViewMode = 'single' | 'dual' | 'continuous';
export type ActiveView = 'home' | 'reader';

const LOCAL_STORAGE_KEY = 'quran_pwa_active_state';
const OFFSET_STORAGE_KEY = 'quran_pwa_page_offset';
const TOTAL_PAGES = quranMeta.total_pages || 728;

interface SavedState {
  activePage: number;
  viewMode: ViewMode;
  scrollPosition: number;
  activeView?: ActiveView;
  isDrawerOpen?: boolean;
}

export function useReaderState() {
  const [activePage, setActivePage] = useState<number>(() => {
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
    return 1;
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
    } catch (e) {
      // ignore
    }
    return 'single';
  });

  const [activeView, setActiveView] = useState<ActiveView>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed: SavedState = JSON.parse(saved);
        if (parsed.activeView === 'home' || parsed.activeView === 'reader') {
          return parsed.activeView;
        }
      }
    } catch (e) {
      // ignore
    }
    return 'home';
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed: SavedState = JSON.parse(saved);
        if (typeof parsed.isDrawerOpen === 'boolean') {
          return parsed.isDrawerOpen;
        }
      }
    } catch (e) {
      // ignore
    }
    return false;
  });

  const [pageOffset, setPageOffset] = useState<number>(() => {
    try {
      localStorage.removeItem(OFFSET_STORAGE_KEY);
    } catch {
      // ignore
    }
    return 0;
  });

  const [scrollPosition, setScrollPosition] = useState<number>(0);

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
    setScrollPosition
  };
}
