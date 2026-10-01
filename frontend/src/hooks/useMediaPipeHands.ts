/**
 * SignX - MediaPipe Hands Hook
 * ==============================
 * Initializes and manages Google MediaPipe Hands in the browser.
 * Extracts 21 3D spatial landmarks and runs real-time ISL Gesture Recognition.
 */

import { useEffect, useRef, useState } from 'react';
import { 
  HandLandmark, 
  drawSignXReticle, 
  extractNormalizedFeatures,
  recognizeHandGesture 
} from '../services/handGestureRecognizer';

declare global {
  interface Window {
    Hands?: any;
    Camera?: any;
  }
}

export interface HandDetectionState {
  isReady: boolean;
  isDetecting: boolean;
  fps: number;
  detectedSign: string | null;
  confidence: number;
  landmarks: HandLandmark[] | null;
  handCount: number;
  statusText: string;
  isModelLoaded: boolean;
  error: string | null;
}

export function useMediaPipeHands(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  isActive: boolean
) {
  const [state, setState] = useState<HandDetectionState>({
    isReady: false,
    isDetecting: false,
    fps: 0,
    detectedSign: null,
    confidence: 0,
    landmarks: null,
    handCount: 0,
    statusText: 'Position your hand inside the frame.',
    isModelLoaded: true, // Active neural & kinematic models
    error: null,
  });

  const handsInstanceRef = useRef<any>(null);
  const cameraInstanceRef = useRef<any>(null);
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(Date.now());
  const isProcessingRef = useRef(false);

  // Temporal smoothing buffer for stable gesture recognition
  const recentPredictionsRef = useRef<Array<{ sign: string; conf: number }>>([]);
  const lastStableSignRef = useRef<string | null>(null);

  // 1. Load MediaPipe Hands dynamically
  useEffect(() => {
    let isMounted = true;

    async function loadMediaPipe() {
      try {
        if (!window.Hands) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
            script.crossOrigin = 'anonymous';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load MediaPipe Hands SDK from CDN'));
            document.head.appendChild(script);
          });
        }

        if (!isMounted) return;

        const hands = new window.Hands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.65,
          minTrackingConfidence: 0.6,
        });

        hands.onResults((results: any) => {
          if (!isMounted) return;

          // FPS calculation
          frameCountRef.current++;
          const now = Date.now();
          if (now - lastFpsTimeRef.current >= 1000) {
            const currentFps = frameCountRef.current;
            frameCountRef.current = 0;
            lastFpsTimeRef.current = now;
            setState(s => ({ ...s, fps: currentFps }));
          }

          const canvas = canvasRef.current;
          const video = videoRef.current;
          if (!canvas || !video) return;

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
          }

          const handsList = results.multiHandLandmarks;
          const handCount = handsList ? handsList.length : 0;

          if (handCount > 0) {
            const primaryHand = handsList[0] as HandLandmark[];

            // 1. Draw SignX Green Reticle & Skeleton
            drawSignXReticle(ctx, primaryHand, canvas.width, canvas.height);

            // 2. Perform Real-Time ISL Gesture Recognition
            const recognition = recognizeHandGesture(primaryHand);

            if (recognition.sign) {
              recentPredictionsRef.current.push({ sign: recognition.sign, conf: recognition.confidence });
              if (recentPredictionsRef.current.length > 5) {
                recentPredictionsRef.current.shift();
              }

              // Count frequencies in buffer to suppress jitter
              const counts: Record<string, number> = {};
              recentPredictionsRef.current.forEach(item => {
                counts[item.sign] = (counts[item.sign] || 0) + 1;
              });

              let dominantSign = recognition.sign;
              let maxCount = 0;
              for (const [sign, count] of Object.entries(counts)) {
                if (count > maxCount) {
                  maxCount = count;
                  dominantSign = sign;
                }
              }

              lastStableSignRef.current = dominantSign;

              setState(s => ({
                ...s,
                isDetecting: true,
                handCount,
                landmarks: primaryHand,
                detectedSign: dominantSign,
                confidence: recognition.confidence,
                statusText: `Recognized: ${dominantSign} (${Math.round(recognition.confidence * 100)}%)`,
                isModelLoaded: true,
              }));
            } else {
              setState(s => ({
                ...s,
                isDetecting: true,
                handCount,
                landmarks: primaryHand,
                statusText: 'Analyzing hand posture...',
                isModelLoaded: true,
              }));
            }
          } else {
            // No hands in frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            recentPredictionsRef.current = [];
            lastStableSignRef.current = null;

            setState(s => ({
              ...s,
              isDetecting: false,
              handCount: 0,
              landmarks: null,
              detectedSign: null,
              confidence: 0,
              statusText: 'Waiting for sign... Position hand in frame.',
              isModelLoaded: true,
            }));
          }
        });

        handsInstanceRef.current = hands;
        setState(s => ({ ...s, isReady: true, isModelLoaded: true }));
      } catch (err: any) {
        console.error('MediaPipe initialization error:', err);
        setState(s => ({ ...s, error: err.message || 'MediaPipe load failed' }));
      }
    }

    loadMediaPipe();

    return () => {
      isMounted = false;
      if (handsInstanceRef.current) {
        try {
          handsInstanceRef.current.close();
        } catch (_) {}
      }
    };
  }, [videoRef, canvasRef]);

  // 2. Stream Camera Frames to MediaPipe Hands
  useEffect(() => {
    if (!isActive || !state.isReady || !videoRef.current || !handsInstanceRef.current) {
      if (cameraInstanceRef.current) {
        try {
          cameraInstanceRef.current.stop();
        } catch (_) {}
      }
      return;
    }

    let isRunning = true;

    async function sendFrameLoop() {
      if (!isRunning || !isActive || !videoRef.current || !handsInstanceRef.current) return;

      if (videoRef.current.readyState >= 2 && !isProcessingRef.current) {
        isProcessingRef.current = true;
        try {
          await handsInstanceRef.current.send({ image: videoRef.current });
        } catch (e) {
          // Frame send failure or video paused
        } finally {
          isProcessingRef.current = false;
        }
      }

      if (isRunning && isActive) {
        requestAnimationFrame(sendFrameLoop);
      }
    }

    sendFrameLoop();

    return () => {
      isRunning = false;
    };
  }, [isActive, state.isReady, videoRef]);

  return state;
}
