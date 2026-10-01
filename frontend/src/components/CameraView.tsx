import React, { useEffect, useRef } from 'react';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
  error: string | null;
}

const CameraView: React.FC<CameraViewProps> = ({ videoRef, isActive, onStart, onStop, error }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // Scanning animation overlay when camera is active
  useEffect(() => {
    if (!isActive || !canvasRef.current) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scanY = 0;
    let direction = 1;

    const animate = () => {
      if (!canvas || !ctx) return;
      
      // Match canvas to video size
      if (videoRef.current) {
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Corner brackets
      const w = canvas.width;
      const h = canvas.height;
      const bracketSize = 40;
      const margin = 30;
      const lineWidth = 2;
      
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';

      // Top-left
      ctx.beginPath();
      ctx.moveTo(margin, margin + bracketSize);
      ctx.lineTo(margin, margin);
      ctx.lineTo(margin + bracketSize, margin);
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(w - margin - bracketSize, margin);
      ctx.lineTo(w - margin, margin);
      ctx.lineTo(w - margin, margin + bracketSize);
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(margin, h - margin - bracketSize);
      ctx.lineTo(margin, h - margin);
      ctx.lineTo(margin + bracketSize, h - margin);
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(w - margin - bracketSize, h - margin);
      ctx.lineTo(w - margin, h - margin);
      ctx.lineTo(w - margin, h - margin - bracketSize);
      ctx.stroke();

      // Scanning line
      scanY += direction * 1.5;
      if (scanY > h - margin * 2) direction = -1;
      if (scanY < 0) direction = 1;

      const gradient = ctx.createLinearGradient(0, scanY + margin, w, scanY + margin);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0)');
      gradient.addColorStop(0.3, 'rgba(99, 102, 241, 0.3)');
      gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.5)');
      gradient.addColorStop(0.7, 'rgba(99, 102, 241, 0.3)');
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(margin + 5, scanY + margin);
      ctx.lineTo(w - margin - 5, scanY + margin);
      ctx.stroke();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, videoRef]);

  return (
    <div className="space-y-4">
      <div className={`camera-container aspect-video relative ${isActive ? 'active' : ''}`}>
        {/* Video element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isActive ? 'block' : 'hidden'}`}
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* Canvas overlay for scanning animation */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full pointer-events-none ${isActive ? 'block' : 'hidden'}`}
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* Recording indicator */}
        {isActive && (
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-medium text-white/80">LIVE</span>
          </div>
        )}

        {/* Model status */}
        {isActive && (
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
            <div className="glow-dot" />
            <span className="text-xs font-medium text-white/80">MediaPipe</span>
          </div>
        )}

        {/* Placeholder when camera off */}
        {!isActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-surface-800 to-surface-900">
            <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <Camera className="w-10 h-10 text-white/15" />
            </div>
            <p className="text-white/30 text-sm font-medium">Click Start Camera to begin</p>
            <p className="text-white/15 text-xs mt-1">Ensure your camera is connected</p>
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/80 backdrop-blur-sm">
            <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
            <p className="text-red-300 text-sm font-medium">{error}</p>
            <p className="text-red-400/50 text-xs mt-1">Check camera permissions in your browser</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {!isActive ? (
          <button
            onClick={onStart}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Camera className="w-5 h-5" />
            Start Camera
          </button>
        ) : (
          <button
            onClick={onStop}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white font-semibold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <CameraOff className="w-5 h-5" />
            Stop Camera
          </button>
        )}
      </div>
    </div>
  );
};

export default CameraView;
