import { useState, useCallback } from 'react'
import type { TerminalLine } from '../commands/types'
import type { PortfolioData } from '../types/portfolio'
import { executeCommand, getAutocomplete } from '../commands'
import type { CommandSideEffect } from '../commands/result'

const PROMPT = 'tauqueer@portfolio:~$'

function makeInputLine(command: string): TerminalLine {
  return {
    id: crypto.randomUUID(),
    parts: [
      { text: `${PROMPT} `, className: 't-orange' },
      { text: command, className: 'command-text t-green' },
    ],
    type: 'input',
  }
}

export function useTerminal(
  portfolio: PortfolioData | null,
  guiMode = false,
  onSideEffect?: (effect: CommandSideEffect) => void
) {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const processCommand = useCallback((trimmed: string) => {
    if (!trimmed || !portfolio) return

    const inputLine = makeInputLine(trimmed)
    const { lines: outputLines, sideEffect } = executeCommand(trimmed, portfolio, guiMode)

    setLines((prev) => [...prev, inputLine, ...outputLines])
    setHistory((prev) => [...prev, trimmed])
    setHistoryIndex(-1)
    setInput('')

    if (sideEffect) onSideEffect?.(sideEffect)
  }, [portfolio, guiMode, onSideEffect])

  const submitCommand = useCallback(() => {
    processCommand(input.trim())
  }, [input, processCommand])

  const clear = useCallback(() => setLines([]), [])

  const navigateHistory = useCallback((direction: 'up' | 'down') => {
    if (history.length === 0) return

    if (direction === 'up') {
      const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex
      setHistoryIndex(newIndex)
      setInput(history[history.length - 1 - newIndex] ?? '')
    } else {
      const newIndex = historyIndex > 0 ? historyIndex - 1 : -1
      setHistoryIndex(newIndex)
      setInput(newIndex === -1 ? '' : history[history.length - 1 - newIndex] ?? '')
    }
  }, [history, historyIndex])

  const autocomplete = useCallback(() => {
    const match = getAutocomplete(input)
    if (match) setInput(match)
  }, [input])

  const showHistory = useCallback(() => {
    if (history.length === 0) {
      setLines((prev) => [
        ...prev,
        makeInputLine('history'),
        { id: crypto.randomUUID(), parts: [{ text: 'No commands in history.', className: 't-dim' }], type: 'output' },
      ])
      return
    }
    const outputLines: TerminalLine[] = history.map((cmd, i) => ({
      id: crypto.randomUUID(),
      parts: [{ text: `  ${i + 1}  ${cmd}`, className: 't-green' }],
      type: 'output' as const,
    }))
    setLines((prev) => [...prev, makeInputLine('history'), ...outputLines])
  }, [history])

  const runCommand = useCallback((cmd: string) => {
    if (!portfolio) return

    if (cmd === 'clear') {
      setLines([
        {
          id: crypto.randomUUID(),
          parts: [{ text: 'session cleared — type help for available commands', className: 't-dim' }],
          type: 'system',
        },
      ])
      setInput('')
      return
    }

    if (cmd === 'history') {
      showHistory()
      setInput('')
      return
    }

    processCommand(cmd)
  }, [portfolio, showHistory, processCommand])

  return {
    lines,
    input,
    setInput,
    submitCommand,
    clear,
    navigateHistory,
    autocomplete,
    runCommand,
  }
}
