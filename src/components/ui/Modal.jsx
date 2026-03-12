import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-md' }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn"
      style={{ backdropFilter: 'blur(8px)', background: 'rgba(15,23,42,0.5)' }}
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className={`w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleIn ${maxWidth}`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div>
              <h2 className="text-lg font-semibold text-primary">{title}</h2>
              {subtitle && <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-bg-secondary text-text-muted hover:text-primary transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className={!title ? 'pt-6' : ''}>{children}</div>
      </div>
    </div>
  )
}
