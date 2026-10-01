# Model Resources

This directory contains the trained ISL Bi-LSTM inference package and existing application model resources.

## ISL Bi-LSTM Package

`isl_bilstm/` contains the complete CPU live-inference package:

- `live_test.py`: capture-and-predict webcam pipeline
- `isl_bilstm_best.pth`: trained 2-layer bidirectional LSTM weights
- `landmark_mean.npy` and `landmark_std.npy`: training normalization statistics
- `label_map.json`: mapping for all 61 output classes
- `hand_landmarker.task`: MediaPipe hand model
- `pose_landmarker.task`: MediaPipe pose model

Run it from the repository root with:

```bash
python model/isl_bilstm/live_test.py
```

The model weights and MediaPipe task files are included because they are required for local inference. Raw videos and the source dataset archive are not included.
