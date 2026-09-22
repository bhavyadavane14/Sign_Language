/**
 * SIGNX In-Browser MediaPipe Hand Landmark & Real-Time ISL Gesture Engine
 * 
 * Provides client-side, zero-latency 21-point 3D hand tracking,
 * real-time ISL geometric gesture classification, and landmark canvas drawing.
 */

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface RecognitionResult {
  sign: string;
  confidence: number;
  category: 'alphabet' | 'digit' | 'phrase';
  fingers: {
    thumb: boolean;
    index: boolean;
    middle: boolean;
    ring: boolean;
    pinky: boolean;
  };
  landmarks: HandLandmark[];
  handedness: 'Left' | 'Right';
}

// MediaPipe Hand Connections (Pairs of landmark indices)
export const HAND_CONNECTIONS: [number, number][] = [
  // Palm
  [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],       // Index
  [5, 9], [9, 10], [10, 11], [11, 12],  // Middle
  [9, 13], [13, 14], [14, 15], [15, 16],// Ring
  [13, 17], [17, 18], [18, 19], [19, 20],// Pinky
  [0, 17]                               // Palm base to pinky
];

// Helper: 2D Euclidean distance
function dist(p1: HandLandmark, p2: HandLandmark): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

/**
 * Geometric heuristic classifier for Indian Sign Language.
 * Analyzes the 21 3D coordinates produced by MediaPipe Hands.
 */
export function classifyHandGesture(landmarks: HandLandmark[], handedness: 'Left' | 'Right' = 'Right'): {
  sign: string;
  confidence: number;
  category: 'alphabet' | 'digit' | 'phrase';
  fingers: { thumb: boolean; index: boolean; middle: boolean; ring: boolean; pinky: boolean };
} {
  if (!landmarks || landmarks.length < 21) {
    return {
      sign: '',
      confidence: 0,
      category: 'alphabet',
      fingers: { thumb: false, index: false, middle: false, ring: false, pinky: false }
    };
  }

  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const thumbIp = landmarks[3];
  const thumbMcp = landmarks[2];
  
  const indexTip = landmarks[8];
  const indexPip = landmarks[6];
  const indexMcp = landmarks[5];

  const middleTip = landmarks[12];
  const middlePip = landmarks[10];
  const middleMcp = landmarks[9];

  const ringTip = landmarks[16];
  const ringPip = landmarks[14];
  const ringMcp = landmarks[13];

  const pinkyTip = landmarks[20];
  const pinkyPip = landmarks[18];
  const pinkyMcp = landmarks[17];

  // Palm reference scale
  const palmScale = dist(wrist, middleMcp);
  if (palmScale === 0) {
    return {
      sign: '',
      confidence: 0,
      category: 'alphabet',
      fingers: { thumb: false, index: false, middle: false, ring: false, pinky: false }
    };
  }

  // Determine which fingers are extended (Up / Straight)
  // For fingers 1..4: tip.y < pip.y (assuming upright hand in camera) or distance from wrist
  const indexUp = indexTip.y < indexPip.y && dist(indexTip, wrist) > dist(indexPip, wrist);
  const middleUp = middleTip.y < middlePip.y && dist(middleTip, wrist) > dist(middlePip, wrist);
  const ringUp = ringTip.y < ringPip.y && dist(ringTip, wrist) > dist(ringPip, wrist);
  const pinkyUp = pinkyTip.y < pinkyPip.y && dist(pinkyTip, wrist) > dist(pinkyPip, wrist);

  // Thumb extended detection (distance from pinky MCP or index MCP)
  const thumbSpread = dist(thumbTip, indexMcp) / palmScale;
  const thumbUp = thumbTip.y < thumbMcp.y && dist(thumbTip, wrist) > dist(thumbIp, wrist);
  const thumbOut = thumbSpread > 0.65;

  const fingers = {
    thumb: thumbOut || thumbUp,
    index: indexUp,
    middle: middleUp,
    ring: ringUp,
    pinky: pinkyUp
  };

  const fingerCount = [indexUp, middleUp, ringUp, pinkyUp].filter(Boolean).length + (fingers.thumb ? 1 : 0);

  // Distances between key tips
  const thumbIndexDist = dist(thumbTip, indexTip) / palmScale;
  const indexMiddleDist = dist(indexTip, middleTip) / palmScale;
  const middleRingDist = dist(middleTip, ringTip) / palmScale;

  let sign = '';
  let confidence = 0.85;
  let category: 'alphabet' | 'digit' | 'phrase' = 'alphabet';

  // 1. All 5 fingers extended -> '5' or 'HELLO'
  if (fingerCount === 5) {
    sign = 'HELLO / 5';
    confidence = 0.94;
    category = 'phrase';
  }
  // 2. Closed Fist (0 fingers extended) -> 'A' or '0'
  else if (fingerCount === 0 || (!indexUp && !middleUp && !ringUp && !pinkyUp && !thumbOut)) {
    // If thumb is tucked against index side -> 'A'
    if (thumbTip.y < indexMcp.y) {
      sign = 'A';
      category = 'alphabet';
      confidence = 0.88;
    } else {
      sign = '0';
      category = 'digit';
      confidence = 0.90;
    }
  }
  // 3. Thumb only extended -> 'THUMBS UP' / 'GOOD'
  else if (fingers.thumb && !indexUp && !middleUp && !ringUp && !pinkyUp) {
    if (thumbTip.y < wrist.y) {
      sign = 'GOOD / YES';
      category = 'phrase';
      confidence = 0.92;
    } else {
      sign = 'BAD / NO';
      category = 'phrase';
      confidence = 0.88;
    }
  }
  // 4. Index only extended -> '1' or 'D'
  else if (indexUp && !middleUp && !ringUp && !pinkyUp && !thumbOut) {
    sign = '1 / D';
    confidence = 0.92;
    category = 'digit';
  }
  // 5. Index and Thumb forming 'L' -> 'L'
  else if (indexUp && thumbOut && !middleUp && !ringUp && !pinkyUp) {
    sign = 'L';
    confidence = 0.95;
    category = 'alphabet';
  }
  // 6. Pinky only extended -> 'I'
  else if (pinkyUp && !indexUp && !middleUp && !ringUp && !fingers.thumb) {
    sign = 'I';
    confidence = 0.94;
    category = 'alphabet';
  }
  // 7. Thumb and Pinky extended (Shaka) -> 'Y'
  else if (pinkyUp && thumbOut && !indexUp && !middleUp && !ringUp) {
    sign = 'Y';
    confidence = 0.93;
    category = 'alphabet';
  }
  // 8. Thumb, Index, Pinky extended -> 'I LOVE YOU'
  else if (indexUp && pinkyUp && thumbOut && !middleUp && !ringUp) {
    sign = 'I LOVE YOU';
    confidence = 0.96;
    category = 'phrase';
  }
  // 9. Index and Middle extended -> '2' or 'V' or 'U'
  else if (indexUp && middleUp && !ringUp && !pinkyUp && !thumbOut) {
    if (indexMiddleDist > 0.35) {
      sign = 'V / 2';
      confidence = 0.93;
      category = 'digit';
    } else {
      sign = 'U';
      confidence = 0.89;
      category = 'alphabet';
    }
  }
  // 10. Index, Middle, Ring extended -> '3' or 'W'
  else if (indexUp && middleUp && ringUp && !pinkyUp && !thumbOut) {
    sign = 'W / 3';
    confidence = 0.91;
    category = 'alphabet';
  }
  // 11. 4 fingers upright (thumb folded) -> '4' or 'B'
  else if (indexUp && middleUp && ringUp && pinkyUp && !thumbOut) {
    sign = '4 / B';
    confidence = 0.92;
    category = 'digit';
  }
  // 12. Thumb and Index touching tips (Circle), other 3 fingers extended -> 'F' or 'OK'
  else if (thumbIndexDist < 0.28 && middleUp && ringUp && pinkyUp) {
    sign = 'OK / F';
    confidence = 0.95;
    category = 'phrase';
  }
  // 13. All fingers curved together -> 'C' or 'O'
  else if (thumbIndexDist < 0.35 && !indexUp && !middleUp && !ringUp && !pinkyUp) {
    sign = 'O';
    confidence = 0.86;
    category = 'alphabet';
  }
  // 14. Curved hand forming 'C' shape
  else if (thumbSpread > 0.4 && thumbIndexDist > 0.35 && thumbIndexDist < 0.75 && !middleUp && !ringUp) {
    sign = 'C';
    confidence = 0.85;
    category = 'alphabet';
  }
  else {
    // Fallback: estimate from finger count
    sign = `Gesture (${fingerCount} fingers)`;
    confidence = 0.70;
    category = 'phrase';
  }

  return {
    sign,
    confidence,
    category,
    fingers
  };
}

/**
 * Draws the cyber-futuristic hand skeleton overlay onto the 2D canvas context.
 */
export function drawFuturisticSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: HandLandmark[],
  width: number,
  height: number,
  signLabel?: string
) {
  if (!landmarks || landmarks.length < 21) return;

  ctx.save();

  // 1. Draw glowing connectors
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (const [i, j] of HAND_CONNECTIONS) {
    const p1 = landmarks[i];
    const p2 = landmarks[j];

    const x1 = p1.x * width;
    const y1 = p1.y * height;
    const x2 = p2.x * width;
    const y2 = p2.y * height;

    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, 'rgba(0, 242, 254, 0.85)'); // Neon cyan
    grad.addColorStop(1, 'rgba(147, 51, 234, 0.85)'); // Neon violet

    ctx.strokeStyle = grad;
    ctx.shadowColor = 'rgba(0, 242, 254, 0.6)';
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // 2. Draw Joints / Landmarks
  for (let i = 0; i < landmarks.length; i++) {
    const p = landmarks[i];
    const x = p.x * width;
    const y = p.y * height;

    const isFingertip = [4, 8, 12, 16, 20].includes(i);
    const isWrist = i === 0;

    ctx.beginPath();
    if (isFingertip) {
      // Fingertip - Glowing emerald or magenta outer ring
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 14;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    } else if (isWrist) {
      // Wrist Anchor
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1';
      ctx.shadowColor = '#6366f1';
      ctx.shadowBlur = 12;
      ctx.fill();
    } else {
      // Standard joints
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 6;
      ctx.fill();
    }
  }

  // 3. Draw Bounding Box & Target HUD
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

  const padding = 24;
  minX = Math.max(0, minX - padding);
  maxX = Math.min(width, maxX + padding);
  minY = Math.max(0, minY - padding);
  maxY = Math.min(height, maxY + padding);

  const boxW = maxX - minX;
  const boxH = maxY - minY;
  const cornerSize = Math.min(24, boxW * 0.2);

  // Corner brackets for bounding box
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#22d3ee';
  ctx.shadowColor = '#22d3ee';
  ctx.shadowBlur = 10;

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

  // HUD Tag on top of bounding box
  if (signLabel) {
    const tagText = `ISL TARGET: ${signLabel}`;
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    const textWidth = ctx.measureText(tagText).width;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(minX, minY - 26, textWidth + 16, 22);

    ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
    ctx.strokeRect(minX, minY - 26, textWidth + 16, 22);

    ctx.fillStyle = '#38bdf8';
    ctx.shadowBlur = 0;
    ctx.fillText(tagText, minX + 8, minY - 11);
  }

  ctx.restore();
}
