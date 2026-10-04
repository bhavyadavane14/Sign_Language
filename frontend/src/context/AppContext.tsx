import React, { createContext, useState, useEffect, useContext } from 'react';

export type SupportedLanguage = 'English' | 'Hindi' | 'Bengali' | 'Tamil' | 'Telugu' | 'Marathi';
export type TextSize = 'Small' | 'Medium' | 'Large' | 'Extra Large';

// Multilingual translations for the entire SignX platform
const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  English: {
    'home': 'Home',
    'history': 'History',
    'learn_isl': 'Learn Sign Language',
    'settings': 'Settings',
    'about': 'About SignX',
    'chatbot': 'SignX Assistant',
    'waiting_for_sign': 'Waiting for sign...',
    'detecting': 'Detecting gesture...',
    'position_hand': 'Position your hand inside frame',
    'show_your_sign': 'Show Your Sign',
    'ai_detects': 'AI Detects the Sign',
    'hear_sign': 'Hear the Detected Sign',
    'switch_cam': 'Switch Camera',
    'camera_paused': 'Camera is Paused',
    'click_to_activate': 'Click the button below to activate your webcam',
    'explore_videos': 'Official ISLRTC Learning Videos on YouTube',
    'isl_alphabet': 'ISL Alphabet & Numbers',
    'everyday_signs': 'Everyday Basic Signs',
    'isl_dict': 'Official ISLRTC Dictionary',
    'watch_youtube': 'Watch on YouTube',
    'voice_output': 'Voice Output',
    'text_size': 'Text Size',
    'language': 'Language',
    'theme': 'Theme'
  },
  Hindi: {
    'home': 'होम',
    'history': 'अनुवाद इतिहास',
    'learn_isl': 'सांकेतिक भाषा सीखें',
    'settings': 'सेटिंग्स',
    'about': 'SignX के बारे में',
    'chatbot': 'SignX सहायक',
    'waiting_for_sign': 'संकेत की प्रतीक्षा है...',
    'detecting': 'संकेत पहचाना जा रहा है...',
    'position_hand': 'अपना हाथ फ्रेम के अंदर रखें',
    'show_your_sign': 'अपना संकेत दिखाएं',
    'ai_detects': 'AI संकेत पहचानता है',
    'hear_sign': 'पहचाना गया संकेत सुनें',
    'switch_cam': 'कैमरा बदलें',
    'camera_paused': 'कैमरा रुका हुआ है',
    'click_to_activate': 'वेबकैम शुरू करने के लिए नीचे दिए गए बटन पर क्लिक करें',
    'explore_videos': 'YouTube पर आधिकारिक ISLRTC शिक्षण वीडियो',
    'isl_alphabet': 'ISL वर्णमाला और संख्याएँ',
    'everyday_signs': 'दैनिक उपयोग के संकेत',
    'isl_dict': 'आधिकारिक ISLRTC शब्दकोश',
    'watch_youtube': 'YouTube पर देखें',
    'voice_output': 'आवाज़ आउटपुट',
    'text_size': 'अक्षर का आकार',
    'language': 'भाषा',
    'theme': 'थीम'
  },
  Bengali: {
    'home': 'হোম',
    'history': 'ইতিহাস',
    'learn_isl': 'ইশারা ভাষা শিখুন',
    'settings': 'সেটিংস',
    'about': 'SignX সম্পর্কিত',
    'chatbot': 'SignX সহকারী',
    'waiting_for_sign': 'ইশারার জন্য অপেক্ষা করা হচ্ছে...',
    'detecting': 'ইশারা শনাক্ত করা হচ্ছে...',
    'position_hand': 'ফ্রেমের মধ্যে হাত রাখুন',
    'show_your_sign': 'আপনার ইশারা দেখান',
    'ai_detects': 'AI ইশারা শনাক্ত করে',
    'hear_sign': 'শনাক্তকৃত শব্দ শুনুন',
    'switch_cam': 'ক্যামেরা পরিবর্তন',
    'camera_paused': 'ক্যামেরা বন্ধ আছে',
    'click_to_activate': 'ওয়েবক্যাম চালু করতে নিচে ক্লিক করুন',
    'explore_videos': 'ইউটিউবে অফিসিয়াল ISLRTC ভিডিও',
    'isl_alphabet': 'ISL বর্ণমালা ও সংখ্যা',
    'everyday_signs': 'দৈনন্দিন সাধারণ ইশারা',
    'isl_dict': 'অফিসিয়াল ISLRTC অভিধান',
    'watch_youtube': 'YouTube-এ দেখুন',
    'voice_output': 'ভয়েস আউটপুট',
    'text_size': 'ফন্ট সাইজ',
    'language': 'ভাষা',
    'theme': 'থিম'
  },
  Tamil: {
    'home': 'முகப்பு',
    'history': 'வரலாறு',
    'learn_isl': 'சைகை மொழி கற்க',
    'settings': 'அமைப்புகள்',
    'about': 'SignX பற்றி',
    'chatbot': 'SignX உதவியாளர்',
    'waiting_for_sign': 'சைகைக்காக காத்திருக்கிறது...',
    'detecting': 'கண்டறியப்படுகிறது...',
    'position_hand': 'சட்டகத்திற்குள் கையை வைக்கவும்',
    'show_your_sign': 'உங்கள் சைகையைக் காட்டுங்கள்',
    'ai_detects': 'AI சைகையைக் கண்டறியும்',
    'hear_sign': 'குரல் ஒலியைக் கேட்கவும்',
    'switch_cam': 'கேமரா மாற்றவும்',
    'camera_paused': 'கேமரா இடைநிறுத்தப்பட்டது',
    'click_to_activate': 'வெப்கேமைத் தொடங்க கீழே உள்ள பொத்தானைக் கிளிக் செய்யவும்',
    'explore_videos': 'YouTube-ல் அதிகாரப்பூர்வ ISLRTC வீடியோக்கள்',
    'isl_alphabet': 'ISL எழுத்துக்கள் மற்றும் எண்கள்',
    'everyday_signs': 'அன்றாட சைகைகள்',
    'isl_dict': 'அதிகாரப்பூர்வ ISLRTC அகராதி',
    'watch_youtube': 'YouTube-ல் பார்க்க',
    'voice_output': 'குரல் வெளியீடு',
    'text_size': 'எழுத்து அளவு',
    'language': 'மொழி',
    'theme': 'வடிவமைப்பு'
  },
  Telugu: {
    'home': 'హోమ్',
    'history': 'చరిత్ర',
    'learn_isl': 'సంజ్ఞ భాష నేర్చుకోండి',
    'settings': 'సెట్టింగులు',
    'about': 'SignX గురించి',
    'chatbot': 'SignX సహాయకుడు',
    'waiting_for_sign': 'సంజ్ఞ కోసం వేచి చూస్తోంది...',
    'detecting': 'గుర్తిస్తోంది...',
    'position_hand': 'ఫ్రేమ్ లోపల చేయి ఉంచండి',
    'show_your_sign': 'మీ సంజ్ఞను చూపించండి',
    'ai_detects': 'AI సంజ్ఞను గుర్తిస్తుంది',
    'hear_sign': 'ధ్వనిని వినండి',
    'switch_cam': 'కెమెరా మార్చండి',
    'camera_paused': 'కెమెరా పాజ్ చేయబడింది',
    'click_to_activate': 'వెబ్‌క్యామ్‌ను ప్రారంభించడానికి దిగువ క్లిక్ చేయండి',
    'explore_videos': 'YouTube లో అధికారిక ISLRTC వీడియోలు',
    'isl_alphabet': 'ISL వర్ణమాల & సంఖ్యలు',
    'everyday_signs': 'రోజువారీ సంజ్ఞలు',
    'isl_dict': 'అధికారిక ISLRTC నిఘంటువు',
    'watch_youtube': 'YouTube లో చూడండి',
    'voice_output': 'వాయిస్ అవుట్‌పుట్',
    'text_size': 'అక్షర పరిమాణం',
    'language': 'భాష',
    'theme': 'థీమ్'
  },
  Marathi: {
    'home': 'मुख्यपृष्ठ',
    'history': 'इतिहास',
    'learn_isl': 'सांकेतिक भाषा शिका',
    'settings': 'सेटिंग्ज',
    'about': 'SignX बद्दल',
    'chatbot': 'SignX सहाय्यक',
    'waiting_for_sign': 'संकेताची प्रतीक्षा करत आहे...',
    'detecting': 'संकेत ओळखत आहे...',
    'position_hand': 'आपला हात फ्रेममध्ये ठेवा',
    'show_your_sign': 'आपला संकेत दाखवा',
    'ai_detects': 'AI संकेत ओळखते',
    'hear_sign': 'उच्चारलेला शब्द ऐका',
    'switch_cam': 'कॅमेरा बदला',
    'camera_paused': 'कॅमेरा थांबवला आहे',
    'click_to_activate': 'वेबकॅम सुरू करण्यासाठी खाली क्लिक करा',
    'explore_videos': 'YouTube वर अधिकृत ISLRTC शिकवणी व्हिडिओ',
    'isl_alphabet': 'ISL मुळाक्षरे आणि अंक',
    'everyday_signs': 'दैनंदिन वापरले जाणारे संकेत',
    'isl_dict': 'अधिकृत ISLRTC शब्दकोश',
    'watch_youtube': 'YouTube वर पहा',
    'voice_output': 'आवाज आउटपुट',
    'text_size': 'अक्षरांचा आकार',
    'language': 'भाषा',
    'theme': 'थीम'
  }
};

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  t: (key: string) => string;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('signx_theme') as 'light' | 'dark') || 'light';
  });

  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('signx_language') as SupportedLanguage) || 'English';
  });

  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    return (localStorage.getItem('signx_text_size') as TextSize) || 'Medium';
  });

  // Apply Font Size to HTML root element dynamically
  useEffect(() => {
    const sizeMap: Record<TextSize, string> = {
      'Small': '14px',
      'Medium': '16px',
      'Large': '18.5px',
      'Extra Large': '21px'
    };
    document.documentElement.style.fontSize = sizeMap[textSize] || '16px';
    localStorage.setItem('signx_text_size', textSize);
  }, [textSize]);

  // Persist language
  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('signx_language', lang);
  };

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('signx_theme', next);
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.English;
    return langDict[key] || TRANSLATIONS.English[key] || key;
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, setLanguage, textSize, setTextSize, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
