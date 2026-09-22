import React, { useRef, useState, useEffect } from 'react';
import { 
  Camera, CameraOff, Volume2, Trash2, Copy, Check, 
  Sparkles, Hand, Zap, Activity, RefreshCw, CornerDownLeft, Eye, HelpCircle
} from 'lucide-react';
import { useCamera } from '../hooks/useCamera';
import { useMediaPipeHands } from '../hooks/useMediaPipeHands';

const SUPPORTED_SIGNS = [
  { sign: 'A', type: 'Alphabet', tip: 'Make a fist with thumb resting alongside' },
  { sign: 'B / 4', type: 'Digit/Letter', tip: '4 fingers upright, thumb folded in' },
  { sign: 'C', type: 'Alphabet', tip: 'Curve fingers and thumb into a C-arc' },
  { sign: 'D / 1', type: 'Digit/Letter', tip: 'Point index finger straight up' },
  { sign: 'F / OK', type: 'Phrase', tip: 'Touch thumb & index tip in circle, 3 fingers up' },
  { sign: 'I', type: 'Alphabet', tip: 'Pinky finger straight up, others folded' },
  { sign: 'L', type: 'Alphabet', tip: 'Index finger up, thumb out at 90° angle' },
  { sign: 'O', type: 'Alphabet', tip: 'Touch all fingertips to thumb in an O ring' },
  { sign: 'U', type: 'Alphabet', tip: 'Index & middle fingers straight together' },
  { sign: 'V / 2', type: 'Digit/Letter', tip: 'Index & middle fingers open in a V (Peace)' },
  { sign: 'W / 3', type: 'Digit/Letter', tip: 'Index, middle, & ring fingers up' },
  { sign: 'Y', type: 'Alphabet', tip: 'Thumb and pinky extended out (Shaka sign)' },
  { sign: 'HELLO / 5', type: 'Phrase/Digit', tip: 'All 5 fingers spread out and upright' },
  { sign: 'GOOD / YES', type: 'Phrase', tip: 'Thumb pointed up (Thumbs Up)' },
  { sign: 'I LOVE YOU', type: 'Phrase', tip: 'Thumb, index, and pinky extended out' },
];

export default function Translator() {
  const { isCameraActive, startCamera, stopCamera, videoRef, error: cameraError } = useCamera();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Live MediaPipe 21-point tracking
  const { 
    isReady: isModelReady, 
    isDetecting, 
    fps, 
    detectedSign, 
    confidence, 
    fingerState 
  } = useMediaPipeHands(videoRef, canvasRef, isCameraActive);

  const [sentence, setSentence] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [autoAppend, setAutoAppend] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'all' | 'alphabet' | 'digit' | 'phrase'>('all');

  const lastAppendedSignRef = useRef<string>('');
  const stableHoldCountRef = useRef<number>(0);

  // Auto-append when sign is held steady for ~1.5 seconds (approx 15 frames)
  useEffect(() => {
    if (!autoAppend || !isCameraActive || !detectedSign) {
      stableHoldCountRef.current = 0;
      return;
    }

    if (detectedSign === lastAppendedSignRef.current) {
      stableHoldCountRef.current += 1;
      if (stableHoldCountRef.current === 18) { // Locked threshold
        setSentence(prev => prev ? `${prev} ${detectedSign}` : detectedSign);
      }
    } else {
      lastAppendedSignRef.current = detectedSign;
      stableHoldCountRef.current = 1;
    }
  }, [detectedSign, autoAppend, isCameraActive]);

  const handleSpeak = () => {
    if (!sentence || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    if (!sentence) return;
    navigator.clipboard.writeText(sentence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBackspace = () => {
    setSentence(prev => {
      const words = prev.trim().split(' ');
      words.pop();
      return words.join(' ');
    });
  };

  return (
    <div className="min-h-screen bg-surface-900 text-white font-sans pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="orb orb-1 opacity-20"></div>
        <div className="orb orb-2 opacity-15"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        
        {/* Top Telemetry Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
                AI Sign <span className="text-gradient">Studio</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-accent-400" /> Real-Time 3D HUD
              </span>
            </div>
            <p className="text-sm text-white/50">
              Live Indian Sign Language hand-pose estimation powered by Google MediaPipe
            </p>
          </div>

          {/* HUD Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="glass px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${isCameraActive ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-white/20'}`} />
              <span className="text-white/60">CAMERA:</span>
              <span className="font-mono font-bold text-white">{isCameraActive ? 'LIVE' : 'OFF'}</span>
            </div>

            <div className="glass px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 text-xs">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-white/60">FPS:</span>
              <span className="font-mono font-bold text-cyan-300">{fps || 0}</span>
            </div>

            <div className="glass px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 text-xs">
              <Hand className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-white/60">TRACKING:</span>
              <span className={`font-mono font-bold ${isDetecting ? 'text-emerald-400' : 'text-white/40'}`}>
                {isDetecting ? '21 LANDMARKS' : 'SEARCHING'}
              </span>
            </div>
          </div>
        </div>

        {/* Studio Grid: Camera Viewport (Left) & Translation HUD (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* CAMERA VIEWPORT (Left 7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            
            <div className={`camera-container relative aspect-[4/3] rounded-3xl overflow-hidden glass-strong border-2 transition-all duration-300 ${isCameraActive ? 'border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.25)]' : 'border-white/10'}`}>
              
              {/* Corner Cyberpunk Reticles */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-400 z-20 pointer-events-none opacity-80" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-400 z-20 pointer-events-none opacity-80" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-cyan-400 z-20 pointer-events-none opacity-80" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-cyan-400 z-20 pointer-events-none opacity-80" />

              {/* Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform scale-x-[-1] ${isCameraActive ? 'block' : 'hidden'}`}
              />

              {/* 2D HUD & Skeleton Canvas */}
              <canvas
                ref={canvasRef}
                className={`absolute inset-0 w-full h-full object-cover z-10 pointer-events-none transform scale-x-[-1] ${isCameraActive ? 'block' : 'hidden'}`}
              />

              {/* Active HUD Overlays */}
              {isCameraActive && (
                <>
                  <div className="absolute top-5 left-5 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 text-xs">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="font-mono text-cyan-300 tracking-wider">OPTICAL STREAM ON</span>
                  </div>

                  {/* Finger State Matrix (Live Anatomy Telemetry) */}
                  <div className="absolute bottom-5 left-5 z-20 glass px-3.5 py-2.5 rounded-2xl border border-white/15 bg-slate-950/80 backdrop-blur-md flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-white/50 mr-1">FINGERS</span>
                    {[
                      { name: 'T', state: fingerState.thumb },
                      { name: 'I', state: fingerState.index },
                      { name: 'M', state: fingerState.middle },
                      { name: 'R', state: fingerState.ring },
                      { name: 'P', state: fingerState.pinky }
                    ].map(f => (
                      <div 
                        key={f.name}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-200 ${
                          f.state 
                            ? 'bg-emerald-500 text-black shadow-[0_0_10px_#10b981]' 
                            : 'bg-white/10 text-white/30'
                        }`}
                        title={f.state ? 'Extended' : 'Folded'}
                      >
                        {f.name}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Placeholder when Camera is Off */}
              {!isCameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-surface-800/80 to-surface-900/90 backdrop-blur-md">
                  <div className="w-20 h-20 rounded-3xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center mb-5 text-brand-400 shadow-glow">
                    <Camera className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">Camera is Idle</h3>
                  <p className="text-sm text-white/50 max-w-sm mb-6">
                    Activate your webcam to initiate optical Indian Sign Language recognition with real-time skeleton projection.
                  </p>
                  <button
                    onClick={startCamera}
                    className="btn-primary flex items-center gap-2 px-8 py-3.5 rounded-2xl shadow-lg shadow-brand-500/30 text-white font-semibold hover:scale-105 transition-transform"
                  >
                    <Zap className="w-5 h-5 text-accent-300" /> Start Real-Time AI Camera
                  </button>
                  {cameraError && (
                    <div className="mt-4 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                      {cameraError}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Camera Control Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {isCameraActive ? (
                  <button
                    onClick={stopCamera}
                    className="btn-secondary px-5 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 flex items-center gap-2 text-sm font-medium transition-colors"
                  >
                    <CameraOff className="w-4 h-4" /> Stop Camera
                  </button>
                ) : (
                  <button
                    onClick={startCamera}
                    className="btn-primary px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium"
                  >
                    <Camera className="w-4 h-4" /> Start Camera
                  </button>
                )}

                <label className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/10 text-xs text-white/70 cursor-pointer hover:bg-white/10 transition-colors select-none">
                  <input
                    type="checkbox"
                    checked={autoAppend}
                    onChange={(e) => setAutoAppend(e.target.checked)}
                    className="accent-brand-500 w-4 h-4 rounded"
                  />
                  <span>Auto-append sign</span>
                </label>
              </div>

              <div className="text-xs text-white/40 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Mirrored preview active</span>
              </div>
            </div>

          </div>

          {/* TRANSLATION & RECOGNITION HUD (Right 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-5">
            
            {/* 1. Live Detected Sign Hologram */}
            <div className="glass-card relative overflow-hidden p-6 rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  OPTICAL RECOGNITION
                </span>
                <span className="text-xs font-mono text-white/40">
                  {isDetecting ? 'HAND IN FRAME' : 'NO HAND'}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center py-4 min-h-[140px] text-center">
                {isCameraActive && detectedSign ? (
                  <>
                    <div className="text-5xl md:text-6xl font-display font-extrabold text-gradient tracking-wider drop-shadow-[0_0_25px_rgba(99,102,241,0.5)] animate-scale-in">
                      {detectedSign}
                    </div>

                    <div className="w-full mt-5 space-y-2">
                      <div className="flex justify-between text-xs font-mono text-white/60">
                        <span>CONFIDENCE</span>
                        <span className="text-cyan-300 font-bold">{confidence}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 via-brand-500 to-accent-500 transition-all duration-300"
                          style={{ width: `${confidence}%` }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Hand className="w-12 h-12 text-white/15 mx-auto animate-pulse" />
                    <p className="text-sm text-white/40">
                      {isCameraActive ? 'Hold your hand steadily in front of the lens...' : 'Camera not active'}
                    </p>
                  </div>
                )}
              </div>

              {/* Append manual button */}
              <button
                onClick={() => setSentence(prev => prev ? `${prev} ${detectedSign}` : detectedSign)}
                disabled={!detectedSign || !isCameraActive}
                className="w-full mt-4 btn-primary py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <CornerDownLeft className="w-4 h-4" /> Add "{detectedSign || 'Sign'}" to Sentence
              </button>
            </div>

            {/* 2. Sentence Accumulator & Speech Hub */}
            <div className="glass-card p-6 rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-brand-300">
                  ACCUMULATED SENTENCE
                </span>
                <span className="text-xs text-white/40 font-mono">
                  {sentence ? sentence.split(' ').filter(Boolean).length : 0} WORDS
                </span>
              </div>

              {/* Text Area Display */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 min-h-[110px] font-sans text-lg text-white leading-relaxed flex items-center">
                {sentence ? (
                  <span className="font-medium text-white tracking-wide">{sentence}</span>
                ) : (
                  <span className="text-white/25 italic text-sm">
                    Recognized signs will sequence into continuous text here...
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={handleSpeak}
                  disabled={!sentence}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                    isSpeaking 
                      ? 'bg-accent-600 text-white shadow-glow-accent animate-pulse'
                      : 'bg-brand-600 hover:bg-brand-500 text-white shadow-glow disabled:opacity-40 disabled:cursor-not-allowed'
                  }`}
                >
                  <Volume2 className="w-4 h-4" /> {isSpeaking ? 'Voicing...' : 'Read Aloud'}
                </button>

                <button
                  onClick={handleCopy}
                  disabled={!sentence}
                  className="px-3.5 py-3 rounded-xl glass border border-white/10 hover:bg-white/10 text-white/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Copy text"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleBackspace}
                  disabled={!sentence}
                  className="px-3.5 py-3 rounded-xl glass border border-white/10 hover:bg-white/10 text-white/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Delete last word"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSentence('')}
                  disabled={!sentence}
                  className="px-3.5 py-3 rounded-xl glass border border-white/10 hover:bg-red-500/20 text-white/60 hover:text-red-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Clear all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM SECTION: ISL Interactive Gesture Reference Guide */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-accent-400" />
                Supported Indian Sign Language Gestures & Finger Guides
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Match these hand postures to test and train the computer vision model in real time.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl glass border border-white/10 text-xs">
              {(['all', 'alphabet', 'digit', 'phrase'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                    activeTab === tab 
                      ? 'bg-brand-600 text-white shadow-sm' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {SUPPORTED_SIGNS
              .filter(item => activeTab === 'all' || item.type.toLowerCase().includes(activeTab))
              .map(item => (
                <div 
                  key={item.sign}
                  onClick={() => setSentence(prev => prev ? `${prev} ${item.sign}` : item.sign)}
                  className="glass p-4 rounded-2xl border border-white/10 hover:border-brand-400/50 hover:bg-white/10 cursor-pointer transition-all duration-200 group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-display font-extrabold text-white group-hover:text-gradient">
                      {item.sign}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-white/5 text-white/40">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 group-hover:text-white/80 line-clamp-2">
                    {item.tip}
                  </p>
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}
