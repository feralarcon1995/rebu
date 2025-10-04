/* eslint-disable no-console */
import { useCallback, useEffect, useRef } from 'react';

interface UseDraftOptions {
  key: string;
  autoSaveInterval?: number;
}

export function useFormDraft<T>({
  key,
  autoSaveInterval = 30000,
}: UseDraftOptions) {
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const saveDraft = useCallback(
    (data: T) => {
      try {
        localStorage.setItem(`draft_${key}`, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving draft:', error);
      }
    },
    [key]
  );

  const loadDraft = useCallback((): T | null => {
    try {
      const draft = localStorage.getItem(`draft_${key}`);
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      console.error('Error loading draft:', error);
      return null;
    }
  }, [key]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(`draft_${key}`);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  }, [key]);

  const startAutoSave = useCallback(
    (getCurrentData: () => T) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        const currentData = getCurrentData();
        if (currentData) {
          saveDraft(currentData);
        }
      }, autoSaveInterval);
    },
    [saveDraft, autoSaveInterval]
  );

  const stopAutoSave = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    startAutoSave,
    stopAutoSave,
  };
}
