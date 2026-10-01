import os
import cv2
import supervision as sv
from inference import get_model

MODEL_ID = "cardboard-box-detection-9ewtq/5"

print("Loading model:", MODEL_ID)

model = get_model(
    model_id=MODEL_ID,
    api_key=os.environ["ROBOFLOW_API_KEY"],
)

print("MODEL LOADED SUCCESSFULLY!")
print("Starting camera... Press Q to quit.")

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    raise RuntimeError("Could not open webcam.")

while True:
    ret, frame = cap.read()

    if not ret:
        break

    result = model.infer(frame)[0]
    detections = sv.Detections.from_inference(result)

    labels = [
        f"{p.class_name} {p.confidence:.2f}"
        for p in result.predictions
    ]

    frame = sv.BoxAnnotator().annotate(
        scene=frame,
        detections=detections
    )

    frame = sv.LabelAnnotator().annotate(
        scene=frame,
        detections=detections,
        labels=labels
    )

    cv2.imshow("Cardboard Box Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()