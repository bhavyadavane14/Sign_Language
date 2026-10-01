# SIGNX: Indian Sign Language Translator

## Overview

SIGNX is an Indian Sign Language (ISL) translation platform with a Bi-LSTM landmark classifier and a web application. This repository includes the finalized CPU live-inference pipeline for the trained 61-class ISL model.

The live pipeline is designed for parity with the original training preprocessing. It does not retrain, alter, or replace the trained model.

## Bi-LSTM Model

- Input sequence: `(32, 225)`
- 32 uniformly sampled frames per video
- Features per frame: left hand `21 x 3` (63), right hand `21 x 3` (63), pose `33 x 3` (99)
- Total features per frame: 225
- Model: 2-layer bidirectional LSTM
- Hidden size: 128
- Dropout: 0.3
- Output classes: 61
- Reported held-out landmark test accuracy: **98.35%**

The test accuracy is measured on the saved landmark test set. It does not guarantee the same accuracy for webcam footage.

## Dataset and Training Approach

The source dataset is organized as class-labelled ISL videos. The original training pipeline independently processes each selected video frame with MediaPipe Tasks API:

1. Sample 32 frame indices uniformly with `np.linspace`.
2. Convert each BGR frame to RGB and create an `mp.Image` using `SRGB`.
3. Run HandLandmarker and PoseLandmarker in `IMAGE` mode.
4. Concatenate `left_hand.flatten()`, `right_hand.flatten()`, and `pose.flatten()`.
5. Zero-fill missing landmarks to produce exactly 225 features.
6. Normalize with the saved `landmark_mean.npy` and `landmark_std.npy`.
7. Feed the normalized `(32, 225)` sequence to the Bi-LSTM and apply softmax.

Raw videos and unnecessary dataset archives are intentionally not included in this repository.

## Live Inference Pipeline

The finalized pipeline is at `model/isl_bilstm/live_test.py`. It:

- Uses MediaPipe `RunningMode.IMAGE` and `detect()` with no timestamps.
- Keeps the camera frame unflipped for inference.
- Shows an optional mirrored preview using a separate display copy.
- Captures one sign after pressing Space.
- Collects at least 32 frames within a bounded 3 to 4 second window.
- Uniformly samples exactly 32 frames.
- Re-extracts landmarks independently from those sampled frames.
- Validates shape, NaN/Inf values, normalization files, and class mapping.
- Loads the saved model with strict state-dict loading.
- Displays the predicted sign, confidence, and top-3 predictions.
- Rejects predictions below the configurable 60% confidence threshold as `Uncertain / No reliable sign`.
- Prints debug statistics when `DEBUG_MODE = True`.

Webcam testing depends on successful OpenCV camera access and suitable lighting, framing, and landmark visibility. The confidence threshold is conservative but does not guarantee live accuracy.

## Local Setup

Prerequisites:

- Python 3.11+
- A working webcam for live testing
- Windows, Linux, or macOS with OpenCV camera access

Create and activate a virtual environment, then install the live inference dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

The repository also contains the SIGNX frontend and backend. Their separate setup and environment files remain under `frontend/` and `backend/`.

## Run Live Inference

From the repository root:

```powershell
python model/isl_bilstm/live_test.py
```

Or from the model directory:

```powershell
cd model/isl_bilstm
python live_test.py
```

Press `SPACE` to capture a sign. Press `Q` or `ESC` to exit. The program will print the preprocessing and MediaPipe detection diagnostics after each capture.

## Project Structure

```text
SIGNX/
├── backend/                 # FastAPI backend
├── frontend/                # React frontend
├── model/
│   ├── isl_bilstm/          # Finalized live Bi-LSTM inference package
│   ├── labels/              # Existing application labels
│   └── preprocessing/       # Model preprocessing documentation
├── database/                # Database schema and seed data
├── docs/                    # Project documentation
├── tests/                   # Automated tests
├── requirements.txt         # Live Bi-LSTM inference dependencies
└── README.md
```

## Existing Application

The broader SIGNX application includes a React frontend, FastAPI backend, authentication, translation history, speech services, and database integration. Refer to the relevant directories and documentation for those components.
