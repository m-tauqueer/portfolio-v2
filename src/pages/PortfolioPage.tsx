import { useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { usePortfolio } from '../hooks/usePortfolio'
import { useViewMode } from '../context/ViewModeContext'
import { Terminal } from '../components/terminal/Terminal'
import { TerminalNav } from '../components/layout/TerminalNav'
import { OpenGuiButton } from '../components/layout/OpenGuiButton'
import { WhoAmISection } from '../components/sections/WhoAmISection'
import { JourneySection } from '../components/sections/JourneySection'
import { ProjectsSection } from '../components/sections/ProjectsSection'
import { ContactSection } from '../components/sections/ContactSection'
import type { CommandSideEffect } from '../commands/result'
import '../styles/sections.css'

export function PortfolioPage() {
  const { data, loading, source } = usePortfolio()
  const { mode, openGui, openTerminal, scrollToSection } = useViewMode()

  const handleSideEffect = useCallback((effect: CommandSideEffect) => {
    if (effect.type === 'mode') {
      if (effect.mode === 'gui') openGui()
      else openTerminal()
    } else if (effect.type === 'scroll') {
      scrollToSection(effect.section)
    }
  }, [openGui, openTerminal, scrollToSection])

  const isGui = mode === 'gui'

  useEffect(() => {
    if (!isGui) {
      window.scrollTo(0, 0)
    }
  }, [isGui])

  return (
    <div className={`portfolio-page ${isGui ? 'gui-mode' : 'terminal-mode'}`}>
      <motion.div
        className="hero-terminal"
        initial={false}
        animate={{
          height: isGui ? 'min(45vh, 420px)' : '100dvh',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 28 }}
      >
        <Terminal
          portfolio={data}
          loading={loading}
          source={source}
          compact={isGui}
          guiMode={isGui}
          onSideEffect={handleSideEffect}
        />
        <OpenGuiButton onClick={openGui} visible={!isGui && !loading} />
        {isGui && <TerminalNav onNavigate={scrollToSection} />}
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          opacity: isGui ? 1 : 0,
          pointerEvents: isGui ? 'auto' : 'none',
        }}
        transition={{ duration: 0.4, delay: isGui ? 0.2 : 0 }}
        className="scroll-sections"
      >
        {data && (
          <>
            <div className="parallax-grid" />
            <WhoAmISection data={data} />
            <JourneySection data={data} />
            <ProjectsSection data={data} />
            <ContactSection data={data} />
          </>
        )}
      </motion.div>
    </div>
  )
}
