import { useState, useEffect } from 'react';
import { useReaderState } from './hooks/useReaderState';
import { useBookmarks } from './hooks/useBookmarks';
import { useUserProfile } from './hooks/useUserProfile';
import { useTheme } from './hooks/useTheme';

import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { ReaderCanvas } from './components/ReaderCanvas';
import { NavigationDrawer } from './components/NavigationDrawer';
import { BookmarkModal } from './components/BookmarkModal';
import { BookmarkManager } from './components/BookmarkManager';
import { SearchModal } from './components/SearchModal';
import { OfflineManager } from './components/OfflineManager';
import { WelcomeModal } from './components/WelcomeModal';
import { SettingsModal } from './components/SettingsModal';
import { MobileNavbar } from './components/MobileNavbar';

import { getPageMetadata } from './utils/pageFallback';
import type { Bookmark } from './db/database';

export function App() {
  const {
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
    updatePageOffset
  } = useReaderState();

  const { theme, toggleTheme } = useTheme();
  const { allBookmarks, addBookmark, removeBookmark, updateBookmarkNote } = useBookmarks(activePage);
  const { userName, saveUserName, isFirstVisit, setIsFirstVisit } = useUserProfile();

  // UI Modals State
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isBookmarkManagerOpen, setIsBookmarkManagerOpen] = useState(false);
  const [isOfflineManagerOpen, setIsOfflineManagerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Active Pending Bookmark Pin Modal State
  const [bookmarkModalState, setBookmarkModalState] = useState<{
    isOpen: boolean;
    pageNumber: number;
    yRatio: number;
    xRatio: number;
    existingBookmark?: Bookmark | null;
  }>({
    isOpen: false,
    pageNumber: 1,
    yRatio: 0.5,
    xRatio: 0.5,
    existingBookmark: null
  });

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Keyboard Navigation & Shortcuts (Arrow Keys, Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K / Cmd+K to open Search Modal
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
        return;
      }

      // Don't trigger arrow navigation if typing in inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (activeView === 'reader') {
        if (e.key === 'ArrowRight') {
          // Right Arrow goes to Previous Page (RTL)
          prevPage();
        } else if (e.key === 'ArrowLeft') {
          // Left Arrow goes to Next Page
          nextPage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevPage, nextPage, activeView]);

  // Open Reader directly to specific page
  const handleOpenReaderPage = (pageNumber?: number) => {
    if (pageNumber !== undefined) {
      goToPage(pageNumber);
    }
    setActiveView('reader');
  };

  // Open Bookmark Modal on Canvas Long-Press / Right-Click
  const handleAddBookmarkClick = (pageNumber: number, yRatio: number, xRatio: number) => {
    setBookmarkModalState({
      isOpen: true,
      pageNumber,
      yRatio,
      xRatio,
      existingBookmark: null
    });
  };

  // Open Bookmark Modal for Editing Existing Pin
  const handleSelectBookmarkPin = (bookmark: Bookmark) => {
    setBookmarkModalState({
      isOpen: true,
      pageNumber: bookmark.pageNumber,
      yRatio: bookmark.yRatio,
      xRatio: bookmark.xRatio,
      existingBookmark: bookmark
    });
  };

  // Save Bookmark Note Handler
  const handleSaveBookmark = async (note: string, color: string) => {
    if (bookmarkModalState.existingBookmark?.id) {
      // Update existing
      await updateBookmarkNote(bookmarkModalState.existingBookmark.id, note, color);
    } else {
      // Create new
      const meta = getPageMetadata(bookmarkModalState.pageNumber);
      await addBookmark({
        pageNumber: bookmarkModalState.pageNumber,
        yRatio: bookmarkModalState.yRatio,
        xRatio: bookmarkModalState.xRatio,
        surahName: meta.surah.name_english,
        surahId: meta.surah.id,
        note,
        color
      });
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      {/* Header Bar */}
      <Header
        activePage={activePage}
        onPageChange={handleOpenReaderPage}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
        onOpenBookmarkManager={() => setIsBookmarkManagerOpen(true)}
        onOpenOfflineManager={() => setIsOfflineManagerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isOnline={isOnline}
        userName={userName}
        activeView={activeView}
        onSelectView={setActiveView}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main View Area: Home Screen vs Reader Canvas */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {activeView === 'home' ? (
          <HomeScreen
            userName={userName}
            activePage={activePage}
            onOpenReader={handleOpenReaderPage}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onOpenSearch={() => setIsSearchModalOpen(true)}
            onOpenBookmarks={() => setIsBookmarkManagerOpen(true)}
            onOpenOffline={() => setIsOfflineManagerOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            totalBookmarks={allBookmarks.length}
          />
        ) : (
          <ReaderCanvas
            activePage={activePage}
            onPageChange={goToPage}
            viewMode={viewMode}
            bookmarks={allBookmarks}
            onAddBookmark={handleAddBookmarkClick}
            onSelectBookmarkPin={handleSelectBookmarkPin}
            pageOffset={pageOffset}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNavbar
        activeTab={activeView}
        onSelectTab={setActiveView}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenBookmarks={() => setIsBookmarkManagerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* First Visit Personalized Welcome Modal */}
      <WelcomeModal
        isOpen={isFirstVisit}
        onSaveName={(name) => saveUserName(name)}
        onClose={() => setIsFirstVisit(false)}
      />

      {/* Slide-Over Navigation Drawer */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activePage={activePage}
        onSelectPage={handleOpenReaderPage}
        bookmarks={allBookmarks}
        onDeleteBookmark={removeBookmark}
        userName={userName}
        onUpdateUserName={saveUserName}
        pageOffset={pageOffset}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectPage={handleOpenReaderPage}
        pageOffset={pageOffset}
        onUpdatePageOffset={updatePageOffset}
      />

      {/* Dedicated Bookmark Manager Modal */}
      <BookmarkManager
        isOpen={isBookmarkManagerOpen}
        onClose={() => setIsBookmarkManagerOpen(false)}
        bookmarks={allBookmarks}
        onSelectPage={handleOpenReaderPage}
        onDeleteBookmark={removeBookmark}
        onEditBookmark={handleSelectBookmarkPin}
      />

      {/* Coordinate Pin Add/Edit Modal */}
      <BookmarkModal
        isOpen={bookmarkModalState.isOpen}
        onClose={() => setBookmarkModalState(prev => ({ ...prev, isOpen: false }))}
        pageNumber={bookmarkModalState.pageNumber}
        yRatio={bookmarkModalState.yRatio}
        xRatio={bookmarkModalState.xRatio}
        existingBookmark={bookmarkModalState.existingBookmark}
        onSave={handleSaveBookmark}
        onDelete={removeBookmark}
      />

      {/* Offline Storage Manager Modal */}
      <OfflineManager
        isOpen={isOfflineManagerOpen}
        onClose={() => setIsOfflineManagerOpen(false)}
      />

      {/* Application Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        pageOffset={pageOffset}
        onUpdatePageOffset={updatePageOffset}
        userName={userName}
        onUpdateUserName={saveUserName}
        onOpenOfflineManager={() => setIsOfflineManagerOpen(true)}
      />
    </div>
  );
}

export default App;
