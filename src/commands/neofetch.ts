import type { CommandContext, TerminalLine } from './types'

function line(parts: TerminalLine['parts']): TerminalLine {
  return { id: crypto.randomUUID(), parts, type: 'output' }
}

const ASCII_MT = `
 ███╗   ███╗████████╗
 ████╗ ████║╚══██╔══╝
 ██╔████╔██║   ██║
 ██║╚██╔╝██║   ██║
 ██║ ╚═╝ ██║   ██║
 ╚═╝     ╚═╝   ╚═╝`.trim()

export function neofetchCommand(ctx: CommandContext): TerminalLine[] {
  const { profile, skills } = ctx.portfolio
  const topStack = skills.flatMap((s) => s.items).slice(0, 4).join(', ')

  const info = [
    `OS: portfolio-linux 6.19`,
    `Host: tauqueer@${profile.location.split(',')[0].toLowerCase()}`,
    `Role: ${profile.title}`,
    `Stack: ${topStack}`,
    `GitHub: github.com/m-tauqueer`,
    `Uptime: since 2025`,
  ]

  const asciiLines = ASCII_MT.split('\n')

  return [
    ...asciiLines.map((ascii, i) =>
      line([
        { text: ascii.padEnd(24), className: 't-orange' },
        { text: info[i] ?? '', className: 't-green' },
      ])
    ),
    ...info.slice(asciiLines.length).map((text) => line([{ text: `                        ${text}`, className: 't-green' }])),
  ]
}
