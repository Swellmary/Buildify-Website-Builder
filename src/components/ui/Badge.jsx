const variants = {
  default: 'bg-bg-secondary text-text-muted border border-border',
  accent: 'bg-accent/10 text-accent border border-accent/20',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  error: 'bg-red-50 text-red-600 border border-red-200',
}

export default function Badge({ children, variant = 'default', className = '', dot = false }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant] || variants.default} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          variant === 'success' ? 'bg-emerald-500' :
          variant === 'error' ? 'bg-red-500' :
          variant === 'warning' ? 'bg-amber-500' :
          variant === 'accent' ? 'bg-accent' : 'bg-text-muted'
        }`} />
      )}
      {children}
    </span>
  )
}
