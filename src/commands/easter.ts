import type { CommandContext, TerminalLine } from './types'

import { pickRandomJoke } from './unknown'

export function easterEggCommand(ctx: CommandContext): TerminalLine[] {
  const cmd = ctx.args[0] ?? ''
  const input = ctx.args.join(' ')

  if (cmd === 'sudo' || input.startsWith('sudo')) {
    return [{
      id: crypto.randomUUID(),
      parts: [{ text: "Nice try. You don't have root here.", className: 't-orange' }],
      type: 'output',
    }]
  }

  if (cmd === 'vim' || cmd === 'nano') {
    return [{
      id: crypto.randomUUID(),
      parts: [{ text: "You are now in vim. Just kidding. Type 'exit' or Ctrl+C won't save you either.", className: 't-orange' }],
      type: 'output',
    }]
  }

  if (input.includes('rm -rf') || input.includes('rm -rf /')) {
    return [
      {
        id: crypto.randomUUID(),
        parts: [{ text: '⚠ WARNING: Deleting entire filesystem...', className: 't-error' }],
        type: 'error',
      },
      {
        id: crypto.randomUUID(),
        parts: [{ text: 'Just kidding. Your portfolio is safe.', className: 't-green' }],
        type: 'success',
      },
    ]
  }

  if (cmd === 'cowsay') {
    const message = ctx.args.slice(1).join(' ') || 'moo'
    const border = '-'.repeat(message.length + 2)
    return [
      { id: crypto.randomUUID(), parts: [{ text: ` ${border} `, className: 't-green' }], type: 'output' },
      { id: crypto.randomUUID(), parts: [{ text: `< ${message} >`, className: 't-green' }], type: 'output' },
      { id: crypto.randomUUID(), parts: [{ text: ` ${border} `, className: 't-green' }], type: 'output' },
      { id: crypto.randomUUID(), parts: [{ text: '        \\   ^__^', className: 't-orange' }], type: 'output' },
      { id: crypto.randomUUID(), parts: [{ text: '         \\  (oo)\\_______', className: 't-orange' }], type: 'output' },
      { id: crypto.randomUUID(), parts: [{ text: '            (__)\\       )\\/\\', className: 't-orange' }], type: 'output' },
      { id: crypto.randomUUID(), parts: [{ text: '                ||----w |', className: 't-orange' }], type: 'output' },
      { id: crypto.randomUUID(), parts: [{ text: '                ||     ||', className: 't-orange' }], type: 'output' },
    ]
  }

  if (cmd === 'fortune') {
    const quote = pickRandomJoke('fortune')
    return [{
      id: crypto.randomUUID(),
      parts: [{ text: quote, className: 't-green italic' }],
      type: 'output',
    }]
  }

  return []
}
