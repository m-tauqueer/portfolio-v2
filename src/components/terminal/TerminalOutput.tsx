import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { TerminalLine } from '../../commands/types'
import { TerminalLineComponent } from './TerminalLine'

interface TerminalOutputProps {
  lines: TerminalLine[]
}

export function TerminalOutput({ lines }: TerminalOutputProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  return (
    <div className="terminal-output">
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
      <div ref={bottomRef} />
    </div>
  )
}
