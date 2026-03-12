import { FolderOpen, Plus } from 'lucide-react'
import Button from '../ui/Button'

export default function EmptyState({ onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-2xl bg-bg-secondary border-2 border-dashed border-border flex items-center justify-center mb-5">
        <FolderOpen size={32} className="text-text-light" />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2">No projects yet</h3>
      <p className="text-sm text-text-muted mb-6 max-w-sm">
        Start building your first website with AI. Describe what you want and Buildify will generate it instantly.
      </p>
      <Button onClick={onAction} variant="accent" size="lg">
        <Plus size={18} /> Generate Your First Website
      </Button>
    </div>
  )
}
