// app/page.js or app/scene/page.js (depending on your structure)
'use client'
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the FormalOfficeScene component and disable SSR
const FormalOfficeScene = dynamic(() => import('@/components/models/FormalOfficScene'), {
  ssr: false,  // This will disable server-side rendering for the 3D scene
});

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading 3D Scene...</div>}>
      <FormalOfficeScene />
    </Suspense>
  );
}
