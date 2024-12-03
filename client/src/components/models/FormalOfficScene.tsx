// components/scene/FormalOfficeScene.js
"use client"

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { Table } from "@/components/models/Table";
import { Chair } from "@/components/models/Chair";
import { Laptop } from "@/components/models/Laptop";
import { FlowerPot } from "@/components/models/FlowerPot";
import { Documents } from "@/components/models/Documents";

export default function FormalOfficeScene() {
  return (
    <div className="w-full h-screen bg-gray-100">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 2, 5]} />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} minDistance={3} maxDistance={8} />
        
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[2.5, 8, 5]}
          intensity={1.5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Table position={[0, -0.5, 0]} />
        <Chair position={[0, -0.5, 0.75]} rotation={[0, Math.PI, 0]} />
        <Laptop position={[0, 0.41, -0.2]} rotation={[0, Math.PI, 0]} />
        <FlowerPot position={[0.5, 0.41, -0.3]} scale={0.8} />
        <Documents position={[-0.5, 0.41, -0.1]} rotation={[0, -0.2, 0]} />

        <Environment preset="city" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.4} />
        </mesh>
      </Canvas>
    </div>
  );
}
