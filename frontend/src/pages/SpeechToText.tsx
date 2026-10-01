import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Copy, Check, Trash2, Sparkles, Volume2, Globe } from 'lucide-react';

export default function SpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [language, setLanguage] = useState('en-IN');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalChunk += event.results[i][0].transcript + ' ';
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (finalChunk) {
          setTranscript(prev => prev ? `${prev} ${finalChunk.trim()}` : finalChunk.trim());
        }
        setInterimText(currentInterim);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setError(`Speech error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText('');
      };

      recognitionRef.current = recognition;
    } else {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language]);

  const toggleListening = () => {
    setError(null);
    if (!recognitionRef.current) {
      setError('Speech recognition engine not initialized');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err: any) {
        setError(err.message || 'Failed to start microphone');
      }
    }
  };

  const handleCopy = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-surface-900 text-white font-sans pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="orb orb-1 opacity-20"></div>
        <div className="orb orb-2 opacity-15"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-6">
        
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent-400" /> Bi-Directional Hearing Bridge
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">
            Speech to <span className="text-gradient">Text Transcriber</span>
          </h1>
          <p className="text-sm md:text-base text-white/50 mt-1">
            Convert spoken hearing voices into real-time readable text for Deaf and Hard-of-Hearing users.
          </p>
        </div>

        {/* Transcriber Studio Card */}
        <div className="glass-card rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl p-6 md:p-8 space-y-6 shadow-2xl">
          
          {/* Active Listening Radar Animation */}
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
              {isListening && (
                <>
                  <div className="absolute inset-0 rounded-full bg-cyan-500/30 animate-ping" />
                  <div className="absolute -inset-4 rounded-full border border-cyan-400/40 animate-pulse" />
                </>
              )}

              <button
                onClick={toggleListening}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-2xl ${
                  isListening
                    ? 'bg-gradient-to-r from-red-600 to-rose-500 shadow-[0_0_40px_rgba(239,68,68,0.5)] scale-110'
                    : 'bg-gradient-to-r from-brand-600 to-accent-600 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:scale-105'
                }`}
              >
                {isListening ? <MicOff className="w-10 h-10 animate-pulse" /> : <Mic className="w-10 h-10" />}
              </button>
            </div>

            <div className="mt-5 text-center">
              <div className="text-base font-display font-bold text-white flex items-center justify-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-400 shadow-[0_0_8px_#f87171]' : 'bg-white/20'}`} />
                {isListening ? 'Listening to speech...' : 'Click to begin audio transcription'}
              </div>
              <p className="text-xs text-white/40 mt-1">Speak clearly into your microphone</p>
            </div>
          </div>

          {/* Transcript Display Box */}
          <div className="min-h-[160px] p-6 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-white/40 pb-2 border-b border-white/5">
              <span>LIVE TRANSCRIPT</span>
              <span>{transcript ? transcript.split(' ').filter(Boolean).length : 0} WORDS</span>
            </div>

            {transcript || interimText ? (
              <div className="text-xl font-sans text-white leading-relaxed pt-2">
                <span>{transcript}</span>
                {interimText && <span className="text-cyan-400 italic opacity-80"> {interimText}</span>}
              </div>
            ) : (
              <div className="h-28 flex items-center justify-center text-white/20 italic text-base">
                Spoken words will transcribe dynamically here...
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            
            {/* Language Selector */}
            <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-xl border border-white/10 text-xs">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isListening}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="en-IN" className="bg-surface-900">English (India)</option>
                <option value="hi-IN" className="bg-surface-900">Hindi (India - हिन्दी)</option>
                <option value="en-US" className="bg-surface-900">English (US)</option>
              </select>
            </div>

            {/* Copy & Clear */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!transcript}
                className="glass px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 text-white/80 text-xs font-medium flex items-center gap-1.5 disabled:opacity-30 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Text'}
              </button>

              <button
                onClick={() => { setTranscript(''); setInterimText(''); }}
                disabled={!transcript && !interimText}
                className="glass px-4 py-2 rounded-xl border border-white/10 hover:bg-red-500/20 text-white/60 hover:text-red-300 text-xs font-medium flex items-center gap-1.5 disabled:opacity-30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>

          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs text-center">
              {error}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
