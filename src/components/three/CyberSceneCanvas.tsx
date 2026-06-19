import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { getDpr, type SceneQuality } from '../../hooks/useSceneQuality'
import { CyberScene } from './CyberScene'

interface CyberSceneCanvasProps {
  quality: SceneQuality
}

export default function CyberSceneCanvas({ quality }: CyberSceneCanvasProps) {
  const dpr = getDpr(quality)
  const [visible, setVisible] = useState(() =>
    typeof document !== 'undefined' ? !document.hidden : true
  )

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  return (
    <Canvas
      className="cyber-scene-canvas"
      dpr={dpr}
      frameloop={visible ? 'always' : 'demand'}
      gl={{
        antialias: quality === 'high',
        alpha: false,
        powerPreference: 'high-performance',
      }}
      camera={{ position: [0, 3.5, 14], fov: 58 }}
    >
      <CyberScene quality={quality} />
    </Canvas>
  )
}
