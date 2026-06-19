import { useState, useEffect, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { PortfolioData } from '../types/portfolio'
import '../styles/admin.css'

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
    throw new Error('Cannot reach server. Check deploy and env vars.')
  }

  const text = await res.text()
  let message = 'Request failed'

  if (text) {
    try {
      const data = JSON.parse(text) as { error?: string }
      message = data.error ?? message
    } catch {
      if (res.status === 404) message = 'Admin API not found — redeploy latest code'
      else if (res.status === 401) message = 'Invalid password'
      else message = `Server error (${res.status})`
    }
  }

  if (!res.ok) throw new Error(message)
  return text ? JSON.parse(text) : null
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
    <div className="admin-page flex items-center justify-center p-4">
      <div className="admin-card w-full max-w-md">
        <h1 className="admin-section-title text-2xl mb-2">Admin Panel</h1>
        <p className="admin-muted mb-6">Portfolio content management</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="admin-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-field"
              required
            />
          </div>
          {error && <p className="admin-error">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="admin-btn w-full py-2"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <Link to="/" className="admin-link block text-center mt-4">
          ← Back to portfolio
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
      <div className="admin-page flex items-center justify-center">
        Loading...
      </div>
    )
  }

  const tabs = ['profile', 'social', 'skills', 'education', 'experience', 'projects']

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Portfolio Admin</h1>
          <p className="admin-muted">Edit portfolio content</p>
        </div>
        <div className="flex gap-3">
          <Link to="/" className="admin-link">View Portfolio</Link>
          <button type="button" onClick={logout} className="admin-link">Logout</button>
        </div>
      </header>

      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg text-sm z-50 ${toast.type === 'success' ? 'admin-toast-success' : 'admin-toast-error'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex">
        <nav className="admin-sidebar space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
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
      <h2 className="admin-section-title">Profile</h2>
      {(['name', 'title', 'location', 'email', 'resume_url'] as const).map((field) => (
        <div key={field}>
          <label className="admin-label">{field.replace('_', ' ')}</label>
          <input
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="admin-field"
          />
        </div>
      ))}
      <div>
        <label className="admin-label">Bio</label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={5}
          className="admin-field"
        />
      </div>
      <div>
        <label className="admin-label">Interests (comma-separated)</label>
        <input
          value={form.interests.join(', ')}
          onChange={(e) => setForm({ ...form, interests: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
          className="admin-field"
        />
      </div>
      <button onClick={() => onSave(form)} disabled={saving} className="admin-btn">
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
      <h2 className="admin-section-title">Social Links</h2>
      {rows.map((row: PortfolioData['social'][0], i: number) => (
        <div key={row.id} className="grid grid-cols-3 gap-2 items-end">
          <input placeholder="Platform" value={row.platform} onChange={(e) => update(i, 'platform', e.target.value)} className="admin-field" />
          <input placeholder="Label" value={row.label} onChange={(e) => update(i, 'label', e.target.value)} className="admin-field" />
          <div className="flex gap-2">
            <input placeholder="URL" value={row.url} onChange={(e) => update(i, 'url', e.target.value)} className="admin-field flex-1" />
            <button type="button" onClick={() => remove(i)} className="admin-danger px-2">×</button>
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <button type="button" onClick={add} className="admin-btn-ghost">+ Add link</button>
        <button onClick={() => onSave(rows)} disabled={saving} className="admin-btn ml-auto">
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
      <h2 className="admin-section-title">Skills</h2>
      {rows.map((row: PortfolioData['skills'][0], i: number) => (
        <div key={row.id} className="space-y-2">
          <input placeholder="Category" value={row.category} onChange={(e) => update(i, 'category', e.target.value)} className="admin-field" />
          <input placeholder="Items (comma-separated)" value={row.items.join(', ')} onChange={(e) => update(i, 'items', e.target.value)} className="admin-field" />
        </div>
      ))}
      <div className="flex gap-2">
        <button type="button" onClick={add} className="admin-btn-ghost">+ Add category</button>
        <button onClick={() => onSave(rows)} disabled={saving} className="admin-btn ml-auto">
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
  const remove = (i: number) => setRows(rows.filter((_: PortfolioData['education'][0], idx: number) => idx !== i))

  return (
    <div className="space-y-4">
      <h2 className="admin-section-title">Education</h2>
      {rows.map((row: PortfolioData['education'][0], i: number) => (
        <div key={row.id} className="admin-block space-y-2">
          <div className="flex justify-end">
            <button type="button" onClick={() => remove(i)} className="admin-danger px-2" title="Delete entry">×</button>
          </div>
          <input placeholder="Degree" value={row.degree} onChange={(e) => update(i, 'degree', e.target.value)} className="admin-field" />
          <input placeholder="School" value={row.school} onChange={(e) => update(i, 'school', e.target.value)} className="admin-field" />
          <input placeholder="Duration" value={row.duration} onChange={(e) => update(i, 'duration', e.target.value)} className="admin-field" />
          <textarea placeholder="Description" value={row.description} onChange={(e) => update(i, 'description', e.target.value)} rows={2} className="admin-field" />
        </div>
      ))}
      <div className="flex gap-2">
        <button type="button" onClick={add} className="admin-btn-ghost">+ Add entry</button>
        <button onClick={() => onSave(rows)} disabled={saving} className="admin-btn ml-auto">
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
  const remove = (i: number) => setRows(rows.filter((_: PortfolioData['experience'][0], idx: number) => idx !== i))

  return (
    <div className="space-y-4">
      <h2 className="admin-section-title">Experience</h2>
      {rows.map((row: PortfolioData['experience'][0], i: number) => (
        <div key={row.id} className="admin-block space-y-2">
          <div className="flex justify-end">
            <button type="button" onClick={() => remove(i)} className="admin-danger px-2" title="Delete entry">×</button>
          </div>
          <input placeholder="Company" value={row.company} onChange={(e) => update(i, 'company', e.target.value)} className="admin-field" />
          <input placeholder="Role" value={row.role} onChange={(e) => update(i, 'role', e.target.value)} className="admin-field" />
          <input placeholder="Duration" value={row.duration} onChange={(e) => update(i, 'duration', e.target.value)} className="admin-field" />
          <textarea placeholder="Description" value={row.description} onChange={(e) => update(i, 'description', e.target.value)} rows={2} className="admin-field" />
        </div>
      ))}
      <div className="flex gap-2">
        <button type="button" onClick={add} className="admin-btn-ghost">+ Add experience</button>
        <button onClick={() => onSave(rows)} disabled={saving} className="admin-btn ml-auto">
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
  const remove = (i: number) => setRows(rows.filter((_: PortfolioData['projects'][0], idx: number) => idx !== i))

  return (
    <div className="space-y-4">
      <h2 className="admin-section-title">Projects</h2>
      {rows.map((row: PortfolioData['projects'][0], i: number) => (
        <div key={row.id} className="admin-block space-y-2">
          <div className="flex justify-end">
            <button type="button" onClick={() => remove(i)} className="admin-danger px-2" title="Delete project">×</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Slug" value={row.slug} onChange={(e) => update(i, 'slug', e.target.value)} className="admin-field" />
            <input placeholder="Name" value={row.name} onChange={(e) => update(i, 'name', e.target.value)} className="admin-field" />
          </div>
          <textarea placeholder="Description" value={row.description} onChange={(e) => update(i, 'description', e.target.value)} rows={2} className="admin-field" />
          <input placeholder="Stack (comma-separated)" value={row.stack.join(', ')} onChange={(e) => update(i, 'stack', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} className="admin-field" />
          <input placeholder="GitHub URL" value={row.github_url} onChange={(e) => update(i, 'github_url', e.target.value)} className="admin-field" />
          <input placeholder="Demo URL" value={row.demo_url} onChange={(e) => update(i, 'demo_url', e.target.value)} className="admin-field" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={row.featured} onChange={(e) => update(i, 'featured', e.target.checked)} />
            Featured (top 3)
          </label>
        </div>
      ))}
      <div className="flex gap-2">
        <button type="button" onClick={add} className="admin-btn-ghost">+ Add project</button>
        <button onClick={() => onSave(rows)} disabled={saving} className="admin-btn ml-auto">
          {saving ? 'Saving...' : 'Save Projects'}
        </button>
      </div>
    </div>
  )
}
