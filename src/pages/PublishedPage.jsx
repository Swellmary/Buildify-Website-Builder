import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Globe } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function PublishedPage() {
  const { slug } = useParams()
  const [html, setHtml] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('html_content, is_public, type')
          .eq('slug', slug)
          .single()

        if (error) throw error
        if (!data.is_public) throw new Error('Private')

        if (data.type === 'fullstack') {
          setHtml('<div style="font-family:sans-serif;padding:3rem;text-align:center;"><h2>Full Stack React App</h2><p>This is a source code package, not a static site. Clone the repository or download the files via Buildify to run it locally.</p></div>')
        } else {
          // It's static, so parse if it's JSON array, else raw string
          try {
            const parsed = JSON.parse(data.html_content)
            if (Array.isArray(parsed)) {
              setHtml(parsed.find(f => f.path.includes('index.html'))?.content || parsed[0].content)
            } else {
              setHtml(data.html_content)
            }
          } catch {
            setHtml(data.html_content)
          }
        }
      } catch (err) {
        setError(err.message === 'Private' ? 'This project is private or does not exist.' : 'Page not found.')
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center">
        <Loader2 size={32} className="text-accent animate-spin mb-4" />
        <p className="text-primary font-medium">Loading published website...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
          <Globe size={32} />
        </div>
        <h1 className="text-2xl font-bold text-primary mb-2">Website Not Available</h1>
        <p className="text-text-muted mb-8">{error}</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-light transition-colors">
          <ArrowLeft size={16} /> Back to Buildify
        </Link>
      </div>
    )
  }

  return (
    <iframe
      title="Published Website"
      srcDoc={html}
      sandbox="allow-scripts allow-same-origin"
      className="w-full h-screen border-0 block"
    />
  )
}
