import type { TerminalLine } from '../../commands/types'

interface TerminalLineProps {
  line: TerminalLine
}

export function TerminalLineComponent({ line }: TerminalLineProps) {
  const className = line.type === 'error'
    ? 'terminal-line error-line'
    : line.type === 'success'
      ? 'terminal-line success-line'
      : line.type === 'system'
        ? 'terminal-line system-line'
        : line.type === 'input'
          ? 'terminal-line input-line'
          : 'terminal-line'

  return (
    <div className={className}>
      {line.parts.map((part, i) =>
        part.href ? (
          <a key={i} href={part.href} target="_blank" rel="noopener noreferrer" className={part.className}>
            {part.text}
          </a>
        ) : (
          <span key={i} className={part.className}>{part.text}</span>
        )
      )}
    </div>
  )
}
