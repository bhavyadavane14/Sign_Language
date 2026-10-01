import os
import cv2
import supervision as sv
from inference import get_model

MODEL_ID = "cardboard-box-detection-9ewtq/5"

print("Loading model...")

model = get_model(
    model_id=MODEL_ID,
    api_key=os.environ["ROBOFLOW_API_KEY"],
)

print("Model loaded successfully!")

image = cv2.imread("input.jpg")

if image is None:
    raise FileNotFoundError(
        "input.jpg not found. Put a test image named input.jpg in this folder."
    )

result = model.infer(image)[0]

detections = sv.Detections.from_inference(result)

labels = [
    f"{prediction.class_name} {prediction.confidence:.2f}"
    for prediction in result.predictions
]

annotated = sv.BoxAnnotator().annotate(
    scene=image.copy(),
    detections=detections,
)

annotated = sv.LabelAnnotator().annotate(
    scene=annotated,
    detections=detections,
    labels=labels,
)

cv2.imwrite("output.jpg", annotated)

print(f"Detected {len(detections)} objects")
print("Saved result to output.jpg")