import { useState, useEffect } from 'react'
import { Key, Eye, EyeOff, ExternalLink, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { GoogleGenerativeAI } from '@google/generative-ai'

export default function ApiKeySettings() {
  const [apiKey, setApiKey] = useState('')
  const [inputKey, setInputKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null) // 'success' | 'error' | null

  useEffect(() => {
    const saved = localStorage.getItem('gemini_api_key')
    if (saved) {
      try { setApiKey(JSON.parse(saved)) } catch { setApiKey(saved) }
    }
  }, [])

  const maskedKey = apiKey ? apiKey.substring(0, 8) + '•'.repeat(Math.min(20, apiKey.length - 8)) : ''

  const handleSave = () => {
    if (inputKey.trim()) {
      localStorage.setItem('gemini_api_key', JSON.stringify(inputKey.trim()))
      setApiKey(inputKey.trim())
      setInputKey('')
      setTestResult(null)
    }
  }

  const handleRemove = () => {
    localStorage.removeItem('gemini_api_key')
    setApiKey('')
    setInputKey('')
    setTestResult(null)
  }

  const handleTest = async () => {
    const key = inputKey.trim() || apiKey
    if (!key) return
    setTesting(true)
    setTestResult(null)
    try {
      const genAI = new GoogleGenerativeAI(key)
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
      await model.generateContent('Say hello in one word')
      setTestResult('success')
    } catch {
      setTestResult('error')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary mb-1">Gemini API Key</h3>
        <p className="text-sm text-text-muted">Connect your Google AI Studio API key to enable AI website generation.</p>
      </div>

      {/* Status */}
      <div className={`flex items-center gap-3 p-4 rounded-xl border ${apiKey ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
        {apiKey ? <CheckCircle2 size={18} className="text-success" /> : <XCircle size={18} className="text-warning" />}
        <div>
          <p className={`text-sm font-medium ${apiKey ? 'text-emerald-700' : 'text-amber-700'}`}>
            {apiKey ? 'Connected' : 'Not configured'}
          </p>
          {apiKey && <p className="text-xs text-emerald-600/70 font-mono mt-0.5">{maskedKey}</p>}
        </div>
        {apiKey && <Badge variant="success" className="ml-auto" dot>Active</Badge>}
      </div>

      {/* Input */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-primary">API Key</label>
        <div className="relative">
          <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
          <input
            type={showKey ? 'text' : 'password'}
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder={apiKey ? 'Enter new key to update...' : 'Paste your Gemini API key...'}
            className="w-full pl-10 pr-10 py-2.5 border border-border rounded-lg text-sm placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all font-mono"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-primary transition-colors">
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={!inputKey.trim()} size="sm">Save Key</Button>
          <Button onClick={handleTest} variant="secondary" size="sm" loading={testing}>
            {testing ? 'Testing...' : 'Test Key'}
          </Button>
          {apiKey && <Button onClick={handleRemove} variant="ghost" size="sm" className="text-error hover:!text-error">Remove</Button>}
        </div>

        {testResult === 'success' && (
          <div className="flex items-center gap-2 text-sm text-success animate-fadeIn">
            <CheckCircle2 size={14} /> Key is valid and working
          </div>
        )}
        {testResult === 'error' && (
          <div className="flex items-center gap-2 text-sm text-error animate-fadeIn">
            <XCircle size={14} /> Key is invalid or API error
          </div>
        )}
      </div>

      <a
        href="https://aistudio.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover font-medium transition-colors"
      >
        Get your free key → <ExternalLink size={14} />
      </a>
    </div>
  )
}
