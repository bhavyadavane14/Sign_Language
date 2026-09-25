import React, { useRef, useState, useEffect } from 'react';
import { 
  Camera, CameraOff, Volume2, Image as ImageIcon, 
  RotateCw, RefreshCw, MessageSquare, AlertCircle, Sparkles, Check, Info
} from 'lucide-react';
import { useCamera } from '../hooks/useCamera';
import { useMediaPipeHands } from '../hooks/useMediaPipeHands';
import SignXHeader from '../components/SignXHeader';
import HamburgerMenu from '../components/HamburgerMenu';
import SignXAssistantDrawer from '../components/SignXAssistantDrawer';
import TranslationOutputCard from '../components/TranslationOutputCard';
import { historyService } from '../services/historyService';

export default function Translator() {
  const { isCameraActive, startCamera, stopCamera, videoRef, error: cameraError } = useCamera();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Live MediaPipe landmark extraction (Strictly vision preprocessing, no fake classification)
  const { 
    isReady: isModelReady, 
    isDetecting, 
    fps, 
    detectedSign, 
    confidence, 
    handCount,
    statusText,
    isModelLoaded 
  } = useMediaPipeHands(videoRef, canvasRef, isCameraActive);

  // Navigation & UI States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'camera' | 'output'>('camera');
  
  // Real active translation text
  const [currentSign, setCurrentSign] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Auto-start camera when mounting Home screen for immediate usability
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Update current sign only when genuine model prediction arrives
  useEffect(() => {
    if (detectedSign && isModelLoaded) {
      setCurrentSign(detectedSign);
      // Save genuine translation to user history
      historyService.addHistoryItem({
        id: Date.now().toString(),
        signText: detectedSign,
        translatedText: detectedSign,
        language: 'en-IN',
        timestamp: new Date().toISOString(),
      });
    }
  }, [detectedSign, isModelLoaded]);

  const handleSpeak = (text: string) => {
    if (!text) return;
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.lang = 'en-IN';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-charcoal-900 font-sans flex flex-col justify-between">
      
      {/* 1. Top Web Header matching Screens 4 & 5 */}
      <SignXHeader 
        onOpenMenu={() => setIsMenuOpen(true)} 
        showProfile={true}
      />

      {/* 2. Main Studio Viewport (Responsive: Mobile centered, Desktop side-by-side) */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-center">
        
        {viewMode === 'camera' ? (
          /* ============================================================
             SCREEN 4: HOME / LIVE ISL DETECTION
             ============================================================ */
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left / Top: Camera Viewport with Green Reticle & Live Hands */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="relative aspect-[3/4] sm:aspect-[4/3] w-full max-w-lg rounded-3xl bg-charcoal-900 overflow-hidden shadow-card border-2 border-cream-300">
                
                {/* HTML5 Video Element */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isCameraActive ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ transform: 'scaleX(-1)' }} // Mirror view for natural interaction
                />

                {/* Landmark Canvas with Green Reticle Brackets */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ transform: 'scaleX(-1)' }}
                />

                {/* Camera Inactive Fallback */}
                {!isCameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-cream-200/95 text-charcoal-700 space-y-3">
                    <div className="w-16 h-16 rounded-3xl bg-white border border-cream-300 flex items-center justify-center text-coral-500 shadow-sm">
                      <CameraOff className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-charcoal-900 font-display">Camera is Paused</h3>
                      <p className="text-xs sm:text-sm text-charcoal-500 mt-1 max-w-xs">
                        Click the center button below to activate your webcam for live Indian Sign Language capture.
                      </p>
                    </div>
                  </div>
                )}

                {/* Status Pill Badge matching Screen 4: "Detecting..." / "Waiting for sign..." */}
                {isCameraActive && (
                  <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
                    <div className="px-4 py-1.5 rounded-full bg-charcoal-900/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 border border-white/20 shadow-md">
                      <span className={`w-2.5 h-2.5 rounded-full ${isDetecting ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                      <span>{isDetecting ? 'Detecting gestures...' : 'Position your hand inside frame'}</span>
                    </div>
                  </div>
                )}

                {/* Model Status Floating Banner */}
                {!isModelLoaded && isCameraActive && (
                  <div className="absolute top-3 inset-x-3 pointer-events-none">
                    <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-amber-300 text-charcoal-800 text-xs flex items-center gap-2.5 shadow-sm">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="truncate">
                        MediaPipe vision active • Awaiting trained weights (`signx_model.h5`)
                      </span>
                    </div>
                  </div>
                )}

              </div>

              {/* Camera Controls matching Screen 4: [Gallery] [Record/Stop] [Switch] */}
              <div className="w-full max-w-lg flex items-center justify-around pt-4 px-6">
                
                {/* Left: Gallery */}
                <button
                  onClick={() => alert("Upload gesture: Use real-time webcam video stream for optimal multi-frame ISL recognition.")}
                  className="flex flex-col items-center gap-1.5 text-charcoal-600 hover:text-coral-600 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-cream-300 flex items-center justify-center shadow-sm hover:border-coral-300 transition-colors">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold">Gallery</span>
                </button>

                {/* Center: Large Record / Stop Toggle (Red/Coral circle matching Screen 4) */}
                <button
                  onClick={isCameraActive ? stopCamera : startCamera}
                  aria-label={isCameraActive ? "Stop Camera" : "Start Camera"}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-coral-500 to-coral-600 p-1.5 shadow-btn flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                >
                  <div className="w-full h-full rounded-full border-2 border-white flex items-center justify-center bg-coral-500">
                    {isCameraActive ? (
                      <div className="w-5 h-5 bg-white rounded-md shadow-sm" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </div>
                </button>

                {/* Right: Switch Camera */}
                <button
                  onClick={() => {
                    stopCamera();
                    setTimeout(() => startCamera(), 300);
                  }}
                  className="flex flex-col items-center gap-1.5 text-charcoal-600 hover:text-coral-600 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-cream-300 flex items-center justify-center shadow-sm hover:border-coral-300 transition-colors">
                    <RotateCw className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold">Switch</span>
                </button>

              </div>
            </div>

            {/* Right / Bottom: Translation Card & Status Info matching Screen 4 */}
            <div className="lg:col-span-5 w-full max-w-lg mx-auto space-y-4">
              
              {/* Detected Sign Output Card matching Screen 4 */}
              <div className="signx-card p-6 bg-white shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-coral-600 uppercase tracking-wider font-display">
                    <span className="w-2.5 h-2.5 rounded-full bg-coral-500" />
                    <span>{isModelLoaded ? "Detected Sign" : "Vision Status"}</span>
                  </div>

                  {currentSign && (
                    <button
                      onClick={() => setViewMode('output')}
                      className="text-xs font-bold text-coral-600 hover:text-coral-700 underline"
                    >
                      View Details →
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight font-display">
                      {isModelLoaded 
                        ? (currentSign || (isDetecting ? "Processing gesture..." : "Waiting for sign..."))
                        : (isDetecting ? "Hand Tracked (MediaPipe)" : "Position hand in frame")}
                    </h3>
                    
                    <p className="text-xs text-charcoal-500 mt-1 leading-relaxed">
                      {isModelLoaded 
                        ? (currentSign ? "Recognized by neural model" : "Sign steady inside the green reticle box")
                        : (isDetecting 
                            ? "21 3D landmarks extracted • Awaiting verified model weights" 
                            : "No hand visible inside webcam viewport")}
                    </p>
                  </div>

                  {/* Speaker Button (active only if genuine sign exists) */}
                  <button
                    onClick={() => handleSpeak(currentSign)}
                    disabled={!currentSign}
                    aria-label="Speak detected sign"
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-btn ${
                      isSpeaking 
                        ? 'bg-forest-700 text-white animate-pulse' 
                        : currentSign
                          ? 'bg-coral-500 hover:bg-coral-600 text-white active:scale-95'
                          : 'bg-cream-200 text-charcoal-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Verified ISL Standards & Architecture Card */}
              <div className="signx-card p-5 bg-cream-50 border border-cream-300/80 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center">
                    <Info className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider font-display">
                    Indian Sign Language Integrity
                  </h4>
                </div>

                <p className="text-xs text-charcoal-600 leading-relaxed">
                  SignX uses <strong>Google MediaPipe Hands</strong> for 21-point spatial coordinate extraction. Neural classification is strictly decoupled and requires verified ISL model weights trained on the <strong>ISLRTC / INCLUDE</strong> corpus. No signs or accuracies are simulated.
                </p>

                <div className="pt-1 flex items-center justify-between text-[11px] font-semibold text-charcoal-500 border-t border-cream-200">
                  <span>Standard: ISLRTC 10k Terms</span>
                  <span className={isModelLoaded ? "text-forest-700" : "text-amber-700"}>
                    Model: {isModelLoaded ? "Loaded" : "Weights Pending"}
                  </span>
                </div>
              </div>

              {/* Quick Navigation to Learn ISL */}
              <div className="p-4 rounded-2xl bg-white border border-cream-300 flex items-center justify-between shadow-sm">
                <div>
                  <h5 className="text-xs font-bold text-charcoal-900">Want to learn authentic signs?</h5>
                  <p className="text-[11px] text-charcoal-500">Explore official ISLRTC dictionary entries</p>
                </div>
                <button
                  onClick={() => window.location.href = '/learn'}
                  className="py-2 px-3.5 rounded-xl bg-forest-700 text-white text-xs font-bold shadow-btn-forest hover:bg-forest-800 transition-colors"
                >
                  Learn ISL →
                </button>
              </div>

            </div>

          </div>
        ) : (
          /* ============================================================
             SCREEN 5: TRANSLATION OUTPUT
             ============================================================ */
          <TranslationOutputCard
            detectedSign={currentSign || ""}
            confidence={confidence}
            onTryAnother={() => setViewMode('camera')}
          />
        )}

      </main>

      {/* Floating SignX Assistant Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsAssistantOpen(true)}
          aria-label="Open SignX Assistant"
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-coral-500 via-coral-600 to-forest-700 text-white shadow-btn hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          </div>
          <span className="font-bold text-xs tracking-wide font-display hidden sm:inline">
            SignX Assistant
          </span>
        </button>
      </div>

      {/* Hamburger Menu Drawer */}
      <HamburgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* SignX Assistant Chatbot Drawer */}
      <SignXAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Footer Branding Banner */}
      <footer className="py-3 text-center border-t border-cream-200 bg-white/50 text-xs text-charcoal-500 font-medium">
        <span>Bridge • Understand • Include &nbsp;|&nbsp; </span>
        <span className="font-hand text-coral-600 text-base font-bold">Different Hands Same World ♥</span>
      </footer>

    </div>
  );
}
