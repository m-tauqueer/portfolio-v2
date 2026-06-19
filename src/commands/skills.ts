import type { CommandContext, TerminalLine } from './types'

function line(parts: TerminalLine['parts']): TerminalLine {
  return { id: crypto.randomUUID(), parts, type: 'output' }
}

export function skillsCommand(ctx: CommandContext): TerminalLine[] {
  return [
    line([{ text: 'Skills & Technologies', className: 't-orange font-bold' }]),
    line([{ text: '─'.repeat(50), className: 't-dim' }]),
    ...ctx.portfolio.skills.flatMap((skill) => [
      line([
        { text: `${skill.category}: `, className: 't-orange' },
        { text: skill.items.join(', '), className: 't-green' },
      ]),
    ]),
  ]
}
