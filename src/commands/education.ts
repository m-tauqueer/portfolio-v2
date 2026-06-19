import type { CommandContext, TerminalLine } from './types'

function line(parts: TerminalLine['parts']): TerminalLine {
  return { id: crypto.randomUUID(), parts, type: 'output' }
}

export function educationCommand(ctx: CommandContext): TerminalLine[] {
  return [
    line([{ text: 'Education', className: 't-orange font-bold' }]),
    line([{ text: '─'.repeat(50), className: 't-dim' }]),
    ...ctx.portfolio.education.flatMap((edu) => [
      line([
        { text: edu.degree, className: 't-orange' },
        { text: ` @ ${edu.school}`, className: 't-green' },
      ]),
      line([{ text: `  ${edu.duration}`, className: 't-dim' }]),
      ...(edu.description
        ? [line([{ text: `  ${edu.description}`, className: 't-green opacity-80' }])]
        : []),
      line([{ text: '', className: '' }]),
    ]),
  ]
}
