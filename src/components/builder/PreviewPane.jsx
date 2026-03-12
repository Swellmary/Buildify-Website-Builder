import { Eye, ExternalLink } from 'lucide-react'
import Button from '../ui/Button'

export default function PreviewPane({ code, type = 'static' }) {
  if (!code) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg-secondary rounded-xl border border-border">
        <div className="text-center p-8">
          <div className="w-12 h-12 rounded-xl bg-bg-secondary border border-border flex items-center justify-center mx-auto mb-3">
            <Eye size={20} className="text-text-light" />
          </div>
          <p className="text-sm text-text-muted font-medium">Live Preview</p>
          <p className="text-xs text-text-light mt-1">Generate a website to see the preview</p>
        </div>
      </div>
    )
  }

  if (type === 'fullstack') {
    return (
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-border overflow-hidden p-8 items-center justify-center text-center">
        <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-4">
          <ExternalLink size={28} />
        </div>
        <h3 className="text-lg font-semibold text-primary mb-2">Full Stack App Ready</h3>
        <p className="text-sm text-text-muted max-w-sm mb-6">
          This is a complete React + Vite application. To see it live, you'll need to deploy it or run it locally using Node.js.
        </p>
        <div className="bg-bg-secondary border border-border rounded-lg p-4 text-left w-full max-w-sm">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Next Steps</p>
          <ol className="text-sm text-primary list-decimal pl-4 space-y-1.5 font-mono">
            <li>Download the project files</li>
            <li>Run <span className="text-accent bg-accent/10 px-1 rounded">npm install</span></li>
            <li>Run <span className="text-accent bg-accent/10 px-1 rounded">npm run dev</span></li>
          </ol>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white rounded-xl border border-border overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-bg-secondary">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
        </div>
        <span className="text-xs text-text-light font-mono ml-2">preview — website.html</span>
      </div>
      <iframe
        title="Website Preview"
        srcDoc={code}
        sandbox="allow-scripts allow-same-origin"
        className="flex-1 w-full border-0 bg-white"
        style={{ minHeight: '400px' }}
      />
    </div>
  )
}
