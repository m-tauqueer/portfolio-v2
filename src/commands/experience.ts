import type { CommandContext, TerminalLine } from './types'

function line(parts: TerminalLine['parts']): TerminalLine {
  return { id: crypto.randomUUID(), parts, type: 'output' }
}

export function experienceCommand(ctx: CommandContext): TerminalLine[] {
  return [
    line([{ text: 'Experience', className: 't-orange font-bold' }]),
    line([{ text: '─'.repeat(50), className: 't-dim' }]),
    ...ctx.portfolio.experience.flatMap((exp) => [
      line([
        { text: exp.role, className: 't-orange' },
        { text: ` @ ${exp.company}`, className: 't-green' },
      ]),
      line([{ text: `  ${exp.duration}`, className: 't-dim' }]),
      ...(exp.description
        ? [line([{ text: `  ${exp.description}`, className: 't-green opacity-80' }])]
        : []),
      line([{ text: '', className: '' }]),
    ]),
  ]
}
