import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="1" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
                  <rect x="9" y="1" width="6" height="6" rx="1" fill="white" opacity="0.6"/>
                  <rect x="1" y="9" width="6" height="6" rx="1" fill="white" opacity="0.6"/>
                  <rect x="9" y="9" width="6" height="6" rx="1" fill="white" opacity="0.3"/>
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight">Buildify</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">Describe it. AI builds it. Free forever.</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li><a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</a></li>
              <li><Link to="/templates" className="text-sm text-white/60 hover:text-white transition-colors">Templates</Link></li>
              <li><a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Use Cases */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Use Cases</h4>
            <ul className="space-y-2.5">
              <li><a href="#categories" className="text-sm text-white/60 hover:text-white transition-colors">E-commerce</a></li>
              <li><a href="#categories" className="text-sm text-white/60 hover:text-white transition-colors">Portfolio</a></li>
              <li><a href="#categories" className="text-sm text-white/60 hover:text-white transition-colors">SaaS</a></li>
              <li><a href="#categories" className="text-sm text-white/60 hover:text-white transition-colors">Restaurant</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Resources</h4>
            <ul className="space-y-2.5">
              <li><a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-white transition-colors">Get API Key</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">GitHub</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} Buildify. Built with ❤️ — Free forever.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
