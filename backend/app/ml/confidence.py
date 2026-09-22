"""
SIGNX Confidence Management
=============================
Handles confidence thresholds and scoring for sign predictions.
"""

import logging
from typing import Optional

logger = logging.getLogger(__name__)


class ConfidenceManager:
    """
    Manages confidence thresholds for sign language recognition.
    
    The confidence threshold determines the minimum probability
    required for a prediction to be considered valid.
    """

    DEFAULT_THRESHOLD = 0.6
    MIN_THRESHOLD = 0.1
    MAX_THRESHOLD = 0.99

    def __init__(self, threshold: Optional[float] = None):
        self._threshold = threshold or self.DEFAULT_THRESHOLD
        self._validate_threshold()

    @property
    def threshold(self) -> float:
        return self._threshold

    @threshold.setter
    def threshold(self, value: float) -> None:
        self._threshold = value
        self._validate_threshold()

    def _validate_threshold(self) -> None:
        """Ensure threshold is within valid range."""
        if self._threshold < self.MIN_THRESHOLD:
            logger.warning(f"Threshold {self._threshold} too low, setting to {self.MIN_THRESHOLD}")
            self._threshold = self.MIN_THRESHOLD
        elif self._threshold > self.MAX_THRESHOLD:
            logger.warning(f"Threshold {self._threshold} too high, setting to {self.MAX_THRESHOLD}")
            self._threshold = self.MAX_THRESHOLD

    def check(self, confidence: float) -> bool:
        """Check if a confidence score passes the threshold."""
        return confidence >= self._threshold

    def get_confidence_level(self, confidence: float) -> str:
        """Return a human-readable confidence level."""
        if confidence >= 0.9:
            return "very_high"
        elif confidence >= 0.75:
            return "high"
        elif confidence >= 0.6:
            return "medium"
        elif confidence >= 0.4:
            return "low"
        else:
            return "very_low"

    def get_info(self) -> dict:
        """Return confidence manager configuration."""
        return {
            "current_threshold": self._threshold,
            "default_threshold": self.DEFAULT_THRESHOLD,
            "min_threshold": self.MIN_THRESHOLD,
            "max_threshold": self.MAX_THRESHOLD,
        }
