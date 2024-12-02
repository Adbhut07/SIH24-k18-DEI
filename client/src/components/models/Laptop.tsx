import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Box } from "@react-three/drei"

export function Laptop(props) {
  const laptopRef = useRef()

  return (
    <group {...props} ref={laptopRef}>
      {/* Base */}
      <Box args={[0.6, 0.02, 0.4]} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#C0C0C0" />
      </Box>
      {/* Screen */}
      <Box args={[0.58, 0.35, 0.02]} position={[0, 0.185, -0.19]} rotation={[Math.PI / 6, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#000000" />
      </Box>
      {/* Screen content (simplified) */}
      <Box args={[0.54, 0.31, 0.01]} position={[0, 0.195, -0.18]} rotation={[Math.PI / 6, 0, 0]}>
        <meshBasicMaterial color="#FFFFFF" />
      </Box>
    </group>
  )
}

