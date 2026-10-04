import { useState, useRef, useCallback } from 'react';

export const useCamera = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera access is unavailable. Open this app on localhost or HTTPS.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });

      const video = videoRef.current;
      if (!video) {
        stream.getTracks().forEach(track => track.stop());
        throw new Error('Camera preview is not ready. Please try again.');
      }

      video.srcObject = stream;
      await video.play();
      streamRef.current = stream;
      setIsCameraActive(true);
      setError(null);
    } catch (err) {
      const errorName = err instanceof DOMException ? err.name : '';
      const message = errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError'
        ? 'Camera permission was denied. Allow camera access for this site, then tap Start Camera again.'
        : errorName === 'NotFoundError'
          ? 'No camera was found. Connect a webcam and try again.'
          : errorName === 'NotReadableError'
            ? 'The camera is already in use by another app.'
            : err instanceof Error ? err.message : 'Failed to access camera.';

      setError(message);
      setIsCameraActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !isCameraActive) return null;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.8);
    }
    return null;
  }, [isCameraActive]);

  return { isCameraActive, startCamera, stopCamera, captureFrame, videoRef, error };
};
