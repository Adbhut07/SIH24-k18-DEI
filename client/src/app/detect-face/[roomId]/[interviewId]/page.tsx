'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as faceapi from 'face-api.js'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { useAppSelector } from '@/lib/store/hooks'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Camera, Repeat, CheckCircle2 } from 'lucide-react'

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

const FaceRecognition = () => {
  const [isSamePerson, setIsSamePerson] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [detectionDone, setDetectionDone] = useState(false)
  const [firstImage, setFirstImage] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [showWebcam, setShowWebcam] = useState(true)

  const {roomId, interviewId} = useParams()
  
  const image1Ref = useRef<HTMLImageElement>(null)
  const image2Ref = useRef<HTMLImageElement>(null)
  const webcamRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const user = useAppSelector((state) => state.user)
  const router = useRouter()

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
      ])
      setLoading(false)
    }

    const initializeWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 }
        })
        
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream
          webcamRef.current.onloadedmetadata = () => {
            if (canvasRef.current && webcamRef.current) {
              canvasRef.current.width = webcamRef.current.videoWidth
              canvasRef.current.height = webcamRef.current.videoHeight
            }
            setVideoReady(true)
          }
        }
      } catch (error) {
        console.error('Webcam access error:', error)
      }
    }

    loadModels()
    fetchFirstImage()
    initializeWebcam()
  }, [])

  const fetchFirstImage = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/userProfile/${user.email}`)
      setFirstImage(response?.data?.data?.image)
    } catch (error) {
      console.error('Error fetching first image:', error)
    }
  }

  const captureImageFromWebcam = () => {
    if (!videoReady || !webcamRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    if (context && webcamRef.current) {
      context.drawImage(webcamRef.current, 0, 0, canvas.width, canvas.height)
    
      createImageBitmap(canvas).then(() => {
        const capturedImageUrl = canvas.toDataURL('image/jpeg')
        setCapturedImage(capturedImageUrl)
        
        if (image2Ref.current) {
          image2Ref.current.src = capturedImageUrl
        }

        // Stop the webcam stream and hide the video element
        const stream = webcamRef.current.srcObject as MediaStream
        const tracks = stream.getTracks()
        tracks.forEach(track => track.stop())
        setShowWebcam(false)
      })
    }
  }

  const compareFaces = async () => {
    try {
      if (!firstImage || !capturedImage) return

      const img1 = await loadImage(firstImage)
      const img2 = await loadImage(capturedImage)
  
      const detections1 = await faceapi.detectSingleFace(img1).withFaceLandmarks().withFaceDescriptor()
      const detections2 = await faceapi.detectSingleFace(img2).withFaceLandmarks().withFaceDescriptor()
  
      if (detections1 && detections2) {
        const distance = faceapi.euclideanDistance(detections1.descriptor, detections2.descriptor)
        console.log("Distance between faces:", distance)
        const isMatch = distance < 0.4
        setIsSamePerson(isMatch)
        
        if (isMatch) {
          // Navigate to the success page if faces match
          router.push(`/candidate-interview/${roomId}/${interviewId}`)
        }
      } else {
        console.log("Face detection failed for one or both images.")
        setIsSamePerson(null)
      }
    } catch (error) {
      console.error("Face comparison error:", error)
      setIsSamePerson(null)
    }
    setDetectionDone(true)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Face Recognition</CardTitle>
        <CardDescription>Verify your identity by comparing your face with the stored image</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading models...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Stored Image</h3>
                {firstImage ? (
                  <img 
                    ref={image1Ref} 
                    src={firstImage} 
                    crossOrigin="anonymous"
                    alt="Stored Face" 
                    className="w-full h-auto border rounded-md" 
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">Loading stored image...</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">
                  {showWebcam ? "Webcam" : "Captured Image"}
                </h3>
                {showWebcam ? (
                  <video 
                    ref={webcamRef} 
                    autoPlay 
                    muted 
                    className="w-full h-auto border rounded-md"
                  />
                ) : capturedImage ? (
                  <img 
                    ref={image2Ref} 
                    src={capturedImage} 
                    crossOrigin="anonymous"
                    alt="Captured Face" 
                    className="w-full h-auto border rounded-md" 
                  />
                ) : null}
                <canvas 
                  ref={canvasRef} 
                  style={{ display: 'none' }} 
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {showWebcam && (
                <Button 
                  onClick={captureImageFromWebcam} 
                  disabled={!videoReady}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Capture Photo
                </Button>
              )}
              <Button 
                onClick={compareFaces} 
                disabled={!capturedImage}
                variant="secondary"
              >
                <Repeat className="w-4 h-4 mr-2" />
                Compare Faces
              </Button>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Photo Guidelines</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li>Ensure good lighting on your face</li>
                  <li>Remove glasses or any face coverings</li>
                  <li>Sit straight and look directly at the camera</li>
                  <li>Keep a neutral expression</li>
                  <li>Ensure your full face is visible in the frame</li>
                </ul>
              </AlertDescription>
            </Alert>

            {detectionDone && isSamePerson !== true && (
              <Alert className="mt-4" variant={isSamePerson === false ? "destructive" : "default"}>
                <AlertTitle>{isSamePerson === false ? "Verification Failed" : "Verification Error"}</AlertTitle>
                <AlertDescription>
                  {isSamePerson === false && "The captured image does not match the stored image."}
                  {isSamePerson === null && "Unable to detect or compare faces. Please try again."}
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default FaceRecognition

