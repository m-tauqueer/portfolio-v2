import { Suspense } from 'react'
import { PerspectiveCamera } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { getParticleCount, type SceneQuality } from '../../hooks/useSceneQuality'
import { ParticleField } from './ParticleField'
import { WireGrid } from './WireGrid'

interface CyberSceneProps {
  quality: SceneQuality
}

function SceneContent({ quality }: CyberSceneProps) {
  const particleCount = getParticleCount(quality)

  return (
    <>
      <color attach="background" args={['#040308']} />
      <fog attach="fog" args={['#040308', 18, 55]} />

      <PerspectiveCamera makeDefault position={[0, 3.5, 14]} fov={58} />

      <ambientLight intensity={0.15} />
      <pointLight position={[8, 6, 4]} intensity={1.2} color="#ff6b1a" />
      <pointLight position={[-8, 4, -6]} intensity={0.9} color="#22d3ee" />

      <ParticleField count={particleCount} />
      <WireGrid />

      <EffectComposer multisampling={quality === 'high' ? 4 : 0}>
        <Bloom
          intensity={quality === 'high' ? 0.35 : 0.25}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

export function CyberScene({ quality }: CyberSceneProps) {
  return (
    <Suspense fallback={null}>
      <SceneContent quality={quality} />
    </Suspense>
  )
}
