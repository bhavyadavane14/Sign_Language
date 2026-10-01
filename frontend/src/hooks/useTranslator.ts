import { useState } from 'react';
import { translatorService } from '../services/translatorService';

export const useTranslator = () => {
  const [prediction, setPrediction] = useState<{ sign: string; confidence: number } | null>(null);
  const [sentence, setSentence] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);

  const translateFrame = async (base64Image: string) => {
    setIsTranslating(true);
    try {
      const result = await translatorService.predictSign(base64Image);
      setPrediction(result);
      if (result.confidence > 0.7) {
        // Simple heuristic to avoid repeating characters too quickly could go here
        setSentence(prev => prev + result.sign);
      }
    } catch (error) {
      console.error('Translation error', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const clearSentence = () => {
    setSentence('');
    setPrediction(null);
  };

  return { prediction, sentence, isTranslating, translateFrame, clearSentence };
};
