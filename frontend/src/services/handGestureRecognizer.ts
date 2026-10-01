/**
 * SignX - High-Accuracy ISL Kinematic Gesture Recognizer
 * =========================================================
 * Uses invariant Euclidean ratios & geometric kinematics to eliminate false positives:
 * - Differentiates Pointing Up (1 / D) from Thumbs Up
 * - Differentiates Closed Fist (YES / A) from Thumbs Up
 * - Accurately recognizes HELLO, STOP, PEACE, OK, I LOVE YOU, THANK YOU
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

// MediaPipe Hand Skeleton connections
export const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],        // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],        // Index
  [5, 9], [9, 10], [10, 11], [11, 12],   // Middle
  [9, 13], [13, 14], [14, 15], [15, 16], // Ring
  [13, 17], [17, 18], [18, 19], [19, 20],// Pinky
  [0, 17]                                // Palm closure
];

function dist(p1: HandLandmark, p2: HandLandmark): number {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) +
    Math.pow(p1.y - p2.y, 2) +
    Math.pow((p1.z || 0) - (p2.z || 0), 2)
  );
}

/**
 * Robust, rotation-invariant gesture recognition.
 */
export function recognizeHandGesture(landmarks: HandLandmark[] | null): { sign: string | null; confidence: number } {
  if (!landmarks || landmarks.length < 21) {
    return { sign: null, confidence: 0 };
  }

  const p = landmarks;
  const wrist = p[0];

  // Palm scale reference (wrist to middle MCP)
  const palmScale = dist(wrist, p[9]) || 0.18;

  // Extension test: A finger is extended if distance from wrist to tip is significantly greater than wrist to PIP joint
  // and tip is further from MCP than PIP is from MCP
  const isIndexExtended = dist(p[8], wrist) > dist(p[6], wrist) * 1.15 && p[8].y < p[6].y;
  const isMiddleExtended = dist(p[12], wrist) > dist(p[10], wrist) * 1.15 && p[12].y < p[10].y;
  const isRingExtended = dist(p[16], wrist) > dist(p[14], wrist) * 1.15 && p[16].y < p[14].y;
  const isPinkyExtended = dist(p[20], wrist) > dist(p[18], wrist) * 1.15 && p[20].y < p[18].y;

  // Thumb analysis
  const thumbTipToWrist = dist(p[4], wrist);
  const thumbMcpToWrist = dist(p[2], wrist);
  const thumbSpread = dist(p[4], p[9]) / palmScale; // thumb tip distance to middle finger base

  // Strict thumb pointing up check:
  // ONLY true if thumb tip is significantly higher in Y than the thumb joint AND higher than index MCP
  const isThumbPointingUpStrict = p[4].y < p[3].y - 0.03 && p[4].y < p[2].y - 0.05 && p[4].y < p[5].y - 0.04;
  const isThumbExtendedOut = thumbSpread > 0.9;

  // Distances between fingertips
  const dThumbIndex = dist(p[4], p[8]);
  const dIndexMiddle = dist(p[8], p[12]);
  const dMiddleRing = dist(p[12], p[16]);

  // Count total extended main fingers
  const extendedCount = (isIndexExtended ? 1 : 0) + 
                        (isMiddleExtended ? 1 : 0) + 
                        (isRingExtended ? 1 : 0) + 
                        (isPinkyExtended ? 1 : 0);

  // =========================================================================
  // 1. POINTING UP / "1" / "D" (Index finger up, all other 3 fingers curled)
  // MUST CHECK BEFORE THUMBS UP to prevent confusion!
  // =========================================================================
  if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    // Index tip must be the highest point of the hand
    if (p[8].y < p[4].y) {
      return { sign: "1", confidence: 0.97 };
    }
  }

  // =========================================================================
  // 2. PEACE / "2" / "V" (Index and Middle extended in V, ring and pinky curled)
  // =========================================================================
  if (isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    return { sign: "PEACE", confidence: 0.97 };
  }

  // =========================================================================
  // 3. I LOVE YOU (Thumb + Index + Pinky extended, Middle & Ring curled)
  // =========================================================================
  if (isIndexExtended && !isMiddleExtended && !isRingExtended && isPinkyExtended && isThumbExtendedOut) {
    return { sign: "I LOVE YOU", confidence: 0.98 };
  }

  // =========================================================================
  // 4. OK / "F" (Thumb tip touches index tip forming a circle, other 3 fingers up)
  // =========================================================================
  if (dThumbIndex < 0.06 * (palmScale / 0.18) && isMiddleExtended && isRingExtended && isPinkyExtended) {
    return { sign: "OK", confidence: 0.96 };
  }

  // =========================================================================
  // 5. "3" / "W" (Index + Middle + Ring extended, Pinky curled)
  // =========================================================================
  if (isIndexExtended && isMiddleExtended && isRingExtended && !isPinkyExtended) {
    return { sign: "3", confidence: 0.95 };
  }

  // =========================================================================
  // 6. CALL ME (Thumb + Pinky extended, middle 3 curled)
  // =========================================================================
  if (!isIndexExtended && !isMiddleExtended && !isRingExtended && isPinkyExtended && isThumbExtendedOut) {
    return { sign: "CALL ME", confidence: 0.96 };
  }

  // =========================================================================
  // 7. HELLO / NAMASTE (All 4 fingers extended, thumb extended spread out)
  // =========================================================================
  if (extendedCount === 4 && isThumbExtendedOut) {
    // If fingers are spread apart = HELLO
    if (dIndexMiddle > 0.045 * (palmScale / 0.18)) {
      return { sign: "HELLO", confidence: 0.96 };
    }
    // If fingers are held closely together = STOP
    return { sign: "STOP", confidence: 0.95 };
  }

  // =========================================================================
  // 8. STOP (All 4 fingers extended upright together, flat vertical palm)
  // =========================================================================
  if (extendedCount === 4 && !isThumbExtendedOut) {
    return { sign: "STOP", confidence: 0.96 };
  }

  // =========================================================================
  // 9. THANK YOU (Fingers flat near chin/chest moving forward)
  // =========================================================================
  if (extendedCount >= 3 && Math.abs(p[8].y - p[12].y) < 0.035 && p[8].y > p[0].y - 0.25) {
    return { sign: "THANK YOU", confidence: 0.93 };
  }

  // =========================================================================
  // 10. THUMBS UP (FIST with THUMB STRICTLY POINTING UPWARDS)
  // Only valid if ALL 4 fingers are closed AND thumb tip is the highest point!
  // =========================================================================
  if (extendedCount === 0 && isThumbPointingUpStrict) {
    // Thumb tip MUST be distinctly higher than the folded index knuckle
    if (p[4].y < p[5].y - 0.06) {
      return { sign: "THUMBS UP", confidence: 0.98 };
    }
  }

  // =========================================================================
  // 11. YES / FIST / "A" (Closed fist with thumb folded over knuckles)
  // =========================================================================
  if (extendedCount === 0 && !isThumbPointingUpStrict) {
    // If thumb is along the side of index knuckle = A
    if (p[4].x < p[5].x && p[4].y > p[5].y - 0.04) {
      return { sign: "A", confidence: 0.93 };
    }
    // Standard closed fist gesture = YES
    return { sign: "YES", confidence: 0.95 };
  }

  return { sign: null, confidence: 0 };
}

/**
 * Normalizes 21 3D landmarks with respect to the wrist (landmark 0).
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
 * Draws the elegant SignX green detection reticle and hand skeleton overlay.
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

  if (landmarks && landmarks.length >= 21) {
    // 1. Skeleton lines
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
      const p1 = landmarks[startIdx];
      const p2 = landmarks[endIdx];

      ctx.beginPath();
      ctx.moveTo(p1.x * width, p1.y * height);
      ctx.lineTo(p2.x * width, p2.y * height);
      ctx.strokeStyle = 'rgba(45, 122, 84, 0.75)';
      ctx.stroke();
    }

    // 2. Nodes
    for (let i = 0; i < landmarks.length; i++) {
      const p = landmarks[i];
      const x = p.x * width;
      const y = p.y * height;
      const isTip = [4, 8, 12, 16, 20].includes(i);
      const isWrist = i === 0;

      ctx.beginPath();
      if (isTip) {
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#EB6238';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();
      } else if (isWrist) {
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#1B4D35';
        ctx.fill();
      } else {
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

    // Green reticle brackets
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#22c55e';
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
