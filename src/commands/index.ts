import { helpCommand } from './help'
import { whoamiCommand, aboutCommand } from './about'
import { educationCommand } from './education'
import { skillsCommand } from './skills'
import { experienceCommand } from './experience'
import { projectsCommand, projectCommand } from './projects'
import { contactCommand, socialCommand, resumeCommand } from './contact'
import { neofetchCommand } from './neofetch'
import { easterEggCommand } from './easter'
import { unknownCommandResponse } from './unknown'
import type { Command, CommandContext } from './types'
import type { CommandResult } from './result'

export const COMMANDS: Command[] = [
  { name: 'help', aliases: ['?'], description: 'List commands', handler: helpCommand },
  { name: 'whoami', description: 'Quick intro', handler: whoamiCommand },
  { name: 'about', aliases: ['me'], description: 'Full bio', handler: aboutCommand },
  { name: 'education', aliases: ['edu'], description: 'Education', handler: educationCommand },
  { name: 'experience', aliases: ['exp'], description: 'Work experience', handler: experienceCommand },
  { name: 'skills', aliases: ['stack'], description: 'Tech stack', handler: skillsCommand },
  { name: 'projects', aliases: ['ls'], description: 'List projects', handler: projectsCommand },
  { name: 'project', aliases: ['open'], description: 'Project details', handler: projectCommand },
  { name: 'contact', description: 'Contact info', handler: contactCommand },
  { name: 'social', description: 'Social links', handler: socialCommand },
  { name: 'resume', aliases: ['cv'], description: 'Open resume', handler: resumeCommand },
  { name: 'neofetch', aliases: ['banner'], description: 'System info', handler: neofetchCommand },
]

const EASTER_COMMANDS = ['sudo', 'vim', 'nano', 'rm', 'cowsay', 'fortune']

const SCROLL_MAP: Record<string, string> = {
  about: 'about',
  me: 'about',
  whoami: 'about',
  skills: 'about',
  stack: 'about',
  education: 'journey',
  edu: 'journey',
  experience: 'journey',
  exp: 'journey',
  journey: 'journey',
  projects: 'projects',
  ls: 'projects',
  contact: 'contact',
}

export function parseInput(input: string): { command: string; args: string[]; flags: string[] } {
  const parts = input.trim().split(/\s+/)
  const command = parts[0]?.toLowerCase() ?? ''
  const rest = parts.slice(1)
  const flags = rest.filter((p) => p.startsWith('--'))
  const args = rest.filter((p) => !p.startsWith('--'))
  return { command, args, flags }
}

export function executeCommand(input: string, portfolio: CommandContext['portfolio'], guiMode = false): CommandResult {
  const trimmed = input.trim().toLowerCase()

  if (trimmed === 'gui' || trimmed === 'open gui') {
    return {
      lines: [{
        id: crypto.randomUUID(),
        parts: [{ text: 'Opening GUI mode... scroll to explore ↓', className: 't-orange' }],
        type: 'success',
      }],
      sideEffect: { type: 'mode', mode: 'gui' },
    }
  }

  if (trimmed === 'terminal' || trimmed === 'fullscreen') {
    return {
      lines: [{
        id: crypto.randomUUID(),
        parts: [{ text: 'Entering fullscreen terminal mode...', className: 't-orange' }],
        type: 'success',
      }],
      sideEffect: { type: 'mode', mode: 'terminal' },
    }
  }

  const { command, args, flags } = parseInput(input)
  if (!command) return { lines: [] }

  const ctx: CommandContext = { args, flags, portfolio }

  if (EASTER_COMMANDS.includes(command) || command === 'sudo' || input.includes('rm -rf')) {
    const easterCtx: CommandContext = { args: [command, ...args], flags, portfolio }
    if (command === 'rm' && args.join(' ').includes('-rf')) {
      return { lines: easterEggCommand({ args: ['rm -rf /'], flags, portfolio }) }
    }
    const result = easterEggCommand(easterCtx)
    if (result.length > 0) return { lines: result }
  }

  const scrollSection = SCROLL_MAP[command]
  if (guiMode && scrollSection && !['project', 'open'].includes(command)) {
    const matched = COMMANDS.find((c) => c.name === command || c.aliases?.includes(command))
    if (matched && matched.name !== 'project') {
      const lines = matched.name === 'projects' && flags.includes('--all')
        ? projectsCommand({ ...ctx, flags: ['--all'] })
        : matched.handler(ctx)
      return {
        lines: [
          ...lines,
          {
            id: crypto.randomUUID(),
            parts: [{ text: `↳ scrolling to ~/${scrollSection}`, className: 't-dim' }],
            type: 'system',
          },
        ],
        sideEffect: { type: 'scroll', section: scrollSection },
      }
    }
  }

  const matched = COMMANDS.find(
    (c) => c.name === command || c.aliases?.includes(command)
  )

  if (!matched) {
    return { lines: unknownCommandResponse(command) }
  }

  if (matched.name === 'projects' && flags.includes('--all')) {
    return { lines: projectsCommand({ ...ctx, flags: ['--all'] }) }
  }

  return { lines: matched.handler(ctx) }
}

export function getAutocomplete(input: string): string | null {
  const { command } = parseInput(input)
  if (!command) return null

  const all = [...COMMANDS.flatMap((c) => [c.name, ...(c.aliases ?? [])]), 'gui', 'terminal', 'fullscreen']
  const match = all.find((c) => c.startsWith(command) && c !== command)
  return match ?? null
}

export const COMMAND_NAMES = COMMANDS.flatMap((c) => [c.name, ...(c.aliases ?? [])])
