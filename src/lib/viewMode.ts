export type ViewMode = 'terminal' | 'gui'

export const MOBILE_BREAKPOINT = '(max-width: 1024px)'

export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(MOBILE_BREAKPOINT).matches
}

export function getDefaultViewMode(): ViewMode {
  return isMobileViewport() ? 'gui' : 'terminal'
}
