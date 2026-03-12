import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex items-center justify-center bg-bg-secondary rounded-xl border border-border">
          <div className="text-center p-8 max-w-sm">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <p className="text-sm font-semibold text-primary mb-1">Something went wrong</p>
            <p className="text-xs text-text-muted mb-4">
              {this.state.error?.message || 'An unexpected error occurred in this component.'}
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
            >
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
