import type { CommandContext, TerminalLine } from './types'

function line(parts: TerminalLine['parts']): TerminalLine {
  return { id: crypto.randomUUID(), parts, type: 'output' }
}

export function skillsCommand(ctx: CommandContext): TerminalLine[] {
  return [
    line([{ text: 'Skills & Technologies', className: 'text-[#ff8c00] font-bold' }]),
    line([{ text: '─'.repeat(50), className: 'text-[#008f11]' }]),
    ...ctx.portfolio.skills.flatMap((skill) => [
      line([
        { text: `${skill.category}: `, className: 'text-[#ff8c00]' },
        { text: skill.items.join(', '), className: 'text-[#00ff41]' },
      ]),
    ]),
  ]
}
