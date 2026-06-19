import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const BOOT_LINES = [
  '[ OK ] Initializing tauq.me — netrunner shell v3.0',
  '[ OK ] Identity: Mohammad Tauqueer · Software Engineer · Bangalore',
  '[ OK ] Metacognition uplink — Engram memory channel active',
  '[ OK ] HUD online — cyan grid · orange auth · green output',
  "       Type 'help' · 'projects' · 'open gui' to explore",
]

interface BootSequenceProps {
  onComplete: () => void
  loading?: boolean
}

export function BootSequence({ onComplete, loading }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    if (loading) return

    if (visibleLines < BOOT_LINES.length) {
      const timer = setTimeout(() => setVisibleLines((v) => v + 1), 400)
      return () => clearTimeout(timer)
    }

    const done = setTimeout(onComplete, 500)
    return () => clearTimeout(done)
  }, [visibleLines, loading, onComplete])

  if (loading) {
    return (
      <div className="terminal-output">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="system-line">
          [ .. ] fetching profile from supabase...
        </motion.div>
      </div>
    )
  }

  return (
    <div className="terminal-output">
      {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={line.startsWith('[ OK ]') ? 'boot-ok-line' : 'system-line'}
        >
          {line}
        </motion.div>
      ))}
    </div>
  )
}
