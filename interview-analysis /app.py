import os
import cv2
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import socketio
import time
from fer import FER  # For facial expression recognition
import mediapipe as mp  # For body and hand gestures

# Initialize FastAPI app
app = FastAPI()

# Initialize SocketIO server
sio = socketio.AsyncServer(async_mode='asgi')
app.mount('/socket.io', socketio.ASGIApp(sio, socketio_path='socket.io'))

# Facial expression recognition model
emotion_detector = FER()

# MediaPipe models for pose and hands
mp_pose = mp.solutions.pose
mp_hands = mp.solutions.hands

# Initialize MediaPipe pose and hand detectors
pose_detector = mp_pose.Pose(
    min_detection_confidence=0.3,
    min_tracking_confidence=0.3,
    model_complexity=1
)

hand_detector = mp_hands.Hands(
    min_detection_confidence=0.3,
    min_tracking_confidence=0.3,
)

# Video capture for processing
video_stream = cv2.VideoCapture(0)
frame_width = 640
frame_height = 480
video_stream.set(cv2.CAP_PROP_FRAME_WIDTH, frame_width)
video_stream.set(cv2.CAP_PROP_FRAME_HEIGHT, frame_height)

frame_count = 0

@app.get("/")
async def root():
    return {"message": "Hello, World! Behavior Analysis Server Running"}

# WebSocket route to receive video data and process it
@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.event
async def video_feed(sid, data):
    global frame_count
    nparr = np.frombuffer(data['frame'], np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    frame_count += 1

    # Skip processing every Nth frame to reduce load
    if frame_count % 5 != 0:
        return

    start_time = time.time()

    # Facial Expression Detection
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    result = {}
    for (x, y, w, h) in faces:
        face = frame[y:y + h, x:x + w]
        emotion, score = emotion_detector.top_emotion(face)
        if emotion and score:
            result['emotion'] = emotion
            result['score'] = round(score * 100, 2)
        else:
            result['emotion'] = 'No Emotion Detected'
            result['score'] = 0.0

        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

    # Body Pose Detection
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    pose_results = pose_detector.process(frame_rgb)
    pose_landmarks = []
    body_movement_detected = False

    if pose_results.pose_landmarks:
        if len(pose_results.pose_landmarks.landmark) >= 5:
            for landmark in pose_results.pose_landmarks.landmark:
                x = int(landmark.x * frame.shape[1])
                y = int(landmark.y * frame.shape[0])
                pose_landmarks.append({'x': x, 'y': y})
                cv2.circle(frame, (x, y), 5, (0, 255, 255), -1)
            body_movement_detected = True

    # Hand Gesture Detection
    hand_landmarks_data = []
    hand_results = hand_detector.process(frame_rgb)
    if hand_results.multi_hand_landmarks:
        for hand_landmarks in hand_results.multi_hand_landmarks:
            hand_points = []
            for landmark in hand_landmarks.landmark:
                x = int(landmark.x * frame.shape[1])
                y = int(landmark.y * frame.shape[0])
                hand_points.append({'x': x, 'y': y})
                cv2.circle(frame, (x, y), 5, (255, 0, 0), -1)
            hand_landmarks_data.append(hand_points)

    # Encode the processed frame to send back to the client
    _, jpeg = cv2.imencode('.jpg', frame)
    response = jpeg.tobytes()

    # Emit back the processed frame, emotion score, pose landmarks, and hand gestures
    await sio.emit('video_stream', {
        'frame': response, 
        'result': result, 
        'pose_landmarks': pose_landmarks, 
        'hand_landmarks': hand_landmarks_data,
        'body_movement': body_movement_detected
    })

    # Calculate and print frame processing time
    processing_time = time.time() - start_time
    print(f"Frame processed in {processing_time:.4f} seconds")

# To run the server with uvicorn
# uvicorn filename:app --host 0.0.0.0 --port 8000 --reload
