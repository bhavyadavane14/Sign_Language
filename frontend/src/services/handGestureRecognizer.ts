/**
 * SignX - Hand Landmark Feature Extraction & ISL Vision Engine
 * ==============================================================
 * Responsible strictly for:
 * 1. Landmark coordinate preprocessing and wrist normalization.
 * 2. Visual rendering of the detection reticle and hand skeleton (matching SignX design).
 * 3. Communicating with the genuine ISL model inference adapter.
 * 
 * STRICT POLICY:
 * - NO hardcoded heuristic sign classifiers (no ASL or invented rules).
 * - NO fabricated signs or fake accuracies.
 * - All classifications must originate from genuine ISL models trained on verified datasets (e.g. INCLUDE / ISLRTC).
 */

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface ISLRecognitionState {
  sign: string | null;
  confidence: number;
  isHandPresent: boolean;
  statusText: string;
  landmarks: HandLandmark[] | null;
  handCount: number;
  isModelLoaded: boolean;
}

// MediaPipe Hand Landmark Connections
export const HAND_CONNECTIONS: [number, number][] = [
  // Palm Base to Wrist
  [0, 1], [1, 2], [2, 3], [3, 4],        // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],        // Index
  [5, 9], [9, 10], [10, 11], [11, 12],   // Middle
  [9, 13], [13, 14], [14, 15], [15, 16], // Ring
  [13, 17], [17, 18], [18, 19], [19, 20],// Pinky
  [0, 17]                                // Palm base closure
];

/**
 * Normalizes 21 3D landmarks with respect to the wrist (landmark 0).
 * Produces a flat 63-dimensional array compatible with the SignX neural model.
 */
export function extractNormalizedFeatures(landmarks: HandLandmark[]): number[] | null {
  if (!landmarks || landmarks.length < 21) return null;

  const wrist = landmarks[0];
  const features: number[] = [];

  for (let i = 0; i < 21; i++) {
    features.push(landmarks[i].x - wrist.x);
    features.push(landmarks[i].y - wrist.y);
    features.push(landmarks[i].z - wrist.z);
  }

  return features;
}

/**
 * Draws the elegant SignX green/coral detection reticle and hand skeleton overlay.
 * Follows Screen 4 ("Home / Detection") of the primary reference image.
 */
export function drawSignXReticle(
  ctx: CanvasRenderingContext2D,
  landmarks: HandLandmark[] | null,
  width: number,
  height: number,
  statusLabel?: string
) {
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // If hand landmarks exist, render the skeleton joints and green bounding brackets
  if (landmarks && landmarks.length >= 21) {
    // 1. Draw connecting skeleton lines
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
      const p1 = landmarks[startIdx];
      const p2 = landmarks[endIdx];

      ctx.beginPath();
      ctx.moveTo(p1.x * width, p1.y * height);
      ctx.lineTo(p2.x * width, p2.y * height);

      // Subtle forest green to coral gradient line
      ctx.strokeStyle = 'rgba(45, 122, 84, 0.75)';
      ctx.stroke();
    }

    // 2. Draw Keypoint Nodes
    for (let i = 0; i < landmarks.length; i++) {
      const p = landmarks[i];
      const x = p.x * width;
      const y = p.y * height;
      const isTip = [4, 8, 12, 16, 20].includes(i);
      const isWrist = i === 0;

      ctx.beginPath();
      if (isTip) {
        // Fingertip - Coral accent dot
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#EB6238';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();
      } else if (isWrist) {
        // Wrist anchor
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#1B4D35';
        ctx.fill();
      } else {
        // Intermediary joints
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#52A67B';
        ctx.fill();
      }
    }

    // 3. Compute Bounding Box
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;

    for (const p of landmarks) {
      const px = p.x * width;
      const py = p.y * height;
      if (px < minX) minX = px;
      if (px > maxX) maxX = px;
      if (py < minY) minY = py;
      if (py > maxY) maxY = py;
    }

    const pad = 28;
    minX = Math.max(12, minX - pad);
    maxX = Math.min(width - 12, maxX + pad);
    minY = Math.max(12, minY - pad);
    maxY = Math.min(height - 12, maxY + pad);

    const boxW = maxX - minX;
    const boxH = maxY - minY;
    const cornerSize = Math.min(28, Math.min(boxW, boxH) * 0.25);

    // Green reticle brackets matching reference Screen 4
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#22c55e'; // Vibrant green reticle
    ctx.lineCap = 'round';

    // Top-left
    ctx.beginPath();
    ctx.moveTo(minX, minY + cornerSize);
    ctx.lineTo(minX, minY);
    ctx.lineTo(minX + cornerSize, minY);
    ctx.stroke();

    // Top-right
    ctx.beginPath();
    ctx.moveTo(maxX - cornerSize, minY);
    ctx.lineTo(maxX, minY);
    ctx.lineTo(maxX, minY + cornerSize);
    ctx.stroke();

    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(minX, maxY - cornerSize);
    ctx.lineTo(minX, maxY);
    ctx.lineTo(minX + cornerSize, maxY);
    ctx.stroke();

    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(maxX - cornerSize, maxY);
    ctx.lineTo(maxX, maxY);
    ctx.lineTo(maxX, maxY - cornerSize);
    ctx.stroke();
  }

  ctx.restore();
}
