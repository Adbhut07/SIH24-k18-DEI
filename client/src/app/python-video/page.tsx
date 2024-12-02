'use client';

import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface VideoStreamData {
  frame: string;
  result: {
    emotion: string;
    emotion_score: number;
    body_language: string;
  };
  pose_landmarks: Array<{x: number, y: number}>;
  hand_landmarks: Array<Array<{x: number, y: number}>>;
  body_movement: boolean;
}

export default function WebSocketVideoClient() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [detectionResults, setDetectionResults] = useState<{
    emotion: string;
    emotionScore: number;
    bodyLanguage: string;
    bodyMovement: boolean;
    poseLandmarks: Array<{x: number, y: number}>;
    handLandmarks: Array<Array<{x: number, y: number}>>;
  }>({
    emotion: 'No detection',
    emotionScore: 0,
    bodyLanguage: 'No posture detected',
    bodyMovement: false,
    poseLandmarks: [],
    handLandmarks: []
  });

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const processedCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8000', {
      transports: ['websocket'],
      withCredentials: true,
      path: '/socket.io/'
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    startWebcam();

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const captureInterval = setInterval(captureFrame, 200);
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  const captureFrame = () => {
    if (!localVideoRef.current || !socket) return;

    const video = localVideoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      if (blob) {
        const reader = new FileReader();
        reader.onloadend = () => {
          socket.emit('video_feed', { frame: reader.result });
        };
        reader.readAsArrayBuffer(blob);
      }
    }, 'image/jpeg');
  };

  useEffect(() => {
    if (!socket) return;

    const handleVideoStream = (data: VideoStreamData) => {
      setDetectionResults({
        emotion: data.result?.emotion || 'No detection',
        emotionScore: data.result?.emotion_score || 0,
        bodyLanguage: data.result?.body_language || 'No posture detected',
        bodyMovement: data.body_movement,
        poseLandmarks: data.pose_landmarks || [],
        handLandmarks: data.hand_landmarks || []
      });

      if (processedCanvasRef.current) {
        const canvas = processedCanvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          const img = new Image();
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Draw pose landmarks
            ctx.fillStyle = 'yellow';
            data.pose_landmarks?.forEach(landmark => {
              ctx.beginPath();
              ctx.arc(landmark.x, landmark.y, 5, 0, 2 * Math.PI);
              ctx.fill();
            });

            // Draw hand landmarks
            ctx.fillStyle = 'red';
            data.hand_landmarks?.forEach(hand => {
              hand.forEach(landmark => {
                ctx.beginPath();
                ctx.arc(landmark.x, landmark.y, 5, 0, 2 * Math.PI);
                ctx.fill();
              });
            });
          };
          img.src = URL.createObjectURL(new Blob([data.frame], {type: 'image/jpeg'}));
        }
      }
    };

    socket.on('video_stream', handleVideoStream);

    return () => {
      socket.off('video_stream', handleVideoStream);
    };
  }, [socket]);

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4">Advanced Behavior Analysis</h2>
      
      <div className="flex space-x-4">
        <div>
          <h3 className="text-lg font-semibold">Local Video</h3>
          <video 
            ref={localVideoRef} 
            autoPlay 
            playsInline 
            className="w-[640px] h-[480px] border-2 border-gray-300"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold">Processed Video</h3>
          <canvas 
            ref={processedCanvasRef} 
            className="w-[640px] h-[480px] border-2 border-gray-300"
          />
        </div>
      </div>

      {/* Enhanced Detection Results */}
      <div className="mt-4 p-4 bg-gray-100 rounded-lg w-full max-w-4xl">
        <h3 className="text-xl font-bold mb-2">Behavior Insights</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-lg shadow">
            <h4 className="font-semibold text-lg mb-2">Emotional State</h4>
            <p className="text-gray-700">Emotion: {detectionResults.emotion}</p>
            <p className="text-gray-700">
              Confidence: {(detectionResults.emotionScore * 100).toFixed(2)}%
            </p>
          </div>
          
          <div className="bg-white p-3 rounded-lg shadow">
            <h4 className="font-semibold text-lg mb-2">Body Language</h4>
            <p className="text-gray-700">Posture: {detectionResults.bodyLanguage}</p>
            <p className="text-gray-700">
              Movement Detected: {detectionResults.bodyMovement ? 'Yes' : 'No'}
            </p>
          </div>
          
          <div className="bg-white p-3 rounded-lg shadow">
            <h4 className="font-semibold text-lg mb-2">Hand Gestures</h4>
            <p className="text-gray-700">
              Hands Detected: {detectionResults.handLandmarks.length}
            </p>
            {detectionResults.handLandmarks.map((hand, index) => (
              <p key={index} className="text-gray-700">
                Hand {index + 1}: {hand.length} landmarks
              </p>
            ))}
          </div>
        </div>

        {/* Detailed Landmarks */}
        <div className="mt-4">
          <h4 className="font-semibold text-lg mb-2">Detailed Landmarks</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium">Pose Landmarks</h5>
              {detectionResults.poseLandmarks.length > 0 ? (
                <ul className="text-sm text-gray-600">
                  {detectionResults.poseLandmarks.slice(0, 5).map((landmark, index) => (
                    <li key={index}>
                      Landmark {index}: x = {landmark.x.toFixed(2)}, y = {landmark.y.toFixed(2)}
                    </li>
                  ))}
                  {detectionResults.poseLandmarks.length > 5 && (
                    <li>... and {detectionResults.poseLandmarks.length - 5} more</li>
                  )}
                </ul>
              ) : (
                <p className="text-gray-500">No pose landmarks detected</p>
              )}
            </div>

            <div>
              <h5 className="font-medium">Hand Landmarks</h5>
              {detectionResults.handLandmarks.length > 0 ? (
                detectionResults.handLandmarks.map((hand, handIndex) => (
                  <div key={handIndex} className="mb-2">
                    <p className="text-sm font-medium">Hand {handIndex + 1}:</p>
                    <ul className="text-sm text-gray-600">
                      {hand.slice(0, 3).map((landmark, index) => (
                        <li key={index}>
                          Landmark {index}: x = {landmark.x.toFixed(2)}, y = {landmark.y.toFixed(2)}
                        </li>
                      ))}
                      {hand.length > 3 && (
                        <li>... and {hand.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No hand landmarks detected</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}