export interface LinePart {
  text: string
  className?: string
  href?: string
}

export interface TerminalLine {
  id: string
  parts: LinePart[]
  type?: 'input' | 'output' | 'error' | 'success' | 'system'
}

export interface CommandContext {
  args: string[]
  flags: string[]
  portfolio: import('../types/portfolio').PortfolioData
}

export type CommandHandler = (ctx: CommandContext) => TerminalLine[]

export interface Command {
  name: string
  aliases?: string[]
  description: string
  handler: CommandHandler
}
