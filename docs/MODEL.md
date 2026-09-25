# SignX Machine Learning Model Architecture & Integration

## 1. Recognition Engine Specification

* **Input Data**: 63-dimensional feature array representing 21 3D hand keypoints \((x, y, z)\) extracted via Google MediaPipe Hands, normalized relative to the wrist origin:
  \[
  x'_i = x_i - x_0, \quad y'_i = y_i - y_0, \quad z'_i = z_i - z_0 \quad (i = 0 \dots 20)
  \]
* **Target Classes**: 36 verified Indian Sign Language classes (26 Alphabet letters A-Z + 10 Digits 0-9), defined in `model/labels/classes.json`.
* **Neural Architecture**:
  * Input Layer: `(1, 63)` normalized spatial coordinates
  * Feature Extraction: 1D Convolutional blocks (`Conv1D`, `BatchNormalization`, `ReLU`, `Dropout`)
  * Classification Head: Fully connected Dense layers with Softmax activation over 36 classes
* **Inference Pipeline**:
  * Handled via `backend/app/ml/model_adapter.py` and `backend/app/ml/inference.py`.

---

## 2. Integrity & Anti-Hallucination Guarantees

In accordance with SignX strict engineering standards:
* **No Rule-Based Heuristic Classifiers**: Gestures are never classified using arbitrary hardcoded angles or single-handed ASL heuristics.
* **No Artificial Confidence**: Confidence scores are strictly the actual Softmax output probabilities output by the trained model. No inflated or fake percentages (such as 98%) are ever synthesized.
* **Graceful Degradation**: When `model/weights/signx_model.h5` is not present, the inference engine explicitly reports:
  * `model_loaded: false`
  * `status: "Model weights awaiting installation (signx_model.h5). Hand tracking active without fake predictions."`
  * `confidence: 0.0`
  * `sign: null`

---

## 3. Training & Dataset Ingestion

To train a compatible model using the **INCLUDE** or **ISLRTC** dataset:
1. Extract MediaPipe landmark coordinates across all video frames in the verified ISL dataset.
2. Normalize coordinates with respect to landmark 0 (wrist) and scale by the maximum palm dimension.
3. Train a multi-layer classifier in TensorFlow/Keras or PyTorch:
   ```python
   import tensorflow as tf
   from tensorflow.keras import layers, models

   model = models.Sequential([
       layers.Input(shape=(63,)),
       layers.Dense(128, activation='relu'),
       layers.Dropout(0.2),
       layers.Dense(64, activation='relu'),
       layers.Dropout(0.2),
       layers.Dense(36, activation='softmax')
   ])
   model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
   ```
4. Save the trained weights to `model/weights/signx_model.h5`.
