import type { TerminalLine } from './types'

const SARCASTIC_JOKES = [
  (cmd: string) => `You typed "${cmd}" like you have root access. You don't.`,
  (cmd: string) => `"${cmd}"? My shell runs on talent, not guesswork. Try help.`,
  (cmd: string) => `Impressive. "${cmd}" unlocked absolutely nothing. Classic move.`,
  () => 'Random keystrokes won\'t hire you. Type help like a professional.',
  () => 'That wasn\'t a command — that was hope with extra steps.',
  () => 'I built Engram so AI remembers things. You? You forgot help exists.',
  () => 'You\'re mashing the keyboard like it\'s a CAPTCHA. It\'s not.',
  () => 'Somewhere a recruiter just felt a disturbance. Type help.',
  () => '404: Your confidence. 200: My patience. Type help.',
  () => 'Did you just try to hack a portfolio? With THAT input?',
  () => 'Tab completion exists. So does help. You chose violence.',
  () => 'I shipped production code today. You shipped... that.',
  () => 'Your command failed faster than a startup without PMF.',
  () => 'Nice fuzzing attempt. My terminal is not your QA environment.',
  () => 'You type like you\'re late for a standup and skipped the docs.',
  () => 'Bold of you to assume I implemented whatever that was.',
  () => 'I\'ve seen better input from a rubber duck.',
  () => 'That input has the energy of "it works on my machine."',
  () => 'You\'re not in vim. You can\'t escape this. Type help.',
  () => 'Recruiter mode: OFF. Sarcasm mode: ON. Help mode: available.',
  () => 'I don\'t have sudo for your career choices either.',
  () => 'Plot twist: the real command was help all along.',
  () => 'You\'re exploring like Google Maps with no destination.',
  () => 'My stack is TypeScript and discipline. Yours seems to be chaos.',
  () => 'If guessing commands was a skill, you\'d be staff level.',
  () => 'I wrote a POSIX shell in Java. You typed... that.',
  () => 'Your input crashed my expectations, not my terminal.',
  (cmd: string) => `Staygrad finds hostels. This terminal won't find "${cmd}".`,
  () => 'Engram remembers meetings. I\'ll remember this attempt.',
  () => 'Keyboard smash detected. Emotional support: type help.',
  () => 'You\'re one typo away from deploying to prod. Oh wait, wrong window.',
  () => 'I\'d roast you harder but I\'m open source and trying to be nice.',
  () => 'That wasn\'t SQL injection. It wasn\'t even SQL.',
  () => 'Your shell history is going to be embarrassing. Type help.',
  () => 'I optimize memory. You seem to be leaking commands.',
  () => 'Bangalore traffic moves faster than you finding valid commands.',
  () => 'BITS taught me algorithms. Nobody taught you help.',
  () => 'You typed with confidence. The terminal responded with silence.',
  () => 'I\'d give you a hint but you clearly enjoy the struggle.',
  () => 'Command not found. Dignity: also not found. Try help.',
  (cmd: string) => `"${cmd}" — even autocomplete gave up on you.`,
  (cmd: string) => `You expected "${cmd}" to work? The audacity.`,
  () => 'This isn\'t ChatGPT. I don\'t hallucinate commands for you.',
  () => 'Your fingers are fast. Your command vocabulary is not.',
  () => 'I put a whole GUI on this site. You chose to fight the terminal.',
  () => 'Type help before I start charging consulting rates.',
]

export function pickRandomJoke(command: string): string {
  const joke = SARCASTIC_JOKES[Math.floor(Math.random() * SARCASTIC_JOKES.length)]
  return joke(command)
}

export function unknownCommandResponse(command: string): TerminalLine[] {
  const joke = pickRandomJoke(command)
  return [
    {
      id: crypto.randomUUID(),
      parts: [
        { text: `command not found: `, className: 't-error' },
        { text: command, className: 't-orange' },
      ],
      type: 'error',
    },
    {
      id: crypto.randomUUID(),
      parts: [{ text: joke, className: 't-orange' }],
      type: 'output',
    },
    {
      id: crypto.randomUUID(),
      parts: [
        { text: "Type ", className: 't-dim' },
        { text: 'help', className: 't-orange' },
        { text: ' to see available commands.', className: 't-dim' },
      ],
      type: 'system',
    },
  ]
}
