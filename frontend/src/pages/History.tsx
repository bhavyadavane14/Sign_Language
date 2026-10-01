import React, { useEffect, useState } from 'react';
import { ChevronLeft, Volume2, Trash2, Clock, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { historyService } from '../services/historyService';
import { TranslationHistory } from '../types/translation';

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<TranslationHistory[]>([]);
  const [isPlayingId, setIsPlayingId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await historyService.getHistory();
      setHistory(data || []);
    } catch (_) {
      setHistory([]);
    }
  };

  const handleDelete = async (id: string) => {
    await historyService.deleteHistoryItem(id);
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = async () => {
    await historyService.clearHistory();
    setHistory([]);
  };

  const handleSpeak = (item: TranslationHistory) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const textToSpeak = item.translatedText || item.signText;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.lang = 'en-IN';
    utterance.onstart = () => setIsPlayingId(item.id);
    utterance.onend = () => setIsPlayingId(null);
    utterance.onerror = () => setIsPlayingId(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-charcoal-900 font-sans flex flex-col justify-between">
      
      {/* Top Header matching Screen 8: Back Arrow + "Translation History" */}
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
              Translation History
            </h1>
          </div>

          <span className="text-xs font-mono text-charcoal-500">
            {history.length} {history.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
      </header>

      {/* Main History List matching Screen 8 */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-4 space-y-3">
        
        {history.length > 0 ? (
          history.map((item) => {
            const dateStr = new Date(item.timestamp).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="p-3.5 bg-white rounded-2xl border border-cream-300 shadow-sm flex items-center justify-between gap-3 hover:border-coral-200 transition-all"
              >
                {/* Left Thumbnail/Avatar matching Screen 8 */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral-100 to-forest-50 border border-cream-200 flex items-center justify-center text-coral-600 font-black text-sm shrink-0">
                  {(item.translatedText || item.signText).slice(0, 2).toUpperCase()}
                </div>

                {/* Content: Title & Timestamp */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-charcoal-900 truncate font-display">
                    {item.translatedText || item.signText}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-charcoal-500 mt-0.5">
                    <Clock className="w-3 h-3 text-charcoal-400" />
                    <span>{dateStr}</span>
                  </div>
                </div>

                {/* Right Actions: Replay Audio & Delete */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleSpeak(item)}
                    aria-label="Replay audio"
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isPlayingId === item.id 
                        ? 'bg-forest-700 text-white animate-pulse' 
                        : 'bg-cream-100 hover:bg-cream-200 text-charcoal-700'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    aria-label="Delete entry"
                    className="w-9 h-9 rounded-xl bg-cream-100 hover:bg-coral-50 hover:text-coral-600 text-charcoal-500 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          /* Authentic Empty State (No permanent fake history) */
          <div className="p-8 text-center bg-white rounded-3xl border border-cream-300 space-y-3 shadow-sm my-8">
            <div className="w-12 h-12 rounded-2xl bg-cream-100 text-charcoal-400 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-charcoal-900 font-display">No History Yet</h3>
              <p className="text-xs text-charcoal-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Translations you capture in the live studio will appear here automatically with genuine timestamped logs.
              </p>
            </div>
            <button
              onClick={() => navigate('/translator')}
              className="py-2.5 px-5 rounded-2xl bg-coral-500 text-white font-semibold text-xs shadow-btn hover:bg-coral-600 transition-colors"
            >
              Start Translating
            </button>
          </div>
        )}

        {/* Clear History Button matching Screen 8: "🗑 Clear History" */}
        {history.length > 0 && (
          <div className="pt-4 flex justify-center">
            <button
              onClick={handleClearAll}
              className="px-5 py-2.5 rounded-2xl bg-white border border-coral-200 text-coral-600 hover:bg-coral-50 text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="py-3 text-center border-t border-cream-200 text-[11px] text-charcoal-500 font-medium">
        Encrypted Local & Session Storage Policy
      </footer>

    </div>
  );
}
