'use client'

import MobileDetection from "@/components/objDetection/MobileDetection";

export default function InterviewPage() {
  return (
    <div>
      <h1>Interview Monitoring</h1>
      <MobileDetection 
        websocketUrl="ws://localhost:8000/detect-mobile" 
      />
    </div>
  );
}