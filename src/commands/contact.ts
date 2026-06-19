import type { CommandContext, TerminalLine } from './types'

function line(parts: TerminalLine['parts']): TerminalLine {
  return { id: crypto.randomUUID(), parts, type: 'output' }
}

export function contactCommand(ctx: CommandContext): TerminalLine[] {
  const { profile, social } = ctx.portfolio
  const activeSocial = social.filter((s) => s.url)

  return [
    line([{ text: 'Contact', className: 'text-[#ff8c00] font-bold' }]),
    line([{ text: '─'.repeat(50), className: 'text-[#008f11]' }]),
    line([
      { text: 'email: ', className: 'text-[#ff8c00]' },
      {
        text: profile.email,
        className: 'text-[#00ff41] underline',
        href: `mailto:${profile.email}`,
      },
    ]),
    ...activeSocial.map((s) =>
      line([
        { text: `${s.platform}: `, className: 'text-[#ff8c00]' },
        { text: s.url, className: 'text-[#00ff41] underline', href: s.url },
      ])
    ),
  ]
}

export function socialCommand(ctx: CommandContext): TerminalLine[] {
  const activeSocial = ctx.portfolio.social.filter((s) => s.url)

  if (activeSocial.length === 0) {
    return [line([{ text: 'No social links set yet.', className: 'text-[#008f11]' }])]
  }

  return activeSocial.map((s) =>
    line([
      { text: `${s.label}: `, className: 'text-[#ff8c00]' },
      { text: s.url, className: 'text-[#00ff41] underline', href: s.url },
    ])
  )
}

export function resumeCommand(ctx: CommandContext): TerminalLine[] {
  const url = ctx.portfolio.profile.resume_url

  if (!url) {
    return [
      {
        id: crypto.randomUUID(),
        parts: [{ text: 'Resume not set yet. Check back soon.', className: 'text-[#008f11]' }],
        type: 'output',
      },
    ]
  }

  window.open(url, '_blank', 'noopener,noreferrer')

  return [
    line([
      { text: 'Opening resume: ', className: 'text-[#ff8c00]' },
      { text: url, className: 'text-[#00ff41] underline', href: url },
    ]),
  ]
}
