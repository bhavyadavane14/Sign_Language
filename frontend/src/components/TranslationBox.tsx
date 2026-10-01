import React from 'react';
import { Volume2, Trash2, Save, Languages } from 'lucide-react';

interface TranslationBoxProps {
  text: string;
  targetLanguage: string;
  onLanguageChange: (lang: string) => void;
  onClear: () => void;
  onSpeak: () => void;
  onSave: () => void;
  isSpeaking: boolean;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'mr', name: 'Marathi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'pa', name: 'Punjabi' },
];

const TranslationBox: React.FC<TranslationBoxProps> = ({
  text,
  targetLanguage,
  onLanguageChange,
  onClear,
  onSpeak,
  onSave,
  isSpeaking,
}) => {
  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Translation</h3>
        <div className="flex items-center gap-1">
          <Languages className="w-3.5 h-3.5 text-white/40" />
          <select
            value={targetLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg text-xs text-white/70 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-surface-800 text-white">
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="min-h-[80px] p-4 rounded-xl bg-white/5 border border-white/5 mb-4">
        {text ? (
          <p className="text-lg font-medium text-white leading-relaxed">{text}</p>
        ) : (
          <p className="text-white/20 italic text-sm">Recognized signs will appear here...</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onSpeak}
          disabled={!text}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            isSpeaking
              ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
              : text
              ? 'bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 border border-brand-500/20'
              : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          {isSpeaking ? 'Speaking...' : 'Speak'}
        </button>

        <button
          onClick={onSave}
          disabled={!text}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70 border border-white/5 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          Save
        </button>

        <button
          onClick={onClear}
          disabled={!text}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/5 text-white/50 hover:bg-red-500/10 hover:text-red-400 border border-white/5 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ml-auto"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>
    </div>
  );
};

export default TranslationBox;
