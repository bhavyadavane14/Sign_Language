# Preprocessing Pipeline

SIGNX uses MediaPipe Hands for robust real-time hand tracking.

## Landmark Extraction
MediaPipe extracts 21 3D landmarks for a detected hand.
Each landmark consists of `x, y, z` coordinates.
Total features per hand: 21 * 3 = 63.

## Normalization
To ensure the model is invariant to hand position and distance from the camera:
1. The wrist landmark (Landmark 0) is treated as the origin `(0,0,0)`.
2. All other landmarks are translated relative to the wrist.
3. Coordinates are scaled based on the maximum distance from the wrist to ensure uniform feature scaling before inference.
