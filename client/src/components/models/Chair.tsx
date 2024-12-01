import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Box, Cylinder } from "@react-three/drei"

export function Chair(props) {
  const chairRef = useRef()

  return (
    <group {...props} ref={chairRef}>
      {/* Seat */}
      <Box args={[0.6, 0.1, 0.6]} position={[0, 0.45, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#4A4A4A" />
      </Box>
      {/* Back */}
      <Box args={[0.6, 0.6, 0.1]} position={[0, 0.8, -0.25]} castShadow receiveShadow>
        <meshStandardMaterial color="#4A4A4A" />
      </Box>
      {/* Legs */}
      {[[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]].map((position, index) => (
        <Cylinder key={index} args={[0.05, 0.05, 0.5]} position={[position[0], 0.2, position[1]]} castShadow receiveShadow>
          <meshStandardMaterial color="#1A1A1A" />
        </Cylinder>
      ))}
    </group>
  )
}

