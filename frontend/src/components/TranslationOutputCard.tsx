import React, { useState } from 'react';
import { Volume2, RefreshCw, Lightbulb, Quote, Copy, Check } from 'lucide-react';

interface TranslationOutputCardProps {
  detectedSign: string;
  onTryAnother: () => void;
  confidence?: number;
}

export default function TranslationOutputCard({
  detectedSign,
  onTryAnother,
  confidence,
}: TranslationOutputCardProps) {
  const [outputMode, setOutputMode] = useState<'Text' | 'Speech' | 'Both'>('Text');
  const [isCopied, setIsCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const displayText = detectedSign || "No sign detected yet";

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(displayText);
    utterance.rate = 0.95;
    utterance.lang = 'en-IN';
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(displayText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-5">
      
      {/* Mode Selectors matching Screen 5: [Text] [Speech] [Both] */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-cream-200/90 rounded-2xl border border-cream-300">
        {(['Text', 'Speech', 'Both'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setOutputMode(mode)}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              outputMode === mode
                ? 'bg-coral-500 text-white shadow-sm'
                : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-white/60'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Main Quotation Card matching Screen 5 */}
      <div className="signx-card p-6 sm:p-8 relative bg-white overflow-hidden shadow-card">
        {/* Soft decorative quote mark */}
        <Quote className="w-12 h-12 text-cream-400/80 -mb-2" />

        <div className="flex items-center justify-between gap-4 my-2">
          <div className="flex-1">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight font-display">
              {displayText}
            </h2>
            {confidence !== undefined && confidence > 0 && (
              <p className="text-xs text-forest-700 font-mono mt-1 font-semibold">
                Model Certainty: {Math.round(confidence * 100)}%
              </p>
            )}
          </div>

          {/* Audio Speaker Button (orange round button matching Screen 5) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeak}
              aria-label="Play translation speech"
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-btn ${
                isPlayingAudio 
                  ? 'bg-forest-700 text-white animate-pulse' 
                  : 'bg-coral-500 hover:bg-coral-600 text-white active:scale-95'
              }`}
            >
              <Volume2 className="w-5 h-5" />
            </button>

            <button
              onClick={handleCopy}
              aria-label="Copy translated text"
              className="w-10 h-10 rounded-2xl bg-cream-100 hover:bg-cream-200 border border-cream-300 flex items-center justify-center text-charcoal-600 transition-all active:scale-95"
            >
              {isCopied ? <Check className="w-4 h-4 text-forest-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Detected Gesture Progression Sequence matching Screen 5 */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 font-display">
          Detected Gesture
        </h4>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((frameIdx) => (
            <div 
              key={frameIdx}
              className="relative aspect-square rounded-2xl bg-cream-200/90 border border-cream-300 p-2 flex flex-col items-center justify-center overflow-hidden shadow-sm"
            >
              {/* Silhouette SVG representing gesture sequence frame */}
              <svg viewBox="0 0 100 100" className="w-12 h-12 text-charcoal-700/80" fill="currentColor">
                <circle cx="50" cy="25" r="14" />
                <path d="M28 50 C28 42, 38 40, 50 40 C62 40, 72 42, 72 50 L78 85 L22 85 Z" opacity="0.85" />
                {/* Hand placement variations across 3 frames */}
                {frameIdx === 1 && (
                  <path d="M30 65 L45 55 M70 65 L55 55" stroke="#EB6238" strokeWidth="4" strokeLinecap="round" />
                )}
                {frameIdx === 2 && (
                  <path d="M35 60 L48 52 M65 60 L52 52" stroke="#EB6238" strokeWidth="4" strokeLinecap="round" />
                )}
                {frameIdx === 3 && (
                  <path d="M42 56 L49 50 M58 56 L51 50" stroke="#1B4D35" strokeWidth="4" strokeLinecap="round" />
                )}
              </svg>
              <span className="text-[10px] font-mono text-charcoal-500 mt-1">
                Phase {frameIdx}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Try Another Sign Button matching Screen 5 */}
      <button
        onClick={onTryAnother}
        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-coral-500 to-coral-600 text-white font-semibold text-sm shadow-btn flex items-center justify-center gap-2 hover:from-coral-600 hover:to-coral-700 transition-all active:scale-[0.98]"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Another Sign</span>
      </button>

      {/* Helpful Tip Card matching Screen 5 */}
      <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200/80 flex items-start gap-3 shadow-sm">
        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <h5 className="text-xs font-bold text-charcoal-900">Tip</h5>
          <p className="text-xs text-charcoal-600 mt-0.5 leading-relaxed">
            Keep both hands clearly inside the camera frame under good lighting for optimal landmark capture.
          </p>
        </div>
      </div>

    </div>
  );
}
