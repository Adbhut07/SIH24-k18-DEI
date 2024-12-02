import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Box } from "@react-three/drei"

export function Documents(props) {
  const docsRef = useRef()

  return (
    <group {...props} ref={docsRef}>
      {/* Stack of papers */}
      <Box args={[0.21, 0.02, 0.297]} position={[0, 0.01, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#F5F5F5" />
      </Box>
      {/* Single paper slightly offset */}
      <Box args={[0.21, 0.001, 0.297]} position={[0.01, 0.021, 0.01]} rotation={[0, 0.1, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#FFFFFF" />
      </Box>
    </group>
  )
}

