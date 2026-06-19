import { useEffect, useState } from 'react'

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setReduced(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}

export type SceneQuality = 'high' | 'low'

export function useSceneQuality(): SceneQuality {
  const [quality, setQuality] = useState<SceneQuality>(() => {
    if (typeof window === 'undefined') return 'high'
    return window.innerWidth < 768 ? 'low' : 'high'
  })

  useEffect(() => {
    const update = () => setQuality(window.innerWidth < 768 ? 'low' : 'high')
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return quality
}

export function getParticleCount(quality: SceneQuality): number {
  return quality === 'high' ? 1800 : 700
}

export function getDpr(quality: SceneQuality): [number, number] {
  return quality === 'high' ? [1, 2] : [1, 1.5]
}
