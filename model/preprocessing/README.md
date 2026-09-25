# ISL Bi-LSTM Preprocessing

The trained model expects a sequence with shape `(32, 225)`.

For each source video, 32 frame indices are selected uniformly:

```python
frame_indices = np.linspace(0, total_frames - 1, 32).astype(int)
```

Each selected BGR frame is converted to RGB and passed independently to MediaPipe Tasks API in `IMAGE` mode. The feature order is fixed:

1. Left hand: 21 landmarks x 3 coordinates = 63 values
2. Right hand: 21 landmarks x 3 coordinates = 63 values
3. Pose: 33 landmarks x 3 coordinates = 99 values

Missing landmarks are zero-filled. The resulting matrix is normalized exactly as:

```python
normalized = (features - landmark_mean) / landmark_std
```

The normalized `(32, 225)` sequence is passed to the saved 2-layer bidirectional LSTM. The live pipeline follows this same contract and does not apply wrist-relative or per-frame rescaling.
