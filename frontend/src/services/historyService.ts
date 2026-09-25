import api from './api';
import { TranslationHistory } from '../types/translation';

const STORAGE_KEY = 'signx_user_translation_history';

export const historyService = {
  getHistory: async (): Promise<TranslationHistory[]> => {
    // 1. Try fetching from backend if user is authenticated
    try {
      const response = await api.get('/api/history', { timeout: 2000 });
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data.map((item: any) => ({
          id: item.id?.toString() || Date.now().toString(),
          signText: item.recognized_sign || item.original_text || '',
          translatedText: item.translated_text || '',
          language: item.target_language || 'en-IN',
          timestamp: item.created_at || new Date().toISOString(),
        }));
      }
    } catch (_) {
      // Fallback to genuine local user history
    }

    // 2. Fetch genuine translations saved in user's browser session
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}

    return [];
  },

  addHistoryItem: (item: TranslationHistory): void => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const existing: TranslationHistory[] = raw ? JSON.parse(raw) : [];
      // Prepend recent item, keep up to 50
      const updated = [item, ...existing.filter((e) => e.id !== item.id)].slice(0, 50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Asynchronously send to backend if available
      api.post('/api/history', {
        recognized_sign: item.signText,
        translated_text: item.translatedText,
        source_language: 'ISL',
        target_language: item.language || 'en-IN',
        confidence: 1.0,
      }).catch(() => {});
    } catch (_) {}
  },

  deleteHistoryItem: async (id: string): Promise<void> => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const existing: TranslationHistory[] = JSON.parse(raw);
        const filtered = existing.filter((item) => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      }
      await api.delete(`/api/history/${id}`).catch(() => {});
    } catch (_) {}
  },

  clearHistory: async (): Promise<void> => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  },
};
