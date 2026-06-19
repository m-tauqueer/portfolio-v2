import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Grid } from '@react-three/drei'
import type { Group } from 'three'

export function WireGrid() {
  const groupRef = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = -5 + Math.sin(clock.elapsedTime * 0.15) * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      <Grid
        infiniteGrid
        cellSize={0.55}
        sectionSize={3.3}
        cellColor="#22d3ee"
        sectionColor="#ff6b1a"
        cellThickness={0.45}
        sectionThickness={0.9}
        fadeDistance={38}
        fadeStrength={1.4}
        position={[0, -5, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  )
}
