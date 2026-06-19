import type { CommandContext, TerminalLine } from './types'

function line(parts: TerminalLine['parts']): TerminalLine {
  return { id: crypto.randomUUID(), parts, type: 'output' }
}

export function experienceCommand(ctx: CommandContext): TerminalLine[] {
  return [
    line([{ text: 'Experience', className: 'text-[#ff8c00] font-bold' }]),
    line([{ text: '─'.repeat(50), className: 'text-[#008f11]' }]),
    ...ctx.portfolio.experience.flatMap((exp) => [
      line([
        { text: exp.role, className: 'text-[#ff8c00]' },
        { text: ` @ ${exp.company}`, className: 'text-[#00ff41]' },
      ]),
      line([{ text: `  ${exp.duration}`, className: 'text-[#008f11]' }]),
      ...(exp.description
        ? [line([{ text: `  ${exp.description}`, className: 'text-[#00ff41]/80' }])]
        : []),
      line([{ text: '', className: '' }]),
    ]),
  ]
}
