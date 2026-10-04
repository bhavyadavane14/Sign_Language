import { useState, useRef, useCallback, useEffect } from 'react';

export const useCamera = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableCameras, setAvailableCameras] = useState<{ id: string; label: string }[]>([]);
  const [activeCameraId, setActiveCameraId] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Helper to enumerate and filter out unwanted virtual cameras (Smart Connect, OBS, etc.)
  const getCleanCameras = useCallback(async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter(d => d.kind === 'videoinput');

      const cleanList = videoDevices.map((d, index) => ({
        id: d.deviceId,
        label: d.label || `Camera ${index + 1}`
      }));

      setAvailableCameras(cleanList);

      // Find the best camera: strictly avoid Smart Connect, OBS, Virtual cameras
      const nonVirtual = cleanList.filter(c => {
        const l = c.label.toLowerCase();
        return !l.includes('smart connect') && !l.includes('virtual') && !l.includes('obs') && !l.includes('droidcam') && !l.includes('iriun') && !l.includes('camo');
      });

      const integrated = nonVirtual.find(c => {
        const l = c.label.toLowerCase();
        return l.includes('integrated') || l.includes('internal') || l.includes('laptop') || l.includes('front') || l.includes('hd webcam') || l.includes('webcam');
      });

      const bestChoice = integrated || (nonVirtual.length > 0 ? nonVirtual[0] : (cleanList[0] || null));
      if (bestChoice) {
        setActiveCameraId(bestChoice.id);
        return bestChoice.id;
      }
      return '';
    } catch {
      return '';
    }
  }, []);

  const startCamera = useCallback(async (forcedDeviceId?: string) => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }

      let deviceId = forcedDeviceId || activeCameraId;
      if (!deviceId) {
        deviceId = await getCleanCameras();
      }

      const constraints: MediaStreamConstraints = {
        video: deviceId 
          ? { 
              deviceId: { exact: deviceId },
              width: { ideal: 640 },
              height: { ideal: 480 },
              frameRate: { ideal: 30 }
            }
          : { 
              facingMode: 'user',
              width: { ideal: 640 },
              height: { ideal: 480 }
            },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('disablePictureInPicture', 'true');
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(console.warn);
        };
      }

      streamRef.current = stream;
      setIsCameraActive(true);
      setError(null);
      getCleanCameras();
    } catch (err: any) {
      console.warn('Camera start notice, attempting fallback to front webcam:', err);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.setAttribute('disablePictureInPicture', 'true');
          videoRef.current.play().catch(console.warn);
        }
        streamRef.current = fallbackStream;
        setIsCameraActive(true);
        setError(null);
      } catch (fallbackErr: any) {
        setError(fallbackErr.message || 'Unable to access your laptop webcam. Please verify camera permissions in your browser.');
        setIsCameraActive(false);
      }
    }
  }, [activeCameraId, getCleanCameras]);

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

  const switchCamera = useCallback(async (newDeviceId: string) => {
    setActiveCameraId(newDeviceId);
    await startCamera(newDeviceId);
  }, [startCamera]);

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !isCameraActive) return null;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.8);
    }
    return null;
  }, [isCameraActive]);

  useEffect(() => {
    getCleanCameras();
  }, [getCleanCameras]);

  return { 
    isCameraActive, 
    startCamera, 
    stopCamera, 
    switchCamera,
    captureFrame, 
    videoRef, 
    error,
    availableCameras,
    activeCameraId
  };
};
