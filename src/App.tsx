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
    updatePageOffset,
    language,
    setLanguage,
    isZenMode,
    setIsZenMode
  } = useReaderState();

  const { theme, toggleTheme, setTheme } = useTheme();
  const { allBookmarks, addBookmark, removeBookmark, updateBookmarkNote } = useBookmarks(activePage);
  const { userName, saveUserName, isFirstVisit, setIsFirstVisit } = useUserProfile();

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setCanInstall(false);
    }
    setDeferredPrompt(null);
  };

  // UI Modals State
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
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
    pageNumber: 2,
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

  // Keyboard Navigation & Shortcuts (Arrow Keys, Ctrl+K, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close modals or exit Zen mode
      if (e.key === 'Escape') {
        if (isZenMode) {
          setIsZenMode(false);
          return;
        }
        setIsSearchModalOpen(false);
        setIsOfflineManagerOpen(false);
        setIsSettingsOpen(false);
        setIsDrawerOpen(false);
        setBookmarkModalState(prev => ({ ...prev, isOpen: false }));
        return;
      }

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
  }, [prevPage, nextPage, activeView, isZenMode, setIsZenMode, setIsDrawerOpen]);

  // Open Reader directly to specific page
  const handleOpenReaderPage = (pageNumber?: number) => {
    if (pageNumber !== undefined) {
      goToPage(pageNumber);
    }
    setActiveView('reader', pageNumber);
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

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ur' : 'en');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 sepia:bg-[#fbf5e6] text-slate-800 dark:text-slate-100 sepia:text-[#2d2417] font-sans antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      {/* Unified Top Header Bar */}
      {!isZenMode && (
        <Header
          activePage={activePage}
          onPageChange={handleOpenReaderPage}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onOpenSearchModal={() => setIsSearchModalOpen(true)}
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
          language={language}
          onToggleLanguage={toggleLanguage}
          canInstall={canInstall}
          onInstallApp={handleInstallApp}
        />
      )}

      {/* Main View Area: Home vs Reader vs Bookmarks */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {activeView === 'home' && (
          <HomeScreen
            userName={userName}
            activePage={activePage}
            onOpenReader={handleOpenReaderPage}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onOpenSearch={() => setIsSearchModalOpen(true)}
            onOpenBookmarks={() => setActiveView('bookmarks')}
            onOpenOffline={() => setIsOfflineManagerOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            totalBookmarks={allBookmarks.length}
            language={language}
            canInstall={canInstall}
            onInstallApp={handleInstallApp}
          />
        )}

        {activeView === 'reader' && (
          <ReaderCanvas
            activePage={activePage}
            onPageChange={goToPage}
            viewMode={viewMode}
            bookmarks={allBookmarks}
            onAddBookmark={handleAddBookmarkClick}
            onSelectBookmarkPin={handleSelectBookmarkPin}
            pageOffset={pageOffset}
            language={language}
            isZenMode={isZenMode}
            onToggleZenMode={() => setIsZenMode(prev => !prev)}
          />
        )}

        {activeView === 'bookmarks' && (
          <BookmarkManager
            isOpen={true}
            isPageView={true}
            onClose={() => setActiveView('home')}
            bookmarks={allBookmarks}
            onSelectPage={handleOpenReaderPage}
            onDeleteBookmark={removeBookmark}
            onEditBookmark={handleSelectBookmarkPin}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Hidden during Zen Mode) */}
      {!isZenMode && (
        <MobileNavbar
          activeTab={activeView}
          onSelectTab={setActiveView}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          onOpenBookmarks={() => setActiveView('bookmarks')}
          onOpenSettings={() => setIsSettingsOpen(true)}
          language={language}
          isZenMode={isZenMode}
          bookmarkCount={allBookmarks.length}
        />
      )}

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
        language={language}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectPage={handleOpenReaderPage}
        pageOffset={pageOffset}
        onUpdatePageOffset={updatePageOffset}
        language={language}
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
        language={language}
      />

      {/* Application Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        setTheme={setTheme}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        pageOffset={pageOffset}
        onUpdatePageOffset={updatePageOffset}
        userName={userName}
        onUpdateUserName={saveUserName}
        onOpenOfflineManager={() => setIsOfflineManagerOpen(true)}
        language={language}
        onSetLanguage={setLanguage}
        canInstall={canInstall}
        onInstallApp={handleInstallApp}
      />
    </div>
  );
}

export default App;
