"""
SIGNX Inference Engine
=======================
Orchestrates the complete inference pipeline:
Frame → Preprocessing → Model Prediction → Post-processing → Result

This module ties together preprocessing, model adapter, confidence filtering,
and sentence building into a single coherent pipeline.
"""

import logging
from typing import Optional, Dict, Any

import numpy as np

from app.ml.model_adapter import get_model_adapter
from app.ml.preprocessing import extract_landmarks
from app.ml.postprocessing import apply_postprocessing
from app.ml.confidence import ConfidenceManager
from app.ml.sentence_builder import SentenceBuilder

logger = logging.getLogger(__name__)


class InferenceEngine:
    """
    Main inference engine for SIGNX sign language recognition.
    
    Pipeline:
    1. Receive base64-encoded camera frame
    2. Extract MediaPipe hand landmarks (preprocessing)
    3. Run CNN model prediction (model adapter)
    4. Apply confidence filtering (confidence manager)
    5. Build sentence from predictions (sentence builder)
    """

    def __init__(self, confidence_threshold: float = 0.6, stability_threshold: int = 5):
        self.model_adapter = get_model_adapter()
        self.confidence_manager = ConfidenceManager(threshold=confidence_threshold)
        self.sentence_builder = SentenceBuilder(
            stability_threshold=stability_threshold,
            confidence_threshold=confidence_threshold,
        )
        self._frame_count: int = 0

    def process_frame(self, frame_b64: str) -> Dict[str, Any]:
        """
        Process a single camera frame through the full pipeline.
        
        Args:
            frame_b64: Base64-encoded image from the camera
            
        Returns:
            Dictionary with prediction results
        """
        self._frame_count += 1
        result = {
            "success": False,
            "sign": None,
            "confidence": 0.0,
            "sentence": self.sentence_builder.get_sentence(),
            "signs": self.sentence_builder.get_signs(),
            "status": "",
            "model_loaded": self.model_adapter.is_loaded,
            "hand_detected": False,
            "frame_number": self._frame_count,
        }

        # Check if model is available
        if not self.model_adapter.is_loaded:
            result["status"] = "Model not loaded. Please check MODEL_STATUS.md for setup instructions."
            return result

        # Step 1: Extract hand landmarks
        landmarks = extract_landmarks(frame_b64)
        if landmarks is None:
            result["status"] = "No hand detected in frame"
            # Still process through sentence builder for state updates
            sb_result = self.sentence_builder.process_prediction(None, 0.0)
            result["sentence"] = sb_result["sentence"]
            result["signs"] = sb_result["signs"]
            return result

        result["hand_detected"] = True

        # Step 2: Model prediction
        predictions = self.model_adapter.predict(landmarks)
        if predictions is None:
            result["status"] = "Model prediction failed"
            return result

        # Step 3: Post-processing — get top prediction
        processed = apply_postprocessing(predictions, self.model_adapter.get_classes())
        if processed is None:
            result["status"] = "Post-processing failed"
            return result

        top_sign = processed["top_class"]
        top_confidence = processed["top_confidence"]

        # Step 4: Confidence filtering
        passes_threshold = self.confidence_manager.check(top_confidence)

        if not passes_threshold:
            result["confidence"] = top_confidence
            result["status"] = "Sign not confidently recognized"
            sb_result = self.sentence_builder.process_prediction(None, top_confidence)
            result["sentence"] = sb_result["sentence"]
            result["signs"] = sb_result["signs"]
            return result

        # Step 5: Sentence building
        sb_result = self.sentence_builder.process_prediction(top_sign, top_confidence)

        result["success"] = True
        result["sign"] = top_sign
        result["confidence"] = top_confidence
        result["sentence"] = sb_result["sentence"]
        result["signs"] = sb_result["signs"]
        result["status"] = sb_result["status"]
        result["accepted"] = sb_result["accepted"]

        # Include top-N predictions for advanced display
        if processed.get("top_n"):
            result["top_predictions"] = processed["top_n"][:5]

        return result

    def reset_session(self) -> Dict[str, Any]:
        """Reset the sentence builder for a new translation session."""
        self.sentence_builder.reset()
        self._frame_count = 0
        return {
            "success": True,
            "sentence": "",
            "signs": [],
            "status": "Session reset",
        }

    def get_status(self) -> Dict[str, Any]:
        """Get the current engine status."""
        return {
            "model_loaded": self.model_adapter.is_loaded,
            "model_info": self.model_adapter.get_model_info(),
            "sentence_state": self.sentence_builder.get_state(),
            "frames_processed": self._frame_count,
            "confidence_threshold": self.confidence_manager.threshold,
        }


# Singleton instance
_engine: Optional[InferenceEngine] = None


def get_inference_engine() -> InferenceEngine:
    """Get or create the singleton InferenceEngine."""
    global _engine
    if _engine is None:
        _engine = InferenceEngine()
    return _engine
