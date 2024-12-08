from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
from deepface import DeepFace  # Pretrained model for expression detection

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Analyzing frame for emotion using DeepFace
def analyze_emotion(frame):
    try:
        # Convert the frame to RGB as DeepFace expects RGB images
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Analyze the frame
        result = DeepFace.analyze(rgb_frame, actions=["emotion"], enforce_detection=False)
        
        # Extract the dominant emotion
        dominant_emotion = result[0].get('dominant_emotion', 'Unknown') # Adjusted for result's structure
        return dominant_emotion
    except Exception as e:
        print(f"Error in DeepFace analysis: {e}")
        return "Unknown"

# WebSocket manager for multiple clients
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/video")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    print("WebSocket connection established")
    try:
        while True:
            data = await websocket.receive_bytes()
            print(f"Received data size: {len(data)} bytes")
            
            nparr = np.frombuffer(data, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if frame is None:
                print("Failed to decode frame")
                continue

            try:
                emotion = analyze_emotion(frame)
                confidence_score = "High" if emotion in ["happy", "neutral"] else "Low"
                response = {
                    "emotion": emotion,
                    "confidence": confidence_score,
                }
                print(f"Analyzed frame: {response}")
                await manager.send_message(str(response), websocket)
            except Exception as e:
                print(f"Error processing frame: {e}")
    except WebSocketDisconnect:
        print("WebSocket disconnected")
        manager.disconnect(websocket)
    except Exception as e:
        print(f"Unexpected error: {e}")

