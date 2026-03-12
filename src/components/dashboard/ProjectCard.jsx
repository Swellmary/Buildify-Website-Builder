import { useState } from 'react'
import { Eye, Pencil, Trash2, Calendar, Star, Code2, Play, Globe } from 'lucide-react'
import Badge from '../ui/Badge'

export default function ProjectCard({ project, onPreview, onEdit, onDelete, onToggleStar }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const isFullStack = project.type === 'fullstack'

  const date = new Date(project.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  // Parse HTML/JSON for static preview rendering
  let primaryHTML = ''
  if (!isFullStack && project.html_content) {
    try {
      const parsed = JSON.parse(project.html_content)
      if (Array.isArray(parsed) && parsed.length > 0) {
        primaryHTML = parsed.find(f => f.path.includes('index.html'))?.content || parsed[0].content
      } else {
        primaryHTML = project.html_content 
      }
    } catch {
      primaryHTML = project.html_content
    }
  }

  return (
    <div className="group bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-accent/40 transition-all duration-300 flex flex-col cursor-pointer" onClick={() => onEdit?.(project)}>
      {/* Thumbnail */}
      <div className="relative h-44 bg-bg-secondary overflow-hidden shrink-0 border-b border-border">
        {!isFullStack ? (
          <iframe
            srcDoc={primaryHTML}
            title={project.name}
            className="w-full h-full border-0 pointer-events-none scale-[0.5] origin-top-left"
            style={{ width: '200%', height: '200%' }}
            sandbox=""
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-50/50 text-indigo-400">
            <Code2 size={48} className="mb-2 opacity-50" />
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-900/40">React App</span>
          </div>
        )}
        
        {/* Status badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-100 transition-opacity">
          {project.is_public && (
            <div className="bg-success text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shadow-sm flex items-center gap-1">
              <Globe size={10} /> Published
            </div>
          )}
          <div className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shadow-sm w-fit ${isFullStack ? 'bg-indigo-600 text-white' : 'bg-primary text-white'}`}>
            {isFullStack ? 'Full Stack' : 'Static'}
          </div>
        </div>

        {/* Hover overlay actions */}
        <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onPreview?.(project)} className="p-2.5 bg-white rounded-lg text-primary hover:bg-bg-secondary transition-colors" title="Preview">
            {isFullStack ? <Play size={16} /> : <Eye size={16} />}
          </button>
          <button onClick={() => onEdit?.(project)} className="p-2.5 bg-white rounded-lg text-primary hover:bg-bg-secondary transition-colors" title="Edit Builder">
            <Pencil size={16} />
          </button>
          <button 
            onClick={() => onToggleStar?.(project.id, project.is_starred)} 
            className={`p-2.5 rounded-lg transition-colors title="Star" ${project.is_starred ? 'bg-amber-100 text-amber-500 hover:bg-amber-200' : 'bg-white text-primary hover:bg-amber-50 hover:text-amber-500'}`}
          >
            <Star size={16} fill={project.is_starred ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-2.5 bg-white rounded-lg text-error hover:bg-red-50 transition-colors" title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-primary truncate group-hover:text-accent transition-colors">{project.name}</h3>
            <p className="text-xs text-text-muted mt-1 line-clamp-2">{project.prompt}</p>
          </div>
        </div>
        <div className="mt-auto pt-3 flex items-center gap-2 flex-wrap">
          <Badge>{project.style}</Badge>
          <span className="ml-auto flex items-center gap-1 text-[11px] font-medium text-text-light">
            <Calendar size={12} /> {date}
          </span>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="p-4 border-t border-error/20 bg-red-50 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
          <p className="text-sm text-red-700 font-medium mb-3">Delete this project permanently?</p>
          <div className="flex gap-2">
            <button onClick={() => { onDelete?.(project.id); setConfirmDelete(false) }} className="flex-1 px-3 py-2 bg-error text-white text-sm rounded-lg font-medium hover:bg-red-600 transition-colors">
              Delete
            </button>
            <button onClick={() => setConfirmDelete(false)} className="flex-1 px-3 py-2 border border-red-200 text-red-700 text-sm rounded-lg font-medium hover:bg-red-100 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
