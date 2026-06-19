import { useEffect, useRef } from 'react'

interface TerminalInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onHistoryUp: () => void
  onHistoryDown: () => void
  onTab: () => void
  disabled?: boolean
  compact?: boolean
}

export function TerminalInput({
  value,
  onChange,
  onSubmit,
  onHistoryUp,
  onHistoryDown,
  onTab,
  disabled,
  compact,
}: TerminalInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!disabled) inputRef.current?.focus()
  }, [disabled])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSubmit()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      onHistoryUp()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      onHistoryDown()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      onTab()
    }
  }

  return (
    <div className="terminal-input-row" onClick={() => inputRef.current?.focus()}>
      <span className="prompt">{compact ? 'tauq:~$' : 'tauqueer@portfolio:~$'}</span>
      <input
        ref={inputRef}
        className="terminal-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label="Terminal input"
      />
      {!disabled && <span className="cursor-blink" />}
    </div>
  )
}
