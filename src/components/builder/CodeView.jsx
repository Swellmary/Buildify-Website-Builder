import { useMemo, useState, useEffect } from 'react'
import { Code2 } from 'lucide-react'
import prettier from 'prettier/standalone'
import htmlParser from 'prettier/parser-html'
import babelParser from 'prettier/parser-babel'
import cssParser from 'prettier/parser-postcss'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-json'

// Base theme injected via JS so we don't need a CSS file
const prismTheme = `
  .token.comment, .token.prolog, .token.doctype, .token.cdata { color: #8b9eb0; font-style: italic; }
  .token.punctuation { color: #e2e8f0; }
  .token.namespace { opacity: .7; }
  .token.property, .token.tag, .token.boolean, .token.number, .token.constant, .token.symbol, .token.deleted { color: #f472b6; }
  .token.selector, .token.attr-name, .token.string, .token.char, .token.builtin, .token.inserted { color: #a78bfa; }
  .token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string { color: #e2e8f0; }
  .token.atrule, .token.attr-value, .token.keyword { color: #38bdf8; }
  .token.function, .token.class-name { color: #34d399; }
  .token.regex, .token.important, .token.variable { color: #fbbf24; }
  /* Additional Next.js/React specific coloring */
  .language-jsx .token.tag .token.punctuation, .language-tsx .token.tag .token.punctuation { color: #38bdf8; }
`

export default function CodeView({ code, language = 'html', filename = 'website.html' }) {
  const [formattedCode, setFormattedCode] = useState('')
  const [highlightedHtml, setHighlightedHtml] = useState('')

  useEffect(() => {
    let active = true
    const formatAndHighlight = async () => {
      if (!code) return

      let formatted = code
      try {
        // Run prettier
        let parser = 'html'
        const plugins = [htmlParser, babelParser, cssParser]
        
        if (filename.endsWith('.json')) parser = 'json'
        else if (filename.endsWith('.js') || filename.endsWith('.jsx')) parser = 'babel'
        else if (filename.endsWith('.ts') || filename.endsWith('.tsx')) parser = 'babel-ts'
        else if (filename.endsWith('.css')) parser = 'css'

        if (parser === 'json') {
          formatted = JSON.stringify(JSON.parse(code), null, 2)
        } else {
          formatted = await prettier.format(code, {
            parser,
            plugins,
            printWidth: 80,
            tabWidth: 2,
            singleQuote: true
          })
        }
      } catch (err) {
        // Fallback to raw code if syntax error prevents formatting
        console.warn('Prettier formatting failed:', err)
      }

      if (!active) return
      setFormattedCode(String(formatted || ''))

      // Prism highlighting
      let prismLang = Prism.languages.html
      let alias = 'html'
      
      if (filename.endsWith('.json')) { prismLang = Prism.languages.json; alias = 'json' }
      else if (filename.endsWith('.jsx')) { prismLang = Prism.languages.jsx; alias = 'jsx' }
      else if (filename.endsWith('.tsx')) { prismLang = Prism.languages.tsx; alias = 'tsx' }
      else if (filename.endsWith('.ts')) { prismLang = Prism.languages.typescript; alias = 'typescript' }
      else if (filename.endsWith('.js')) { prismLang = Prism.languages.javascript; alias = 'javascript' }
      else if (filename.endsWith('.css')) { prismLang = Prism.languages.css; alias = 'css' }

      if (prismLang) {
        const highlighted = Prism.highlight(formatted, prismLang, alias)
        setHighlightedHtml(highlighted)
      } else {
        // Safe fallback escaping
         const safeHtml = formatted
         .replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         setHighlightedHtml(safeHtml)
      }
    }

    formatAndHighlight()
    return () => { active = false }
  }, [code, filename, language])

  const lines = useMemo(() => formattedCode ? formattedCode.split('\n') : [], [formattedCode])

  if (!code) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg-secondary rounded-xl border border-border">
        <div className="text-center p-8">
          <div className="w-12 h-12 rounded-xl bg-bg-secondary border border-border flex items-center justify-center mx-auto mb-3">
            <Code2 size={20} className="text-text-light" />
          </div>
          <p className="text-sm text-text-muted font-medium">Source Code</p>
          <p className="text-xs text-text-light mt-1">Generate a project to see the code</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0f172a] rounded-xl border border-border overflow-hidden">
      <style>{prismTheme}</style>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-[#0c1322] shrink-0">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400/80" />
          <span className="w-3 h-3 rounded-full bg-amber-400/80" />
          <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
        </div>
        <span className="text-xs text-white/40 font-mono ml-2">{filename}</span>
        <span className="text-xs text-white/20 ml-auto">{lines.length} lines</span>
      </div>
      <div className="flex-1 overflow-auto bg-[#0f172a] p-4 text-sm font-mono leading-relaxed relative flex min-h-0">
         <div className="text-right text-white/20 select-none mr-4 flex-shrink-0 flex flex-col" style={{ minWidth: '2.5rem' }}>
           {lines.map((_, i) => (
             <span key={i} className="leading-relaxed">{i + 1}</span>
           ))}
         </div>
         <pre className="flex-1 overflow-visible margin-0 p-0 bg-transparent text-white/90">
           <code 
             className={`language-${language} block pb-8`}
             dangerouslySetInnerHTML={{ __html: highlightedHtml || 'Loading...' }} 
           />
         </pre>
      </div>
    </div>
  )
}
