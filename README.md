# 🤖 Boundary X - AI Face Recognition

**Boundary X - AI Face Mesh Recognition** is a high-performance web application that tracks facial movements and expressions in real-time using Google's **MediaPipe Face Landmarker**.

Designed for educational and prototyping environments, this app converts facial data into control signals and transmits them to external hardware (like **BBC Micro:bit**) via **Web Bluetooth (BLE)**.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Platform](https://img.shields.io/badge/Platform-Web-blue)
![Tech](https://img.shields.io/badge/Stack-p5.js%20%7C%20MediaPipe-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Key Features

### 1. ⚡ MediaPipe Powered Face Tracking
- **Face Mesh Technology:** Tracks 478 facial landmarks in real-time to detect precise movements.
- **11 Key Parameters:** Extracts essential data for robot control (Position, Rotation, Expressions) and maps them to integer ranges (0-99 or 0-9).
- **Visual Feedback:** Provides intuitive visual feedback with a neon-green face mesh and a highlighted nose point.

### 2. 📡 Bluetooth Low Energy (BLE) Control
- **Wireless Communication:** Connects directly to **BBC Micro:bit** (or compatible BLE devices) using the **Nordic UART Service** without any dongles.
- **Data Optimization:** Throttles data transmission to **100ms (10Hz)** intervals to prevent hardware buffer overflow and ensure stability.

### 3. 📱 Responsive & User-Friendly UI
- **Cross-Platform:** The layout automatically adapts to PC, Tablet, and Mobile environments (features a Sticky Canvas for mobile).
- **Multi-language Support:** Instantly switch between **English (EN)** and **Korean (KO)** with a single click.
- **Camera Control:** Supports front/rear camera switching and automatic mirroring.

---

## 📊 Communication Protocol

The application sends data to the Micro:bit as either a **19-digit numeric string** or a **control command**.

### 1. BLE Service Information (Nordic UART)
* **Service UUID:** `6e400001-b5a3-f393-e0a9-e50e24dcca9e`
* **TX Characteristic:** `6e400002-b5a3-f393-e0a9-e50e24dcca9e`
* **RX Characteristic:** `6e400003-b5a3-f393-e0a9-e50e24dcca9e`

### 2. Data Packet Structure (19 Digits)
Sent when a face is detected.

| Order | Parameter | Length | Range | Description |
|:---:|:---:|:---:|:---:|:---|
| 1 | **X** | 2 digits | 00~99 | Horizontal Position (0: Left, 99: Right) |
| 2 | **Y** | 2 digits | 00~99 | Vertical Position (0: Top, 99: Bottom) |
| 3 | **Z** | 2 digits | 00~99 | Estimated Distance (Higher value = Closer) |
| 4 | **Yaw** | 2 digits | 00~99 | Head Rotation Left/Right (No) |
| 5 | **Pitch** | 2 digits | 00~99 | Head Rotation Up/Down (Nod) |
| 6 | **Mouth** | 2 digits | 00~99 | Mouth Openness (Higher value = Open) |
| 7 | **L-Eye** | 2 digits | 00~99 | Left Eye Openness |
| 8 | **R-Eye** | 2 digits | 00~99 | Right Eye Openness |
| 9 | **Roll** | 1 digit | 0~9 | Head Tilt (0: Left, 5: Center, 9: Right) |
| 10 | **Smile** | 1 digit | 0~9 | Smile Intensity |
| 11 | **Vis** | 1 digit | 0 or 1 | Face Visibility (1: Detected) |

> **Example Data:** `5050605050009999501`
> * Center(50,50), Looking straight, Mouth closed(00), Eyes open(99), Level head(5), Neutral expression(0), Detected(1)

### 3. Control Commands
* **`stop`**: Sent when the 'Stop' button is pressed or no face is detected. Use this to halt robot motors.

**Tech Stack:**
- **Frontend:** HTML5, CSS3
- **Creative Coding:** p5.js (Canvas, Video handling)
- **AI Engine:** MediaPipe Tasks Vision (@mediapipe/tasks-vision)
- **Hardware I/O:** Web Bluetooth API (BLE)

**License:**
- Copyright © 2024 Boundary X Co. All rights reserved.
- All rights to the source code and design of this project belong to BoundaryX.
- Web: boundaryx.io
- Contact: https://boundaryx.io/contact
