const NAV_ITEMS = [
  { id: 'about', label: '~/about' },
  { id: 'journey', label: '~/journey' },
  { id: 'projects', label: '~/projects' },
  { id: 'contact', label: '~/contact' },
]

interface TerminalNavProps {
  onNavigate: (id: string) => void
  activeSection?: string
}

export function TerminalNav({ onNavigate, activeSection }: TerminalNavProps) {
  return (
    <nav className="terminal-nav">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`terminal-nav-item ${activeSection === item.id ? 'active' : ''}`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
