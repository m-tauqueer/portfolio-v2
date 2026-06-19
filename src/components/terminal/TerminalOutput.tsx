import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { TerminalLine } from '../../commands/types'
import { TerminalLineComponent } from './TerminalLine'

interface TerminalOutputProps {
  lines: TerminalLine[]
  systemMessage?: string
}

export function TerminalOutput({ lines, systemMessage }: TerminalOutputProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [lines, systemMessage])

  return (
    <div ref={containerRef} className="terminal-output">
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
