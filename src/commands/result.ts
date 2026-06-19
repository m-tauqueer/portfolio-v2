import type { TerminalLine } from './types'

export type CommandSideEffect =
  | { type: 'mode'; mode: 'gui' | 'terminal' }
  | { type: 'scroll'; section: string }

export interface CommandResult {
  lines: TerminalLine[]
  sideEffect?: CommandSideEffect
}
