const SUGGESTIONS = {
  default: [
    { icon: '🛍', label: 'E-commerce Store' },
    { icon: '💼', label: 'Portfolio Site' },
    { icon: '🏥', label: 'Medical Clinic' },
    { icon: '🍕', label: 'Restaurant Menu' },
    { icon: '📊', label: 'SaaS Dashboard' },
    { icon: '🏛', label: 'Government Portal' },
  ],
  ecommerce: [
    { icon: '👗', label: 'Fashion Store' },
    { icon: '📱', label: 'Electronics Shop' },
    { icon: '🏠', label: 'Home Goods' },
    { icon: '💍', label: 'Jewelry Store' },
  ],
  food: [
    { icon: '☕', label: 'Coffee Shop' },
    { icon: '🍕', label: 'Pizza Restaurant' },
    { icon: '🍣', label: 'Sushi Bar' },
    { icon: '🧁', label: 'Bakery' },
  ],
  saas: [
    { icon: '📊', label: 'Analytics Dashboard' },
    { icon: '📬', label: 'Email Marketing Tool' },
    { icon: '🗂️', label: 'Project Manager' },
    { icon: '💬', label: 'Chat App Landing' },
  ],
  portfolio: [
    { icon: '📸', label: 'Photography Portfolio' },
    { icon: '🎨', label: 'Design Portfolio' },
    { icon: '💻', label: 'Developer Portfolio' },
    { icon: '✍️', label: 'Writer Portfolio' },
  ],
}

export default function SuggestionChips({ category, onSelect }) {
  const chips = SUGGESTIONS[category] || SUGGESTIONS.default

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.label}
          onClick={() => onSelect(`A professional ${chip.label.toLowerCase()} website`)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border text-sm text-text-muted hover:text-primary hover:border-gray-300 hover:bg-bg-secondary transition-all duration-200"
        >
          <span>{chip.icon}</span> {chip.label}
        </button>
      ))}
    </div>
  )
}
