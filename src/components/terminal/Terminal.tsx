import { useState, useEffect } from 'react'
import { TitleBar } from './TitleBar'
import { TerminalOutput } from './TerminalOutput'
import { TerminalInput } from './TerminalInput'
import { BootSequence } from './BootSequence'
import { useTerminal } from '../../hooks/useTerminal'
import type { PortfolioData } from '../../types/portfolio'
import type { CommandSideEffect } from '../../commands/result'
import '../../styles/terminal.css'

interface TerminalProps {
  portfolio: PortfolioData | null
  loading: boolean
  source: 'supabase' | 'fallback'
  compact?: boolean
  guiMode?: boolean
  onSideEffect?: (effect: CommandSideEffect) => void
}

export function Terminal({ portfolio, loading, source, compact, guiMode, onSideEffect }: TerminalProps) {
  const [bootDone, setBootDone] = useState(false)
  const { lines, input, setInput, submitCommand, navigateHistory, autocomplete, runCommand } = useTerminal(
    portfolio,
    guiMode ?? false,
    onSideEffect
  )

  const handleSubmit = () => {
    const trimmed = input.trim()
    if (trimmed === 'clear' || trimmed === 'cls') {
      runCommand('clear')
      return
    }
    if (trimmed === 'history') {
      runCommand('history')
      return
    }
    submitCommand()
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [bootDone])

  const systemMessage =
    source === 'fallback' && lines.length === 0 && bootDone && !loading
      ? 'warning: using offline cache'
      : undefined

  return (
    <div className={`terminal-root ${compact ? 'terminal-compact' : ''}`}>
      <div className="terminal-window">
        <TitleBar />
        {!bootDone || loading ? (
          <BootSequence onComplete={() => setBootDone(true)} loading={loading} />
        ) : (
          <>
            <TerminalOutput lines={lines} systemMessage={systemMessage} />
            <TerminalInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              onHistoryUp={() => navigateHistory('up')}
              onHistoryDown={() => navigateHistory('down')}
              onTab={autocomplete}
              disabled={!portfolio}
            />
          </>
        )}
      </div>
    </div>
  )
}
