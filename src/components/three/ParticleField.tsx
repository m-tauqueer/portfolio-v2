import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleFieldProps {
  count: number
}

export function ParticleField({ count }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const orange = new THREE.Color('#ff6b1a')
    const cyan = new THREE.Color('#22d3ee')
    const violet = new THREE.Color('#8b5cf6')

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 48
      positions[i3 + 1] = (Math.random() - 0.5) * 28
      positions[i3 + 2] = (Math.random() - 0.5) * 48

      const roll = Math.random()
      const color = roll < 0.45 ? orange : roll < 0.85 ? cyan : violet
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }

    return { positions, colors }
  }, [count])

  useFrame(({ clock }) => {
    const points = pointsRef.current
    if (!points) return

    const t = clock.elapsedTime
    points.rotation.y = t * 0.018
    points.rotation.x = Math.sin(t * 0.08) * 0.04
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
