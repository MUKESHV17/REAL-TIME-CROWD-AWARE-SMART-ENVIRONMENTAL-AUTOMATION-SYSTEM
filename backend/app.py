import os
import cv2
import time
import torch
import numpy as np
from flask import Flask, jsonify, Response
import threading
import json
from torchvision import transforms
from ultralytics import YOLO
from deep_sort_realtime.deepsort_tracker import DeepSort
from gpio_controller import turn_on_device, turn_off_device
from seg12 import load_trained_model, analyze_crowd_density, process_resnet_batch

app = Flask(__name__)

# Global stats dictionary
current_stats = {
    'people_count': 0,
    'density': 0.0,
    'device_status': 'off',
    'crowd_level': 'unknown',
    'tracked_ids': [],
    'processing_time': 0,
    'fps': 0,
    'frame_count': 0,
    'crowd_confidence': 1.0,
    'tracking_info': []
}

@app.route('/api/detection_status')
def detection_status():
    return jsonify({
        'running': True,
        'stats': current_stats
    })

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# Constants and model loading
CAMERA_ID = 0
CAMERA_FOV_M2 = 100
DENSITY_THRESHOLD = 0.05
YOLO_MODEL_PATH = "yolov8n.pt"
RESNET_MODEL_PATH = "model/resnet50_density_model.pth"
MIN_CONFIDENCE = 0.3
USE_RESNET = True

# Load YOLO and ResNet
device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
yolo_model = YOLO(YOLO_MODEL_PATH).to(device)
resnet_model, crowd_classifier = load_trained_model(RESNET_MODEL_PATH, device) if USE_RESNET else (None, None)

resnet_transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

tracker = DeepSort(
    max_age=50,
    n_init=3,
    max_cosine_distance=0.4,
    embedder="mobilenet",
    bgr=True
)

# Frame generator for /video_feed
frame_buffer = []

def generate_frames():
    while True:
        if frame_buffer:
            frame = frame_buffer.pop(0)
            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

# Detection thread function
def run_detection():
    cap = cv2.VideoCapture(CAMERA_ID)
    while True:
        start_time = time.time()
        ret, frame = cap.read()
        if not ret:
            continue

        # YOLOv8 Inference
        results = yolo_model(frame, conf=MIN_CONFIDENCE)[0]
        people_boxes = [
            box.xyxy[0].cpu().numpy().astype(int).tolist()
            for box in results.boxes
            if int(box.cls[0]) == 0
        ]

        # Tracking
        formatted_detections = [([x1, y1, x2, y2], 0.9, 0) for x1, y1, x2, y2 in people_boxes]
        tracks = tracker.update_tracks(formatted_detections, frame=frame)
        tracked_ids = [track.track_id for track in tracks if track.is_confirmed()]

        # Density & GPIO
        density = len(tracked_ids) / CAMERA_FOV_M2
        device_status = 'on' if density > DENSITY_THRESHOLD else 'off'
        turn_on_device() if device_status == 'on' else turn_off_device()

        # ResNet crowd estimation
        crowd_level = "unknown"
        crowd_confidence = 1.0
        if USE_RESNET:
            count, level, _ = analyze_crowd_density(frame, resnet_model, crowd_classifier, resnet_transform, device)
            crowd_level = level

        # Update stats
        processing_time = (time.time() - start_time) * 1000
        current_stats.update({
            'people_count': len(tracked_ids),
            'density': density,
            'device_status': device_status,
            'crowd_level': crowd_level,
            'crowd_confidence': crowd_confidence,  # Replace with actual confidence if possible
            'tracked_ids': tracked_ids,
            'tracking_info': [
                {
                    'track_id': track.track_id,
                    'position': f"{int(track.to_ltrb()[0])},{int(track.to_ltrb()[1])}",
                    'confidence': round(track.det_conf, 2) if hasattr(track, 'det_conf') else 0.9,
                    'status': 'Confirmed' if track.is_confirmed() else 'Unconfirmed'
                }
                for track in tracks if track.is_confirmed()
            ],
            'processing_time': round(processing_time, 2),
            'fps': round(1000 / processing_time, 2) if processing_time > 0 else 0,
            'frame_count': current_stats['frame_count'] + 1
        })

        print(f"STATUS_UPDATE:{json.dumps(current_stats)}")

        # Draw tracking results
        for track in tracks:
            if not track.is_confirmed():
                continue
            x1, y1, x2, y2 = map(int, track.to_ltrb())
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, f"ID:{track.track_id}", (x1, y1 - 5),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        frame_buffer.append(frame)

if __name__ == '__main__':
    detection_thread = threading.Thread(target=run_detection)
    detection_thread.daemon = True
    detection_thread.start()
    app.run(host='0.0.0.0', port=5000, debug=False)
