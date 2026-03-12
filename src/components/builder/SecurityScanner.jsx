import { Shield, ShieldAlert, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { useState, useMemo } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

export default function SecurityScanner({ code, onOpenChange, open }) {
  const scans = useMemo(() => {
    if (!code) return []

    const checks = []
    
    // Check 1: Inline scripts with eval
    const hasEval = /<script\b[^>]*>[\s\S]*?eval\s*\([\s\S]*?<\/script>/i.test(code)
    checks.push({
      id: 'eval',
      name: 'No inline eval() scripts',
      status: hasEval ? 'fail' : 'pass',
      message: hasEval ? 'Found dangerous eval() usage in inline scripts' : 'Safe'
    })

    // Check 2: Unknown CDNs
    const cdnMatch = code.match(/src=["'](https?:\/\/[^"']+)["']/g)
    const allowedCdns = ['fonts.googleapis', 'fonts.gstatic', 'cdnjs.cloudflare', 'cdn.jsdelivr', 'unpkg', 'tailwind']
    let badCdn = false
    if (cdnMatch) {
      badCdn = cdnMatch.some(src => {
        return !allowedCdns.some(allow => src.includes(allow))
      })
    }
    checks.push({
      id: 'cdn',
      name: 'Allowed CDN sources only',
      status: badCdn ? 'warning' : 'pass',
      message: badCdn ? 'Found external scripts from unverified domains' : 'Verified'
    })

    // Check 3: API keys
    const hasKeys = /(pk_[a-zA-Z0-9]{20,})|(sk_[a-zA-Z0-9]{20,})|(AIzaSy[a-zA-Z0-9_\-]{30,})/.test(code)
    checks.push({
      id: 'keys',
      name: 'No exposed credentials',
      status: hasKeys ? 'fail' : 'pass',
      message: hasKeys ? 'Possible API keys detected in source code' : 'Clean'
    })

    // Check 4: Alt attributes
    const imgMatch = code.match(/<img[^>]+>/g)
    let altMissing = false
    if (imgMatch) {
      altMissing = imgMatch.some(img => !img.includes('alt='))
    }
    checks.push({
      id: 'alt',
      name: 'Image accessibility (alt attrs)',
      status: altMissing ? 'warning' : 'pass',
      message: altMissing ? 'Some images are missing alt text' : 'Compliant'
    })

    return checks
  }, [code])

  const fails = scans.filter(s => s.status === 'fail').length
  const warnings = scans.filter(s => s.status === 'warning').length
  const isHealthy = fails === 0

  return (
    <Modal isOpen={open} onClose={() => onOpenChange(false)} title="Security Scan Report">
      <div className="p-6">
        <div className={`p-4 rounded-xl border mb-6 flex items-center justify-between ${isHealthy ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isHealthy ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
              {isHealthy ? <Shield size={20} /> : <ShieldAlert size={20} />}
            </div>
            <div>
              <h3 className={`font-semibold ${isHealthy ? 'text-emerald-800' : 'text-red-800'}`}>
                {isHealthy ? 'Analysis Passed' : 'Security Vulnerabilities Detected'}
              </h3>
              <p className={`text-sm ${isHealthy ? 'text-emerald-600' : 'text-red-600'}`}>
                {fails} Fails • {warnings} Warnings
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {scans.map(check => (
            <div key={check.id} className="flex items-center gap-3 p-3 rounded-lg bg-bg-secondary border border-border">
              {check.status === 'pass' && <CheckCircle size={18} className="text-emerald-500 shrink-0" />}
              {check.status === 'warning' && <AlertTriangle size={18} className="text-amber-500 shrink-0" />}
              {check.status === 'fail' && <XCircle size={18} className="text-red-500 shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary">{check.name}</p>
                <p className="text-xs text-text-light truncate">{check.message}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-indigo-50 border border-indigo-100 flex items-start gap-3">
          <ShieldAlert className="text-indigo-500 shrink-0 pt-0.5" size={16} />
          <div>
            <p className="text-sm text-indigo-900 font-medium">Advanced Security</p>
            <p className="text-xs text-indigo-700 mt-1">Full OWASP ZAP automated pentesting will be available in V4 (Backend integration required).</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Close Report</Button>
        </div>
      </div>
    </Modal>
  )
}
