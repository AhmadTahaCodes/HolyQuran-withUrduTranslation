import React, { useState, useRef, useEffect } from 'react';
import { db, type Bookmark } from '../db/database';
import { generateFallbackPageDataUrl, getPageMetadata, toArabicNumerals } from '../utils/pageFallback';
import quranMeta from '../data/quran_meta.json';
import { BookmarkPin } from './BookmarkPin';
import { ZoomIn, ZoomOut, RotateCcw, Bookmark as BookmarkIcon, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import type { Language } from '../utils/i18n';
import { translations } from '../utils/i18n';

interface ReaderCanvasProps {
  activePage: number;
  onPageChange: (page: number) => void;
  viewMode: 'single' | 'dual' | 'continuous';
  bookmarks: Bookmark[];
  onAddBookmark: (pageNumber: number, yRatio: number, xRatio: number) => void;
  onSelectBookmarkPin: (bookmark: Bookmark) => void;
  pageOffset?: number;
  language?: Language;
  isZenMode?: boolean;
  onToggleZenMode?: () => void;
}

const TOTAL_PAGES = quranMeta.total_pages || 729;

export const ReaderCanvas: React.FC<ReaderCanvasProps> = ({
  activePage,
  onPageChange,
  viewMode,
  bookmarks,
  onAddBookmark,
  onSelectBookmarkPin,
  pageOffset = 0,
  language = 'en',
  isZenMode = false,
  onToggleZenMode
}) => {
  const [zoomScale, setZoomScale] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollUpdatingRef = useRef<boolean>(false);
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Touch Gesture tracking
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapRef = useRef<number>(0);

  // Track images that fail to load from /pages/page_XXX.webp to fallback
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [offlineImages, setOfflineImages] = useState<Record<number, string>>({});

  // Reset zoom on page change across view modes
  const [prevViewMode, setPrevViewMode] = useState(viewMode);
  if (prevViewMode !== viewMode) {
    setPrevViewMode(viewMode);
    setZoomScale(1);
  }

  // Programmatic scroll-into-view (ONLY when activePage changed via button/drawer/search, NOT manual scroll)
  useEffect(() => {
    if (viewMode === 'continuous') {
      if (isScrollUpdatingRef.current) {
        isScrollUpdatingRef.current = false;
        return;
      }

      isProgrammaticScrollRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      const el = document.getElementById(`quran-page-${activePage}`);
      const container = containerRef.current;
      if (el && container) {
        const targetTop = el.offsetTop - 12;
        container.scrollTo({ top: Math.max(0, targetTop), behavior: 'auto' });
      }

      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 300);
    } else {
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }
  }, [activePage, viewMode]);

  // Real-time viewport scroll detector for window & container scrolling
  useEffect(() => {
    if (viewMode !== 'continuous') return;

    const checkVisiblePage = () => {
      if (isProgrammaticScrollRef.current) return;

      const containerEl = containerRef.current;
      const containerRect = containerEl
        ? containerEl.getBoundingClientRect()
        : { top: 56, bottom: window.innerHeight, height: window.innerHeight - 56 };

      // Reading focal zone: upper 15% to 60% of reader viewport height
      const focalTop = containerRect.top + containerRect.height * 0.15;
      const focalBottom = containerRect.top + containerRect.height * 0.60;

      let maxVisibleHeight = 0;
      let bestPage = activePage;

      const pageElements = document.querySelectorAll('[id^="quran-page-"]');
      pageElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const visibleTop = Math.max(rect.top, focalTop);
        const visibleBottom = Math.min(rect.bottom, focalBottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        if (visibleHeight > maxVisibleHeight) {
          maxVisibleHeight = visibleHeight;
          const match = el.id.match(/quran-page-(\d+)/);
          if (match && match[1]) {
            bestPage = parseInt(match[1], 10);
          }
        }
      });

      if (bestPage !== activePage && bestPage >= 1 && bestPage <= TOTAL_PAGES) {
        isScrollUpdatingRef.current = true;
        onPageChange(bestPage);
      }
    };

    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener('scroll', checkVisiblePage, { passive: true });
    }
    window.addEventListener('scroll', checkVisiblePage, { passive: true });
    window.addEventListener('resize', checkVisiblePage, { passive: true });

    // Execute immediately to calibrate visible page on load/viewMode change
    checkVisiblePage();

    return () => {
      if (containerEl) {
        containerEl.removeEventListener('scroll', checkVisiblePage);
      }
      window.removeEventListener('scroll', checkVisiblePage);
      window.removeEventListener('resize', checkVisiblePage);
    };
  }, [viewMode, activePage, onPageChange]);

  // Handle double-tap zoom
  const handleDoubleTap = () => {
    setZoomScale(prev => (prev === 1 ? 1.4 : prev === 1.4 ? 1.8 : 1.0));
  };

  // Touch Start Handler for Swipe & Long-Press Detection
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, pageNum: number) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const now = e.timeStamp;

    // Check for Double-Tap (within 300ms)
    if (now - lastTapRef.current < 300) {
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
      handleDoubleTap();
      lastTapRef.current = 0;
      return;
    }
    lastTapRef.current = now;

    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: now };
    const rect = e.currentTarget.getBoundingClientRect();
    const touchX = touch.clientX;
    const touchY = touch.clientY;

    // Trigger Long-Press Bookmark after 500ms
    touchTimerRef.current = setTimeout(() => {
      const yRatio = Math.max(0, Math.min(1, (touchY - rect.top) / rect.height));
      const xRatio = Math.max(0, Math.min(1, (touchX - rect.left) / rect.width));
      onAddBookmark(pageNum, yRatio, xRatio);
      touchStartRef.current = null;
    }, 500);
  };

  const handleTouchMove = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }

    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const duration = e.timeStamp - touchStartRef.current.time;

    // RTL Swipe Navigation in Single/Dual mode
    if (Math.abs(deltaX) > 40 && Math.abs(deltaY) < 70 && duration < 500 && zoomScale === 1 && viewMode !== 'continuous') {
      if (deltaX < 0) {
        // Swiped Left -> Next Page
        onPageChange(activePage + (viewMode === 'dual' ? 2 : 1));
      } else {
        // Swiped Right -> Prev Page
        onPageChange(activePage - (viewMode === 'dual' ? 2 : 1));
      }
    }

    touchStartRef.current = null;
  };

  // Context Menu / Right-Click Bookmark Handler (Desktop)
  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>, pageNum: number) => {
    if (e.shiftKey || e.button === 2) {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const yRatio = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      const xRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onAddBookmark(pageNum, yRatio, xRatio);
    }
  };

  // Get Page Image Src (IndexedDB cached, WebP, or fallback SVG)
  const getPageSrc = (pageNum: number) => {
    if (offlineImages[pageNum]) {
      return offlineImages[pageNum];
    }
    if (failedImages[pageNum]) {
      return generateFallbackPageDataUrl(pageNum);
    }
    const targetNum = pageNum - 1 + pageOffset;
    if (targetNum < 0 || targetNum >= TOTAL_PAGES) {
      return generateFallbackPageDataUrl(pageNum);
    }
    const padded = String(targetNum).padStart(3, '0');
    return `/pages/page_${padded}.webp`;
  };

  const handleImageError = async (pageNum: number) => {
    if (failedImages[pageNum]) return;
    try {
      const offline = await db.offlinePages.get(pageNum);
      if (offline?.dataUrlOrBlob) {
        setOfflineImages(prev => ({ ...prev, [pageNum]: offline.dataUrlOrBlob }));
        return;
      }
    } catch {
      // ignore
    }
    setFailedImages(prev => ({ ...prev, [pageNum]: true }));
  };

  // Dynamic Virtualized Pages Calculation
  let pagesToRender: number[] = [];
  if (viewMode === 'single') {
    pagesToRender = [activePage];
  } else if (viewMode === 'dual') {
    const firstPage = activePage % 2 === 0 ? activePage : Math.max(1, activePage - 1);
    pagesToRender = [firstPage, Math.min(TOTAL_PAGES, firstPage + 1)];
  } else if (viewMode === 'continuous') {
    const start = Math.max(1, activePage - 8);
    const end = Math.min(TOTAL_PAGES, activePage + 8);
    for (let i = start; i <= end; i++) pagesToRender.push(i);
  }

  const t = translations[language || 'en'];

  return (
    <div
      ref={containerRef}
      className={`relative flex-1 w-full h-full min-h-[calc(100vh-3.5rem)] bg-slate-50 dark:bg-slate-950 sepia:bg-[#fbf5e6] flex flex-col items-center overflow-y-auto select-none p-2 sm:p-4 transition-colors ${
        isZenMode ? 'pt-2 pb-16' : 'pb-24 sm:pb-16'
      }`}
    >
      {/* Floating Controls Overlay (Zoom + Zen Fullscreen) */}
      <div className="fixed bottom-16 sm:bottom-6 right-4 z-40 flex items-center space-x-1 p-1 bg-slate-900/90 dark:bg-slate-900/90 sepia:bg-[#2d2417]/90 text-slate-100 border border-slate-700/80 sepia:border-[#b45309]/50 rounded-2xl shadow-2xl backdrop-blur-md">
        {onToggleZenMode && (
          <button
            onClick={onToggleZenMode}
            className="p-1.5 hover:bg-slate-800 sepia:hover:bg-[#433522] rounded-xl transition-colors active:scale-95 text-emerald-400"
            title={isZenMode ? t.exitZenMode : t.zenMode}
          >
            {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        )}
        <button
          onClick={() => setZoomScale(prev => Math.min(2.5, prev + 0.2))}
          className="p-1.5 hover:bg-slate-800 sepia:hover:bg-[#433522] rounded-xl transition-colors active:scale-95"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="text-[11px] font-mono font-medium text-emerald-400 px-1.5">
          {Math.round(zoomScale * 100)}%
        </span>
        <button
          onClick={() => setZoomScale(prev => Math.max(0.8, prev - 0.2))}
          className="p-1.5 hover:bg-slate-800 sepia:hover:bg-[#433522] rounded-xl transition-colors active:scale-95"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        {zoomScale !== 1 && (
          <button
            onClick={() => setZoomScale(1)}
            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 sepia:hover:bg-[#433522] rounded-xl transition-colors active:scale-95"
            title={t.resetZoom}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Page Scrubber Bar (Floating at Bottom Center) */}
      <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 hidden xs:flex items-center space-x-2.5 px-3.5 py-1.5 bg-slate-900/90 dark:bg-slate-900/90 sepia:bg-[#2d2417]/90 border border-slate-700/80 sepia:border-[#b45309]/50 rounded-2xl shadow-2xl backdrop-blur-md text-xs text-white max-w-[90vw]">
        <span className="text-[11px] font-mono text-emerald-400 font-bold whitespace-nowrap">
          {language === 'ur' ? `صفحہ ${toArabicNumerals(activePage)}` : `Pg ${activePage}`}
        </span>
        <input
          type="range"
          min="1"
          max={TOTAL_PAGES}
          value={activePage}
          onChange={(e) => onPageChange(parseInt(e.target.value, 10))}
          className="w-28 sm:w-44 accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          title="Scrub Pages 1 to 729"
        />
        <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
          {TOTAL_PAGES}
        </span>
      </div>

      {/* Pages Container */}
      <div
        className={`w-full max-w-5xl flex ${
          viewMode === 'dual'
            ? 'flex-row-reverse justify-center gap-3 sm:gap-6 items-start py-2'
            : viewMode === 'continuous'
            ? 'flex-col items-center gap-6 py-2'
            : 'justify-center items-center py-2 sm:py-3'
        }`}
      >
        {pagesToRender.map(pageNum => {
          const pageMeta = getPageMetadata(pageNum);
          const pagePins = (bookmarks || []).filter(b => b.pageNumber === pageNum);
          const isCurrentPage = pageNum === activePage;
          const pageZoom = isCurrentPage ? zoomScale : 1;
          const availableHeight = isZenMode ? 'calc(100vh - 4.5rem)' : 'calc(100vh - 9.5rem)';
          const singleWidthCalc = `min(calc(100vw - 2rem), calc((${availableHeight}) * 1100 / 1700 * ${pageZoom}))`;
          const dualWidthCalc = `min(calc(50vw - 1.5rem), calc((${availableHeight}) * 1100 / 1700))`;

          return (
            <div
              key={pageNum}
              id={`quran-page-${pageNum}`}
              className="flex flex-col items-center transition-all duration-300 ease-out"
              style={{
                width: viewMode === 'continuous'
                  ? '100%'
                  : viewMode === 'dual'
                  ? dualWidthCalc
                  : singleWidthCalc,
                maxWidth: viewMode === 'continuous'
                  ? `${pageZoom !== 1 ? Math.min(960, pageZoom * 680) : 680}px`
                  : `${Math.min(1000, 700 * pageZoom)}px`
              }}
            >
              {/* Quran Page Frame (Hugs the image precisely with zero wasted top/bottom space) */}
              <div
                onTouchStart={(e) => handleTouchStart(e, pageNum)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={(e) => handlePageClick(e, pageNum)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  const rect = e.currentTarget.getBoundingClientRect();
                  const yRatio = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
                  const xRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  onAddBookmark(pageNum, yRatio, xRatio);
                }}
                className={`relative w-full cursor-pointer overflow-hidden rounded-2xl border bg-white dark:bg-slate-900 sepia:bg-[#fffdf5] shadow-2xl transition-all duration-300 ease-out ${
                  isCurrentPage
                    ? 'border-emerald-500 ring-2 ring-emerald-500/40 shadow-emerald-950/30'
                    : 'border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9]'
                }`}
                style={{
                  aspectRatio: '1100 / 1700'
                }}
              >
                {/* Scanned Quran Page Image */}
                <img
                  src={getPageSrc(pageNum)}
                  onError={() => handleImageError(pageNum)}
                  alt={`Quran Page ${pageNum}`}
                  className="w-full h-full object-contain block select-none pointer-events-none mx-auto"
                  loading="eager"
                />

                {/* Bookmark Pins Overlay */}
                {pagePins.map(pin => (
                  <BookmarkPin
                    key={pin.id}
                    bookmark={pin}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBookmarkPin(pin);
                    }}
                  />
                ))}
              </div>

              {/* Bottom Page Info & Bookmark Bar */}
              <div className="w-full flex items-center justify-between px-3 py-1.5 mt-1.5 bg-white/95 dark:bg-slate-900/95 sepia:bg-[#fffdf5]/95 border border-slate-200 dark:border-slate-800/80 sepia:border-[#dfd3b9] rounded-xl text-xs shadow-sm">
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="font-bold text-slate-800 dark:text-slate-100 sepia:text-[#2d2417] text-[11px] sm:text-xs truncate">
                    {pageNum === 1 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">غِلَافُ القُرْآنِ (Cover)</span>
                    ) : (
                      <>
                        Pg {pageNum} - Surah {pageMeta.surah.name_english}{' '}
                        <span className="text-emerald-600 dark:text-emerald-400 font-serif">
                          ({pageMeta.surah.name_arabic})
                        </span>
                      </>
                    )}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddBookmark(pageNum, 0.5, 0.5);
                  }}
                  className="flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors shadow active:scale-95 flex-shrink-0"
                  title="Add Bookmark Pin to Page"
                >
                  <BookmarkIcon className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">{t.bookmarkThisPage}</span>
                  <span className="xs:hidden">Pin</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button for Continuous Mode */}
      {viewMode === 'continuous' && activePage < TOTAL_PAGES && (
        <div className="py-6 flex justify-center w-full">
          <button
            onClick={() => onPageChange(Math.min(TOTAL_PAGES, activePage + 8))}
            className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-2xl shadow-xl transition-all active:scale-95"
          >
            <span>Load Next Pages (towards Page {Math.min(TOTAL_PAGES, activePage + 8)})</span>
            <ChevronRight className="w-4 h-4 rotate-90" />
          </button>
        </div>
      )}
    </div>
  );
};
