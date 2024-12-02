import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Cylinder, Sphere } from "@react-three/drei"

export function FlowerPot(props) {
  const potRef = useRef()

  return (
    <group {...props} ref={potRef}>
      {/* Pot */}
      <Cylinder args={[0.1, 0.08, 0.15, 32]} position={[0, 0.075, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>
      {/* Soil */}
      <Cylinder args={[0.09, 0.09, 0.02, 32]} position={[0, 0.16, 0]}>
        <meshStandardMaterial color="#3B2F2F" />
      </Cylinder>
      {/* Flower stem */}
      <Cylinder args={[0.005, 0.005, 0.2, 8]} position={[0, 0.26, 0]} castShadow>
        <meshStandardMaterial color="#228B22" />
      </Cylinder>
      {/* Flower */}
      <Sphere args={[0.05, 16, 16]} position={[0, 0.36, 0]} castShadow>
        <meshStandardMaterial color="#FF69B4" />
      </Sphere>
    </group>
  )
}

