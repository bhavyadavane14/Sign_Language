import json
import os

import cv2
import mediapipe as mp
import numpy as np
import torch
import torch.nn as nn
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

BASE = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE, "isl_bilstm_best.pth")
MEAN_PATH = os.path.join(BASE, "landmark_mean.npy")
STD_PATH = os.path.join(BASE, "landmark_std.npy")
LABEL_PATH = os.path.join(BASE, "label_map.json")
HAND_MODEL = os.path.join(BASE, "hand_landmarker.task")
POSE_MODEL = os.path.join(BASE, "pose_landmarker.task")

DEBUG_MODE = True
CONFIDENCE_THRESHOLD = 0.60
MIN_CAPTURE_SECONDS = 3.0
MAX_CAPTURE_SECONDS = 4.0
TARGET_FRAMES = 32
PREVIEW_DETECTION_INTERVAL = 3
CAMERA_INDEXES = (0, 1)
INPUT_SIZE = 225
NUM_CLASSES = 61


def load_assets():
    required = (MODEL_PATH, MEAN_PATH, STD_PATH, LABEL_PATH, HAND_MODEL, POSE_MODEL)
    missing = [path for path in required if not os.path.isfile(path)]
    if missing:
        raise FileNotFoundError("Missing required file(s):\n" + "\n".join(missing))

    mean = np.load(MEAN_PATH).astype(np.float32)
    std = np.load(STD_PATH).astype(np.float32)
    if mean.shape != (INPUT_SIZE,) or std.shape != (INPUT_SIZE,):
        raise ValueError(f"Expected mean/std shapes ({INPUT_SIZE},), got {mean.shape}/{std.shape}")
    if not np.isfinite(mean).all() or not np.isfinite(std).all() or np.any(std == 0.0):
        raise ValueError("Normalization files contain invalid or zero standard-deviation values")

    with open(LABEL_PATH, "r", encoding="utf-8") as label_file:
        label_map = json.load(label_file)
    if all(str(key).isdigit() for key in label_map):
        index_to_label = {int(key): str(value) for key, value in label_map.items()}
    else:
        index_to_label = {int(value): str(key) for key, value in label_map.items()}
    if len(index_to_label) != NUM_CLASSES or set(index_to_label) != set(range(NUM_CLASSES)):
        raise ValueError("label_map.json does not contain exactly class indices 0..60")

    print("All required files found")
    print(f"Classes: {len(index_to_label)}")
    return mean, std, index_to_label


class ISLBiLSTM(nn.Module):
    def __init__(self):
        super().__init__()
        self.lstm = nn.LSTM(225, 128, num_layers=2, batch_first=True, bidirectional=True, dropout=0.3)
        self.classifier = nn.Sequential(nn.Linear(256, 128), nn.ReLU(), nn.Dropout(0.3), nn.Linear(128, 61))

    def forward(self, inputs):
        outputs, _ = self.lstm(inputs)
        return self.classifier(outputs[:, -1, :])


def load_model(device):
    model = ISLBiLSTM().to(device)
    checkpoint = torch.load(MODEL_PATH, map_location=device)
    state_dict = checkpoint["model_state_dict"] if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint else checkpoint
    if not isinstance(state_dict, dict):
        raise ValueError("Model file does not contain a state_dict")
    model.load_state_dict(state_dict, strict=True)
    model.eval()
    print("Bi-LSTM loaded with strict=True")
    return model


def create_landmarkers():
    hand_options = vision.HandLandmarkerOptions(
        base_options=python.BaseOptions(model_asset_path=HAND_MODEL),
        running_mode=vision.RunningMode.IMAGE,
        num_hands=2,
        min_hand_detection_confidence=0.5,
        min_hand_presence_confidence=0.5,
    )
    pose_options = vision.PoseLandmarkerOptions(
        base_options=python.BaseOptions(model_asset_path=POSE_MODEL),
        running_mode=vision.RunningMode.IMAGE,
        num_poses=1,
        min_pose_detection_confidence=0.5,
        min_pose_presence_confidence=0.5,
        min_tracking_confidence=0.5,
    )
    hands = vision.HandLandmarker.create_from_options(hand_options)
    pose = vision.PoseLandmarker.create_from_options(pose_options)
    print("MediaPipe ready in IMAGE mode")
    return hands, pose


def extract_landmarks(frame, hand_detector, pose_detector):
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
    hand_result = hand_detector.detect(image)
    pose_result = pose_detector.detect(image)

    left = np.zeros((21, 3), dtype=np.float32)
    right = np.zeros((21, 3), dtype=np.float32)
    for hand_index, hand in enumerate(hand_result.hand_landmarks):
        if hand_index >= len(hand_result.handedness):
            continue
        points = np.asarray([[point.x, point.y, point.z] for point in hand], dtype=np.float32)
        side = hand_result.handedness[hand_index][0].category_name
        if side == "Left":
            left = points
        elif side == "Right":
            right = points

    pose = np.zeros((33, 3), dtype=np.float32)
    if pose_result.pose_landmarks:
        pose = np.asarray([[point.x, point.y, point.z] for point in pose_result.pose_landmarks[0]], dtype=np.float32)

    features = np.concatenate((left.flatten(), right.flatten(), pose.flatten())).astype(np.float32)
    if features.shape != (INPUT_SIZE,):
        raise ValueError(f"Frame feature shape must be (225,), got {features.shape}")
    return features, len(hand_result.hand_landmarks), len(pose_result.pose_landmarks), hand_result, pose_result


def draw_landmarks(frame, hand_result, pose_result, mirrored=False):
    height, width = frame.shape[:2]

    def point_position(point):
        x = int(point.x * width)
        if mirrored:
            x = width - 1 - x
        return x, int(point.y * height)

    for hand_index, hand in enumerate(hand_result.hand_landmarks):
        color = (0, 255, 0)
        if hand_index < len(hand_result.handedness) and hand_result.handedness[hand_index][0].category_name == "Right":
            color = (0, 165, 255)
        for point in hand:
            cv2.circle(frame, point_position(point), 4, color, -1)
    if pose_result.pose_landmarks:
        for point in pose_result.pose_landmarks[0]:
            cv2.circle(frame, point_position(point), 3, (255, 0, 0), -1)


def sample_uniform_frames(frames):
    if len(frames) < TARGET_FRAMES:
        raise ValueError(f"Only {len(frames)} frames captured; exactly 32 are required")
    indices = np.linspace(0, len(frames) - 1, TARGET_FRAMES).astype(int)
    return [frames[index] for index in indices]


def validate_and_normalize(sequence, mean, std):
    if sequence.shape != (TARGET_FRAMES, INPUT_SIZE):
        raise ValueError(f"Raw feature shape must be (32, 225), got {sequence.shape}")
    if not np.isfinite(sequence).all():
        raise ValueError("Raw feature matrix contains NaN or Inf")
    normalized = (sequence - mean) / std
    if normalized.shape != (TARGET_FRAMES, INPUT_SIZE) or not np.isfinite(normalized).all():
        raise ValueError("Normalized feature matrix has an invalid shape or contains NaN/Inf")
    return normalized


def print_debug(sequence, normalized, hand_counts, pose_counts, probabilities=None):
    if not DEBUG_MODE:
        return
    hand_frames = sum(count > 0 for count in hand_counts)
    pose_frames = sum(count > 0 for count in pose_counts)
    print("\n=== DEBUG: captured sequence ===")
    print(f"Raw feature shape: {sequence.shape}")
    print(f"Normalized feature shape: {normalized.shape}")
    print(f"Hands per sampled frame: {hand_counts}")
    print(f"Poses per sampled frame: {pose_counts}")
    print(f"Frames with at least one detected hand: {hand_frames}/{TARGET_FRAMES} ({100 * hand_frames / TARGET_FRAMES:.1f}%)")
    print(f"Frames with pose detected: {pose_frames}/{TARGET_FRAMES} ({100 * pose_frames / TARGET_FRAMES:.1f}%)")
    print(f"NaN/Inf in raw features: {not np.isfinite(sequence).all()}")
    print(f"NaN/Inf in normalized features: {not np.isfinite(normalized).all()}")
    if probabilities is not None:
        print("Prediction probabilities:")
        print(probabilities)


def predict_from_capture(frames, hand_detector, pose_detector, mean, std, model, index_to_label, device):
    selected = sample_uniform_frames(frames)
    features = []
    hand_counts = []
    pose_counts = []
    for frame in selected:
        feature, hands, poses, _, _ = extract_landmarks(frame, hand_detector, pose_detector)
        features.append(feature)
        hand_counts.append(hands)
        pose_counts.append(poses)

    sequence = np.stack(features).astype(np.float32)
    normalized = validate_and_normalize(sequence, mean, std)
    print_debug(sequence, normalized, hand_counts, pose_counts)
    inputs = torch.from_numpy(normalized).unsqueeze(0).to(device)
    with torch.no_grad():
        probabilities = torch.softmax(model(inputs), dim=1)[0].cpu().numpy()
    if probabilities.shape != (NUM_CLASSES,) or not np.isfinite(probabilities).all():
        raise ValueError("Model probabilities are invalid")

    top_indices = np.argsort(probabilities)[::-1][:3]
    top3 = [(index_to_label[int(index)], float(probabilities[index])) for index in top_indices]
    best_probability = float(probabilities[int(top_indices[0])])
    best_label = index_to_label[int(top_indices[0])] if best_probability >= CONFIDENCE_THRESHOLD else "Uncertain / No reliable sign"
    print_debug(sequence, normalized, hand_counts, pose_counts, probabilities)
    return best_label, best_probability, top3


def open_camera():
    for index in CAMERA_INDEXES:
        camera = cv2.VideoCapture(index)
        if camera.isOpened():
            ok, frame = camera.read()
            if ok and frame is not None and frame.size:
                return camera, index
            print(f"Camera {index} opened but returned no frame")
        else:
            print(f"Camera {index} is unavailable")
        camera.release()
    raise RuntimeError("Could not read frames from camera indexes 0 or 1")


def main():
    mean, std, index_to_label = load_assets()
    device = torch.device("cpu")
    model = load_model(device)
    hand_detector, pose_detector = create_landmarkers()
    camera = None
    try:
        camera, camera_index = open_camera()
        print(f"\nCAMERA READY (index {camera_index})")
        print("SPACE = capture sign; Q or ESC = quit")
        capturing = False
        frames = []
        capture_start = 0.0
        prediction = "No sign captured"
        confidence = 0.0
        top3 = []
        status = "SPACE = capture sign"
        frame_counter = 0
        preview_hand_result = None
        preview_pose_result = None

        while True:
            ok, frame = camera.read()
            if not ok:
                print("Failed to read camera frame")
                break

            frame_counter += 1
            if capturing:
                frames.append(frame.copy())

            detect_preview = (
                not capturing
                or frame_counter % PREVIEW_DETECTION_INTERVAL == 0
                or preview_hand_result is None
            )
            if detect_preview:
                _, _, _, preview_hand_result, preview_pose_result = extract_landmarks(
                    frame, hand_detector, pose_detector
                )

            display = cv2.flip(frame.copy(), 1)
            if preview_hand_result is not None and preview_pose_result is not None:
                draw_landmarks(display, preview_hand_result, preview_pose_result, mirrored=True)

            if capturing:
                elapsed = cv2.getTickCount() / cv2.getTickFrequency() - capture_start
                status = f"CAPTURING: {elapsed:.1f}s ({len(frames)} frames)"
                enough_time = elapsed >= MIN_CAPTURE_SECONDS and len(frames) >= TARGET_FRAMES
                timed_out = elapsed >= MAX_CAPTURE_SECONDS
                if enough_time or timed_out:
                    try:
                        if len(frames) < TARGET_FRAMES:
                            raise ValueError(f"Captured {len(frames)} frames in {MAX_CAPTURE_SECONDS:.1f}s; need 32")
                        prediction, confidence, top3 = predict_from_capture(
                            frames, hand_detector, pose_detector, mean, std, model, index_to_label, device
                        )
                        print(f"Prediction: {prediction}\nConfidence: {confidence:.2%}")
                        print("Top-3:")
                        for label, probability in top3:
                            print(f"  {label}: {probability:.2%}")
                    except (ValueError, RuntimeError) as error:
                        prediction, confidence, top3 = "Capture validation failed", 0.0, []
                        print(f"Prediction error: {error}")
                    frames.clear()
                    capturing = False
                    status = "SPACE = capture another sign"

            cv2.rectangle(display, (0, 0), (display.shape[1], 175), (0, 0, 0), -1)
            cv2.putText(display, f"Sign: {prediction}", (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 255, 0), 2)
            cv2.putText(display, f"Confidence: {confidence:.1%}", (20, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            for row, (label, probability) in enumerate(top3, 1):
                cv2.putText(display, f"{row}. {label}: {probability:.1%}", (20, 60 + row * 25), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
            cv2.putText(display, status, (20, 155), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1)
            cv2.imshow("ISL Sign Language Translator", display)
            key = cv2.waitKey(1) & 0xFF
            if key in (ord("q"), 27):
                break
            if key == ord(" ") and not capturing:
                frames.clear()
                capture_start = cv2.getTickCount() / cv2.getTickFrequency()
                capturing = True
                prediction, confidence, top3 = "Perform your sign...", 0.0, []
    except RuntimeError as error:
        print(f"Camera error: {error}")
    finally:
        if camera is not None:
            camera.release()
        hand_detector.close()
        pose_detector.close()
        cv2.destroyAllWindows()
        print("\nLive testing stopped.")


if __name__ == "__main__":
    main()
