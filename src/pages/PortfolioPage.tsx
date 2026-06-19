import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { usePortfolio } from '../hooks/usePortfolio'
import { useIntroGate } from '../hooks/useIntroGate'
import { useViewMode } from '../context/ViewModeContext'
import { Terminal } from '../components/terminal/Terminal'
import { TerminalNav } from '../components/layout/TerminalNav'
import { OpenGuiButton } from '../components/layout/OpenGuiButton'
import { IntroSequence } from '../components/intro/IntroSequence'
import { WhoAmISection } from '../components/sections/WhoAmISection'
import { JourneySection } from '../components/sections/JourneySection'
import { ProjectsSection } from '../components/sections/ProjectsSection'
import { ContactSection } from '../components/sections/ContactSection'
import type { CommandSideEffect } from '../commands/result'
import { CyberBackground } from '../components/layout/CyberBackground'
import { NoiseOverlay } from '../components/layout/NoiseOverlay'
import { getDefaultViewMode } from '../lib/viewMode'
import '../styles/sections.css'
import '../styles/cyber.css'
import '../styles/hud.css'

const SECTION_IDS = ['about', 'journey', 'projects', 'contact']

export function PortfolioPage() {
  const { data, loading, source } = usePortfolio()
  const { introDone, completeIntro } = useIntroGate()
  const { mode, openGui, openTerminal, scrollToSection } = useViewMode()
  const [activeSection, setActiveSection] = useState('about')

  const handleIntroComplete = useCallback(() => {
    completeIntro()
    if (getDefaultViewMode() === 'gui') openGui()
    else openTerminal()
  }, [completeIntro, openGui, openTerminal])

  useEffect(() => {
    if (!introDone) return
    if (getDefaultViewMode() === 'gui') openGui()
    else openTerminal()
  }, [introDone, openGui, openTerminal])

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

  useEffect(() => {
    if (!isGui) return

    const observers: IntersectionObserver[] = []

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [isGui, data])

  if (!introDone) {
    return (
      <IntroSequence
        data={data}
        onComplete={handleIntroComplete}
      />
    )
  }

  const terminalProps = {
    portfolio: data,
    loading,
    source,
    guiMode: isGui,
    onSideEffect: handleSideEffect,
  }

  const terminal = (
    <Terminal
      {...terminalProps}
      compact={isGui}
      embedded={isGui}
    />
  )

  return (
    <div className={`portfolio-page ${isGui ? 'gui-mode' : 'terminal-mode'}`}>
      <CyberBackground enabled={introDone} />
      <NoiseOverlay />

      {isGui ? (
        <div className="gui-layout">
          <TerminalNav
            onNavigate={scrollToSection}
            onOpenTerminal={openTerminal}
            activeSection={activeSection}
          />
          <main className="gui-main">
            {data && (
              <>
                <div className="parallax-grid" />
                <WhoAmISection
                  data={data}
                  terminal={
                    <div className="about-terminal-embed">
                      {terminal}
                    </div>
                  }
                />
                <JourneySection data={data} />
                <ProjectsSection data={data} />
                <ContactSection data={data} />
              </>
            )}
          </main>
        </div>
      ) : (
        <motion.div
          className="hero-terminal hero-terminal--fullscreen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          {terminal}
          <OpenGuiButton onClick={openGui} visible={!loading} />
        </motion.div>
      )}
    </div>
  )
}
