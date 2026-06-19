import { helpCommand } from './help'
import { whoamiCommand, aboutCommand } from './about'
import { educationCommand } from './education'
import { skillsCommand } from './skills'
import { projectsCommand, projectCommand } from './projects'
import { contactCommand, socialCommand, resumeCommand } from './contact'
import { neofetchCommand } from './neofetch'
import { easterEggCommand } from './easter'
import type { Command, CommandContext, TerminalLine } from './types'

export const COMMANDS: Command[] = [
  { name: 'help', aliases: ['?'], description: 'List commands', handler: helpCommand },
  { name: 'whoami', description: 'Quick intro', handler: whoamiCommand },
  { name: 'about', aliases: ['me'], description: 'Full bio', handler: aboutCommand },
  { name: 'education', aliases: ['edu'], description: 'Education', handler: educationCommand },
  { name: 'skills', aliases: ['stack'], description: 'Tech stack', handler: skillsCommand },
  { name: 'projects', aliases: ['ls'], description: 'List projects', handler: projectsCommand },
  { name: 'project', aliases: ['open'], description: 'Project details', handler: projectCommand },
  { name: 'contact', description: 'Contact info', handler: contactCommand },
  { name: 'social', description: 'Social links', handler: socialCommand },
  { name: 'resume', aliases: ['cv'], description: 'Open resume', handler: resumeCommand },
  { name: 'neofetch', aliases: ['banner'], description: 'System info', handler: neofetchCommand },
]

const EASTER_COMMANDS = ['sudo', 'vim', 'nano', 'rm', 'cowsay', 'fortune']

export function parseInput(input: string): { command: string; args: string[]; flags: string[] } {
  const parts = input.trim().split(/\s+/)
  const command = parts[0]?.toLowerCase() ?? ''
  const rest = parts.slice(1)
  const flags = rest.filter((p) => p.startsWith('--'))
  const args = rest.filter((p) => !p.startsWith('--'))
  return { command, args, flags }
}

export function executeCommand(input: string, portfolio: CommandContext['portfolio']): TerminalLine[] {
  const { command, args, flags } = parseInput(input)
  if (!command) return []

  const ctx: CommandContext = { args, flags, portfolio }

  if (EASTER_COMMANDS.includes(command) || command === 'sudo' || input.includes('rm -rf')) {
    const easterCtx: CommandContext = { args: [command, ...args], flags, portfolio }
    if (command === 'rm' && args.join(' ').includes('-rf')) {
      return easterEggCommand({ args: ['rm -rf /'], flags, portfolio })
    }
    const result = easterEggCommand(easterCtx)
    if (result.length > 0) return result
  }

  const matched = COMMANDS.find(
    (c) => c.name === command || c.aliases?.includes(command)
  )

  if (!matched) {
    return [{
      id: crypto.randomUUID(),
      parts: [
        { text: `command not found: ${command}. `, className: 'text-[#ff4444]' },
        { text: "Type 'help' for available commands.", className: 'text-[#008f11]' },
      ],
      type: 'error',
    }]
  }

  if (matched.name === 'projects' && flags.includes('--all')) {
    return projectsCommand({ ...ctx, flags: ['--all'] })
  }

  return matched.handler(ctx)
}

export function getAutocomplete(input: string): string | null {
  const { command } = parseInput(input)
  if (!command) return null

  const all = COMMANDS.flatMap((c) => [c.name, ...(c.aliases ?? [])])
  const match = all.find((c) => c.startsWith(command) && c !== command)
  return match ?? null
}

export const COMMAND_NAMES = COMMANDS.flatMap((c) => [c.name, ...(c.aliases ?? [])])
