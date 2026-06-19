import { useReducedMotion } from '../../hooks/useReducedMotion'

export function NoiseOverlay() {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) return null

  return <div className="noise-overlay" aria-hidden="true" />
}
