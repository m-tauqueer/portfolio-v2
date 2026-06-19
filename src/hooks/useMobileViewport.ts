import { useEffect, useState } from 'react'
import { isMobileViewport, MOBILE_BREAKPOINT } from '../lib/viewMode'

export function useMobileViewport(): boolean {
  const [mobile, setMobile] = useState(isMobileViewport)

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_BREAKPOINT)
    const update = () => setMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return mobile
}
