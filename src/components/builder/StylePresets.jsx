const STYLES = [
  { id: 'minimal', label: 'Minimal', icon: '◽', desc: 'Clean & simple' },
  { id: 'bold', label: 'Bold', icon: '⬛', desc: 'Strong & impactful' },
  { id: 'dark', label: 'Dark', icon: '🌙', desc: 'Dark mode design' },
  { id: 'colorful', label: 'Colorful', icon: '🎨', desc: 'Vibrant colors' },
  { id: 'corporate', label: 'Corporate', icon: '💼', desc: 'Professional look' },
]

export default function StylePresets({ selected, onSelect }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Style Preset</p>
      <div className="flex flex-wrap gap-2">
        {STYLES.map((s) => (
          <button
            key={s.id}
            id={`style-${s.id}`}
            onClick={() => onSelect(s.id)}
            className={`group px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
              selected === s.id
                ? 'bg-accent/5 border-accent/30 text-accent ring-1 ring-accent/20'
                : 'bg-white border-border text-text-muted hover:text-primary hover:border-gray-300'
            }`}
          >
            <span className="mr-1.5">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
