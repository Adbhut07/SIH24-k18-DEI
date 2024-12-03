import os
import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import socketio
import time
import mediapipe as mp
import math

app = FastAPI()

sio = socketio.AsyncServer(
    async_mode='asgi', 
    cors_allowed_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000"
    ]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  
        "http://127.0.0.1:3000",
        "http://localhost:8000",  
        "http://127.0.0.1:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount('/socket.io', socketio.ASGIApp(sio, socketio_path='socket.io'))

mp_pose = mp.solutions.pose
mp_hands = mp.solutions.hands
mp_face_detection = mp.solutions.face_detection
mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils

pose_detector = mp_pose.Pose(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5,
    model_complexity=1
)

hand_detector = mp_hands.Hands(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5,
    max_num_hands=2
)

face_detector = mp_face_detection.FaceDetection(
    min_detection_confidence=0.5
)

face_mesh_detector = mp_face_mesh.FaceMesh(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

def calculate_emotion_from_facial_landmarks(face_landmarks):
    """
    Attempt to analyze emotion based on facial landmark configurations
    """
    # This is a simplified emotion detection logic
    # You'd need advanced ML models for more accurate emotion recognition
    if not face_landmarks:
        return 'Neutral', 0.0
    
    # Example logic: detect basic expressions
    left_eye = face_landmarks[33]
    right_eye = face_landmarks[263]
    mouth_left = face_landmarks[61]
    mouth_right = face_landmarks[291]
    
    eye_distance = math.hypot(left_eye.x - right_eye.x, left_eye.y - right_eye.y)
    mouth_width = math.hypot(mouth_left.x - mouth_right.x, mouth_left.y - mouth_right.y)
    
    if eye_distance > 0.1:  # More open eyes might indicate surprise or alertness
        return 'Alert/Surprised', 0.7
    
    if mouth_width > 0.15:  # Wider mouth might indicate smile or stress
        return 'Happy/Stressed', 0.6
    
    return 'Neutral', 0.5

def analyze_body_language(pose_landmarks):
    """
    Analyze body language and posture
    """
    if not pose_landmarks:
        return 'No Posture Detected', False
    
    # Shoulder and hip alignment
    left_shoulder = pose_landmarks[mp_pose.PoseLandmarks.LEFT_SHOULDER]
    right_shoulder = pose_landmarks[mp_pose.PoseLandmarks.RIGHT_SHOULDER]
    left_hip = pose_landmarks[mp_pose.PoseLandmarks.LEFT_HIP]
    right_hip = pose_landmarks[mp_pose.PoseLandmarks.RIGHT_HIP]
    
    # Check for open or closed posture
    shoulder_width = abs(left_shoulder.x - right_shoulder.x)
    hip_width = abs(left_hip.x - right_hip.x)
    
    if shoulder_width > hip_width * 1.2:
        return 'Open, Confident Posture', True
    elif shoulder_width < hip_width * 0.8:
        return 'Closed, Defensive Posture', True
    
    return 'Neutral Posture', True

def analyze_hand_gestures(hand_landmarks):
    """
    Detect and analyze hand gestures
    """
    if not hand_landmarks:
        return 'No Gestures', None
    
    # Simplified gesture detection
    thumb_tip = hand_landmarks[4]
    index_tip = hand_landmarks[8]
    
    # Distance between thumb and index finger
    distance = math.hypot(
        thumb_tip.x - index_tip.x, 
        thumb_tip.y - index_tip.y
    )
    
    if distance < 0.1:
        return 'Pointing/Precise Gesture', hand_landmarks
    elif thumb_tip.y < index_tip.y:
        return 'Thumbs Up/Positive', hand_landmarks
    
    return 'Relaxed Hand Position', hand_landmarks

@sio.event
async def video_feed(sid, data):
    try:
        # Decode the incoming frame
        nparr = np.frombuffer(data['frame'], np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Convert to RGB for MediaPipe
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Detect face and facial landmarks
        face_results = face_detector.process(frame_rgb)
        face_mesh_results = face_mesh_detector.process(frame_rgb)

        # Detect pose
        pose_results = pose_detector.process(frame_rgb)

        # Detect hands
        hand_results = hand_detector.process(frame_rgb)

        # Prepare results
        emotion = 'No Face Detected'
        emotion_score = 0.0
        body_language = 'No Posture Detected'
        body_movement = False
        hand_gesture = 'No Gestures'
        
        # Face and emotion analysis
        if face_mesh_results.multi_face_landmarks:
            face_landmarks = face_mesh_results.multi_face_landmarks[0].landmark
            emotion, emotion_score = calculate_emotion_from_facial_landmarks(face_landmarks)

        # Body language analysis
        if pose_results.pose_landmarks:
            pose_landmarks = pose_results.pose_landmarks.landmark
            body_language, body_movement = analyze_body_language(pose_landmarks)

        # Hand gesture analysis
        hand_landmarks_data = []
        if hand_results.multi_hand_landmarks:
            for hand_landmarks in hand_results.multi_hand_landmarks:
                landmarks = hand_landmarks.landmark
                hand_gesture, analyzed_landmarks = analyze_hand_gestures(landmarks)
                
                hand_points = [
                    {'x': int(landmark.x * frame.shape[1]), 'y': int(landmark.y * frame.shape[0])} 
                    for landmark in landmarks
                ]
                hand_landmarks_data.append(hand_points)

        # Draw detected landmarks (optional visualization)
        if pose_results.pose_landmarks:
            mp_drawing.draw_landmarks(
                frame, 
                pose_results.pose_landmarks, 
                mp_pose.POSE_CONNECTIONS
            )
        
        if hand_results.multi_hand_landmarks:
            for hand_landmarks in hand_results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    frame, 
                    hand_landmarks, 
                    mp_hands.HAND_CONNECTIONS
                )

        # Encode the processed frame
        _, jpeg = cv2.imencode('.jpg', frame)
        response = jpeg.tobytes()

        # Emit comprehensive detection results
        await sio.emit('video_stream', {
            'frame': response, 
            'result': {
                'emotion': emotion,
                'emotion_score': emotion_score,
                'body_language': body_language
            },
            'pose_landmarks': [
                {'x': int(landmark.x * frame.shape[1]), 'y': int(landmark.y * frame.shape[0])} 
                for landmark in pose_results.pose_landmarks.landmark
            ] if pose_results.pose_landmarks else [],
            'hand_landmarks': hand_landmarks_data,
            'body_movement': body_movement
        })

    except Exception as e:
        print(f"Error processing video frame: {e}")
        await sio.emit('error', {'message': str(e)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)