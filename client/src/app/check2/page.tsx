'use client'
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { useAppSelector } from '@/lib/store/hooks';

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

const FaceRecognition = () => {
  const [isSamePerson, setIsSamePerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detectionDone, setDetectionDone] = useState(false);
  const [firstImage, setFirstImage] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [videoReady, setVideoReady] = useState(false);
  
  const image1Ref = useRef(null);
  const image2Ref = useRef(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ]);
      setLoading(false);
    };

    const initializeWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
          webcamRef.current.onloadedmetadata = () => {
            if (canvasRef.current && webcamRef.current) {
              canvasRef.current.width = webcamRef.current.videoWidth;
              canvasRef.current.height = webcamRef.current.videoHeight;
            }
            setVideoReady(true);
          };
        }
      } catch (error) {
        console.error('Webcam access error:', error);
      }
    };

    loadModels();
    fetchFirstImage();
    initializeWebcam();
  }, []);

  const fetchFirstImage = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/userProfile/${user.email}`);
      setFirstImage(response?.data?.data?.image);
    } catch (error) {
      console.error('Error fetching first image:', error);
    }
  };

  const captureImageFromWebcam = () => {
    if (!videoReady || !webcamRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    context.drawImage(webcamRef.current, 0, 0, canvas.width, canvas.height);
    
    // Use createImageBitmap to avoid CORS issues
    createImageBitmap(canvas).then(imageBitmap => {
      const capturedImageUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(capturedImageUrl);
      
      if (image2Ref.current) {
        image2Ref.current.src = capturedImageUrl;
      }
    });
  };

  const compareFaces = async () => {
    try {
      const img1 = await loadImage(firstImage);
      const img2 = await loadImage(capturedImage);

      const detections1 = await faceapi.detectSingleFace(img1).withFaceLandmarks().withFaceDescriptor();
      const detections2 = await faceapi.detectSingleFace(img2).withFaceLandmarks().withFaceDescriptor();

      if (detections1 && detections2) {
        const distance = faceapi.euclideanDistance(detections1.descriptor, detections2.descriptor);
        setIsSamePerson(distance < 0.6);
      } else {
        setIsSamePerson(null);
      }
    } catch (error) {
      console.error('Face comparison error:', error);
      setIsSamePerson(null);
    }

    setDetectionDone(true);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Face Recognition</h2>
      
      {loading ? (
        <p>Loading models...</p>
      ) : (
        <>
          <div className="flex space-x-4">
            <div>
              <h3>Database Image</h3>
              {firstImage ? (
                <img 
                  ref={image1Ref} 
                  src={firstImage} 
                  crossOrigin="anonymous"
                  alt="First Face" 
                  className="max-w-[200px] border-2 border-gray-300" 
                />
              ) : (
                <p>Loading first image...</p>
              )}
            </div>

            <div>
              <h3>Webcam</h3>
              <video 
                ref={webcamRef} 
                autoPlay 
                muted 
                className="max-w-[200px] border-2 border-gray-300"
              />
              <canvas 
                ref={canvasRef} 
                style={{ display: 'none' }} 
              />
            </div>
          </div>

          {capturedImage && (
            <div>
              <h3>Captured Image</h3>
              <img 
                ref={image2Ref} 
                src={capturedImage} 
                crossOrigin="anonymous"
                alt="Captured Face" 
                className="max-w-[200px] border-2 border-gray-300" 
              />
            </div>
          )}

          <div className="space-x-2">
            <button 
              onClick={captureImageFromWebcam} 
              disabled={!videoReady}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Capture Photo
            </button>
            <button 
              onClick={compareFaces} 
              disabled={!capturedImage}
              className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Compare Faces
            </button>
          </div>

          {detectionDone && (
            <div className="mt-4">
              {isSamePerson === true && (
                <h3 className="text-green-600 font-bold">Images are of the same person!</h3>
              )}
              {isSamePerson === false && (
                <h3 className="text-red-600 font-bold">Images are of different people.</h3>
              )}
              {isSamePerson === null && (
                <h3 className="text-yellow-600">Unable to detect faces or compare.</h3>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FaceRecognition;