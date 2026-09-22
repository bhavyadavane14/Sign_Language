import React from 'react';
import { Clock, Trash2, ArrowRight, Volume2, Globe } from 'lucide-react';
import { TranslationHistory } from '../types/translation';

interface HistoryCardProps {
  entry: TranslationHistory;
  onDelete: (id: string) => void;
}

export default function HistoryCard({ entry, onDelete }: HistoryCardProps) {
  const date = new Date(entry.timestamp);
  const formattedDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  const handleSpeak = () => {
    if ('speechSynthesis' in window && entry.translatedText) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(entry.translatedText);
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="glass-card p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-brand-500/40 hover:bg-white/10 transition-all duration-200 group flex flex-col space-y-3">
      <div className="flex items-center justify-between text-xs text-white/50">
        <div className="flex items-center gap-1.5 font-mono">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{formattedDate} • {formattedTime}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeak}
            className="p-1.5 rounded-lg glass border border-white/10 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
            title="Speak translation"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="p-1.5 rounded-lg glass border border-white/10 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors"
            title="Delete entry"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* Sign Input */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest block">
            RECOGNIZED SIGN
          </span>
          <p className="text-base font-medium text-white font-display break-words">
            {entry.signText}
          </p>
        </div>

        {/* Translation Output */}
        <div className="p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/20 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-brand-300 uppercase tracking-widest">
            <span>TRANSLATION</span>
            <span className="text-white/40">{entry.language}</span>
          </div>
          <p className="text-base font-medium text-white font-sans break-words">
            {entry.translatedText}
          </p>
        </div>
      </div>
    </div>
  );
}
