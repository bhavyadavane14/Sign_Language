import api from './api';
import { RecognitionResult } from '../types/translation';

export const translatorService = {
  predictSign: async (base64Image: string): Promise<RecognitionResult> => {
    // Fake prediction for UI mock
    const classes = ['A', 'B', 'C', '1', '2'];
    const randomClass = classes[Math.floor(Math.random() * classes.length)];
    const randomConfidence = 0.5 + Math.random() * 0.49;
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ sign: randomClass, confidence: randomConfidence });
      }, 500);
    });
    
    // const response = await api.post<RecognitionResult>('/translate/predict', { image: base64Image });
    // return response.data;
  }
};
