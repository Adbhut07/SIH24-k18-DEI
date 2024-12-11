'use client'
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner'; // Recommended for notifications, install via npm

interface MobileDetectionProps {
  websocketUrl: string; // Backend WebSocket URL
}

const MobileDetection: React.FC<MobileDetectionProps> = ({ websocketUrl }) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [mobileDetected, setMobileDetected] = useState(false);
  const webcamRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Setup webcam
    const setupWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });

        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
          webcamRef.current.play();
        }
      } catch (error) {
        console.error('Webcam access error:', error);
        toast.error('Unable to access webcam');
      }
    };

    // Setup WebSocket
    const setupWebSocket = () => {
      socketRef.current = new WebSocket(websocketUrl);

      socketRef.current.onopen = () => {
        console.log('Mobile detection WebSocket connected');
        setIsDetecting(true);
        toast.success('Mobile detection started');
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.mobile_detected) {
          setMobileDetected(true);
          toast.error('Mobile phone detected! Unfair means identified.', {
            description: `Number of mobiles: ${data.mobile_count}`,
            duration: 5000
          });
        } else {
          setMobileDetected(false);
        }
      };

      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('WebSocket connection failed');
      };

      socketRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsDetecting(false);
      };
    };

    // Image capture and send function
    const captureAndSend = () => {
      if (
        webcamRef.current && 
        canvasRef.current && 
        socketRef.current && 
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Set canvas dimensions to match video
        canvas.width = webcamRef.current.videoWidth;
        canvas.height = webcamRef.current.videoHeight;
        
        // Draw current video frame
        context?.drawImage(webcamRef.current, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64
        const imageBase64 = canvas.toDataURL('image/jpeg');
        
        // Send to backend
        socketRef.current.send(JSON.stringify({ 
          image: imageBase64 
        }));
      }
    };

    // Initial setup
    setupWebcam();
    setupWebSocket();

    // Periodic capture
    const intervalId = setInterval(captureAndSend, 3000); // Every 3 seconds

    // Cleanup
    return () => {
      clearInterval(intervalId);
      
      // Close webcam stream
      if (webcamRef.current) {
        const stream = webcamRef.current.srcObject as MediaStream;
        const tracks = stream?.getTracks();
        tracks?.forEach(track => track.stop());
      }

      // Close WebSocket
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [websocketUrl]);

  return (
    <div className="mobile-detection-container">
      <div className="relative">
        {/* Webcam Video Element */}
        <video 
          ref={webcamRef} 
          className={`w-full max-h-[500px] ${mobileDetected ? 'border-4 border-red-500' : ''}`}
          muted 
          autoPlay 
          playsInline
        />

        {/* Hidden Canvas for Image Capture */}
        <canvas 
          ref={canvasRef} 
          className="hidden" 
        />

        {/* Detection Status Overlay */}
        {isDetecting && (
          <div className="absolute top-4 right-4">
            <div 
              className={`
                px-4 py-2 rounded-full font-bold 
                ${mobileDetected ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}
              `}
            >
              {mobileDetected ? 'Mobile Detected' : 'No Mobile Detected'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileDetection;