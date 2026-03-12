import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Bell, FolderOpen, Zap, Calendar, TrendingUp } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import ProjectGrid from '../components/dashboard/ProjectGrid'
import EmptyState from '../components/dashboard/EmptyState'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import SuggestionChips from '../components/builder/SuggestionChips'
import { useAuth } from '../hooks/useAuth'
import { useProjects } from '../hooks/useProjects'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { projects, loading, fetchProjects, deleteProject, toggleStar } = useProjects()
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (user?.id) fetchProjects(user.id)
  }, [user?.id, fetchProjects])

  const filtered = search
    ? projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.prompt?.toLowerCase().includes(search.toLowerCase()))
    : projects

  const todayCount = projects.filter(p => {
    const d = new Date(p.created_at)
    const t = new Date()
    return d.toDateString() === t.toDateString()
  }).length

  const weekCount = projects.filter(p => {
    const d = new Date(p.created_at)
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return d >= weekAgo
  }).length

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="flex min-h-screen bg-bg-secondary">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar — search + new project only */}
        <header className="bg-white border-b border-border px-6 py-3 flex items-center gap-4 sticky top-0 z-30">
          <div className="flex-1 max-w-md relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all bg-bg-secondary"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-bg-secondary transition-colors">
              <Bell size={18} className="text-text-muted" />
            </button>
            <button className="flex items-center p-1.5 rounded-lg hover:bg-bg-secondary transition-colors" onClick={() => navigate('/settings')}>
              <Avatar name={profile?.name} src={profile?.avatar} size="sm" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary mb-1">
              {greeting()}, {profile?.name || 'there'} 👋
            </h1>
            <p className="text-sm text-text-muted">Here's what's happening with your projects.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Projects', value: projects.length, icon: FolderOpen, color: 'text-accent' },
              { label: 'Generated Today', value: todayCount, icon: Zap, color: 'text-emerald-500' },
              { label: 'This Week', value: weekCount, icon: Calendar, color: 'text-purple-500' },
              { label: 'All Time', value: projects.length, icon: TrendingUp, color: 'text-amber-500' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-3">
                  <s.icon size={18} className={s.color} />
                </div>
                <p className="text-2xl font-bold text-primary">{s.value}</p>
                <p className="text-xs text-text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Projects */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-border rounded-xl overflow-hidden">
                  <div className="h-44 bg-bg-secondary animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-bg-secondary rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-bg-secondary rounded animate-pulse w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-primary">
                  {search ? `Results for "${search}"` : 'Recent Projects'}
                </h2>
                <p className="text-sm text-text-muted">{filtered.length} projects</p>
              </div>
              <ProjectGrid
                projects={filtered}
                onPreview={(p) => {
                  if (p.type === 'fullstack') {
                    alert('Full Stack apps must be downloaded or deployed to preview fully. Edit to view Code.')
                  } else {
                    let html = p.html_content
                    try {
                      const parsed = JSON.parse(p.html_content)
                      html = Array.isArray(parsed) ? (parsed.find(f => f.path.includes('index.html'))?.content || parsed[0].content) : html
                    } catch {}
                    window.open(URL.createObjectURL(new Blob([html], { type: 'text/html' })), '_blank')
                  }
                }}
                onEdit={(p) => navigate('/builder', { state: { project: p } })}
                onDelete={(id) => deleteProject(id)}
                onToggleStar={toggleStar}
              />
            </div>
          ) : (
            <EmptyState onAction={() => navigate('/builder')} />
          )}

          {/* Quick Start */}
          {!loading && projects.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-semibold text-primary mb-4">Quick Start</h2>
              <SuggestionChips onSelect={(prompt) => navigate('/builder', { state: { prompt } })} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
