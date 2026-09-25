/**
 * SignX - MediaPipe Hands Hook
 * ==============================
 * Initializes and manages Google MediaPipe Hands in the browser.
 * Extracts 21 3D spatial landmarks for Indian Sign Language processing.
 * 
 * STRICT POLICY:
 * - MediaPipe is purely for landmark extraction and vision tracking.
 * - Does NOT perform heuristic gesture classification or fake predictions.
 * - Genuine recognition requires the verified ISL model.
 */

import { useEffect, useRef, useState } from 'react';
import { HandLandmark, drawSignXReticle, extractNormalizedFeatures } from '../services/handGestureRecognizer';

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
    isModelLoaded: false,
    error: null,
  });

  const handsInstanceRef = useRef<any>(null);
  const cameraInstanceRef = useRef<any>(null);
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(Date.now());
  const isProcessingRef = useRef(false);

  // 1. Check backend model status on initialization
  useEffect(() => {
    let isMounted = true;
    async function checkModelStatus() {
      try {
        const res = await fetch('/api/translate/status');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setState(s => ({ ...s, isModelLoaded: !!data.model_loaded }));
          }
        }
      } catch (_) {
        // Backend offline or unreachable
      }
    }
    checkModelStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Load MediaPipe Hands dynamically
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

            // Draw SignX Green Reticle & Hand Skeleton
            drawSignXReticle(ctx, primaryHand, canvas.width, canvas.height);

            // Extract normalized 63-d feature vector
            const normalizedFeatures = extractNormalizedFeatures(primaryHand);

            setState(s => ({
              ...s,
              isDetecting: true,
              handCount,
              landmarks: primaryHand,
              statusText: s.isModelLoaded 
                ? 'Hand tracked — Analyzing ISL kinematics...'
                : 'Hand tracked • Awaiting verified ISL weights (signx_model.h5)',
            }));
          } else {
            // No hands visible in frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setState(s => ({
              ...s,
              isDetecting: false,
              handCount: 0,
              landmarks: null,
              detectedSign: null,
              confidence: 0,
              statusText: 'Waiting for sign... Position hand in frame.',
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
  }, [videoRef, canvasRef]);

  // 3. Connect Video Stream to MediaPipe Hands
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
