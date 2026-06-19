import type { CommandContext, TerminalLine } from './types'

function line(parts: TerminalLine['parts'], type: TerminalLine['type'] = 'output'): TerminalLine {
  return { id: crypto.randomUUID(), parts, type }
}

export function helpCommand(_ctx: CommandContext): TerminalLine[] {
  const commands = [
    ['help', '?', 'List all commands'],
    ['whoami', '', 'Quick intro'],
    ['about', 'me', 'Full bio'],
    ['education', 'edu', 'Education timeline'],
    ['skills', 'stack', 'Tech stack'],
    ['projects', 'ls', 'Featured projects'],
    ['projects --all', '', 'All projects'],
    ['project <slug>', 'open <slug>', 'Project details'],
    ['contact', '', 'Email & socials'],
    ['resume', 'cv', 'Open resume'],
    ['social', '', 'Social links only'],
    ['neofetch', 'banner', 'System info + ASCII art'],
    ['clear', 'cls', 'Clear terminal'],
    ['history', '', 'Command history'],
  ]

  return [
    line([{ text: 'Available commands:', className: 'text-[#ff8c00]' }]),
    ...commands.map(([name, alias, desc]) =>
      line([
        { text: `  ${name.padEnd(20)}`, className: 'text-[#ff8c00]' },
        { text: alias ? `(${alias}) ` : '        ', className: 'text-[#008f11]' },
        { text: desc, className: 'text-[#00ff41]' },
      ])
    ),
  ]
}
