/**
 * Flexible MongoDB Cloud Sync Utility module.
 * Supports standard HTTP Webhook / Serverless API endpoint or Atlas Data API.
 */
import { db } from './database';

export interface MongoSyncConfig {
  syncEndpoint: string; // Your serverless function or webhook endpoint (e.g. /api/sync-bookmarks)
  apiKey?: string;      // Optional API Key or Auth Token
}

export function getMongoConfigFromEnv(): MongoSyncConfig | null {
  const syncEndpoint = import.meta.env.VITE_MONGODB_SYNC_ENDPOINT || import.meta.env.VITE_MONGODB_API_URL;
  const apiKey = import.meta.env.VITE_MONGODB_API_KEY || import.meta.env.VITE_MONGODB_DATA_API_KEY;

  if (!syncEndpoint) return null;

  return { syncEndpoint, apiKey };
}

/**
 * Syncs local Dexie IndexedDB bookmarks to MongoDB Cloud.
 */
export async function syncBookmarksToMongoDB(): Promise<{ success: boolean; count: number; error?: string }> {
  const config = getMongoConfigFromEnv();
  if (!config) {
    return {
      success: false,
      count: 0,
      error: 'MongoDB sync endpoint (VITE_MONGODB_SYNC_ENDPOINT) not configured in .env'
    };
  }

  try {
    const localBookmarks = await db.bookmarks.toArray();

    const response = await fetch(config.syncEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey ? { 'Authorization': `Bearer ${config.apiKey}` } : {})
      },
      body: JSON.stringify({
        bookmarks: localBookmarks,
        syncedAt: Date.now()
      })
    });

    if (response.ok) {
      return { success: true, count: localBookmarks.length };
    } else {
      const errText = await response.text();
      return { success: false, count: 0, error: `Sync Server HTTP ${response.status}: ${errText}` };
    }
  } catch (err: any) {
    return { success: false, count: 0, error: err.message || 'Network connection error' };
  }
}
