"""
SIGNX Preprocessing
====================
Extracts hand landmarks from camera frames using MediaPipe.

Pipeline:
1. Decode base64 image → OpenCV image
2. Convert BGR → RGB
3. Run MediaPipe Hands detection
4. Extract 21 hand landmarks × 3 coordinates = 63 features
5. Return as numpy array for model input
"""

import logging
from typing import Optional

import cv2
import numpy as np
import base64

logger = logging.getLogger(__name__)

# MediaPipe initialization (lazy to avoid import issues)
_mp_hands = None
_hands_detector = None


def _get_hands_detector():
    """Lazy-initialize MediaPipe Hands to avoid import-time failures."""
    global _mp_hands, _hands_detector
    if _hands_detector is None:
        try:
            import mediapipe as mp
            _mp_hands = mp.solutions.hands
            _hands_detector = _mp_hands.Hands(
                static_image_mode=True,
                max_num_hands=1,
                min_detection_confidence=0.5,
            )
            logger.info("MediaPipe Hands initialized successfully")
        except ImportError:
            logger.error("MediaPipe is not installed. Install with: pip install mediapipe")
            raise
    return _hands_detector


def decode_base64_image(image_b64: str) -> Optional[np.ndarray]:
    """
    Decode a base64-encoded image string to an OpenCV image.
    
    Handles both raw base64 and data-URI format (data:image/...;base64,...).
    """
    try:
        # Strip data URI prefix if present
        if "," in image_b64:
            image_b64 = image_b64.split(",", 1)[1]

        img_data = base64.b64decode(image_b64)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            logger.warning("Failed to decode image from base64 data")
            return None

        return img

    except Exception as e:
        logger.error(f"Base64 decode error: {e}")
        return None


def extract_landmarks(image_b64: str) -> Optional[np.ndarray]:
    """
    Extract hand landmarks from a base64-encoded image.
    
    Args:
        image_b64: Base64-encoded camera frame
        
    Returns:
        NumPy array of shape (1, 63) with landmark coordinates,
        or None if no hand is detected
    """
    try:
        # Decode image
        img = decode_base64_image(image_b64)
        if img is None:
            return None

        # Convert BGR to RGB for MediaPipe
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Run hand detection
        detector = _get_hands_detector()
        results = detector.process(img_rgb)

        if not results.multi_hand_landmarks:
            return None

        # Extract landmarks from the first detected hand
        hand_landmarks = results.multi_hand_landmarks[0]
        landmarks = []

        for landmark in hand_landmarks.landmark:
            landmarks.extend([landmark.x, landmark.y, landmark.z])

        # Should have 63 values (21 landmarks × 3 coordinates)
        if len(landmarks) != 63:
            logger.warning(f"Unexpected landmark count: {len(landmarks)} (expected 63)")
            return None

        return np.array([landmarks], dtype=np.float32)

    except ImportError:
        logger.error("MediaPipe not available for preprocessing")
        return None
    except Exception as e:
        logger.error(f"Landmark extraction error: {e}")
        return None


def get_preprocessing_info() -> dict:
    """Return information about the preprocessing pipeline."""
    return {
        "method": "MediaPipe Hands",
        "features": 63,
        "landmarks": 21,
        "coordinates_per_landmark": 3,
        "coordinate_types": ["x (normalized)", "y (normalized)", "z (depth)"],
        "max_hands": 1,
        "min_detection_confidence": 0.5,
        "input_format": "Base64-encoded image (JPEG/PNG)",
        "output_format": "NumPy array of shape (1, 63)",
    }
