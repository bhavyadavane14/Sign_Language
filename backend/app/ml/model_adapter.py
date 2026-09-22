"""
SIGNX Model Adapter
====================
Clean adapter interface for the ISL recognition model.
Supports TensorFlow/Keras .h5 models trained on MediaPipe hand landmarks.

The current model recognizes 36 classes:
- ISL Alphabet: A-Z (26 classes)
- ISL Digits: 0-9 (10 classes)

Model Input: 63-feature vector (21 hand landmarks × 3 coordinates from MediaPipe)
Model Output: Probability distribution over 36 classes
"""

import os
import json
import logging
import string
from typing import Optional, Dict, Any, List

import numpy as np

logger = logging.getLogger(__name__)

# Default class mapping: A-Z then 0-9
DEFAULT_CLASSES = list(string.ascii_uppercase) + [str(i) for i in range(10)]

# Paths
LABELS_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "model", "labels", "classes.json")


class ModelAdapter:
    """
    Adapter interface for the SIGNX ISL recognition model.
    
    Handles model loading, prediction, and graceful degradation
    when the model file is not available.
    """

    def __init__(self, model_path: Optional[str] = None):
        self.model_path = model_path
        self.model = None
        self.classes: List[str] = []
        self.is_loaded: bool = False
        self._framework: str = "tensorflow"
        self._model_format: str = ".h5"
        self._input_shape: tuple = (1, 63)  # 21 landmarks × 3 coords
        self._load_classes()

    def _load_classes(self) -> None:
        """Load class labels from classes.json or use defaults."""
        try:
            labels_path = os.path.normpath(LABELS_PATH)
            if os.path.exists(labels_path):
                with open(labels_path, "r") as f:
                    class_map = json.load(f)
                # Sort by numeric key to ensure correct ordering
                self.classes = [class_map[str(i)] for i in range(len(class_map))]
                logger.info(f"Loaded {len(self.classes)} classes from {labels_path}")
            else:
                self.classes = DEFAULT_CLASSES.copy()
                logger.info(f"Using default {len(self.classes)} classes (A-Z, 0-9)")
        except Exception as e:
            self.classes = DEFAULT_CLASSES.copy()
            logger.warning(f"Failed to load classes.json, using defaults: {e}")

    def load_model(self) -> bool:
        """
        Load the trained model from disk.
        Returns True if successful, False otherwise.
        The application continues to run even if the model is not found.
        """
        if not self.model_path:
            logger.warning("No model path configured. Set MODEL_PATH in .env")
            return False

        if not os.path.exists(self.model_path):
            logger.warning(
                f"Model file not found at '{self.model_path}'. "
                "Download the model from the SIGNX Google Drive and place it at the configured path. "
                "The application will run without AI recognition capabilities."
            )
            return False

        try:
            import tensorflow as tf

            # Suppress TF warnings during load
            tf.get_logger().setLevel("ERROR")
            self.model = tf.keras.models.load_model(self.model_path)
            self.is_loaded = True

            # Verify model input shape
            expected_features = self._input_shape[1]
            model_input_shape = self.model.input_shape
            if model_input_shape and len(model_input_shape) > 1:
                actual_features = model_input_shape[-1]
                if actual_features != expected_features:
                    logger.warning(
                        f"Model expects {actual_features} input features, "
                        f"but preprocessing provides {expected_features}. "
                        "Results may be incorrect."
                    )

            logger.info(f"Model loaded successfully from '{self.model_path}'")
            return True

        except ImportError:
            logger.error("TensorFlow is not installed. Install with: pip install tensorflow")
            return False
        except Exception as e:
            logger.error(f"Failed to load model from '{self.model_path}': {e}")
            return False

    def predict(self, features: np.ndarray) -> Optional[np.ndarray]:
        """
        Run inference on preprocessed features.
        
        Args:
            features: NumPy array of shape (1, 63) containing hand landmark coordinates
            
        Returns:
            Probability distribution over classes, or None if model is unavailable
        """
        if not self.is_loaded or self.model is None:
            return None

        try:
            # Ensure correct shape
            if features.ndim == 1:
                features = features.reshape(1, -1)

            predictions = self.model.predict(features, verbose=0)
            return predictions
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            return None

    def get_classes(self) -> List[str]:
        """Return the list of supported class labels."""
        return self.classes

    def get_class_label(self, index: int) -> Optional[str]:
        """Get the class label for a given index."""
        if 0 <= index < len(self.classes):
            return self.classes[index]
        return None

    def get_model_info(self) -> Dict[str, Any]:
        """Return detailed model information for the Model Information page."""
        return {
            "model_type": "Convolutional Neural Network (CNN)",
            "framework": "TensorFlow / Keras",
            "model_format": self._model_format,
            "input_type": "MediaPipe Hand Landmarks (21 points × 3 coordinates = 63 features)",
            "preprocessing": "MediaPipe Hands → Landmark Extraction → Coordinate Normalization",
            "recognition_method": "Single-hand static gesture recognition",
            "num_classes": len(self.classes),
            "supported_classes": self.classes,
            "supported_vocabulary": {
                "alphabet": [c for c in self.classes if c.isalpha()],
                "digits": [c for c in self.classes if c.isdigit()],
            },
            "confidence_threshold": 0.6,
            "model_version": "1.0.0",
            "model_status": "loaded" if self.is_loaded else "not_loaded",
            "model_path": self.model_path or "Not configured",
            "accuracy": "Not independently verified",
            "last_updated": "See model/README.md for training details",
        }


# Singleton instance — initialized at import time but model loading deferred
_adapter_instance: Optional[ModelAdapter] = None


def get_model_adapter() -> ModelAdapter:
    """Get or create the singleton ModelAdapter instance."""
    global _adapter_instance
    if _adapter_instance is None:
        from app.core.config import settings
        _adapter_instance = ModelAdapter(model_path=settings.MODEL_PATH)
        _adapter_instance.load_model()
    return _adapter_instance
