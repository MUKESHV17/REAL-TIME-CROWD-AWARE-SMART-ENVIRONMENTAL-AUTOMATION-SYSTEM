 REAL-TIME-CROWD-AWARE-SMART-ENVIRONMENTAL-AUTOMATION-SYSTEM is a real-time intelligent environmental automation system designed for smart buildings. It uses YOLOv8, DeepSORT, and a novel Multi-Scale DensityResNet to detect crowd density, control lighting, HVAC, and display systems through IoT devices.

🔋 Saves up to 28.5% energy, operates at 45 FPS, and maintains comfort within ±0.5°C.

⚙️ Key Features
🧍 YOLOv8 Person Detection
👥 Crowd Density Estimation (ResNet + CBAM + ASPP)
🔁 DeepSORT Multi-Object Tracking
🧠 ML-Powered Adaptive Decision Engine
🌐 Real-Time Web Dashboard

🧰 Tech Stack
Category	Technologies
Languages	Python 3, React.js
Frameworks	Flask, PyTorch, OpenCV
Models Used	YOLOv8, ResNet, DeepSORT
Visualization	WebRTC, Chart.js
Datasets	ShanghaiTech, JHU-CROWD++, UCF-QNRF
📊 System Workflow


📱 Dashboard Overview
👁️ Live Feed with bounding boxes and density overlays
📈 Sensor Graphs for real-time temperature and humidity
⚙️ Control Panel to toggle fans, lights, and display
🔔 Smart Alerts for crowd density and environmental thresholds
📈 Results & Performance
Metric	Value
Crowd Estimation Accuracy	91.2%
YOLOv8 mAP@0.5	94.2%
Identity Preservation	91.8%
Mean Absolute Error (MAE)	6.9 (Part A)
Real-Time FPS	45
Energy Saved	28.5%
🧪 Evaluation Metrics
✅ Mean Average Precision (mAP)
✅ Mean Absolute Error (MAE)
✅ F1 Score
✅ Identity Re-identification Accuracy
💡 Use Cases
🏢 Smart Office Automation
🛍️ Malls & Shopping Centers
🚉 Public Transit Stations
🏥 Hospital Monitoring
🏫 School and Lecture Hall Management
🔑 Model Weights
Download YOLOv8 weights from Ultralytics
Get ResNet-based density estimation model (custom-trained)
Use DeepSORT checkpoint with EfficientNet-B2
📁 Place all model weights in the /models/ directory.

🔧 Installation Guide
Prerequisites
Python 3.8+
USB Webcam
