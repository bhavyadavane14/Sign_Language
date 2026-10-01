"""
SIGNX Post-processing
======================
Processes raw model output into structured prediction results.
"""

import logging
from typing import Optional, Dict, Any, List

import numpy as np

logger = logging.getLogger(__name__)


def apply_postprocessing(
    predictions: np.ndarray,
    classes: List[str],
    top_n: int = 5,
) -> Optional[Dict[str, Any]]:
    """
    Post-process raw model predictions.
    
    Args:
        predictions: Raw model output array of shape (1, num_classes)
        classes: List of class labels
        top_n: Number of top predictions to return
        
    Returns:
        Dictionary with top class, confidence, and top-N predictions
    """
    try:
        if predictions is None or len(predictions) == 0:
            return None

        probs = predictions[0]

        # Apply softmax if not already probabilities
        if np.any(probs < 0) or not np.isclose(np.sum(probs), 1.0, atol=0.1):
            exp_probs = np.exp(probs - np.max(probs))
            probs = exp_probs / np.sum(exp_probs)

        top_idx = int(np.argmax(probs))
        top_confidence = float(probs[top_idx])

        # Get top-N predictions
        top_indices = np.argsort(probs)[::-1][:top_n]
        top_predictions = []
        for idx in top_indices:
            if idx < len(classes):
                top_predictions.append({
                    "class": classes[idx],
                    "confidence": float(probs[idx]),
                    "index": int(idx),
                })

        return {
            "top_class": classes[top_idx] if top_idx < len(classes) else "unknown",
            "top_confidence": top_confidence,
            "top_index": top_idx,
            "top_n": top_predictions,
            "all_probabilities": probs.tolist(),
        }

    except Exception as e:
        logger.error(f"Post-processing error: {e}")
        return None


def label_to_category(label: str) -> str:
    """Categorize a label as alphabet, digit, or word."""
    if len(label) == 1 and label.isalpha():
        return "alphabet"
    elif label.isdigit():
        return "digit"
    else:
        return "word"
