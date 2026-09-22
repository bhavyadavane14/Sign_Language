export interface RecognitionResult {
  sign: string;
  confidence: number;
}

export interface Translation {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslationHistory {
  id: string;
  timestamp: string;
  signText: string;
  translatedText: string;
  language: string;
}
