import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Bookmark } from '../db/database';

export function useBookmarks(currentPage?: number) {
  // Query all bookmarks ordered by timestamp descending
  const allBookmarks = useLiveQuery(
    () => db.bookmarks.orderBy('timestamp').reverse().toArray(),
    []
  );

  // Query bookmarks for the active page specifically
  const pageBookmarks = useLiveQuery(
    () => currentPage ? db.bookmarks.where('pageNumber').equals(currentPage).toArray() : db.bookmarks.filter(() => false).toArray(),
    [currentPage]
  );

  const addBookmark = async (bookmark: Omit<Bookmark, 'id' | 'timestamp'>) => {
    return await db.bookmarks.add({
      ...bookmark,
      timestamp: Date.now()
    });
  };

  const removeBookmark = async (id: number) => {
    return await db.bookmarks.delete(id);
  };

  const updateBookmarkNote = async (id: number, note: string, color?: string) => {
    return await db.bookmarks.update(id, { note, color });
  };

  return {
    allBookmarks: allBookmarks || [],
    pageBookmarks: pageBookmarks || [],
    addBookmark,
    removeBookmark,
    updateBookmarkNote
  };
}
