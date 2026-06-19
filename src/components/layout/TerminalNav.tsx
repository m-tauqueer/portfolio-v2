import { motion } from 'framer-motion'
import { GlitchText } from '../ui/GlitchText'

const NAV_ITEMS = [
  { id: 'about', label: '~/about' },
  { id: 'journey', label: '~/journey' },
  { id: 'projects', label: '~/projects' },
  { id: 'contact', label: '~/contact' },
]

interface TerminalNavProps {
  onNavigate: (id: string) => void
  onOpenTerminal: () => void
  activeSection?: string
}

export function TerminalNav({ onNavigate, onOpenTerminal, activeSection }: TerminalNavProps) {
  return (
    <header className="site-nav">
      <div className="site-nav-brand">
        <GlitchText as="span" className="site-nav-logo" intensity="low">
          tauqueer@tauq.me
        </GlitchText>
        <span className="site-nav-status">
          <span className="status-dot" />
          online
        </span>
      </div>

      <nav className="site-nav-links">
        {NAV_ITEMS.map((item, i) => (
          <motion.button
            key={item.id}
            onClick={() => onNavigate(item.id)}
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

      <motion.button
        className="site-nav-terminal-btn"
        onClick={onOpenTerminal}
        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,107,26,0.4)' }}
        whileTap={{ scale: 0.98 }}
      >
        [ fullscreen ]
      </motion.button>
    </header>
  )
}
