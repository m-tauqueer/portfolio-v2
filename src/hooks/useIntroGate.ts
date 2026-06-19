import { useCallback, useState } from 'react'

const INTRO_SEEN_KEY = 'tauq-intro-seen'

function shouldSkipIntro(): boolean {
  if (typeof window === 'undefined') return true

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true
  }

  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

export function useIntroGate() {
  const [introDone, setIntroDone] = useState(shouldSkipIntro)

  const completeIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, '1')
    } catch {
      /* private browsing */
    }
    setIntroDone(true)
  }, [])

  return { introDone, completeIntro }
}
