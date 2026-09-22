# Model Documentation

## Architecture
The SIGNX model is a 1D Convolutional Neural Network (CNN) designed to classify spatial hand coordinates.

### Layers:
1. Input Layer (63 units)
2. Conv1D / Dense layers for feature extraction
3. Dropout layers for regularization
4. Output Layer (36 units, Softmax activation)

## Dataset
Trained on a custom dataset of Indian Sign Language alphabets and digits.

## Classes
36 classes representing A-Z and 0-9.

## Preprocessing
Uses Google MediaPipe to extract 21 hand landmarks, flattened into a 63-dimensional array. Coordinates are normalized relative to the wrist.
