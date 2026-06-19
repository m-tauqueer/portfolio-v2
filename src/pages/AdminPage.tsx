import { useState, useEffect, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { PortfolioData } from '../types/portfolio'

async function apiFetch(path: string, options?: RequestInit) {
  let res: Response
  try {
    res = await fetch(path, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
  } catch {
    throw new Error('Cannot reach API. Restart with: npm run dev')
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error ?? 'Request failed')
  }
  return res.json()
}

export function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await apiFetch('/api/admin/verify', {
        method: 'POST',
        body: JSON.stringify({ password }),
      })
      window.location.href = '/admin/dashboard'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-2">Admin Panel</h1>
        <p className="text-zinc-400 text-sm mb-6">Portfolio content management</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <Link to="/" className="block text-center text-zinc-500 text-sm mt-4 hover:text-zinc-300">
          ← Back to terminal
        </Link>
      </div>
    </div>
  )
}

export function AdminDashboard() {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    apiFetch('/api/admin/content?section=all')
      .then(setData)
      .catch(() => window.location.href = '/admin')
      .finally(() => setLoading(false))
  }, [])

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3000)
  }

  const save = async (section: string, body: unknown) => {
    setSaving(true)
    try {
      await apiFetch(`/api/admin/content?section=${section}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      })
      showToast('success', 'Saved successfully!')
      const updated = await apiFetch('/api/admin/content?section=all')
      setData(updated)
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const logout = async () => {
    await apiFetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin'
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        Loading...
      </div>
    )
  }

  const tabs = ['profile', 'social', 'skills', 'education', 'experience', 'projects']

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Portfolio Admin</h1>
          <p className="text-zinc-500 text-sm">Edit terminal content</p>
        </div>
        <div className="flex gap-3">
          <Link to="/" className="text-zinc-400 hover:text-white text-sm">View Terminal</Link>
          <button onClick={logout} className="text-zinc-400 hover:text-white text-sm">Logout</button>
        </div>
      </header>

      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg text-sm z-50 ${toast.type === 'success' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex">
        <nav className="w-48 border-r border-zinc-800 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition ${activeTab === tab ? 'bg-orange-600/20 text-orange-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <main className="flex-1 p-6 max-w-3xl">
          {activeTab === 'profile' && (
            <ProfileForm profile={data.profile} onSave={(p) => save('profile', p)} saving={saving} />
          )}
          {activeTab === 'social' && (
            <SocialForm social={data.social} onSave={(s) => save('social', s)} saving={saving} />
          )}
          {activeTab === 'skills' && (
            <SkillsForm skills={data.skills} onSave={(s) => save('skills', s)} saving={saving} />
          )}
          {activeTab === 'education' && (
            <EducationForm education={data.education} onSave={(e) => save('education', e)} saving={saving} />
          )}
          {activeTab === 'experience' && (
            <ExperienceForm experience={data.experience ?? []} onSave={(e) => save('experience', e)} saving={saving} />
          )}
          {activeTab === 'projects' && (
            <ProjectsForm projects={data.projects} onSave={(p) => save('projects', p)} saving={saving} />
          )}
        </main>
      </div>
    </div>
  )
}

function ProfileForm({ profile, onSave, saving }: { profile: PortfolioData['profile']; onSave: (p: PortfolioData['profile']) => void; saving: boolean }) {
  const [form, setForm] = useState(profile)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Profile</h2>
      {(['name', 'title', 'location', 'email', 'resume_url'] as const).map((field) => (
        <div key={field}>
          <label className="block text-sm text-zinc-400 mb-1 capitalize">{field.replace('_', ' ')}</label>
          <input
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      ))}
      <div>
        <label className="block text-sm text-zinc-400 mb-1">Bio</label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={5}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm text-zinc-400 mb-1">Interests (comma-separated)</label>
        <input
          value={form.interests.join(', ')}
          onChange={(e) => setForm({ ...form, interests: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <button onClick={() => onSave(form)} disabled={saving} className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 px-4 py-2 rounded-lg text-sm">
        {saving ? 'Saving...' : 'Save Profile'}
      </button>
    </div>
  )
}

function SocialForm({ social, onSave, saving }: { social: PortfolioData['social']; onSave: (s: PortfolioData['social']) => void; saving: boolean }) {
  const [rows, setRows] = useState(social)

  const update = (i: number, field: string, value: string) => {
    const next = [...rows]
    next[i] = { ...next[i], [field]: value }
    setRows(next)
  }

  const add = () => setRows([...rows, { id: Date.now(), platform: '', url: '', label: '', sort_order: rows.length + 1 }])
  const remove = (i: number) => setRows(rows.filter((_: PortfolioData['social'][0], idx: number) => idx !== i))

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Social Links</h2>
      {rows.map((row: PortfolioData['social'][0], i: number) => (
        <div key={row.id} className="grid grid-cols-3 gap-2 items-end">
          <input placeholder="Platform" value={row.platform} onChange={(e) => update(i, 'platform', e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Label" value={row.label} onChange={(e) => update(i, 'label', e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <input placeholder="URL" value={row.url} onChange={(e) => update(i, 'url', e.target.value)} className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
            <button onClick={() => remove(i)} className="text-red-400 text-sm px-2">×</button>
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <button onClick={add} className="text-orange-400 text-sm">+ Add link</button>
        <button onClick={() => onSave(rows)} disabled={saving} className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 px-4 py-2 rounded-lg text-sm ml-auto">
          {saving ? 'Saving...' : 'Save Social'}
        </button>
      </div>
    </div>
  )
}

function SkillsForm({ skills, onSave, saving }: { skills: PortfolioData['skills']; onSave: (s: PortfolioData['skills']) => void; saving: boolean }) {
  const [rows, setRows] = useState(skills)

  const update = (i: number, field: string, value: string) => {
    const next = [...rows]
    if (field === 'items') {
      next[i] = { ...next[i], items: value.split(',').map((s) => s.trim()).filter(Boolean) }
    } else {
      next[i] = { ...next[i], [field]: value }
    }
    setRows(next)
  }

  const add = () => setRows([...rows, { id: Date.now(), category: '', items: [], sort_order: rows.length + 1 }])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Skills</h2>
      {rows.map((row: PortfolioData['skills'][0], i: number) => (
        <div key={row.id} className="space-y-2">
          <input placeholder="Category" value={row.category} onChange={(e) => update(i, 'category', e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Items (comma-separated)" value={row.items.join(', ')} onChange={(e) => update(i, 'items', e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
        </div>
      ))}
      <div className="flex gap-2">
        <button onClick={add} className="text-orange-400 text-sm">+ Add category</button>
        <button onClick={() => onSave(rows)} disabled={saving} className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 px-4 py-2 rounded-lg text-sm ml-auto">
          {saving ? 'Saving...' : 'Save Skills'}
        </button>
      </div>
    </div>
  )
}

function EducationForm({ education, onSave, saving }: { education: PortfolioData['education']; onSave: (e: PortfolioData['education']) => void; saving: boolean }) {
  const [rows, setRows] = useState(education)

  const update = (i: number, field: string, value: string) => {
    const next = [...rows]
    next[i] = { ...next[i], [field]: value }
    setRows(next)
  }

  const add = () => setRows([...rows, { id: Date.now(), degree: '', school: '', duration: '', description: '', sort_order: rows.length + 1 }])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Education</h2>
      {rows.map((row: PortfolioData['education'][0], i: number) => (
        <div key={row.id} className="border border-zinc-800 rounded-lg p-4 space-y-2">
          <input placeholder="Degree" value={row.degree} onChange={(e) => update(i, 'degree', e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="School" value={row.school} onChange={(e) => update(i, 'school', e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Duration" value={row.duration} onChange={(e) => update(i, 'duration', e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
          <textarea placeholder="Description" value={row.description} onChange={(e) => update(i, 'description', e.target.value)} rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
        </div>
      ))}
      <div className="flex gap-2">
        <button onClick={add} className="text-orange-400 text-sm">+ Add entry</button>
        <button onClick={() => onSave(rows)} disabled={saving} className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 px-4 py-2 rounded-lg text-sm ml-auto">
          {saving ? 'Saving...' : 'Save Education'}
        </button>
      </div>
    </div>
  )
}

function ExperienceForm({ experience, onSave, saving }: { experience: PortfolioData['experience']; onSave: (e: PortfolioData['experience']) => void; saving: boolean }) {
  const [rows, setRows] = useState(experience)

  const update = (i: number, field: string, value: string) => {
    const next = [...rows]
    next[i] = { ...next[i], [field]: value }
    setRows(next)
  }

  const add = () => setRows([...rows, { id: Date.now(), company: '', role: '', duration: '', description: '', sort_order: rows.length + 1 }])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Experience</h2>
      {rows.map((row: PortfolioData['experience'][0], i: number) => (
        <div key={row.id} className="border border-zinc-800 rounded-lg p-4 space-y-2">
          <input placeholder="Company" value={row.company} onChange={(e) => update(i, 'company', e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Role" value={row.role} onChange={(e) => update(i, 'role', e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Duration" value={row.duration} onChange={(e) => update(i, 'duration', e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
          <textarea placeholder="Description" value={row.description} onChange={(e) => update(i, 'description', e.target.value)} rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
        </div>
      ))}
      <div className="flex gap-2">
        <button onClick={add} className="text-orange-400 text-sm">+ Add experience</button>
        <button onClick={() => onSave(rows)} disabled={saving} className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 px-4 py-2 rounded-lg text-sm ml-auto">
          {saving ? 'Saving...' : 'Save Experience'}
        </button>
      </div>
    </div>
  )
}

function ProjectsForm({ projects, onSave, saving }: { projects: PortfolioData['projects']; onSave: (p: PortfolioData['projects']) => void; saving: boolean }) {
  const [rows, setRows] = useState(projects)

  const update = (i: number, field: string, value: string | boolean | string[]) => {
    const next = [...rows]
    next[i] = { ...next[i], [field]: value }
    setRows(next)
  }

  const add = () => setRows([...rows, { id: Date.now(), slug: '', name: '', description: '', stack: [], github_url: '', demo_url: '', featured: false, sort_order: rows.length + 1 }])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Projects</h2>
      {rows.map((row: PortfolioData['projects'][0], i: number) => (
        <div key={row.id} className="border border-zinc-800 rounded-lg p-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Slug" value={row.slug} onChange={(e) => update(i, 'slug', e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Name" value={row.name} onChange={(e) => update(i, 'name', e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
          </div>
          <textarea placeholder="Description" value={row.description} onChange={(e) => update(i, 'description', e.target.value)} rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Stack (comma-separated)" value={row.stack.join(', ')} onChange={(e) => update(i, 'stack', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="GitHub URL" value={row.github_url} onChange={(e) => update(i, 'github_url', e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Demo URL" value={row.demo_url} onChange={(e) => update(i, 'demo_url', e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={row.featured} onChange={(e) => update(i, 'featured', e.target.checked)} />
            Featured (top 3)
          </label>
        </div>
      ))}
      <div className="flex gap-2">
        <button onClick={add} className="text-orange-400 text-sm">+ Add project</button>
        <button onClick={() => onSave(rows)} disabled={saving} className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 px-4 py-2 rounded-lg text-sm ml-auto">
          {saving ? 'Saving...' : 'Save Projects'}
        </button>
      </div>
    </div>
  )
}
