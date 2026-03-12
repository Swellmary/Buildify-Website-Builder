import { Eye, ExternalLink } from 'lucide-react'
import Button from '../ui/Button'

export default function PreviewPane({ code, type = 'static', device = 'desktop' }) {
  const DEVICE_WIDTHS = {
    mobile: '375px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '100%'
  }

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
    <div className="flex-1 flex flex-col bg-bg-secondary rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[10px] text-text-light font-mono ml-2 uppercase tracking-wider">Preview — {device} view</span>
        </div>
        <div className="text-[10px] font-medium text-text-muted bg-bg-secondary px-2 py-0.5 rounded border border-border">
          {DEVICE_WIDTHS[device] === '100%' ? 'Adaptive' : DEVICE_WIDTHS[device]}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 flex flex-col items-center bg-gray-50/50">
        <div 
          className="bg-white shadow-2xl rounded-lg overflow-hidden border border-border transition-all duration-500 ease-in-out flex-1 w-full"
          style={{ 
            maxWidth: DEVICE_WIDTHS[device],
            minHeight: '100%'
          }}
        >
          <iframe
            title="Website Preview"
            srcDoc={code}
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  )
}
