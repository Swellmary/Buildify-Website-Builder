import { User } from 'lucide-react'

export default function Avatar({ src, name, size = 'md', className = '', onClick, ...rest }) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base', xl: 'w-14 h-14 text-lg' }
  const initial = name ? name.charAt(0).toUpperCase() : 'U'

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`rounded-full object-cover ${sizes[size]} ${className}`}
        onClick={onClick}
        {...rest}
      />
    )
  }

  return (
    <div
      className={`rounded-full bg-accent/10 text-accent font-semibold flex items-center justify-center ${sizes[size]} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {initial}
    </div>
  )
}

