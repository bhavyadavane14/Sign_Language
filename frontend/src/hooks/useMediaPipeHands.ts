/**
 * Hook to initialize and run Google MediaPipe Hands in the browser with maximum compatibility.
 * Provides live landmark tracking and calls callbacks per frame.
 */

import { useEffect, useRef, useState } from 'react';
import { HandLandmark, classifyHandGesture, drawFuturisticSkeleton } from '../services/handGestureRecognizer';

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
  detectedSign: string;
  confidence: number;
  landmarks: HandLandmark[] | null;
  fingerState: {
    thumb: boolean;
    index: boolean;
    middle: boolean;
    ring: boolean;
    pinky: boolean;
  };
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
    detectedSign: '',
    confidence: 0,
    landmarks: null,
    fingerState: { thumb: false, index: false, middle: false, ring: false, pinky: false },
    error: null
  });

  const handsInstanceRef = useRef<any>(null);
  const cameraInstanceRef = useRef<any>(null);
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(Date.now());
  const isProcessingRef = useRef(false);

  // 1. Load MediaPipe script dynamically if not present
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

        // Initialize Hands solution
        const hands = new window.Hands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.65,
          minTrackingConfidence: 0.6
        });

        hands.onResults((results: any) => {
          if (!isMounted) return;

          // FPS counter
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

          // Match canvas dimensions to video
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const firstHand = results.multiHandLandmarks[0] as HandLandmark[];
            
            // Classify gesture
            const classification = classifyHandGesture(firstHand);

            // Draw holographic skeleton
            drawFuturisticSkeleton(ctx, firstHand, canvas.width, canvas.height, classification.sign);

            setState(s => ({
              ...s,
              isDetecting: true,
              detectedSign: classification.sign,
              confidence: Math.round(classification.confidence * 100),
              landmarks: firstHand,
              fingerState: classification.fingers
            }));
          } else {
            setState(s => ({
              ...s,
              isDetecting: false,
              detectedSign: '',
              confidence: 0,
              landmarks: null,
              fingerState: { thumb: false, index: false, middle: false, ring: false, pinky: false }
            }));
          }
        });

        handsInstanceRef.current = hands;
        setState(s => ({ ...s, isReady: true }));
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
  }, [canvasRef, videoRef]);

  // 2. Video frame dispatch loop
  useEffect(() => {
    let animId: number;

    const processFrame = async () => {
      const video = videoRef.current;
      const hands = handsInstanceRef.current;

      if (isActive && video && video.readyState >= 2 && hands && !isProcessingRef.current) {
        try {
          isProcessingRef.current = true;
          await hands.send({ image: video });
        } catch (err) {
          // ignore dropped frames
        } finally {
          isProcessingRef.current = false;
        }
      }

      if (isActive) {
        animId = requestAnimationFrame(processFrame);
      }
    };

    if (isActive && state.isReady) {
      animId = requestAnimationFrame(processFrame);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isActive, state.isReady, videoRef]);

  return state;
}
