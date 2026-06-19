import type { CommandContext, TerminalLine } from './types'

function line(parts: TerminalLine['parts']): TerminalLine {
  return { id: crypto.randomUUID(), parts, type: 'output' }
}

export function projectsCommand(ctx: CommandContext): TerminalLine[] {
  const showAll = ctx.flags.includes('--all')
  const list = showAll
    ? ctx.portfolio.projects
    : ctx.portfolio.projects.filter((p) => p.featured)

  const title = showAll ? 'ALL PROJECTS' : 'FEATURED PROJECTS'

  return [
    line([{ text: title, className: 'text-[#ff8c00] font-bold' }]),
    line([{ text: '─'.repeat(50), className: 'text-[#008f11]' }]),
    line([
      { text: 'NAME'.padEnd(22), className: 'text-[#ff8c00]' },
      { text: 'STACK'.padEnd(16), className: 'text-[#ff8c00]' },
      { text: 'STATUS', className: 'text-[#ff8c00]' },
    ]),
    ...list.map((p) =>
      line([
        { text: p.name.padEnd(22), className: 'text-[#00ff41]' },
        { text: p.stack.join(', ').padEnd(16), className: 'text-[#008f11]' },
        {
          text: p.demo_url ? 'live demo' : 'active',
          className: 'text-[#00ff41]/70',
        },
      ])
    ),
    line([
      { text: '\nTip: ', className: 'text-[#008f11]' },
      { text: 'project <slug>', className: 'text-[#ff8c00]' },
      { text: ' for details', className: 'text-[#008f11]' },
    ]),
  ]
}

export function projectCommand(ctx: CommandContext): TerminalLine[] {
  const slug = ctx.args[0]
  if (!slug) {
    return [
      {
        id: crypto.randomUUID(),
        parts: [{ text: 'Usage: project <slug>', className: 'text-[#ff4444]' }],
        type: 'error',
      },
    ]
  }

  const project = ctx.portfolio.projects.find((p) => p.slug === slug)
  if (!project) {
    return [
      {
        id: crypto.randomUUID(),
        parts: [{ text: `Project not found: ${slug}`, className: 'text-[#ff4444]' }],
        type: 'error',
      },
    ]
  }

  const lines: TerminalLine[] = [
    line([
      { text: project.name, className: 'text-[#ff8c00] font-bold' },
      { text: ` — ${project.description}`, className: 'text-[#00ff41]' },
    ]),
    line([
      { text: 'Stack: ', className: 'text-[#ff8c00]' },
      { text: project.stack.join(', '), className: 'text-[#00ff41]' },
    ]),
  ]

  if (project.github_url) {
    lines.push(
      line([
        { text: '→ ', className: 'text-[#008f11]' },
        { text: project.github_url, className: 'text-[#ff8c00] underline', href: project.github_url },
      ])
    )
  }

  if (project.demo_url) {
    lines.push(
      line([
        { text: '→ ', className: 'text-[#008f11]' },
        { text: project.demo_url, className: 'text-[#ff8c00] underline', href: project.demo_url },
      ])
    )
  }

  return lines
}
