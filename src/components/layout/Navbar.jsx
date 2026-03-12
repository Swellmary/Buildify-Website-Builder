import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'

const USE_CASES = [
  { label: 'E-commerce & Retail', icon: '🛒' },
  { label: 'Business & Corporate', icon: '💼' },
  { label: 'Education', icon: '🎓' },
  { label: 'Health & Wellness', icon: '🏥' },
  { label: 'Food & Restaurant', icon: '🍽' },
  { label: 'Portfolio & Creative', icon: '🎨' },
  { label: 'SaaS & Tech', icon: '📊' },
  { label: 'Government & Public', icon: '🏛' },
]

export default function Navbar({ onAuthOpen }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [useCasesOpen, setUseCasesOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUseCasesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isLanding = location.pathname === '/'

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border' : 'bg-white border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
                <rect x="9" y="1" width="6" height="6" rx="1" fill="white" opacity="0.6"/>
                <rect x="1" y="9" width="6" height="6" rx="1" fill="white" opacity="0.6"/>
                <rect x="9" y="9" width="6" height="6" rx="1" fill="white" opacity="0.3"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-primary tracking-tight">Buildify</span>
          </Link>

          {/* Desktop Nav */}
          {isLanding && (
            <div className="hidden md:flex items-center gap-1">
              <a href="#features" className="px-3 py-2 text-sm text-text-muted hover:text-primary transition-colors rounded-lg">
                Product
              </a>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUseCasesOpen(!useCasesOpen)}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-text-muted hover:text-primary transition-colors rounded-lg"
                >
                  Use Cases <ChevronDown size={14} className={`transition-transform ${useCasesOpen ? 'rotate-180' : ''}`} />
                </button>
                {useCasesOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-border py-2 animate-fadeIn">
                    {USE_CASES.map((uc) => (
                      <a
                        key={uc.label}
                        href="#categories"
                        onClick={() => setUseCasesOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-muted hover:text-primary hover:bg-bg-secondary transition-colors"
                      >
                        <span>{uc.icon}</span> {uc.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/templates" className="px-3 py-2 text-sm text-text-muted hover:text-primary transition-colors rounded-lg">
                Templates
              </Link>
              <a href="#pricing" className="px-3 py-2 text-sm text-text-muted hover:text-primary transition-colors rounded-lg">
                Pricing
              </a>
            </div>
          )}

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Button onClick={() => navigate('/dashboard')} size="sm">Dashboard</Button>
            ) : (
              <>
                <button onClick={onAuthOpen} className="text-sm text-text-muted hover:text-primary transition-colors font-medium px-3 py-2">
                  Sign In
                </button>
                <Button onClick={onAuthOpen} size="sm">Start Building Free</Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-bg-secondary transition-colors">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border animate-fadeIn">
          <div className="px-4 py-4 space-y-2">
            {isLanding && (
              <>
                <a href="#features" className="block px-3 py-2.5 text-sm text-text-muted rounded-lg hover:bg-bg-secondary">Product</a>
                <Link to="/templates" className="block px-3 py-2.5 text-sm text-text-muted rounded-lg hover:bg-bg-secondary">Templates</Link>
                <a href="#pricing" className="block px-3 py-2.5 text-sm text-text-muted rounded-lg hover:bg-bg-secondary">Pricing</a>
              </>
            )}
            <div className="pt-2 border-t border-border">
              {user ? (
                <Button onClick={() => navigate('/dashboard')} fullWidth>Dashboard</Button>
              ) : (
                <Button onClick={onAuthOpen} fullWidth>Start Building Free</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
