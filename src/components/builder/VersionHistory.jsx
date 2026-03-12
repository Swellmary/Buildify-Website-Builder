import { Clock, RotateCcw, Eye, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useProjects } from '../../hooks/useProjects'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

export default function VersionHistory({ projectId, onRestore, onClose }) {
  const { getProjectVersions } = useProjects()
  const [versions, setVersions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectId) return
    const load = async () => {
      setLoading(true)
      try {
        const data = await getProjectVersions(projectId)
        setVersions(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [projectId, getProjectVersions])

  if (loading) {
    return <div className="p-6 text-center text-text-muted text-sm">Loading history...</div>
  }

  return (
    <div className="flex flex-col h-full bg-white border-l border-border w-80 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-secondary">
        <h3 className="font-semibold text-primary flex items-center gap-2">
          <Clock size={16} className="text-accent" />
          Version History
        </h3>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white text-text-muted transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {versions.length === 0 ? (
          <div className="text-center text-sm text-text-light py-8">
            No versions saved yet.
          </div>
        ) : (
          versions.map((ver, idx) => {
            const date = new Date(ver.created_at)
            const isCurrent = idx === 0
            
            return (
              <div key={ver.id} className={`p-3 rounded-xl border ${isCurrent ? 'bg-accent/5 border-accent/20' : 'bg-white border-border'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-text-muted">
                    {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isCurrent && <Badge variant="accent">Current</Badge>}
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    fullWidth 
                    className="h-8 text-xs"
                    onClick={() => {
                      // Open a popup raw preview window 
                      const win = window.open('', '_blank')
                      let content = ver.html_content
                      try {
                        const files = JSON.parse(content)
                        if (Array.isArray(files)) {
                          // Try to find index.html or first file
                          const index = files.find(f => f.path.includes('index.html')) || files[0]
                          content = index.content
                        }
                      } catch (e) {
                        // Keep as is (classic static)
                      }
                      win.document.write(content)
                      win.document.close()
                    }}
                  >
                    <Eye size={14} /> Preview
                  </Button>
                  <Button 
                    variant={isCurrent ? 'secondary' : 'primary'} 
                    size="sm" 
                    fullWidth 
                    className="h-8 text-xs"
                    disabled={isCurrent}
                    onClick={() => onRestore(ver.html_content)}
                  >
                    <RotateCcw size={14} /> Restore
                  </Button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
