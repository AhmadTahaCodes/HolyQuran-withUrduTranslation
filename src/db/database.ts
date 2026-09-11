import Dexie, { type Table } from 'dexie';

export interface Bookmark {
  id?: number;
  pageNumber: number;
  yRatio: number;      // 0.0 to 1.0 relative height coordinate on canvas
  xRatio: number;      // 0.0 to 1.0 relative width coordinate on canvas
  surahName: string;
  surahId: number;
  ayahNumber?: number;
  timestamp: number;
  note: string;
  color?: string;      // e.g. '#059669', '#d97706', '#2563eb'
}

export interface ReadingState {
  id: string;          // 'active'
  lastActivePage: number;
  scrollPosition: number;
  viewMode: 'single' | 'dual' | 'continuous';
  updatedAt: number;
}

export interface OfflinePage {
  pageNumber: number;
  dataUrlOrBlob: string | Blob; // Blob, Base64, or SVG DataURL
  timestamp: number;
}

export class QuranDatabase extends Dexie {
  bookmarks!: Table<Bookmark, number>;
  readingState!: Table<ReadingState, string>;
  offlinePages!: Table<OfflinePage, number>;

  constructor() {
    super('QuranPWADB');
    this.version(1).stores({
      bookmarks: '++id, pageNumber, surahId, timestamp',
      readingState: 'id',
      offlinePages: 'pageNumber, timestamp'
    });
  }
}

export const db = new QuranDatabase();
