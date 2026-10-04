import React from 'react';
import { 
  ChevronLeft, Globe, Volume2, Type, Sun, 
  ChevronRight, Sparkles 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp, SupportedLanguage, TextSize } from '../context/AppContext';

export default function Settings() {
  const navigate = useNavigate();
  const { language, setLanguage, textSize, setTextSize, theme, toggleTheme, t } = useApp();

  const [voiceOutput, setVoiceOutput] = React.useState(true);

  const languages: SupportedLanguage[] = ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi'];
  const textSizes: TextSize[] = ['Small', 'Medium', 'Large', 'Extra Large'];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-charcoal-900 font-sans flex flex-col justify-between select-none">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-cream-300 px-4 py-3 sm:px-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/translator')}
              aria-label="Back to home"
              className="w-10 h-10 rounded-2xl bg-white border border-cream-300 flex items-center justify-center text-charcoal-700 hover:text-coral-500 transition-all shadow-sm active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-extrabold text-charcoal-900 font-display">
              {t('settings')}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Settings List */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-4 space-y-3">
        
        <div className="signx-card p-2 bg-white divide-y divide-cream-200 shadow-card">
          
          {/* 1. Language Selection (Real Translation) */}
          <div 
            onClick={() => {
              const nextIdx = (languages.indexOf(language) + 1) % languages.length;
              setLanguage(languages[nextIdx]);
            }}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-cream-50 transition-colors rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-coral-600" />
              <span className="text-sm font-semibold text-charcoal-800">{t('language')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-coral-600 bg-coral-50 px-2.5 py-1 rounded-lg border border-coral-200">
              <span>{language}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 2. Text Size (Scales entire site dynamically) */}
          <div 
            onClick={() => {
              const nextIdx = (textSizes.indexOf(textSize) + 1) % textSizes.length;
              setTextSize(textSizes[nextIdx]);
            }}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-cream-50 transition-colors rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-forest-700" />
              <span className="text-sm font-semibold text-charcoal-800">{t('text_size')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-forest-700 bg-forest-50 px-2.5 py-1 rounded-lg border border-forest-200">
              <span>{textSize}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 3. Voice Output */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-charcoal-600" />
              <span className="text-sm font-semibold text-charcoal-800">{t('voice_output')}</span>
            </div>
            <button
              onClick={() => setVoiceOutput(!voiceOutput)}
              aria-label="Toggle voice output"
              className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                voiceOutput ? 'bg-forest-600' : 'bg-cream-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                  voiceOutput ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 4. Theme */}
          <div 
            onClick={toggleTheme}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-cream-50 transition-colors rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-semibold text-charcoal-800">{t('theme')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal-600">
              <span className="capitalize">{theme}</span>
              <ChevronRight className="w-4 h-4 text-charcoal-400" />
            </div>
          </div>

        </div>

        {/* Info box explaining real-time adaptation */}
        <div className="p-3.5 rounded-2xl bg-white border border-cream-300 shadow-sm text-xs text-charcoal-600 flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-coral-500 shrink-0" />
          <span>Language and Font scaling changes apply instantly to all pages, navigation, and speech outputs!</span>
        </div>

      </main>

      <footer className="w-full text-center py-4 text-xs text-charcoal-400 font-sans">
        SignX v1.0.0  Real Indian Sign Language Platform
      </footer>
    </div>
  );
}
