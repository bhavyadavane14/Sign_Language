import React, { useState, useEffect } from 'react';
import { Volume2, Square, Copy, Check, Trash2, Sparkles, Sliders } from 'lucide-react';

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [language, setLanguage] = useState('en-IN');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSpeak = () => {
    if (!text.trim() || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = speed;
    utterance.pitch = pitch;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
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
              <Sparkles className="w-3.5 h-3.5 text-accent-400" /> Neural Audio Synthesizer
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">
            Text to <span className="text-gradient">Speech Studio</span>
          </h1>
          <p className="text-sm md:text-base text-white/50 mt-1">
            Broadcast sign translation transcripts or custom text with natural localized Indian accents.
          </p>
        </div>

        {/* Studio Card */}
        <div className="glass-card rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl p-6 md:p-8 space-y-6 shadow-2xl">
          
          {/* Text Area */}
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste sign language transcripts here to speak them aloud..."
              className="w-full h-48 p-5 rounded-2xl bg-black/40 border border-white/10 focus:border-brand-500/50 text-white placeholder:text-white/25 text-lg leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all font-sans"
            />
            
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!text}
                className="glass p-2 rounded-xl border border-white/10 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-30 transition-colors"
                title="Copy"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setText('')}
                disabled={!text}
                className="glass p-2 rounded-xl border border-white/10 hover:bg-red-500/20 text-white/60 hover:text-red-300 disabled:opacity-30 transition-colors"
                title="Clear"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Soundwave Visualizer Simulation */}
          <div className="h-12 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-center gap-1.5 px-6 overflow-hidden">
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isSpeaking
                    ? 'bg-gradient-to-t from-cyan-500 via-brand-500 to-accent-500 animate-pulse'
                    : 'bg-white/10 h-2'
                }`}
                style={{
                  height: isSpeaking ? `${Math.max(6, Math.sin(i * 0.5 + Date.now() / 150) * 36 + 10)}px` : '4px',
                  animationDelay: `${i * 40}ms`
                }}
              />
            ))}
          </div>

          {/* Controls Bar: Language, Speed, Pitch */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            
            {/* Language Selector */}
            <div className="glass p-4 rounded-2xl border border-white/10 space-y-2">
              <label className="text-xs font-mono uppercase text-white/50 tracking-wider">Accent & Dialect</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-surface-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
              >
                <option value="en-IN">English (India - en-IN)</option>
                <option value="hi-IN">Hindi (India - hi-IN)</option>
                <option value="en-US">English (United States)</option>
                <option value="en-GB">English (United Kingdom)</option>
              </select>
            </div>

            {/* Speech Rate */}
            <div className="glass p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono text-white/50">
                <span>SPEECH SPEED</span>
                <span className="text-brand-300 font-bold">{speed}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>

            {/* Voice Pitch */}
            <div className="glass p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono text-white/50">
                <span>VOICE PITCH</span>
                <span className="text-accent-300 font-bold">{pitch}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-accent-500"
              />
            </div>

          </div>

          {/* Broadcast Trigger Button */}
          <div className="flex items-center gap-4 pt-2">
            {!isSpeaking ? (
              <button
                onClick={handleSpeak}
                disabled={!text.trim()}
                className="btn-primary flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-glow hover:scale-[1.01] transition-transform disabled:opacity-40"
              >
                <Volume2 className="w-5 h-5 text-accent-300" /> Speak Broadcast
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="btn-secondary flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 transition-colors"
              >
                <Square className="w-5 h-5 fill-current" /> Stop Broadcast
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
