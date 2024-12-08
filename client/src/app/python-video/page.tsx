'use client';

import { useState, useRef } from "react";

const Home = () => {
  const [status, setStatus] = useState<string>("Disconnected");
  const [emotion, setEmotion] = useState<string>("None");
  const [confidence, setConfidence] = useState<string>("N/A");
  const videoRef = useRef<HTMLVideoElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const startStream = async () => {
    try {
      // Get user media (webcam access)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Initialize WebSocket
      const ws = new WebSocket("ws://localhost:8000/ws/video");

      ws.onopen = () => {
        setStatus("Connected");
        console.log("WebSocket connected");
        wsRef.current = ws;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received:", data);
          setEmotion(data.emotion || "Unknown");
          setConfidence(data.confidence || "N/A");
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed:", event.reason);
        setStatus("Disconnected");
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setStatus("Error");
      };

      // Stream video frames to WebSocket
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      const sendFrames = () => {
        if (videoRef.current && context && ws.readyState === WebSocket.OPEN) {
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

          // Convert frame to blob and send to the backend
          canvas.toBlob((blob) => {
            if (blob && ws.readyState === WebSocket.OPEN) {
              ws.send(blob);
            }
          }, "image/jpeg");
        }

        if (ws.readyState === WebSocket.OPEN) {
          requestAnimationFrame(sendFrames);
        }
      };

      sendFrames();
    } catch (err) {
      console.error("Error starting video stream:", err);
    }
  };

  const stopStream = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus("Disconnected");
    setEmotion("None");
    setConfidence("N/A");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Interview Analysis Demo</h1>
      <video ref={videoRef} className="border rounded mb-4" autoPlay muted></video>
      <div className="mb-4">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Detected Emotion:</strong> {emotion}</p>
        <p><strong>Confidence Score:</strong> {confidence}</p>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={startStream}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Start
        </button>
        <button
          onClick={stopStream}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default Home;
