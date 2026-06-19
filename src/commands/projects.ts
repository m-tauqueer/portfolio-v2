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
    line([{ text: title, className: 't-orange font-bold' }]),
    line([{ text: '─'.repeat(50), className: 't-dim' }]),
    line([
      { text: 'NAME'.padEnd(22), className: 't-orange' },
      { text: 'STACK'.padEnd(16), className: 't-orange' },
      { text: 'STATUS', className: 't-orange' },
    ]),
    ...list.map((p) =>
      line([
        { text: p.name.padEnd(22), className: 't-green' },
        { text: p.stack.join(', ').padEnd(16), className: 't-dim' },
        {
          text: p.demo_url ? 'live demo' : 'active',
          className: 't-green opacity-70',
        },
      ])
    ),
    line([
      { text: '\nTip: ', className: 't-dim' },
      { text: 'project <slug>', className: 't-orange' },
      { text: ' for details', className: 't-dim' },
    ]),
  ]
}

export function projectCommand(ctx: CommandContext): TerminalLine[] {
  const slug = ctx.args[0]
  if (!slug) {
    return [
      {
        id: crypto.randomUUID(),
        parts: [{ text: 'Usage: project <slug>', className: 't-error' }],
        type: 'error',
      },
    ]
  }

  const project = ctx.portfolio.projects.find((p) => p.slug === slug)
  if (!project) {
    return [
      {
        id: crypto.randomUUID(),
        parts: [{ text: `Project not found: ${slug}`, className: 't-error' }],
        type: 'error',
      },
    ]
  }

  const lines: TerminalLine[] = [
    line([
      { text: project.name, className: 't-orange font-bold' },
      { text: ` — ${project.description}`, className: 't-green' },
    ]),
    line([
      { text: 'Stack: ', className: 't-orange' },
      { text: project.stack.join(', '), className: 't-green' },
    ]),
  ]

  if (project.github_url) {
    lines.push(
      line([
        { text: '→ ', className: 't-dim' },
        { text: project.github_url, className: 't-orange underline', href: project.github_url },
      ])
    )
  }

  if (project.demo_url) {
    lines.push(
      line([
        { text: '→ ', className: 't-dim' },
        { text: project.demo_url, className: 't-orange underline', href: project.demo_url },
      ])
    )
  }

  return lines
}
