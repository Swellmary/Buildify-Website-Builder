import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { useAuth } from '../../hooks/useAuth'

export default function AuthModal({ isOpen, onClose }) {
  const [tab, setTab] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signInWithEmail, signUp, signInWithGoogle } = useAuth()

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError('')
    setSuccess('')
    setShowPassword(false)
    setAgreed(false)
  }

  const switchTab = (newTab) => {
    setTab(newTab)
    resetForm()
  }

  const passwordStrength = (pw) => {
    if (pw.length < 6) return { level: 0, label: 'Too short', color: 'bg-red-400' }
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-red-400' }
    if (score === 2) return { level: 2, label: 'Fair', color: 'bg-amber-400' }
    if (score === 3) return { level: 3, label: 'Good', color: 'bg-emerald-400' }
    return { level: 4, label: 'Strong', color: 'bg-emerald-500' }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields'); return }
    setLoading(true)
    setError('')
    try {
      await signInWithEmail(email, password)
      onClose()
    } catch (err) {
      setError(err.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!email || !password || !confirmPassword) { setError('Please fill in all fields'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    if (!agreed) { setError('Please agree to the terms'); return }
    setLoading(true)
    setError('')
    try {
      await signUp(email, password)
      setSuccess('Check your email to confirm your account!')
    } catch (err) {
      setError(err.message || 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err.message || 'Google sign in failed')
    }
  }

  const strength = passwordStrength(password)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="px-6 pb-6">
        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => switchTab('signin')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === 'signin' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-primary'
            }`}
          >Sign In</button>
          <button
            onClick={() => switchTab('signup')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === 'signup' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-primary'
            }`}
          >Create Account</button>
        </div>

        <h3 className="text-xl font-bold text-primary mb-1">
          {tab === 'signin' ? 'Welcome back to Buildify' : 'Create your free Buildify account'}
        </h3>
        <p className="text-sm text-text-muted mb-6">
          {tab === 'signin' ? 'Sign in to access your projects' : 'Start building websites with AI'}
        </p>

        {/* Google OAuth */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-primary hover:bg-bg-secondary transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-text-light">or continue with email</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 animate-fadeIn">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        {success && (
          <div className="p-3 mb-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-600 animate-fadeIn">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={tab === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-primary">Password</label>
              {tab === 'signin' && (
                <button type="button" className="text-xs text-accent hover:text-accent-hover transition-colors">Forgot password?</button>
              )}
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tab === 'signup' ? 'Min 8 characters' : '••••••••'}
                className="w-full pl-10 pr-10 py-2.5 border border-border rounded-lg text-sm placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-primary transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {tab === 'signup' && password && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.level ? strength.color : 'bg-gray-200'}`} />
                  ))}
                </div>
                <span className="text-xs text-text-muted">{strength.label}</span>
              </div>
            )}
          </div>

          {tab === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                )}
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 w-4 h-4 rounded border-border text-accent focus:ring-accent/20" />
                <span className="text-xs text-text-muted leading-relaxed">
                  I agree to the <a href="#" className="text-accent hover:underline">Terms of Service</a> and <a href="#" className="text-accent hover:underline">Privacy Policy</a>
                </span>
              </label>
            </>
          )}

          <Button type="submit" loading={loading} fullWidth size="lg">
            {tab === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-text-muted">
          {tab === 'signin' ? (
            <>Don't have an account? <button onClick={() => switchTab('signup')} className="text-accent font-medium hover:underline">Create one →</button></>
          ) : (
            <>Already have an account? <button onClick={() => switchTab('signin')} className="text-accent font-medium hover:underline">Sign in →</button></>
          )}
        </p>
      </div>
    </Modal>
  )
}
