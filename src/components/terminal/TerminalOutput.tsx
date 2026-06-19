import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { TerminalLine } from '../../commands/types'
import { TerminalLineComponent } from './TerminalLine'
import { TerminalWelcome } from './TerminalWelcome'
import type { PortfolioData } from '../../types/portfolio'
import { useScrollChain } from '../../hooks/useScrollChain'

interface TerminalOutputProps {
  lines: TerminalLine[]
  systemMessage?: string
  portfolio?: PortfolioData | null
  embedded?: boolean
  guiMode?: boolean
  showWelcome?: boolean
}

export function TerminalOutput({ lines, systemMessage, portfolio, embedded, guiMode, showWelcome }: TerminalOutputProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollable, setScrollable] = useState(false)

  useScrollChain(containerRef, Boolean(embedded))

  useEffect(() => {
    const el = containerRef.current
    if (!embedded || !el) return

    const check = () => {
      setScrollable(el.scrollHeight > el.clientHeight + 2)
    }

    check()
    const observer = new ResizeObserver(check)
    observer.observe(el)
    return () => observer.disconnect()
  }, [embedded, lines, showWelcome, systemMessage])

  useEffect(() => {
    const el = containerRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [lines, systemMessage])

  return (
    <div
      ref={containerRef}
      className={`terminal-output ${embedded ? 'terminal-output--embedded' : ''} ${embedded && !scrollable ? 'terminal-output--no-inner-scroll' : ''}`}
    >
      {showWelcome && portfolio && (
        <TerminalWelcome portfolio={portfolio} embedded={embedded} guiMode={guiMode} />
      )}
      {systemMessage && (
        <div className="system-line">{systemMessage}</div>
      )}
      {lines.map((line, index) => (
        <motion.div
          key={line.id}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.08, delay: Math.min(index * 0.01, 0.3) }}
        >
          <TerminalLineComponent line={line} />
        </motion.div>
      ))}
    </div>
  )
}
