export function helpCommand(_ctx: import('./types').CommandContext): import('./types').TerminalLine[] {
  const commands = [
    ['help', '?', 'List all commands'],
    ['whoami', '', 'Quick intro'],
    ['about', 'me', 'Full bio'],
    ['education', 'edu', 'Education timeline'],
    ['experience', 'exp', 'Work experience'],
    ['skills', 'stack', 'Tech stack'],
    ['projects', 'ls', 'Featured projects'],
    ['projects --all', '', 'All projects'],
    ['project <slug>', 'open <slug>', 'Project details'],
    ['contact', '', 'Email & socials'],
    ['resume', 'cv', 'Open resume'],
    ['social', '', 'Social links only'],
    ['neofetch', 'banner', 'System info + ASCII art'],
    ['gui', 'open gui', 'Open scrollable GUI mode'],
    ['terminal', 'fullscreen', 'Back to fullscreen terminal'],
    ['clear', 'cls', 'Clear terminal'],
    ['history', '', 'Command history'],
  ]

  function line(parts: import('./types').TerminalLine['parts'], type: import('./types').TerminalLine['type'] = 'output'): import('./types').TerminalLine {
    return { id: crypto.randomUUID(), parts, type }
  }

  return [
    line([{ text: 'Available commands:', className: 'text-[#ff8c00]' }]),
    ...commands.map(([name, alias, desc]) =>
      line([
        { text: `  ${name.padEnd(22)}`, className: 'text-[#ff8c00]' },
        { text: alias ? `(${alias}) ` : '        ', className: 'text-[#008f11]' },
        { text: desc, className: 'text-[#00ff41]' },
      ])
    ),
  ]
}
