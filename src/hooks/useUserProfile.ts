import { useState } from 'react';

const USER_NAME_KEY = 'quran_pwa_user_name';
const ONBOARDING_COMPLETED_KEY = 'quran_pwa_onboarding_completed';

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
      const completed = localStorage.getItem(ONBOARDING_COMPLETED_KEY);
      if (completed === 'true') {
        return false;
      }
      const existingName = localStorage.getItem(USER_NAME_KEY);
      if (existingName) {
        return false;
      }
      return true;
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
    // Note: Do NOT set isFirstVisit to false here.
    // The user needs to proceed to Step 2 (Install App) in WelcomeModal.
  };

  const completeFirstVisit = () => {
    setIsFirstVisit(false);
    try {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    } catch (e) {
      console.warn('Failed to save onboarding status to localStorage:', e);
    }
  };

  return {
    userName,
    saveUserName,
    isFirstVisit,
    setIsFirstVisit,
    completeFirstVisit
  };
}

