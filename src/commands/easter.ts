import type { CommandContext, TerminalLine } from './types'

const FORTUNES = [
  'It works on my machine.',
  'There are only two hard things in CS: cache invalidation and naming things.',
  'First, solve the problem. Then, write the code.',
  'The best error message is the one that never shows up.',
  'Talk is cheap. Show me the code.',
  'Programs must be written for people to read.',
]

export function easterEggCommand(ctx: CommandContext): TerminalLine[] {
  const cmd = ctx.args[0] ?? ''
  const input = ctx.args.join(' ')

  if (cmd === 'sudo' || input.startsWith('sudo')) {
    return [{
      id: crypto.randomUUID(),
      parts: [{ text: "Nice try. You don't have root here.", className: 'text-[#ff8c00]' }],
      type: 'output',
    }]
  }

  if (cmd === 'vim' || cmd === 'nano') {
    return [{
      id: crypto.randomUUID(),
      parts: [{ text: "You are now in vim. Just kidding. Type 'exit' or Ctrl+C won't save you either.", className: 'text-[#ff8c00]' }],
      type: 'output',
    }]
  }

  if (input.includes('rm -rf') || input.includes('rm -rf /')) {
    return [
      {
        id: crypto.randomUUID(),
        parts: [{ text: '⚠ WARNING: Deleting entire filesystem...', className: 'text-[#ff4444]' }],
        type: 'error',
      },
      {
        id: crypto.randomUUID(),
        parts: [{ text: 'Just kidding. Your portfolio is safe.', className: 'text-[#00ff41]' }],
        type: 'success',
      },
    ]
  }

  if (cmd === 'cowsay') {
    const message = ctx.args.slice(1).join(' ') || 'moo'
    const border = '-'.repeat(message.length + 2)
    return [
      { id: crypto.randomUUID(), parts: [{ text: ` ${border} `, className: 'text-[#00ff41]' }], type: 'output' },
      { id: crypto.randomUUID(), parts: [{ text: `< ${message} >`, className: 'text-[#00ff41]' }], type: 'output' },
      { id: crypto.randomUUID(), parts: [{ text: ` ${border} `, className: 'text-[#00ff41]' }], type: 'output' },
      { id: crypto.randomUUID(), parts: [{ text: '        \\   ^__^', className: 'text-[#ff8c00]' }], type: 'output' },
      { id: crypto.randomUUID(), parts: [{ text: '         \\  (oo)\\_______', className: 'text-[#ff8c00]' }], type: 'output' },
      { id: crypto.randomUUID(), parts: [{ text: '            (__)\\       )\\/\\', className: 'text-[#ff8c00]' }], type: 'output' },
      { id: crypto.randomUUID(), parts: [{ text: '                ||----w |', className: 'text-[#ff8c00]' }], type: 'output' },
      { id: crypto.randomUUID(), parts: [{ text: '                ||     ||', className: 'text-[#ff8c00]' }], type: 'output' },
    ]
  }

  if (cmd === 'fortune') {
    const quote = FORTUNES[Math.floor(Math.random() * FORTUNES.length)]
    return [{
      id: crypto.randomUUID(),
      parts: [{ text: quote, className: 'text-[#00ff41] italic' }],
      type: 'output',
    }]
  }

  return []
}
