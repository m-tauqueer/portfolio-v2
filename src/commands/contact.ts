import type { CommandContext, TerminalLine } from './types'

function line(parts: TerminalLine['parts']): TerminalLine {
  return { id: crypto.randomUUID(), parts, type: 'output' }
}

export function contactCommand(ctx: CommandContext): TerminalLine[] {
  const { profile, social } = ctx.portfolio
  const activeSocial = social.filter((s) => s.url)

  return [
    line([{ text: 'Contact', className: 't-orange font-bold' }]),
    line([{ text: '─'.repeat(50), className: 't-dim' }]),
    line([
      { text: 'email: ', className: 't-orange' },
      {
        text: profile.email,
        className: 't-green underline',
        href: `mailto:${profile.email}`,
      },
    ]),
    ...activeSocial.map((s) =>
      line([
        { text: `${s.platform}: `, className: 't-orange' },
        { text: s.url, className: 't-green underline', href: s.url },
      ])
    ),
  ]
}

export function socialCommand(ctx: CommandContext): TerminalLine[] {
  const activeSocial = ctx.portfolio.social.filter((s) => s.url)

  if (activeSocial.length === 0) {
    return [line([{ text: 'No social links set yet.', className: 't-dim' }])]
  }

  return activeSocial.map((s) =>
    line([
      { text: `${s.label}: `, className: 't-orange' },
      { text: s.url, className: 't-green underline', href: s.url },
    ])
  )
}

export function resumeCommand(ctx: CommandContext): TerminalLine[] {
  const url = ctx.portfolio.profile.resume_url

  if (!url) {
    return [
      {
        id: crypto.randomUUID(),
        parts: [{ text: 'Resume not set yet. Check back soon.', className: 't-dim' }],
        type: 'output',
      },
    ]
  }

  window.open(url, '_blank', 'noopener,noreferrer')

  return [
    line([
      { text: 'Opening resume: ', className: 't-orange' },
      { text: url, className: 't-green underline', href: url },
    ]),
  ]
}
