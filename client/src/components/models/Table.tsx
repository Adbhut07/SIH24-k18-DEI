import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Box } from "@react-three/drei"

export function Table(props) {
  const tableRef = useRef()

  return (
    <group {...props} ref={tableRef}>
      {/* Table top */}
      <Box args={[1.5, 0.05, 1]} position={[0, 0.725, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      {/* Table legs */}
      {[[-0.7, -0.4], [0.7, -0.4], [-0.7, 0.4], [0.7, 0.4]].map((position, index) => (
        <Box key={index} args={[0.1, 1.4, 0.1]} position={[position[0], 0, position[1]]} castShadow receiveShadow>
          <meshStandardMaterial color="#8B4513" />
        </Box>
      ))}
    </group>
  )
}

