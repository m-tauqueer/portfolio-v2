import { useState, useCallback } from 'react'
import type { TerminalLine } from '../commands/types'
import type { PortfolioData } from '../types/portfolio'
import { executeCommand, getAutocomplete } from '../commands'

const PROMPT = 'tauqueer@portfolio:~$'

function makeInputLine(command: string): TerminalLine {
  return {
    id: crypto.randomUUID(),
    parts: [
      { text: `${PROMPT} `, className: 'text-[#ff8c00]' },
      { text: command, className: 'command-text text-[#00ff41]' },
    ],
    type: 'input',
  }
}

export function useTerminal(portfolio: PortfolioData | null) {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const submitCommand = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed || !portfolio) return

    const inputLine = makeInputLine(trimmed)
    const outputLines = executeCommand(trimmed, portfolio)

    setLines((prev) => [...prev, inputLine, ...outputLines])
    setHistory((prev) => [...prev, trimmed])
    setHistoryIndex(-1)
    setInput('')
  }, [input, portfolio])

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
        { id: crypto.randomUUID(), parts: [{ text: 'No commands in history.', className: 'text-[#008f11]' }], type: 'output' },
      ])
      return
    }
    const outputLines: TerminalLine[] = history.map((cmd, i) => ({
      id: crypto.randomUUID(),
      parts: [{ text: `  ${i + 1}  ${cmd}`, className: 'text-[#00ff41]' }],
      type: 'output' as const,
    }))
    setLines((prev) => [...prev, makeInputLine('history'), ...outputLines])
  }, [history])

  const runCommand = useCallback((cmd: string) => {
    if (!portfolio) return
    setInput(cmd)
    const inputLine = makeInputLine(cmd)
    const outputLines = cmd === 'clear'
      ? []
      : cmd === 'history'
        ? []
        : executeCommand(cmd, portfolio)

    if (cmd === 'clear') {
      setLines([])
      setInput('')
      return
    }

    if (cmd === 'history') {
      showHistory()
      setInput('')
      return
    }

    setLines((prev) => [...prev, inputLine, ...outputLines])
    setHistory((prev) => [...prev, cmd])
    setInput('')
  }, [portfolio, showHistory])

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
