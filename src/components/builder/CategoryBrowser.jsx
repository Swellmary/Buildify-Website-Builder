import { ArrowRight } from 'lucide-react'

export const CATEGORIES = [
  { id: 'ecommerce', label: 'E-commerce & Retail', icon: '🛒', count: 8 },
  { id: 'business', label: 'Business & Corporate', icon: '💼', count: 6 },
  { id: 'education', label: 'Education', icon: '🎓', count: 7 },
  { id: 'health', label: 'Health & Wellness', icon: '🏥', count: 5 },
  { id: 'food', label: 'Food & Restaurant', icon: '🍽', count: 6 },
  { id: 'government', label: 'Government & Public', icon: '🏛', count: 4 },
  { id: 'portfolio', label: 'Portfolio & Creative', icon: '🎨', count: 8 },
  { id: 'saas', label: 'SaaS & Tech', icon: '📊', count: 9 },
  { id: 'events', label: 'Events & Entertainment', icon: '🎉', count: 5 },
]

export default function CategoryBrowser({ onSelect }) {
  return (
    <section id="categories" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-3">Browse by Category</h2>
          <p className="text-text-muted max-w-xl mx-auto">
            Choose a category to explore tailored website templates and prompts for your industry.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect?.(cat)}
              className="group flex items-center gap-4 p-5 bg-white border border-border rounded-xl hover:shadow-lg hover:border-gray-200 transition-all duration-300 text-left"
            >
              <span className="text-3xl">{cat.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-primary group-hover:text-accent transition-colors">{cat.label}</p>
                <p className="text-sm text-text-muted">{cat.count} use cases</p>
              </div>
              <ArrowRight size={16} className="text-text-light group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
