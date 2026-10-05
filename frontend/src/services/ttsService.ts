import { SupportedLanguage } from '../context/AppContext';

// Comprehensive dictionary for ISL gestures into Indian languages
const SIGN_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  'HELLO': {
    English: 'Hello',
    Hindi: 'नमस्ते',
    Marathi: 'नमस्कार',
    Bengali: 'নমস্কার',
    Tamil: 'வணக்கம்',
    Telugu: 'నమస్కారం'
  },
  'THANK YOU': {
    English: 'Thank you',
    Hindi: 'धन्यवाद',
    Marathi: 'धन्यवाद',
    Bengali: 'ধন্যবাদ',
    Tamil: 'நன்றி',
    Telugu: 'ధన్యవాదాలు'
  },
  'PLEASE': {
    English: 'Please',
    Hindi: 'कृपया',
    Marathi: 'कृपया',
    Bengali: 'দয়া করে',
    Tamil: 'தயவுசெய்து',
    Telugu: 'దయచేసి'
  },
  'YES': {
    English: 'Yes',
    Hindi: 'हाँ',
    Marathi: 'हो',
    Bengali: 'হ্যাঁ',
    Tamil: 'ஆம்',
    Telugu: 'అవును'
  },
  'NO': {
    English: 'No',
    Hindi: 'नहीं',
    Marathi: 'नाही',
    Bengali: 'না',
    Tamil: 'இல்லை',
    Telugu: 'కాదు'
  },
  'HELP': {
    English: 'Help',
    Hindi: 'मदद',
    Marathi: 'मदत',
    Bengali: 'সাহায্য',
    Tamil: 'உதவி',
    Telugu: 'సహాయం'
  },
  'WATER': {
    English: 'Water',
    Hindi: 'पानी',
    Marathi: 'पाणी',
    Bengali: 'জল',
    Tamil: 'தண்ணீர்',
    Telugu: 'నీరు'
  },
  'FOOD': {
    English: 'Food',
    Hindi: 'खाना',
    Marathi: 'अन्न',
    Bengali: 'খাবার',
    Tamil: 'உணவு',
    Telugu: 'ఆహారం'
  },
  'GOOD': {
    English: 'Good',
    Hindi: 'अच्छा',
    Marathi: 'छान',
    Bengali: 'ভালো',
    Tamil: 'நல்லது',
    Telugu: 'మంచిది'
  },
  'BAD': {
    English: 'Bad',
    Hindi: 'बुरा',
    Marathi: 'वाईट',
    Bengali: 'খারাপ',
    Tamil: 'மோசமானது',
    Telugu: 'చెడ్డది'
  },
  'FRIEND': {
    English: 'Friend',
    Hindi: 'दोस्त',
    Marathi: 'मित्र',
    Bengali: 'বন্ধু',
    Tamil: 'நண்பர்',
    Telugu: 'స్నేహితుడు'
  },
  'FAMILY': {
    English: 'Family',
    Hindi: 'परिवार',
    Marathi: 'कुटुंब',
    Bengali: 'পরিবার',
    Tamil: 'குடும்பம்',
    Telugu: 'కుటుంబం'
  },
  'LOVE': {
    English: 'Love',
    Hindi: 'प्यार',
    Marathi: 'प्रेम',
    Bengali: 'ভালোবাসা',
    Tamil: 'அன்பு',
    Telugu: 'ప్రేమ'
  },
  'HOME': {
    English: 'Home',
    Hindi: 'घर',
    Marathi: 'घर',
    Bengali: 'বাড়ি',
    Tamil: 'வீடு',
    Telugu: 'ఇల్లు'
  },
  'SCHOOL': {
    English: 'School',
    Hindi: 'विद्यालय',
    Marathi: 'शाळा',
    Bengali: 'বিদ্যালয়',
    Tamil: 'பள்ளி',
    Telugu: 'పాఠశాల'
  },
  'INDIA': {
    English: 'India',
    Hindi: 'भारत',
    Marathi: 'भारत',
    Bengali: 'ভারত',
    Tamil: 'இந்தியா',
    Telugu: 'భారతదేశం'
  },
  'PEACE': {
    English: 'Peace',
    Hindi: 'शांति',
    Marathi: 'शांतता',
    Bengali: 'শান্তি',
    Tamil: 'அமைதி',
    Telugu: 'శాంతి'
  }
};

const LANG_CODE_MAP: Record<SupportedLanguage, { bcp47: string; gtts: string }> = {
  English: { bcp47: 'en-IN', gtts: 'en' },
  Hindi: { bcp47: 'hi-IN', gtts: 'hi' },
  Marathi: { bcp47: 'mr-IN', gtts: 'mr' },
  Bengali: { bcp47: 'bn-IN', gtts: 'bn' },
  Tamil: { bcp47: 'ta-IN', gtts: 'ta' },
  Telugu: { bcp47: 'te-IN', gtts: 'te' }
};

let activeAudio: HTMLAudioElement | null = null;

export const ttsService = {
  /**
   * Translates a recognized sign into the active interface language.
   */
  translateSign(sign: string, targetLanguage: SupportedLanguage): string {
    if (!sign) return '';
    const cleanKey = sign.trim().toUpperCase();
    if (SIGN_TRANSLATIONS[cleanKey] && SIGN_TRANSLATIONS[cleanKey][targetLanguage]) {
      return SIGN_TRANSLATIONS[cleanKey][targetLanguage];
    }
    return sign;
  },

  /**
   * Speaks the text aloud using browser Web Speech API, with automatic fallback
   * to backend gTTS service if regional voice is not found in the browser.
   */
  async speak(
    text: string,
    targetLanguage: SupportedLanguage = 'English',
    options?: {
      rate?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ): Promise<void> {
    if (!text || !text.trim()) return;

    // Stop any currently playing audio or speech
    this.stop();

    const { bcp47, gtts } = LANG_CODE_MAP[targetLanguage] || { bcp47: 'en-IN', gtts: 'en' };
    const translatedText = this.translateSign(text, targetLanguage);
    const rate = options?.rate || 0.95;

    // 1. Try Browser Web Speech API if supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const voices = window.speechSynthesis.getVoices();
        // Check if there is a matching voice for this language prefix
        const langPrefix = bcp47.split('-')[0].toLowerCase();
        const hasMatchingVoice = voices.some(v => v.lang.toLowerCase().startsWith(langPrefix));

        // If English or voice exists in browser, speak natively
        if (targetLanguage === 'English' || hasMatchingVoice) {
          const utterance = new SpeechSynthesisUtterance(translatedText);
          utterance.lang = bcp47;
          utterance.rate = rate;
          utterance.pitch = 1.0;

          if (hasMatchingVoice) {
            const voice = voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
            if (voice) utterance.voice = voice;
          }

          utterance.onstart = () => {
            options?.onStart?.();
          };
          utterance.onend = () => {
            options?.onEnd?.();
          };
          utterance.onerror = (e) => {
            if (e.error !== 'interrupted') {
              // Try backend fallback if browser speech errored
              this.speakViaBackend(translatedText, gtts, options);
            } else {
              options?.onEnd?.();
            }
          };

          window.speechSynthesis.speak(utterance);
          return;
        }
      } catch (e) {
        // Fall through to backend
      }
    }

    // 2. Fallback to Backend gTTS Audio
    await this.speakViaBackend(translatedText, gtts, options);
  },

  async speakViaBackend(
    text: string,
    gttsLang: string,
    options?: { onStart?: () => void; onEnd?: () => void; onError?: (err: any) => void; }
  ) {
    try {
      options?.onStart?.();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/text-to-speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: gttsLang, slow: false }),
      });

      if (!response.ok) {
        throw new Error('TTS server response failed');
      }

      const data = await response.json();
      if (data.audio_base64) {
        const audioSrc = `data:audio/mp3;base64,${data.audio_base64}`;
        activeAudio = new Audio(audioSrc);
        activeAudio.onended = () => {
          options?.onEnd?.();
          activeAudio = null;
        };
        activeAudio.onerror = (err) => {
          options?.onError?.(err);
          options?.onEnd?.();
          activeAudio = null;
        };
        await activeAudio.play();
      } else {
        options?.onEnd?.();
      }
    } catch (err) {
      console.warn('Backend TTS fallback unavailable, attempting speech synthesis:', err);
      // Final attempt: simple speech synthesis
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const fallbackUtterance = new SpeechSynthesisUtterance(text);
        fallbackUtterance.onstart = () => options?.onStart?.();
        fallbackUtterance.onend = () => options?.onEnd?.();
        fallbackUtterance.onerror = () => options?.onEnd?.();
        window.speechSynthesis.speak(fallbackUtterance);
      } else {
        options?.onEnd?.();
      }
    }
  },

  /**
   * Stop any current speech playback.
   */
  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
    }
    if (activeAudio) {
      try {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      } catch (_) {}
      activeAudio = null;
    }
  }
};
