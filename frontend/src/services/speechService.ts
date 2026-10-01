// Speech service for backend transcription if needed
import api from './api';

export const speechService = {
  transcribeAudio: async (audioBlob: Blob): Promise<{ text: string }> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ text: 'Mocked speech transcription' });
      }, 1000);
    });
  }
};
