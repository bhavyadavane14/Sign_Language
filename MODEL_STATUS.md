# Model Status and Setup

## Overview
The SIGNX AI model is a Convolutional Neural Network (CNN) built using TensorFlow/Keras. It uses MediaPipe for hand landmark extraction before feeding the normalized coordinates into the CNN.

## Details
- **Format**: `.h5` Keras model
- **Classes**: 36 classes (A-Z, 0-9)
- **Input Features**: 63 features (21 hand landmarks * 3 coordinates (x,y,z))
- **Preprocessing**: MediaPipe Hands is used to extract hand landmarks. These landmarks are normalized relative to the wrist before prediction.
- **Inference**: Handled via `tensorflow.keras.models.load_model` and `.predict()`.

## Model File Location
**IMPORTANT:** The model weights file (`signx_model.h5`) is NOT included in this repository due to file size limits.

You MUST download it manually and place it in the correct directory for the backend to function.

### Setup Instructions:
1. Download `signx_model.h5` from the authorized Google Drive repository.
2. Place it exactly at: `SIGNX/model/weights/signx_model.h5`.
3. Ensure the backend environment variable `MODEL_PATH` points to this file.
