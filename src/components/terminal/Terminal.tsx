import { useState } from 'react'
import { TitleBar } from './TitleBar'
import { TerminalOutput } from './TerminalOutput'
import { TerminalInput } from './TerminalInput'
import { BootSequence } from './BootSequence'
import { useTerminal } from '../../hooks/useTerminal'
import type { PortfolioData } from '../../types/portfolio'
import '../../styles/terminal.css'

interface TerminalProps {
  portfolio: PortfolioData | null
  loading: boolean
  source: 'supabase' | 'fallback'
}

export function Terminal({ portfolio, loading, source }: TerminalProps) {
  const [bootDone, setBootDone] = useState(false)
  const { lines, input, setInput, submitCommand, navigateHistory, autocomplete, runCommand } = useTerminal(portfolio)

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

  return (
    <div className="terminal-root">
      <div className="terminal-window">
        <TitleBar />
        {!bootDone || loading ? (
          <BootSequence onComplete={() => setBootDone(true)} loading={loading} />
        ) : (
          <>
            {source === 'fallback' && lines.length === 0 && (
              <div className="terminal-output">
                <div className="system-line">warning: using offline cache</div>
              </div>
            )}
            <TerminalOutput lines={lines} />
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
