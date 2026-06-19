import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlitchText } from '../ui/GlitchText'

const NAV_ITEMS = [
  { id: 'about', label: '~/about', short: 'about' },
  { id: 'journey', label: '~/journey', short: 'journey' },
  { id: 'projects', label: '~/projects', short: 'projects' },
  { id: 'contact', label: '~/contact', short: 'contact' },
]

interface TerminalNavProps {
  onNavigate: (id: string) => void
  onOpenTerminal: () => void
  activeSection?: string
}

export function TerminalNav({ onNavigate, onOpenTerminal, activeSection }: TerminalNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNav = (id: string) => {
    onNavigate(id)
    setMenuOpen(false)
  }

  return (
    <>
      <header className="site-nav hud-nav">
        <span className="hud-corner hud-corner--tl" aria-hidden="true" />
        <span className="hud-corner hud-corner--tr" aria-hidden="true" />

        <div className="site-nav-brand">
          <GlitchText as="span" className="site-nav-logo" intensity="low">
            tauqueer@tauq.me
          </GlitchText>
          <span className="site-nav-status">
            <span className="status-dot" />
            engineer.online
          </span>
        </div>

        <nav className="site-nav-links site-nav-links--desktop">
          {NAV_ITEMS.map((item, i) => (
            <motion.button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`terminal-nav-item ${activeSection === item.id ? 'active' : ''}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.05 }}
            >
              {item.label}
            </motion.button>
          ))}
        </nav>

        <div className="site-nav-actions">
          <motion.button
            className="site-nav-terminal-btn site-nav-terminal-btn--desktop"
            onClick={onOpenTerminal}
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,107,26,0.4)' }}
            whileTap={{ scale: 0.98 }}
          >
            [ shell ]
          </motion.button>

          <button
            type="button"
            className="site-nav-terminal-btn site-nav-terminal-btn--mobile"
            onClick={onOpenTerminal}
          >
            [ sh ]
          </button>

          <button
            type="button"
            className="mobile-nav-menu-btn"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
          >
            <GlitchText
              as="span"
              className="mobile-nav-menu-text"
              intensity="low"
            >
              {menuOpen ? '[ close ]' : '[ menu ]'}
            </GlitchText>
          </button>
        </div>
      </header>

      <nav className="mobile-nav-dock hud-dock" aria-label="Section navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleNav(item.id)}
            className={`mobile-dock-item ${activeSection === item.id ? 'active' : ''}`}
          >
            <span className="mobile-dock-label">{item.short}</span>
          </button>
        ))}
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="mobile-nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="mobile-nav-sheet hud-sheet"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <p className="mobile-nav-sheet-title">// navigate</p>
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`mobile-sheet-item ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => handleNav(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
