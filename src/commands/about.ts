import type { CommandContext, TerminalLine } from './types'

function line(parts: TerminalLine['parts']): TerminalLine {
  return { id: crypto.randomUUID(), parts, type: 'output' }
}

export function whoamiCommand(ctx: CommandContext): TerminalLine[] {
  const { profile } = ctx.portfolio
  return [
    line([
      { text: profile.name, className: 't-orange' },
      { text: ` — ${profile.title}`, className: 't-green' },
    ]),
  ]
}

export function aboutCommand(ctx: CommandContext): TerminalLine[] {
  const { profile } = ctx.portfolio
  return [
    line([{ text: profile.bio, className: 't-green' }]),
    line([{ text: '\nInterests:', className: 't-orange' }]),
    line([{ text: `  ${profile.interests.join(' · ')}`, className: 't-dim' }]),
  ]
}
