import type { CommandContext, TerminalLine } from './types'

function line(parts: TerminalLine['parts']): TerminalLine {
  return { id: crypto.randomUUID(), parts, type: 'output' }
}

export function whoamiCommand(ctx: CommandContext): TerminalLine[] {
  const { profile } = ctx.portfolio
  return [
    line([
      { text: profile.name, className: 'text-[#ff8c00]' },
      { text: ` — ${profile.title}`, className: 'text-[#00ff41]' },
    ]),
  ]
}

export function aboutCommand(ctx: CommandContext): TerminalLine[] {
  const { profile } = ctx.portfolio
  return [
    line([{ text: profile.bio, className: 'text-[#00ff41]' }]),
    line([{ text: '\nInterests:', className: 'text-[#ff8c00]' }]),
    line([{ text: `  ${profile.interests.join(' · ')}`, className: 'text-[#008f11]' }]),
  ]
}
