import { useRef, useEffect } from 'react'

const MAX_CHARS = 2000

export default function PromptInput({ value, onChange, disabled }) {
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.max(140, Math.min(textareaRef.current.scrollHeight, 300)) + 'px'
    }
  }, [value])

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        id="prompt-input"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
        disabled={disabled}
        placeholder="Describe the website you want to build in detail..."
        className="w-full px-4 py-4 border border-border rounded-xl text-sm text-primary placeholder:text-text-light resize-none bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed"
        style={{ minHeight: '140px' }}
      />
      <span className={`absolute bottom-3 right-3 text-xs font-mono ${value.length > MAX_CHARS * 0.9 ? 'text-warning' : 'text-text-light'}`}>
        {value.length}/{MAX_CHARS}
      </span>
    </div>
  )
}
