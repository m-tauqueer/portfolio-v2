import type { CommandContext, TerminalLine } from './types'

function line(parts: TerminalLine['parts']): TerminalLine {
  return { id: crypto.randomUUID(), parts, type: 'output' }
}

export function educationCommand(ctx: CommandContext): TerminalLine[] {
  return [
    line([{ text: 'Education', className: 'text-[#ff8c00] font-bold' }]),
    line([{ text: '─'.repeat(50), className: 'text-[#008f11]' }]),
    ...ctx.portfolio.education.flatMap((edu) => [
      line([
        { text: edu.degree, className: 'text-[#ff8c00]' },
        { text: ` @ ${edu.school}`, className: 'text-[#00ff41]' },
      ]),
      line([{ text: `  ${edu.duration}`, className: 'text-[#008f11]' }]),
      ...(edu.description
        ? [line([{ text: `  ${edu.description}`, className: 'text-[#00ff41]/80' }])]
        : []),
      line([{ text: '', className: '' }]),
    ]),
  ]
}
