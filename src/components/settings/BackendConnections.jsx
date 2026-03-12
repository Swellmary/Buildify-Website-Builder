import { useState, useEffect } from 'react'
import { CheckCircle2, Database, Cloud, Server, Image, Globe, Zap } from 'lucide-react'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import toast from 'react-hot-toast'

const SERVICES = [
  { id: 'supabase', name: 'Supabase', desc: 'PostgreSQL + Auth + Storage', icon: Database, color: 'text-emerald-500', fields: [{ key: 'url', label: 'Project URL' }, { key: 'anon_key', label: 'Anon Key' }] },
  { id: 'firebase', name: 'Firebase', desc: "Google's app platform", icon: Zap, color: 'text-amber-500', fields: [{ key: 'api_key', label: 'API Key' }, { key: 'project_id', label: 'Project ID' }] },
  { id: 'planetscale', name: 'PlanetScale', desc: 'Serverless MySQL', icon: Globe, color: 'text-blue-500', fields: [{ key: 'host', label: 'Host' }, { key: 'username', label: 'Username' }, { key: 'password', label: 'Password' }] },
  { id: 'railway', name: 'Railway', desc: 'Deploy backends instantly', icon: Server, color: 'text-purple-500', fields: [{ key: 'token', label: 'API Token' }] },
  { id: 'render', name: 'Render', desc: 'Cloud hosting platform', icon: Cloud, color: 'text-cyan-500', fields: [{ key: 'api_key', label: 'API Key' }] },
  { id: 'cloudinary', name: 'Cloudinary', desc: 'Image & video CDN', icon: Image, color: 'text-orange-500', fields: [{ key: 'cloud_name', label: 'Cloud Name' }, { key: 'api_key', label: 'API Key' }, { key: 'api_secret', label: 'API Secret' }] },
]

export default function BackendConnections() {
  const [connections, setConnections] = useState({})
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem('backend_connections')
      if (saved) setConnections(JSON.parse(atob(saved)))
    } catch {}
  }, [])

  const saveConnection = (serviceId) => {
    const updated = { ...connections, [serviceId]: formData }
    setConnections(updated)
    localStorage.setItem('backend_connections', btoa(JSON.stringify(updated)))
    setEditing(null)
    setFormData({})
    toast.success(`${SERVICES.find(s => s.id === serviceId)?.name} connected!`)
  }

  const removeConnection = (serviceId) => {
    const updated = { ...connections }
    delete updated[serviceId]
    setConnections(updated)
    localStorage.setItem('backend_connections', btoa(JSON.stringify(updated)))
    toast.success('Connection removed')
  }

  const isConnected = (id) => connections[id] && Object.values(connections[id]).some(v => v)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary mb-1">Backend Connections</h3>
        <p className="text-sm text-text-muted">Connect external services to enhance your projects.</p>
      </div>

      <div className="grid gap-4">
        {SERVICES.map((service) => (
          <div key={service.id} className="p-5 bg-white border border-border rounded-xl hover:border-gray-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg bg-bg-secondary flex items-center justify-center ${service.color}`}>
                <service.icon size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-primary">{service.name}</p>
                  {isConnected(service.id) && <Badge variant="success" dot>Connected</Badge>}
                </div>
                <p className="text-sm text-text-muted">{service.desc}</p>
              </div>
              <div className="flex gap-2">
                {isConnected(service.id) && (
                  <Button variant="ghost" size="sm" onClick={() => removeConnection(service.id)} className="text-error hover:!text-error">
                    Remove
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={() => { setEditing(editing === service.id ? null : service.id); setFormData(connections[service.id] || {}) }}>
                  {editing === service.id ? 'Cancel' : isConnected(service.id) ? 'Update' : 'Configure'}
                </Button>
              </div>
            </div>

            {editing === service.id && (
              <div className="mt-4 pt-4 border-t border-border space-y-3 animate-fadeIn">
                {service.fields.map((field) => (
                  <div key={field.key}>
                    <label className="text-sm font-medium text-primary mb-1 block">{field.label}</label>
                    <input
                      type={field.key.includes('password') || field.key.includes('secret') || field.key.includes('key') ? 'password' : 'text'}
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  </div>
                ))}
                <Button onClick={() => saveConnection(service.id)} size="sm">Save Connection</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
