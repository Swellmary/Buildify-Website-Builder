import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Zap, Lock, DollarSign, FolderOpen, Palette, Rocket, Send, Star, Quote } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import AuthModal from '../components/auth/AuthModal'
import CategoryBrowser from '../components/builder/CategoryBrowser'
import SuggestionChips from '../components/builder/SuggestionChips'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'

const FEATURES = [
  { icon: Zap, title: 'Instant Generation', desc: 'From prompt to working website in under 10 seconds. No waiting, no queues.' },
  { icon: Lock, title: 'Private & Secure', desc: 'Files never leave your browser. Your API key stays yours. Zero data collection.' },
  { icon: DollarSign, title: 'Free Forever', desc: 'No subscription. No credit card. Bring your own Gemini key and build unlimited sites.' },
  { icon: FolderOpen, title: 'Save Projects', desc: 'Build a library of generated sites in your dashboard. Organize by category.' },
  { icon: Palette, title: 'Style Presets', desc: 'Minimal, Bold, Dark, Colorful, Corporate — one click to set the visual direction.' },
  { icon: Rocket, title: 'Export Ready', desc: 'Download complete HTML files ready to deploy anywhere. Fully self-contained.' },
]

const TESTIMONIALS = [
  { name: 'Sarah Chen', role: 'Freelance Designer', quote: 'Buildify saved me hours of prototyping. I describe what I need and get a production-ready starting point instantly.', avatar: 'SC' },
  { name: 'Marcus Rivera', role: 'Startup Founder', quote: 'We used Buildify to prototype 12 landing pages in a single afternoon. The quality is genuinely impressive.', avatar: 'MR' },
  { name: 'Aisha Patel', role: 'Full-Stack Developer', quote: "The generated code is clean and responsive. It's like having an AI pair programmer for frontend work.", avatar: 'AP' },
]

const TEMPLATES = [
  { name: 'Restaurant Landing', category: 'Food & Restaurant', desc: 'Hero, menu, reservations' },
  { name: 'SaaS Product Page', category: 'SaaS & Tech', desc: 'Features, pricing, CTA' },
  { name: 'Developer Portfolio', category: 'Portfolio & Creative', desc: 'Projects, skills, timeline' },
  { name: 'E-commerce Store', category: 'E-commerce & Retail', desc: 'Products, cart, checkout' },
  { name: 'Medical Clinic', category: 'Health & Wellness', desc: 'Services, doctors, booking' },
  { name: 'Government Portal', category: 'Government & Public', desc: 'Services, notices, forms' },
]

export default function Landing() {
  const [authOpen, setAuthOpen] = useState(false)
  const [heroPrompt, setHeroPrompt] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleHeroSubmit = () => {
    if (user) {
      navigate('/builder', { state: { prompt: heroPrompt } })
    } else {
      setAuthOpen(true)
    }
  }

  const handleChipSelect = (prompt) => {
    setHeroPrompt(prompt)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onAuthOpen={() => setAuthOpen(true)} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.06)_0%,_transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center relative">
          <Badge variant="accent" className="mb-6 animate-fadeIn">
            ✦ Powered by Gemini 2.5 Flash — Always Free
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary tracking-tight leading-[1.1] mb-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            Build Any Website<br />With Just Words
          </h1>

          <p className="text-lg text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Describe your website in plain English. Buildify's AI generates it instantly — complete with HTML, CSS, and JavaScript. No coding required. Free forever.
          </p>

          {/* Hero Input */}
          <div className="max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <input
                type="text"
                value={heroPrompt}
                onChange={(e) => setHeroPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleHeroSubmit()}
                placeholder="Describe the website you want to build..."
                className="w-full px-5 py-4 pr-14 border border-border rounded-2xl text-base text-primary placeholder:text-text-light shadow-lg shadow-gray-100/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
              <button
                onClick={handleHeroSubmit}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-primary hover:bg-primary-light text-white flex items-center justify-center transition-colors"
              >
                <Send size={16} />
              </button>
            </div>

            {/* Suggestion chips */}
            <div className="mt-5">
              <SuggestionChips onSelect={handleChipSelect} />
            </div>

            <a href="#categories" className="inline-flex items-center gap-1 mt-4 text-xs font-semibold uppercase tracking-wider text-text-light hover:text-accent transition-colors">
              Not sure where to start? Browse by category <ArrowRight size={12} />
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <CategoryBrowser onSelect={(cat) => setHeroPrompt(`A professional ${cat.label.toLowerCase()} website`)} />

      {/* Features */}
      <section id="features" className="py-20 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-primary mb-3">Everything you need to build</h2>
            <p className="text-text-muted max-w-xl mx-auto">Powerful features, zero complexity. Just describe and download.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-border hover:shadow-md hover:border-gray-200 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-accent/5 flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                  <f.icon size={20} className="text-accent" />
                </div>
                <h3 className="font-semibold text-primary mb-2">{f.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-primary mb-3">Trusted by developers worldwide</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="p-6 bg-bg-secondary rounded-xl border border-border">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-sm text-text-muted leading-relaxed mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">{t.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-primary">{t.name}</p>
                    <p className="text-xs text-text-light">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { value: '10,000+', label: 'websites generated' },
              { value: '1,500', label: 'daily free requests' },
              { value: '100%', label: 'free forever' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl md:text-3xl font-extrabold text-primary">{s.value}</p>
                <p className="text-xs text-text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="py-20 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-3">Browse Ready-Made Templates</h2>
            <p className="text-text-muted">Get started faster with pre-built prompts for every use case.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEMPLATES.map((t, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-border hover:shadow-md transition-all duration-300 group">
                <Badge variant="accent" className="mb-3">{t.category}</Badge>
                <h3 className="font-semibold text-primary mb-1">{t.name}</h3>
                <p className="text-sm text-text-muted mb-4">{t.desc}</p>
                <Button
                  variant="secondary" size="sm"
                  onClick={() => { user ? navigate('/builder', { state: { template: t } }) : setAuthOpen(true) }}
                >
                  Use Template
                </Button>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="ghost" onClick={() => navigate('/templates')}>
              View all templates <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="py-20 bg-primary text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Building For Free</h2>
          <p className="text-white/60 mb-8 text-lg">No credit card required. No subscription. Just build.</p>
          <Button
            onClick={() => user ? navigate('/builder') : setAuthOpen(true)}
            className="!bg-white !text-primary hover:!bg-gray-100 !shadow-lg !px-8 !py-3.5 !text-base"
          >
            Create Free Account
          </Button>
        </div>
      </section>

      <Footer />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}
