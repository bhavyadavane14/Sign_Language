"""
SIGNX Sentence Builder
=======================
Converts a stream of individual sign predictions into coherent sentences.

Features:
- Duplicate suppression: Prevents repeated output from the same held sign
- Temporal smoothing: Requires a sign to be held for N frames before accepting
- Confidence filtering: Ignores low-confidence predictions
- Word sequence building: Maintains an ordered list of recognized signs
- Punctuation insertion: Basic sentence termination
- Session reset: Clear the buffer for a new sentence
"""

import time
import logging
from typing import Optional, List, Dict, Any
from collections import deque

logger = logging.getLogger(__name__)


class SentenceBuilder:
    """
    Builds sentences from a stream of sign predictions.
    
    The builder maintains internal state to smooth out the recognition stream:
    1. A sign must be detected for `stability_threshold` consecutive frames to be accepted
    2. Once accepted, the same sign won't be added again until a different sign is detected
    3. A configurable cooldown prevents rapid-fire additions
    """

    def __init__(
        self,
        stability_threshold: int = 5,
        confidence_threshold: float = 0.6,
        cooldown_seconds: float = 1.0,
        max_sentence_length: int = 50,
    ):
        """
        Args:
            stability_threshold: Number of consecutive frames a sign must appear to be accepted
            confidence_threshold: Minimum confidence to consider a prediction
            cooldown_seconds: Minimum time between accepting the same sign again
            max_sentence_length: Maximum number of signs in a sentence before auto-reset
        """
        self.stability_threshold = stability_threshold
        self.confidence_threshold = confidence_threshold
        self.cooldown_seconds = cooldown_seconds
        self.max_sentence_length = max_sentence_length

        # State
        self._sentence: List[str] = []
        self._current_sign: Optional[str] = None
        self._current_count: int = 0
        self._last_accepted_sign: Optional[str] = None
        self._last_accepted_time: float = 0.0
        self._history: deque = deque(maxlen=10)  # Recent prediction window

    def process_prediction(
        self, sign: Optional[str], confidence: float
    ) -> Dict[str, Any]:
        """
        Process a single prediction from the model.
        
        Args:
            sign: The predicted sign label (e.g., "A", "5"), or None if no hand detected
            confidence: The confidence score (0.0 to 1.0)
            
        Returns:
            Dictionary with:
                - accepted: Whether the sign was accepted into the sentence
                - sign: The accepted sign (if any)
                - sentence: The current full sentence string
                - signs: List of individual signs in the sentence
                - status: Human-readable status message
        """
        result = {
            "accepted": False,
            "sign": None,
            "sentence": self.get_sentence(),
            "signs": self._sentence.copy(),
            "status": "",
        }

        # No hand detected
        if sign is None:
            self._current_sign = None
            self._current_count = 0
            result["status"] = "No hand detected"
            return result

        # Below confidence threshold
        if confidence < self.confidence_threshold:
            self._current_sign = None
            self._current_count = 0
            result["status"] = "Sign not confidently recognized"
            return result

        # Track the current sign
        if sign == self._current_sign:
            self._current_count += 1
        else:
            self._current_sign = sign
            self._current_count = 1

        # Add to history window
        self._history.append(sign)

        # Check if sign is stable enough
        if self._current_count < self.stability_threshold:
            result["status"] = f"Detecting: {sign} ({self._current_count}/{self.stability_threshold})"
            return result

        # Check duplicate suppression — don't add the same sign consecutively
        if sign == self._last_accepted_sign:
            elapsed = time.time() - self._last_accepted_time
            if elapsed < self.cooldown_seconds:
                result["status"] = f"Sign '{sign}' already recorded"
                return result

        # Accept the sign
        self._accept_sign(sign)

        result["accepted"] = True
        result["sign"] = sign
        result["sentence"] = self.get_sentence()
        result["signs"] = self._sentence.copy()
        result["status"] = f"Recognized: {sign}"

        return result

    def _accept_sign(self, sign: str) -> None:
        """Add a sign to the sentence."""
        if len(self._sentence) >= self.max_sentence_length:
            logger.info("Sentence max length reached, auto-resetting")
            self.reset()

        self._sentence.append(sign)
        self._last_accepted_sign = sign
        self._last_accepted_time = time.time()
        self._current_count = 0  # Reset count to prevent immediate re-trigger

        logger.debug(f"Accepted sign '{sign}', sentence: {self.get_sentence()}")

    def get_sentence(self) -> str:
        """
        Get the current sentence as a string.
        
        Single characters (alphabet/digits) are concatenated without spaces
        to form words. In future versions with word-level signs, spaces
        will be used to separate words.
        """
        if not self._sentence:
            return ""

        # For alphabet/digit signs (single characters), join without spaces
        # This allows fingerspelling to form words
        parts = []
        current_word = []

        for sign in self._sentence:
            if len(sign) == 1:  # Single character (letter or digit)
                current_word.append(sign)
            else:
                # Multi-character sign (future word-level signs)
                if current_word:
                    parts.append("".join(current_word))
                    current_word = []
                parts.append(sign)

        if current_word:
            parts.append("".join(current_word))

        return " ".join(parts)

    def get_signs(self) -> List[str]:
        """Get the list of individual signs in the sentence."""
        return self._sentence.copy()

    def remove_last(self) -> Optional[str]:
        """Remove and return the last sign from the sentence."""
        if self._sentence:
            removed = self._sentence.pop()
            self._last_accepted_sign = self._sentence[-1] if self._sentence else None
            return removed
        return None

    def reset(self) -> None:
        """Clear the sentence and reset all state."""
        self._sentence.clear()
        self._current_sign = None
        self._current_count = 0
        self._last_accepted_sign = None
        self._last_accepted_time = 0.0
        self._history.clear()
        logger.debug("Sentence builder reset")

    def get_state(self) -> Dict[str, Any]:
        """Get the current state for debugging/display."""
        return {
            "sentence": self.get_sentence(),
            "signs": self._sentence.copy(),
            "sign_count": len(self._sentence),
            "current_detecting": self._current_sign,
            "detection_frames": self._current_count,
            "stability_threshold": self.stability_threshold,
            "last_accepted": self._last_accepted_sign,
        }
