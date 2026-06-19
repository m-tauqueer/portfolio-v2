import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

export type ViewMode = 'terminal' | 'gui'

interface ViewModeContextValue {
  mode: ViewMode
  setMode: (mode: ViewMode) => void
  openGui: () => void
  openTerminal: () => void
  scrollToSection: (id: string) => void
}

const ViewModeContext = createContext<ViewModeContextValue | null>(null)

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ViewMode>('terminal')

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const navHeight = 64
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  const openGui = useCallback(() => {
    setMode('gui')
    document.body.style.overflow = 'auto'
  }, [])

  const openTerminal = useCallback(() => {
    setMode('terminal')
    document.body.style.overflow = 'hidden'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    document.body.style.overflow = mode === 'terminal' ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = ''
    }
  }, [mode])

  return (
    <ViewModeContext.Provider value={{ mode, setMode, openGui, openTerminal, scrollToSection }}>
      {children}
    </ViewModeContext.Provider>
  )
}

export function useViewMode() {
  const ctx = useContext(ViewModeContext)
  if (!ctx) throw new Error('useViewMode must be used within ViewModeProvider')
  return ctx
}
