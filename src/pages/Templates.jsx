import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight, LayoutTemplate, Sparkles } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import AuthModal from '../components/auth/AuthModal'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { useAuth } from '../hooks/useAuth'
import { PREBUILT_TEMPLATES } from '../data/prebuilt_templates'

const CATEGORY_TABS = [
  'All', 'E-commerce & Retail', 'Business & Corporate', 'Education',
  'Health & Wellness', 'Food & Restaurant', 'Government & Public',
  'Portfolio & Creative', 'SaaS & Tech', 'Events & Entertainment',
]

const TEMPLATES = [
  { id: 1, name: 'Medical Clinic', desc: 'Professional healthcare website', category: 'Health & Wellness', prompt: 'A trustworthy medical clinic website with clean white design, services offered, doctor profiles with credentials, appointment booking form, patient testimonials, and emergency contact info.', style: 'Minimal', uses: 670 },
  { id: 2, name: 'Government Portal', desc: 'Official government or public service site', category: 'Government & Public', prompt: 'A professional government portal with official header, navigation with departments, public notices section, services directory, downloadable forms list, contact directory, and accessibility features.', style: 'Corporate', uses: 340 },
  { id: 3, name: 'Online Course Platform', desc: 'Educational platform with course listings', category: 'Education', prompt: 'An online education platform with hero section, featured courses grid, instructor profiles, student testimonials, pricing plans, and enrollment form. Include course categories and search.', style: 'Minimal', uses: 520 },
  { id: 4, name: 'Event Landing Page', desc: 'Event or conference promo page', category: 'Events & Entertainment', prompt: 'A vibrant event landing page with countdown timer, event details, speaker lineup with photos, schedule timeline, ticket pricing tiers, venue map, and registration form.', style: 'Bold', uses: 430 },
  { id: 5, name: 'Corporate Website', desc: 'Professional business website', category: 'Business & Corporate', prompt: 'A professional corporate website with services overview, team section, client logos carousel, case studies, company values, and contact form with office locations.', style: 'Corporate', uses: 780 },
]

export default function Templates() {
  const [authOpen, setAuthOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('prebuilt') // 'prebuilt' | 'ai'
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  const listToFilter = activeTab === 'prebuilt' ? PREBUILT_TEMPLATES : TEMPLATES

  const filtered = listToFilter.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleUsePrompt = (template) => {
    if (user) {
      navigate('/builder', { state: { template } })
    } else {
      setAuthOpen(true)
    }
  }

  const handleUsePrebuilt = (template) => {
    if (user) {
      navigate('/builder', { 
        state: { 
          project: { 
            name: template.name + ' Copy', 
            html_content: JSON.stringify([{ path: 'index.html', content: template.html }]),
            type: 'static'
          } 
        } 
      })
    } else {
      setAuthOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col">
      <Navbar onAuthOpen={() => setAuthOpen(true)} />

      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary mb-3">Template Library</h1>
          <p className="text-text-muted max-w-xl mx-auto">Start with a complete pre-built website, or use one of our optimized AI prompts to generate exactly what you need.</p>
        </div>

        {/* Top Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex p-1 bg-white border border-border rounded-xl shadow-sm">
            <button
              onClick={() => setActiveTab('prebuilt')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'prebuilt' ? 'bg-bg-secondary text-primary shadow-sm' : 'text-text-muted hover:text-primary'
              }`}
            >
              <LayoutTemplate size={16} /> Pre-Built Sites
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'ai' ? 'bg-bg-secondary text-primary shadow-sm' : 'text-text-muted hover:text-primary'
              }`}
            >
              <Sparkles size={16} className={activeTab === 'ai' ? 'text-accent' : ''} /> AI Prompts
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${activeTab === 'prebuilt' ? 'templates' : 'prompts'}...`}
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm bg-white placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORY_TABS.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-white border border-border text-text-muted hover:text-primary hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(t => (
            <div key={t.id} className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-accent/30 transition-all duration-300 group flex flex-col">
              {activeTab === 'prebuilt' && (
                <div className="relative h-48 bg-bg-secondary border-b border-border overflow-hidden">
                  <iframe
                    srcDoc={t.html}
                    title={t.name}
                    className="w-full h-full border-0 pointer-events-none scale-[0.5] origin-top-left"
                    style={{ width: '200%', height: '200%' }}
                    sandbox=""
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <Badge variant="accent" className="self-start mb-3">{t.category}</Badge>
                <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-accent transition-colors">{t.name}</h3>
                <p className="text-sm text-text-muted mb-6 flex-1">{activeTab === 'prebuilt' ? t.desc : t.prompt}</p>
                
                <Button fullWidth onClick={() => activeTab === 'prebuilt' ? handleUsePrebuilt(t) : handleUsePrompt(t)}>
                  Use {activeTab === 'prebuilt' ? 'Template' : 'Prompt'} <ArrowRight size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white border border-border rounded-2xl">
            <p className="text-text-muted">No {activeTab === 'prebuilt' ? 'templates' : 'prompts'} found matching your search.</p>
          </div>
        )}
      </div>

      <Footer />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}
