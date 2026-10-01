import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, RefreshCw, Lightbulb, Quote, Copy, Check, Play, Square } from 'lucide-react';

interface TranslationOutputCardProps {
  detectedSign: string;
  onTryAnother: () => void;
  confidence?: number;
  /** If true, the card will auto-speak when a new sign is received */
  autoSpeak?: boolean;
}

export default function TranslationOutputCard({
  detectedSign,
  onTryAnother,
  confidence,
  autoSpeak = false,
}: TranslationOutputCardProps) {
  const [outputMode, setOutputMode] = useState<'Text' | 'Speech' | 'Both'>('Both');
  const [isCopied, setIsCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(true);
  const [ttsError, setTtsError] = useState('');
  const [speechRate, setSpeechRate] = useState(0.9);
  const lastSpokenSign = useRef('');

  const displayText = detectedSign || 'No sign detected yet';
  const hasSign = !!detectedSign;

  // Check browser TTS support on mount
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setTtsSupported(false);
      setTtsError('Text-to-speech is not supported in this browser. Please try Chrome or Edge.');
    }
  }, []);

  const speakText = useCallback((text: string, rate = speechRate) => {
    if (!ttsSupported || !text) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = rate;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsPlayingAudio(true);
        setTtsError('');
      };
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = (e) => {
        setIsPlayingAudio(false);
        if (e.error !== 'interrupted') {
          setTtsError('Voice playback failed. Please try again.');
        }
      };

      // iOS/Safari workaround: needs a small delay
      setTimeout(() => window.speechSynthesis.speak(utterance), 50);
    } catch (err) {
      setIsPlayingAudio(false);
      setTtsError('Voice playback failed. Please check browser audio permissions.');
    }
  }, [ttsSupported, speechRate]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, []);

  // Auto-speak when a genuinely new sign is detected and mode is Speech or Both
  useEffect(() => {
    if (
      autoSpeak &&
      hasSign &&
      ttsSupported &&
      detectedSign !== lastSpokenSign.current &&
      (outputMode === 'Speech' || outputMode === 'Both')
    ) {
      lastSpokenSign.current = detectedSign;
      // Small delay so UI renders first
      const timer = setTimeout(() => speakText(detectedSign), 300);
      return () => clearTimeout(timer);
    }
  }, [detectedSign, autoSpeak, hasSign, ttsSupported, outputMode, speakText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayText).catch(() => {});
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleModeChange = (mode: 'Text' | 'Speech' | 'Both') => {
    setOutputMode(mode);
    // If switching to Speech or Both and sign exists, speak immediately
    if ((mode === 'Speech' || mode === 'Both') && hasSign && ttsSupported) {
      speakText(detectedSign);
    } else if (mode === 'Text') {
      stopSpeaking();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-5">
      
      {/* Mode Selectors: [Text] [Speech] [Both] */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-cream-200/90 rounded-2xl border border-cream-300">
        {(['Text', 'Speech', 'Both'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => handleModeChange(mode)}
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

      {/* Main Quotation Card */}
      <div className="signx-card p-6 sm:p-8 relative bg-white overflow-hidden shadow-card">
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

          {/* Voice control buttons */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            {/* Play / Stop button */}
            <button
              onClick={isPlayingAudio ? stopSpeaking : () => speakText(detectedSign)}
              disabled={!hasSign || !ttsSupported}
              aria-label={isPlayingAudio ? 'Stop voice' : 'Play translation speech'}
              title={!ttsSupported ? 'TTS not supported in this browser' : (isPlayingAudio ? 'Stop' : 'Speak')}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-btn ${
                !hasSign || !ttsSupported
                  ? 'bg-cream-200 text-charcoal-400 cursor-not-allowed shadow-none'
                  : isPlayingAudio
                    ? 'bg-forest-700 text-white animate-pulse'
                    : 'bg-coral-500 hover:bg-coral-600 text-white active:scale-95'
              }`}
            >
              {isPlayingAudio ? <Square className="w-4 h-4" fill="currentColor" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              aria-label="Copy translated text"
              className="w-10 h-10 rounded-2xl bg-cream-100 hover:bg-cream-200 border border-cream-300 flex items-center justify-center text-charcoal-600 transition-all active:scale-95"
            >
              {isCopied ? <Check className="w-4 h-4 text-forest-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* TTS Error or no-support notice */}
        {ttsError && (
          <p className="mt-2 text-[11px] text-rose-500 flex items-center gap-1">
            <VolumeX className="w-3.5 h-3.5" /> {ttsError}
          </p>
        )}
        {!ttsSupported && (
          <p className="mt-2 text-[11px] text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
            ⚠ Text-to-speech unavailable. Please use Chrome or Edge for voice output.
          </p>
        )}
      </div>

      {/* Voice Speed Control (shown when Speech or Both mode is active) */}
      {(outputMode === 'Speech' || outputMode === 'Both') && ttsSupported && (
        <div className="signx-card px-5 py-4 bg-white border border-cream-300 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-charcoal-700 flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-coral-500" fill="currentColor" />
              Voice Speed
            </span>
            <span className="text-xs font-mono font-bold text-coral-600 bg-coral-50 px-2 py-0.5 rounded-lg">
              {speechRate.toFixed(1)}×
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.8"
            step="0.1"
            value={speechRate}
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-coral-500"
            aria-label="Voice playback speed"
          />
          <div className="flex justify-between text-[10px] text-charcoal-400 mt-1 font-mono">
            <span>0.5× Slow</span>
            <span>1.0× Normal</span>
            <span>1.8× Fast</span>
          </div>

          {/* Replay button */}
          {hasSign && (
            <button
              onClick={() => speakText(detectedSign)}
              disabled={isPlayingAudio}
              className="mt-3 w-full py-2 rounded-xl bg-cream-100 hover:bg-cream-200 border border-cream-300 text-charcoal-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              <RefreshCw className="w-3.5 h-3.5 text-coral-500" />
              Replay Voice
            </button>
          )}
        </div>
      )}

      {/* Detected Gesture Progression Sequence */}
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
              <svg viewBox="0 0 100 100" className="w-12 h-12 text-charcoal-700/80" fill="currentColor">
                <circle cx="50" cy="25" r="14" />
                <path d="M28 50 C28 42, 38 40, 50 40 C62 40, 72 42, 72 50 L78 85 L22 85 Z" opacity="0.85" />
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

      {/* Try Another Sign Button */}
      <button
        onClick={() => {
          stopSpeaking();
          onTryAnother();
        }}
        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-coral-500 to-coral-600 text-white font-semibold text-sm shadow-btn flex items-center justify-center gap-2 hover:from-coral-600 hover:to-coral-700 transition-all active:scale-[0.98]"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Another Sign</span>
      </button>

      {/* Helpful Tip Card */}
      <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200/80 flex items-start gap-3 shadow-sm">
        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <h5 className="text-xs font-bold text-charcoal-900">Tip</h5>
          <p className="text-xs text-charcoal-600 mt-0.5 leading-relaxed">
            Keep both hands clearly inside the camera frame under good lighting for optimal landmark capture. Use <strong>Both</strong> mode to see text and hear the translation simultaneously.
          </p>
        </div>
      </div>

    </div>
  );
}
