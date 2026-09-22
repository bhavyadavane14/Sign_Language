import api from './api';
import { TranslationHistory } from '../types/translation';

export const historyService = {
  getHistory: async (): Promise<TranslationHistory[]> => {
    return [
      { id: '1', timestamp: new Date().toISOString(), signText: 'HELLO', translatedText: 'Hello', language: 'en' },
      { id: '2', timestamp: new Date(Date.now() - 86400000).toISOString(), signText: 'THANK YOU', translatedText: 'Thank you', language: 'en' }
    ];
  },
  saveTranslation: async (data: Partial<TranslationHistory>): Promise<void> => {
    // return api.post('/history', data);
  },
  deleteHistoryItem: async (id: string): Promise<void> => {
    // return api.delete(`/history/${id}`);
  }
};
