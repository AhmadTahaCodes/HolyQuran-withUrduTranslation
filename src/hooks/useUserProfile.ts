import { useState } from 'react';

const USER_NAME_KEY = 'quran_pwa_user_name';

export function useUserProfile() {
  const [userName, setUserName] = useState<string>(() => {
    try {
      return localStorage.getItem(USER_NAME_KEY) || '';
    } catch {
      return '';
    }
  });

  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(USER_NAME_KEY);
    } catch {
      return false;
    }
  });

  const saveUserName = (name: string) => {
    const trimmed = name.trim();
    setUserName(trimmed);
    try {
      if (trimmed) {
        localStorage.setItem(USER_NAME_KEY, trimmed);
      } else {
        localStorage.removeItem(USER_NAME_KEY);
      }
    } catch (e) {
      console.warn('Failed to save username to localStorage:', e);
    }
    setIsFirstVisit(false);
  };

  return {
    userName,
    saveUserName,
    isFirstVisit,
    setIsFirstVisit
  };
}
