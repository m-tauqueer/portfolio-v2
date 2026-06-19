import { lazy, Suspense } from 'react'
import { usePrefersReducedMotion, useSceneQuality } from '../../hooks/useSceneQuality'

const CyberSceneCanvas = lazy(() => import('../three/CyberSceneCanvas'))

function CyberBackgroundFallback() {
  return (
    <>
      <div className="cyber-blob cyber-blob-1" />
      <div className="cyber-blob cyber-blob-2" />
      <div className="cyber-blob cyber-blob-3" />
      <div className="cyber-blob cyber-blob-4" />
    </>
  )
}

interface CyberBackgroundProps {
  /** Lazy-load 3D after intro completes */
  enabled?: boolean
}

export function CyberBackground({ enabled = true }: CyberBackgroundProps) {
  const reducedMotion = usePrefersReducedMotion()
  const quality = useSceneQuality()
  const use3d = enabled && !reducedMotion

  return (
    <div className="cyber-bg" aria-hidden="true">
      {use3d ? (
        <Suspense fallback={<CyberBackgroundFallback />}>
          <CyberSceneCanvas quality={quality} />
        </Suspense>
      ) : (
        <CyberBackgroundFallback />
      )}
    </div>
  )
}
